"use server";

import { auth } from "@/auth";
import { applyCompletedEraTech } from "@/lib/era-tech-completion";
import {
  eraTechResearchCost,
  getTechByKey,
  isOneShotEraTech,
  requiredEraIndexForTech,
  scaledEraTechDurationSec,
} from "@/config/technology-catalog";
import { eraIndex, getResourceUnlocks } from "@/config/eras";
import { canAfford } from "@/lib/economy";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type EraTechActionResult = { ok: true } | { ok: false; error: string };

function paths() {
  revalidatePath("/research");
  revalidatePath("/overview");
}

export async function startEraTechResearch(
  cityId: string,
  techKey: string,
): Promise<EraTechActionResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false, error: "Giriş gerekli" };

  const entry = getTechByKey(techKey);
  if (!entry) return { ok: false, error: "Geçersiz teknoloji" };

  const city = await prisma.city.findFirst({
    where: { id: cityId, userId },
  });
  if (!city) return { ok: false, error: "Şehir bulunamadı" };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false, error: "Kullanıcı yok" };

  const needIdx = requiredEraIndexForTech(entry.eraOrdinal);
  if (eraIndex(user.currentEra) < needIdx) {
    return { ok: false, error: "Bu teknoloji için çağınız yeterli değil." };
  }

  const existing = await prisma.userEraTech.findUnique({
    where: { userId_techKey: { userId, techKey } },
  });
  const oneShot = isOneShotEraTech(entry);
  if (oneShot && existing && existing.level >= 1) {
    return { ok: false, error: "Bu teknoloji zaten tamamlandı." };
  }

  const dupTech = await prisma.eraTechResearchJob.findFirst({
    where: { userId, techKey, status: "queued" },
    select: { id: true },
  });
  if (dupTech) {
    return { ok: false, error: "Bu teknoloji için zaten kuyrukta iş var." };
  }

  const MAX_ERA_TECH_QUEUE = 2;
  const queuedCount = await prisma.eraTechResearchJob.count({
    where: { userId, status: "queued" },
  });
  if (queuedCount >= MAX_ERA_TECH_QUEUE) {
    return {
      ok: false,
      error: `Çağ teknolojisi kuyruğu dolu (en fazla ${MAX_ERA_TECH_QUEUE}).`,
    };
  }

  const hasActiveEraJob = await prisma.eraTechResearchJob.findFirst({
    where: { userId, status: "queued", completesAt: { not: null } },
    select: { id: true },
  });

  const currentLv = existing?.level ?? 0;
  const nextLevel = currentLv + 1;
  const unlocks = getResourceUnlocks(user.currentEra);
  const cost = eraTechResearchCost(entry, nextLevel);
  if (!unlocks.oil && cost.oil > 0) {
    return { ok: false, error: "Bu çağda petrol kullanılamaz." };
  }
  if (!canAfford(city, cost)) {
    return { ok: false, error: "Yetersiz kaynak" };
  }

  const dur = scaledEraTechDurationSec(entry, currentLv);

  await prisma.$transaction(async (tx) => {
    await tx.city.update({
      where: { id: cityId },
      data: {
        wood: city.wood - cost.wood,
        iron: city.iron - cost.iron,
        oil: city.oil - cost.oil,
        food: city.food - cost.food,
      },
    });

    if (dur < 1) {
      await applyCompletedEraTech(tx, userId, techKey);
    } else {
      const completesAt: Date | null = hasActiveEraJob
        ? null
        : new Date(Date.now() + dur * 1000);
      await tx.eraTechResearchJob.create({
        data: {
          userId,
          cityId,
          techKey,
          durationSec: dur,
          completesAt,
          status: "queued",
        },
      });
    }
  });

  paths();
  return { ok: true };
}

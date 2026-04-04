"use server";

import { auth } from "@/auth";
import {
  eraTechResearchCost,
  getTechByKey,
  requiredEraIndexForTech,
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
  if (existing && existing.level >= 1) {
    return { ok: false, error: "Bu teknoloji zaten tamamlandı." };
  }

  const active = await prisma.eraTechResearchJob.findFirst({
    where: { userId, status: "queued" },
  });
  if (active) {
    return { ok: false, error: "Zaten bir çağ teknolojisi araştırması sürüyor." };
  }

  const unlocks = getResourceUnlocks(user.currentEra);
  const cost = eraTechResearchCost(entry);
  if (!unlocks.oil && cost.oil > 0) {
    return { ok: false, error: "Bu çağda petrol kullanılamaz." };
  }
  if (!canAfford(city, cost)) {
    return { ok: false, error: "Yetersiz kaynak" };
  }

  const dur = entry.durationSec;

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
      await tx.userEraTech.upsert({
        where: { userId_techKey: { userId, techKey } },
        create: { userId, techKey, level: 1 },
        update: { level: 1 },
      });
    } else {
      const completesAt = new Date(Date.now() + dur * 1000);
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

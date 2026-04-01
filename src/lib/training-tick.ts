import { UNITS } from "@/config/units";
import { prisma } from "@/lib/prisma";
import type { City, User } from "@prisma/client";

function unitSeconds(unitId: string): number {
  const u = UNITS.find((x) => x.id === unitId);
  return u?.trainSeconds ?? 30;
}

/**
 * Tamamlanan üretimleri şehir asker sayısına ekler.
 * Her job 1 adet askerdir; completesAt <= now ise done olur.
 */
export async function applyTrainingJobs(user: User & { cities: City[] }) {
  const now = new Date();
  const jobs = (await (prisma as any).trainingJob.findMany({
    where: { userId: user.id, status: "queued", completesAt: { lte: now } },
    select: { id: true, cityId: true },
    take: 200,
  })) as { id: string; cityId: string }[];
  if (jobs.length === 0) return;

  const byCity = new Map<string, number>();
  for (const j of jobs) {
    byCity.set(j.cityId, (byCity.get(j.cityId) ?? 0) + 1);
  }

  await prisma.$transaction(async (tx) => {
    for (const [cityId, add] of byCity) {
      await tx.city.update({
        where: { id: cityId },
        data: { soldiers: { increment: add } },
      });
    }
    await (tx as any).trainingJob.updateMany({
      where: { id: { in: jobs.map((j: { id: string }) => j.id) } },
      data: { status: "done" },
    });
  });
}

export type EnqueueArgs = {
  userId: string;
  cityId: string;
  unitId: string;
  amount: number; // 1..10
};

/**
 * Kuyruğa N adet job ekler, job'lar ardışık completesAt alır.
 * Maks 3 aktif (queued) job/city.
 */
export async function enqueueTrainingJobs({
  userId,
  cityId,
  unitId,
  amount,
}: EnqueueArgs) {
  const n = Math.max(1, Math.min(3, Math.floor(amount)));
  const dur = unitSeconds(unitId);
  const now = Date.now();

  return prisma.$transaction(async (tx) => {
    const active = await (tx as any).trainingJob.findMany({
      where: { userId, cityId, status: "queued" },
      orderBy: { completesAt: "desc" },
      take: 1,
      select: { completesAt: true },
    });
    const countActive = await (tx as any).trainingJob.count({
      where: { userId, cityId, status: "queued" },
    });
    const MAX_QUEUE = 3;
    const room = Math.max(0, MAX_QUEUE - countActive);
    const toAdd = Math.min(n, room);
    if (toAdd < 1) return { added: 0 };

    const lastCompleteMs = active[0]?.completesAt.getTime() ?? now;
    let startMs = Math.max(now, lastCompleteMs);

    const rows: {
      userId: string;
      cityId: string;
      unitId: string;
      durationSec: number;
      startsAt: Date;
      completesAt: Date;
      status: string;
    }[] = [];
    for (let i = 0; i < toAdd; i++) {
      const startsAt = new Date(startMs);
      const completesAt = new Date(startMs + dur * 1000);
      rows.push({
        userId,
        cityId,
        unitId,
        durationSec: dur,
        startsAt,
        completesAt,
        status: "queued",
      });
      startMs = completesAt.getTime();
    }

    await (tx as any).trainingJob.createMany({ data: rows });
    return { added: toAdd };
  });
}


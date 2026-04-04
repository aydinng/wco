import { UNITS } from "@/config/units";
import { prisma } from "@/lib/prisma";
import type { City, User } from "@prisma/client";

function unitSeconds(unitId: string): number {
  const u = UNITS.find((x) => x.id === unitId);
  return u?.trainSeconds ?? 30;
}

/**
 * Tamamlanan üretimleri şehir asker sayısı ve birim stoklarına ekler.
 */
export async function applyTrainingJobs(user: User & { cities: City[] }) {
  const now = new Date();
  const jobs = await prisma.trainingJob.findMany({
    where: { userId: user.id, status: "queued", completesAt: { lte: now } },
    select: { id: true, cityId: true, unitId: true },
    take: 200,
  });
  if (jobs.length === 0) return;

  type Key = string;
  const byCityUnit = new Map<Key, number>();
  const ids: string[] = [];
  for (const j of jobs) {
    ids.push(j.id);
    const k = `${j.cityId}\0${j.unitId}`;
    byCityUnit.set(k, (byCityUnit.get(k) ?? 0) + 1);
  }

  await prisma.$transaction(async (tx) => {
    for (const [k, add] of byCityUnit) {
      const [cityId, unitId] = k.split("\0");
      await tx.city.update({
        where: { id: cityId },
        data: { soldiers: { increment: add } },
      });
      await tx.cityUnitStock.upsert({
        where: {
          cityId_unitId: { cityId, unitId },
        },
        create: {
          cityId,
          unitId,
          quantity: add,
        },
        update: {
          quantity: { increment: add },
        },
      });
    }
    await tx.trainingJob.updateMany({
      where: { id: { in: ids } },
      data: { status: "done" },
    });
  });
}

export type EnqueueArgs = {
  userId: string;
  cityId: string;
  unitId: string;
  amount: number;
};

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
    const active = await tx.trainingJob.findMany({
      where: { userId, cityId, status: "queued" },
      orderBy: { completesAt: "desc" },
      take: 1,
      select: { completesAt: true },
    });
    const countActive = await tx.trainingJob.count({
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

    await tx.trainingJob.createMany({ data: rows });
    return { added: toAdd };
  });
}

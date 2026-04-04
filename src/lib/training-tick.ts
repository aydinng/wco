import { UNITS } from "@/config/units";
import { unitTrainingTotalDurationSec } from "@/lib/duration-scaling";
import { prisma } from "@/lib/prisma";
import type { City, Prisma, User } from "@prisma/client";

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
    select: { id: true, cityId: true, unitId: true, quantity: true },
    take: 200,
  });
  if (jobs.length === 0) return;

  type Key = string;
  const byCityUnit = new Map<Key, number>();
  const ids: string[] = [];
  for (const j of jobs) {
    ids.push(j.id);
    const q = Math.max(1, j.quantity ?? 1);
    const k = `${j.cityId}\0${j.unitId}`;
    byCityUnit.set(k, (byCityUnit.get(k) ?? 0) + q);
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

const MAX_TRAIN_QUEUE = 3;

/**
 * Tek kuyruk kaydı: 1–50 birim, toplam süre = birim süresi × adet.
 * `countActive` dışarıda doğrulanmış olmalı (< 3).
 */
export async function enqueueTrainingJobsTx(
  tx: Prisma.TransactionClient,
  {
    userId,
    cityId,
    unitId,
    amount,
    researchTier = 0,
  }: EnqueueArgs & { researchTier?: number },
) {
  const n = Math.max(1, Math.min(50, Math.floor(amount)));
  const unitDur = unitSeconds(unitId);
  const totalDurationSec = unitTrainingTotalDurationSec({
    unitTrainSeconds: unitDur,
    quantity: n,
    researchTier,
  });
  const now = Date.now();

  const active = await tx.trainingJob.findMany({
    where: { userId, cityId, status: "queued" },
    orderBy: { completesAt: "desc" },
    take: 1,
    select: { completesAt: true },
  });
  const lastCompleteMs = active[0]?.completesAt.getTime() ?? now;
  const startMs = Math.max(now, lastCompleteMs);
  const startsAt = new Date(startMs);
  const completesAt = new Date(startMs + totalDurationSec * 1000);

  await tx.trainingJob.create({
    data: {
      userId,
      cityId,
      unitId,
      quantity: n,
      durationSec: totalDurationSec,
      startsAt,
      completesAt,
      status: "queued",
    },
  });
  return { added: n };
}

/** Tek oyuncu işlemi için tam transaction sarmalayıcı (test / basit çağrılar). */
export async function enqueueTrainingJobs(args: EnqueueArgs) {
  return prisma.$transaction(async (tx) => {
    const countActive = await tx.trainingJob.count({
      where: { userId: args.userId, cityId: args.cityId, status: "queued" },
    });
    if (countActive >= MAX_TRAIN_QUEUE) {
      return { added: 0 };
    }
    return enqueueTrainingJobsTx(tx, args);
  });
}

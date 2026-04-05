import { prisma } from "@/lib/prisma";
import type { City, User } from "@prisma/client";

/**
 * Tamamlanan bina işlerini uygular; ardından sırada bekleyen tek işi başlatır
 * (aynı anda yalnızca birinin completesAt’i işler).
 */
export async function applyBuildingJobs(user: User & { cities: City[] }) {
  const now = new Date();
  const jobs = (await prisma.buildingJob.findMany({
    where: {
      userId: user.id,
      status: "queued",
      completesAt: { not: null, lte: now },
    },
    select: { id: true, cityId: true, buildingId: true, toLevel: true },
    take: 100,
  })) as { id: string; cityId: string; buildingId: string; toLevel: number }[];

  const fieldById: Record<string, string> = {
    townHall: "townHallLevel",
    lumberMill: "lumberMillLevel",
    ironMine: "ironMineLevel",
    oilWell: "oilWellLevel",
    farm: "farmLevel",
    barracks: "barracksLevel",
    researchLodge: "researchLodgeLevel",
    shepherdLodge: "shepherdLodgeLevel",
    civilLodge: "civilLodgeLevel",
    bank: "bankLevel",
    policeDept: "policeDeptLevel",
  };

  const userIdsToPromote = new Set<string>();

  await prisma.$transaction(async (tx) => {
    for (const j of jobs) {
      const field = fieldById[j.buildingId];
      if (!field) continue;
      await tx.city.update({
        where: { id: j.cityId },
        data: { [field]: j.toLevel },
      });
      await tx.buildingJob.update({
        where: { id: j.id },
        data: { status: "done" },
      });
      userIdsToPromote.add(user.id);
    }
  });

  for (const uid of userIdsToPromote) {
    const pending = await prisma.buildingJob.findFirst({
      where: { userId: uid, status: "queued", completesAt: null },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    });
    if (!pending) continue;
    const completesAt = new Date(now.getTime() + pending.durationSec * 1000);
    await prisma.buildingJob.update({
      where: { id: pending.id },
      data: {
        startsAt: now,
        completesAt,
      },
    });
  }
}

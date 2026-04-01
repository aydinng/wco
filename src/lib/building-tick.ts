import { prisma } from "@/lib/prisma";
import type { City, User } from "@prisma/client";

/**
 * Tamamlanan bina job'larını şehir seviyelerine uygular.
 * MVP: job oluşturulurken hedef seviye hesaplanır, tamamlanınca ilgili level alanına yazılır.
 */
export async function applyBuildingJobs(user: User & { cities: City[] }) {
  const now = new Date();
  const jobs = (await (prisma as any).buildingJob.findMany({
    where: { userId: user.id, status: "queued", completesAt: { lte: now } },
    select: { id: true, cityId: true, buildingId: true, toLevel: true },
    take: 100,
  })) as { id: string; cityId: string; buildingId: string; toLevel: number }[];

  if (jobs.length === 0) return;

  const fieldById: Record<string, string> = {
    townHall: "townHallLevel",
    lumberMill: "lumberMillLevel",
    ironMine: "ironMineLevel",
    oilWell: "oilWellLevel",
    farm: "farmLevel",
    barracks: "barracksLevel",
  };

  await prisma.$transaction(async (tx) => {
    for (const j of jobs) {
      const field = fieldById[j.buildingId];
      if (!field) continue;
      await tx.city.update({
        where: { id: j.cityId },
        data: { [field]: j.toLevel },
      });
    }
    await (tx as any).buildingJob.updateMany({
      where: { id: { in: jobs.map((j: { id: string }) => j.id) } },
      data: { status: "done" },
    });
  });
}


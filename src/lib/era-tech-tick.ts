import { prisma } from "@/lib/prisma";

/**
 * Süresi dolan çağ teknolojisi araştırmasını tamamlar (seviye 1).
 */
export async function applyEraTechJobs(userId: string) {
  const now = new Date();
  const jobs = await prisma.eraTechResearchJob.findMany({
    where: {
      userId,
      status: "queued",
      completesAt: { lte: now },
    },
    take: 50,
  });
  if (jobs.length === 0) return;

  await prisma.$transaction(async (tx) => {
    for (const j of jobs) {
      await tx.userEraTech.upsert({
        where: {
          userId_techKey: { userId: j.userId, techKey: j.techKey },
        },
        create: {
          userId: j.userId,
          techKey: j.techKey,
          level: 1,
        },
        update: { level: 1 },
      });
      await tx.eraTechResearchJob.update({
        where: { id: j.id },
        data: { status: "done" },
      });
    }
  });
}

import { applyCompletedEraTech } from "@/lib/era-tech-completion";
import { prisma } from "@/lib/prisma";

/**
 * Süresi dolan çağ teknolojisi işini tamamlar; sırada bekleyen varsa onu başlatır
 * (aynı anda yalnızca birinin süresi işler).
 */
export async function applyEraTechJobs(userId: string) {
  const now = new Date();
  const jobs = await prisma.eraTechResearchJob.findMany({
    where: {
      userId,
      status: "queued",
      completesAt: { not: null, lte: now },
    },
    take: 50,
  });
  if (jobs.length === 0) return;

  await prisma.$transaction(async (tx) => {
    for (const j of jobs) {
      await applyCompletedEraTech(tx, j.userId, j.techKey);
      await tx.eraTechResearchJob.update({
        where: { id: j.id },
        data: { status: "done" },
      });
    }
  });

  const pending = await prisma.eraTechResearchJob.findFirst({
    where: { userId, status: "queued", completesAt: null },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  });
  if (pending) {
    await prisma.eraTechResearchJob.update({
      where: { id: pending.id },
      data: {
        completesAt: new Date(now.getTime() + pending.durationSec * 1000),
      },
    });
  }
}

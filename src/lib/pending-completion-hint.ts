import { prisma } from "@/lib/prisma";

export type PendingCompletionHint = {
  /** En yakın bilinen bitiş zamanı (bina / üretim / araştırma / çağ teknolojisi) */
  nextCompletionAt: Date | null;
  /** completesAt henüz atanmamış sıra bekleyen bina işi — periyodik yenileme gerekir */
  pollStalledBuildingQueue: boolean;
};

/**
 * Oyun içi sayfaların süre dolunca `router.refresh()` ile güncellenmesi için ipuçları.
 */
export async function getPendingCompletionHint(
  userId: string,
): Promise<PendingCompletionHint> {
  const now = new Date();

  const [userRow, bNext, bWaiting, tNext, eNext] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { researchJobEndsAt: true },
    }),
    prisma.buildingJob.findFirst({
      where: {
        userId,
        status: "queued",
        completesAt: { not: null, gt: now },
      },
      orderBy: { completesAt: "asc" },
      select: { completesAt: true },
    }),
    prisma.buildingJob.count({
      where: { userId, status: "queued", completesAt: null },
    }),
    prisma.trainingJob.findFirst({
      where: { userId, status: "queued", completesAt: { gt: now } },
      orderBy: { completesAt: "asc" },
      select: { completesAt: true },
    }),
    prisma.eraTechResearchJob.findFirst({
      where: {
        userId,
        status: "queued",
        completesAt: { not: null, gt: now },
      },
      orderBy: { completesAt: "asc" },
      select: { completesAt: true },
    }),
  ]);

  const candidates: Date[] = [];
  if (userRow?.researchJobEndsAt && userRow.researchJobEndsAt > now) {
    candidates.push(userRow.researchJobEndsAt);
  }
  if (bNext?.completesAt) candidates.push(bNext.completesAt);
  if (tNext?.completesAt) candidates.push(tNext.completesAt);
  if (eNext?.completesAt) candidates.push(eNext.completesAt);

  const nextCompletionAt =
    candidates.length === 0
      ? null
      : new Date(Math.min(...candidates.map((d) => d.getTime())));

  return {
    nextCompletionAt,
    pollStalledBuildingQueue: bWaiting > 0,
  };
}

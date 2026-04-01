import { prisma } from "@/lib/prisma";
import { MAX_RESEARCH_TIER } from "@/lib/economy";
import type { User } from "@prisma/client";

/**
 * Süresi dolan araştırma işini tamamlar: researchTier +1, researchJobEndsAt temizlenir.
 */
export async function applyResearchJobs(user: User) {
  const ends = user.researchJobEndsAt;
  if (!ends) return;
  const now = new Date();
  if (ends.getTime() > now.getTime()) return;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      researchJobEndsAt: null,
      researchTier: Math.min(MAX_RESEARCH_TIER, user.researchTier + 1),
    },
  });
}

/** Sunucu aksiyonunda güncel tier için önce süresi dolmuş işi kapatır */
export async function flushResearchJob(userId: string) {
  const u = await prisma.user.findUnique({ where: { id: userId } });
  if (!u) return null;
  await applyResearchJobs(u);
  return prisma.user.findUnique({ where: { id: userId } });
}

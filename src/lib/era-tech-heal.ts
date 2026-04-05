import { prisma } from "@/lib/prisma";

/**
 * Tamamlanmış çağ kilidi teknolojileri var ama currentEra geride kaldıysa düzeltir
 * (iş tamamlandıktan sonra güncelleme kaçmış olabilir).
 */
export async function healUserEraFromTechProgress(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currentEra: true },
  });
  if (!user) return;

  const rows = await prisma.userEraTech.findMany({
    where: {
      userId,
      techKey: { in: ["orta_cag_unlock", "yeniden_dogus_unlock"] },
      level: { gte: 1 },
    },
    select: { techKey: true },
  });
  const has = new Set(rows.map((r) => r.techKey));

  let next = user.currentEra;
  if (has.has("yeniden_dogus_unlock")) {
    next = "yeniden_dogus";
  } else if (has.has("orta_cag_unlock")) {
    next = "orta_cag";
  }

  if (next !== user.currentEra) {
    await prisma.user.update({
      where: { id: userId },
      data: { currentEra: next },
    });
  }
}

import { prisma } from "@/lib/prisma";

/** Eski `soldiers` toplamı ile birim kırılımı uyuşmuyorsa farkı mızrakçıya yazar */
export async function syncLegacySoldiersToUnitStocks(userId: string) {
  const cities = await prisma.city.findMany({
    where: { userId },
    include: { cityUnitStocks: true },
  });
  for (const c of cities) {
    const fromStocks = c.cityUnitStocks.reduce((a, s) => a + s.quantity, 0);
    const gap = c.soldiers - fromStocks;
    if (gap <= 0) continue;
    await prisma.cityUnitStock.upsert({
      where: {
        cityId_unitId: { cityId: c.id, unitId: "mizrakci" },
      },
      create: {
        cityId: c.id,
        unitId: "mizrakci",
        quantity: gap,
      },
      update: {
        quantity: { increment: gap },
      },
    });
  }
}

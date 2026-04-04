import type { City, User } from "@prisma/client";
import { getResourceUnlocks } from "@/config/eras";
import { hourlyProduction } from "@/lib/economy";

/** Oyuncu skor bileşenleri — istatistik çubukları ve sıralama için */
export function computeUserScores(user: User & { cities: City[] }) {
  const unlocks = getResourceUnlocks(user.currentEra);
  let prod = 0;
  for (const c of user.cities) {
    const ph = hourlyProduction(c, user.researchTier, unlocks);
    prod += Math.floor(
      Math.abs(ph.wood) + Math.abs(ph.iron) + Math.abs(ph.oil) + Math.abs(ph.food),
    );
  }
  const tech = user.researchTier * 2500;
  let bld = 0;
  for (const c of user.cities) {
    bld +=
      c.townHallLevel +
      c.lumberMillLevel +
      c.ironMineLevel +
      c.oilWellLevel +
      c.farmLevel +
      c.barracksLevel;
  }
  bld *= 150;
  const total = prod + tech + bld;
  return {
    scoreProduction: prod,
    scoreTech: tech,
    scoreBuilding: bld,
    scoreTotal: total,
  };
}

import type { City, User } from "@prisma/client";
import { getResourceUnlocks } from "@/config/eras";
import {
  eraTechResourceMultipliers,
  type EraTechLevels,
} from "@/lib/era-tech-bonuses";
import { hourlyProduction } from "@/lib/economy";

type ScoreOpts = {
  /** Tamamlanmış çağ teknolojisi sayısı (UserEraTech level ≥ 1) */
  eraTechCompleted?: number;
  /** Üretim skorunda çağ teknolojisi çarpanları */
  eraTechLevels?: EraTechLevels;
};

/** Oyuncu skor bileşenleri — istatistik çubukları ve sıralama için */
export function computeUserScores(
  user: User & { cities: City[] },
  opts?: ScoreOpts,
) {
  const eraTechCompleted = opts?.eraTechCompleted ?? 0;
  const unlocks = getResourceUnlocks(user.currentEra);
  const mult = opts?.eraTechLevels
    ? eraTechResourceMultipliers(opts.eraTechLevels)
    : { wood: 1, iron: 1, oil: 1, food: 1 };
  let prod = 0;
  for (const c of user.cities) {
    const ph = hourlyProduction(c, user.researchTier, unlocks);
    prod += Math.floor(
      Math.abs(ph.wood * mult.wood) +
        Math.abs(ph.iron * mult.iron) +
        Math.abs(ph.oil * mult.oil) +
        Math.abs(ph.food * mult.food),
    );
  }
  const tech =
    user.researchTier * 2500 + eraTechCompleted * 800;
  let bld = 0;
  for (const c of user.cities) {
    bld +=
      c.townHallLevel +
      c.lumberMillLevel +
      c.ironMineLevel +
      c.oilWellLevel +
      c.farmLevel +
      c.barracksLevel +
      c.researchLodgeLevel +
      c.shepherdLodgeLevel +
      c.civilLodgeLevel +
      c.bankLevel +
      c.policeDeptLevel;
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

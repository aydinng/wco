import { eraIndex } from "@/config/eras";
import {
  MIN_ERA_INDEX_FOR_FOUND_CITY,
  MIN_RESEARCH_TIER_FOR_FOUND_CITY,
} from "@/config/game-rules";

export function canFoundCity(
  eraId: string | null | undefined,
  researchTier: number,
): boolean {
  return (
    eraIndex(eraId) >= MIN_ERA_INDEX_FOR_FOUND_CITY &&
    researchTier >= MIN_RESEARCH_TIER_FOR_FOUND_CITY
  );
}

/** Mevcut şehir sayısına göre kurulum maliyeti */
export function foundCityCostWoodIronFood(existingCityCount: number) {
  const n = Math.max(1, existingCityCount + 1);
  return {
    wood: 2500 * n,
    iron: 2000 * n,
    food: 1800 * n,
  };
}

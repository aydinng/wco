import type { BuildingId } from "@/app/actions/game-city";
import type { City } from "@prisma/client";
import {
  buildingProductionMultiplier,
  computePopCap,
  soldierCap,
} from "@/lib/economy";

export type BonusTemplates = {
  bonusNone: string;
  bonusTownHall: string;
  bonusResource: string;
  bonusBarracks: string;
};

export function formatBuildingBonusLine(
  building: BuildingId,
  level: number,
  city: City,
  templates: BonusTemplates,
): string {
  if (level < 1) return templates.bonusNone;
  const mult = buildingProductionMultiplier(level);
  const multStr =
    mult % 1 === 0 ? String(mult) : mult.toFixed(2).replace(/\.?0+$/, "") || "1";

  if (building === "townHall") {
    const cap = computePopCap({
      townHallLevel: level,
      barracksLevel: city.barracksLevel,
      civilLodgeLevel: city.civilLodgeLevel,
    });
    return templates.bonusTownHall.replace("{cap}", String(cap));
  }
  if (building === "barracks") {
    const cap = soldierCap(level);
    return templates.bonusBarracks.replace("{cap}", String(cap));
  }
  return templates.bonusResource.replace("{mult}", multStr);
}

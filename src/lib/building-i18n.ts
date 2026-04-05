import type { BuildingId } from "@/app/actions/game-city";

const NAMES: Record<
  BuildingId,
  { tr: string; en: string }
> = {
  townHall: { tr: "Belediye", en: "Town hall" },
  lumberMill: { tr: "Oduncu kulübesi", en: "Lumberjack lodge" },
  ironMine: { tr: "Demir madeni", en: "Iron mine" },
  oilWell: { tr: "Petrol kuyusu", en: "Oil well" },
  farm: { tr: "Çiftlik", en: "Farm" },
  barracks: { tr: "Kışla", en: "Barracks" },
  researchLodge: { tr: "Araştırma kulübesi", en: "Research lodge" },
  shepherdLodge: { tr: "Çoban kulübesi", en: "Shepherd lodge" },
  civilLodge: { tr: "Sivil kulübesi", en: "Civil lodge" },
  bank: { tr: "Banka", en: "Bank" },
  policeDept: { tr: "Polis departmanı", en: "Police department" },
};

export function buildingDisplayName(
  id: string,
  locale: string,
): string {
  const row = NAMES[id as BuildingId];
  if (!row) return id;
  return locale === "en" ? row.en : row.tr;
}

export function buildingJobSummaryLine(
  buildingId: string,
  toLevel: number,
  locale: string,
): string {
  const name = buildingDisplayName(buildingId, locale);
  return locale === "en"
    ? `${name} → Lv.${toLevel}`
    : `${name} → Sv. ${toLevel}`;
}

import type { BuildingId } from "@/app/actions/game-city";

export function buildingImagePath(id: BuildingId): string {
  const map: Record<BuildingId, string> = {
    townHall: "/buildings/town-hall.jpg",
    lumberMill: "/buildings/lumber-mill.svg",
    ironMine: "/buildings/iron-mine.svg",
    oilWell: "/buildings/oil-well.svg",
    farm: "/buildings/farm.svg",
    barracks: "/buildings/barracks.svg",
  };
  return map[id];
}

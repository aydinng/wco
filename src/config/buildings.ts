import type { BuildingId } from "@/app/actions/game-city";

function assetUrl(path: string): string {
  return encodeURI(path);
}

export function buildingImagePath(id: BuildingId): string {
  const map: Record<BuildingId, string> = {
    townHall: "/buildings/civil-lodge.svg",
    lumberMill: "/buildings/lumber-mill.svg",
    ironMine: "/buildings/iron-mine.svg",
    oilWell: "/buildings/oil-well.svg",
    farm: "/buildings/farm.svg",
    barracks: assetUrl("/buildings/kışla.jpg"),
    researchLodge: "/buildings/research-lodge.svg",
    shepherdLodge: "/buildings/shepherd-lodge.svg",
    civilLodge: "/buildings/civil-lodge.svg",
    bank: "/buildings/bank.svg",
    policeDept: "/buildings/police.svg",
  };
  return map[id];
}

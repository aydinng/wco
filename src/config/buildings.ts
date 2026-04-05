import type { BuildingId } from "@/app/actions/game-city";

function assetUrl(path: string): string {
  return encodeURI(path);
}

export function buildingImagePath(id: BuildingId): string {
  const map: Record<BuildingId, string> = {
    townHall: "/buildings/town-hall.jpg",
    lumberMill: assetUrl("/buildings/taş-ocagi.jpg"),
    ironMine: "/buildings/iron-mine.svg",
    oilWell: "/buildings/oil-well.svg",
    farm: assetUrl("/buildings/avcı-kulubesi.jpg"),
    barracks: assetUrl("/buildings/kışla.jpg"),
    researchLodge: "/buildings/research-lodge.svg",
    shepherdLodge: "/buildings/shepherd-lodge.svg",
    civilLodge: "/buildings/civil-lodge.svg",
    bank: "/buildings/bank.svg",
    policeDept: "/buildings/police.svg",
  };
  return map[id];
}

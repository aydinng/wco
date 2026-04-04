import type { BuildingId } from "@/app/actions/game-city";

/** public/ altında Unicode dosya adları için güvenli URL */
function assetUrl(path: string): string {
  return encodeURI(path);
}

export function buildingImagePath(id: BuildingId): string {
  const map: Record<BuildingId, string> = {
    townHall: "/buildings/town-hall.jpg",
    /** Taş Ocağı — görsel: public/buildings/taş-ocagi.jpg */
    lumberMill: assetUrl("/buildings/taş-ocagi.jpg"),
    ironMine: "/buildings/iron-mine.svg",
    oilWell: "/buildings/oil-well.svg",
    /** Avcı Kulübesi — görsel: public/buildings/avcı-kulubesi.jpg */
    farm: assetUrl("/buildings/avcı-kulubesi.jpg"),
    /** Kışla — görsel: public/buildings/kışla.jpg */
    barracks: assetUrl("/buildings/kışla.jpg"),
  };
  return map[id];
}

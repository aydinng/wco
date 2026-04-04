import type { BuildingId } from "@/app/actions/game-city";

export function buildingImagePath(id: BuildingId): string {
  const map: Record<BuildingId, string> = {
    townHall: "/buildings/town-hall.jpg",
    /** İlk çağ katalog: Taş Ocağı — görsel dosyası public/buildings/tas-ocagi.jpg */
    lumberMill: "/buildings/tas-ocagi.jpg",
    ironMine: "/buildings/iron-mine.svg",
    oilWell: "/buildings/oil-well.svg",
    /** İlk çağ: Avcı Kulübesi — public/buildings/avci-kulubesi.jpg */
    farm: "/buildings/avci-kulubesi.jpg",
    /** Kışla — public/buildings/kisla.jpg */
    barracks: "/buildings/kisla.jpg",
  };
  return map[id];
}

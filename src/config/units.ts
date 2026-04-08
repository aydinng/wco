import { eraIndex, type EraId } from "@/config/eras";

export type UnitPurpose =
  | "saldırı"
  | "koruma"
  | "saldırı/koruma"
  | "taşıma"
  | "casusluk";

/** Üretim maliyeti: taban + ek (petrol/nadir birimler) */
export type UnitCostAddon = {
  wood?: number;
  iron?: number;
  oil?: number;
  food?: number;
};

export type UnitSpec = {
  id: string;
  name: string;
  minEra: EraId;
  /** Tek asker eğitim süresi (sn) */
  trainSeconds: number;
  purpose: UnitPurpose;
  attack: number;
  defense: number;
  agility: number;
  speed: number;
  carry: number;
  hp: number;
  foodPerMinute: number;
  imageSrc: string;
  /** trainCostPerSoldier üzerine ek kaynak (adet başına) */
  costAddon?: UnitCostAddon;
};

/**
 * Çağ eşlemesi (oyuncu): 2→orta_cag, 3→yeniden_dogus, 4→sanayi, 5→modern
 */
export const UNITS: UnitSpec[] = [
  {
    id: "mizrakci",
    name: "Mızrakçı",
    minEra: "ilk_cag",
    trainSeconds: 220,
    purpose: "saldırı",
    attack: 14,
    defense: 10,
    agility: 22,
    speed: 26,
    carry: 8,
    hp: 22,
    foodPerMinute: 1,
    imageSrc: "/units/mizrakci.jpg",
  },
  {
    id: "asil_sovalye",
    name: "Asil Şövalye",
    minEra: "orta_cag",
    trainSeconds: 22,
    purpose: "saldırı/koruma",
    attack: 84,
    defense: 42,
    agility: 37,
    speed: 28,
    carry: 0,
    hp: 90,
    foodPerMinute: 4,
    imageSrc: "/units/unit-strip.svg",
  },
  {
    id: "kilic_ustasi",
    name: "Kılıç Ustası",
    minEra: "orta_cag",
    trainSeconds: 19,
    purpose: "saldırı/koruma",
    attack: 53,
    defense: 36,
    agility: 25,
    speed: 27,
    carry: 0,
    hp: 34,
    foodPerMinute: 2,
    imageSrc: "/units/unit-strip.svg",
  },
  {
    id: "sovalye",
    name: "Şövalye",
    minEra: "orta_cag",
    trainSeconds: 16,
    purpose: "saldırı/koruma",
    attack: 58,
    defense: 34,
    agility: 26,
    speed: 29,
    carry: 0,
    hp: 41,
    foodPerMinute: 2,
    imageSrc: "/units/unit-strip.svg",
  },
  {
    id: "makinali",
    name: "Makinalı",
    minEra: "yeniden_dogus",
    trainSeconds: 59,
    purpose: "saldırı/koruma",
    attack: 113,
    defense: 36,
    agility: 24,
    speed: 53,
    carry: 0,
    hp: 113,
    foodPerMinute: 5,
    imageSrc: "/units/unit-strip.svg",
  },
  {
    id: "tufekli_asker",
    name: "Tüfekli Asker",
    minEra: "yeniden_dogus",
    trainSeconds: 47,
    purpose: "saldırı/koruma",
    attack: 83,
    defense: 35,
    agility: 31,
    speed: 63,
    carry: 0,
    hp: 102,
    foodPerMinute: 4,
    imageSrc: "/units/unit-strip.svg",
  },
  {
    id: "bazuka",
    name: "Bazuka",
    minEra: "yeniden_dogus",
    trainSeconds: 39,
    purpose: "saldırı/koruma",
    attack: 93,
    defense: 34,
    agility: 27,
    speed: 58,
    carry: 0,
    hp: 135,
    foodPerMinute: 4,
    imageSrc: "/units/unit-strip.svg",
  },
  {
    id: "keskin_nisanci",
    name: "Keskin Nişancı",
    minEra: "yeniden_dogus",
    trainSeconds: 38,
    purpose: "saldırı/koruma",
    attack: 115,
    defense: 30,
    agility: 172,
    speed: 53,
    carry: 0,
    hp: 57,
    foodPerMinute: 4,
    imageSrc: "/units/unit-strip.svg",
  },
  {
    id: "helikopter",
    name: "Helikopter",
    minEra: "sanayi",
    trainSeconds: 49,
    purpose: "taşıma",
    attack: 29,
    defense: 41,
    agility: 122,
    speed: 113,
    carry: 150_000,
    hp: 113,
    foodPerMinute: 5,
    imageSrc: "/units/unit-strip.svg",
  },
  {
    id: "casus_ucak",
    name: "Casus Uçak",
    minEra: "sanayi",
    trainSeconds: 63,
    purpose: "casusluk",
    attack: 32,
    defense: 36,
    agility: 222,
    speed: 923,
    carry: 0,
    hp: 113,
    foodPerMinute: 5,
    imageSrc: "/units/unit-strip.svg",
  },
  {
    id: "bombardiman_ucagi",
    name: "Bombardıman Uçağı",
    minEra: "sanayi",
    trainSeconds: 46,
    purpose: "saldırı/koruma",
    attack: 378,
    defense: 41,
    agility: 32,
    speed: 103,
    carry: 0,
    hp: 45,
    foodPerMinute: 10,
    imageSrc: "/units/unit-strip.svg",
  },
  {
    id: "roket_atar",
    name: "Roket Atar",
    minEra: "modern",
    trainSeconds: 316,
    purpose: "saldırı/koruma",
    attack: 578,
    defense: 41,
    agility: 23,
    speed: 68,
    carry: 0,
    hp: 563,
    foodPerMinute: 22,
    imageSrc: "/units/unit-strip.svg",
  },
  {
    id: "firavun",
    name: "Firavun",
    minEra: "modern",
    trainSeconds: 394,
    purpose: "saldırı/koruma",
    attack: 178,
    defense: 61,
    agility: 222,
    speed: 68,
    carry: 0,
    hp: 338,
    foodPerMinute: 15,
    imageSrc: "/units/unit-strip.svg",
  },
  {
    id: "alev_tanki",
    name: "Alev Tankı",
    minEra: "modern",
    trainSeconds: 238,
    purpose: "saldırı/koruma",
    attack: 378,
    defense: 66,
    agility: 23,
    speed: 53,
    carry: 0,
    hp: 900,
    foodPerMinute: 20,
    imageSrc: "/units/unit-strip.svg",
  },
];

export type UnitId = (typeof UNITS)[number]["id"];

const UNIT_BY_ID = new Map(UNITS.map((u) => [u.id, u]));

export function getUnitSpec(unitId: string): UnitSpec | undefined {
  return UNIT_BY_ID.get(unitId);
}

export function unlockedUnits(playerEra: string | null | undefined): UnitSpec[] {
  const idx = eraIndex(playerEra);
  const seen = new Set<string>();
  const out: UnitSpec[] = [];
  for (const u of UNITS) {
    if (eraIndex(u.minEra) > idx) continue;
    if (seen.has(u.id)) continue;
    seen.add(u.id);
    out.push(u);
  }
  return out;
}

/** Katalog: tüm çağlardaki birimler (kilit durumu satırda gösterilir). */
export function catalogUnits(): UnitSpec[] {
  const seen = new Set<string>();
  const out: UnitSpec[] = [];
  for (const u of UNITS) {
    if (seen.has(u.id)) continue;
    seen.add(u.id);
    out.push(u);
  }
  return out;
}

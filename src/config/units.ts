import { eraIndex, type EraId } from "@/config/eras";

export type UnitPurpose = "saldırı" | "koruma" | "saldırı/koruma";

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
  /** Tek asker eğitim süresi (sn) — denge: erken kısa, geç oyun uzun */
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
 * 7 çağ modeli: isimler ilkel → teknolojik; güçler kademeli.
 * Eski kuyruklar için legacy id’ler sonda tutuldu.
 */
export const UNITS: UnitSpec[] = [
  // --- İlk Çağ ---
  {
    id: "mizrakci",
    name: "Mızrakçı",
    minEra: "ilk_cag",
    trainSeconds: 100,
    purpose: "saldırı",
    attack: 14,
    defense: 10,
    agility: 22,
    speed: 26,
    carry: 8,
    hp: 22,
    foodPerMinute: 1,
    imageSrc: "/units/unit-strip.svg",
  },
  // --- Orta Çağ ---
  {
    id: "muhafiz",
    name: "Muhafız",
    minEra: "orta_cag",
    trainSeconds: 130,
    purpose: "koruma",
    attack: 18,
    defense: 28,
    agility: 14,
    speed: 18,
    carry: 0,
    hp: 45,
    foodPerMinute: 2,
    imageSrc: "/units/unit-strip.svg",
  },
  {
    id: "agir_suvari",
    name: "Ağır Süvari (Şövalye)",
    minEra: "orta_cag",
    trainSeconds: 1800,
    purpose: "saldırı",
    attack: 52,
    defense: 38,
    agility: 20,
    speed: 32,
    carry: 0,
    hp: 55,
    foodPerMinute: 5,
    imageSrc: "/units/unit-strip.svg",
    costAddon: { iron: 15, food: 10 },
  },
  {
    id: "arbaletci",
    name: "Arbaletçi",
    minEra: "orta_cag",
    trainSeconds: 260,
    purpose: "saldırı",
    attack: 44,
    defense: 16,
    agility: 24,
    speed: 20,
    carry: 0,
    hp: 28,
    foodPerMinute: 2,
    imageSrc: "/units/unit-strip.svg",
  },
  // --- Rönesans ---
  {
    id: "arkebuscu",
    name: "İlk Arkebüzcü",
    minEra: "yeniden_dogus",
    trainSeconds: 420,
    purpose: "saldırı",
    attack: 62,
    defense: 22,
    agility: 28,
    speed: 38,
    carry: 0,
    hp: 48,
    foodPerMinute: 3,
    imageSrc: "/units/unit-strip.svg",
  },
  {
    id: "makinali",
    name: "Seri Atışlı Tüfek",
    minEra: "yeniden_dogus",
    trainSeconds: 3200,
    purpose: "saldırı/koruma",
    attack: 88,
    defense: 36,
    agility: 22,
    speed: 42,
    carry: 0,
    hp: 72,
    foodPerMinute: 4,
    imageSrc: "/units/unit-strip.svg",
    costAddon: { iron: 25, food: 15 },
  },
  // --- Sanayi ---
  {
    id: "tufekci",
    name: "Tüfekçi",
    minEra: "sanayi",
    trainSeconds: 900,
    purpose: "saldırı/koruma",
    attack: 72,
    defense: 40,
    agility: 26,
    speed: 36,
    carry: 0,
    hp: 58,
    foodPerMinute: 3,
    imageSrc: "/units/unit-strip.svg",
  },
  {
    id: "sahra_topu",
    name: "Sahra Topu",
    minEra: "sanayi",
    trainSeconds: 7200,
    purpose: "saldırı",
    attack: 120,
    defense: 28,
    agility: 10,
    speed: 12,
    carry: 0,
    hp: 95,
    foodPerMinute: 6,
    imageSrc: "/units/unit-strip.svg",
    costAddon: { iron: 40, oil: 8, food: 20 },
  },
  // --- Modern ---
  {
    id: "komando",
    name: "Komando",
    minEra: "modern",
    trainSeconds: 3600,
    purpose: "saldırı",
    attack: 95,
    defense: 55,
    agility: 40,
    speed: 55,
    carry: 12,
    hp: 85,
    foodPerMinute: 5,
    imageSrc: "/units/unit-strip.svg",
  },
  {
    id: "ana_muharebe_tanki",
    name: "Ana Muharebe Tankı",
    minEra: "modern",
    trainSeconds: 28800,
    purpose: "koruma",
    attack: 110,
    defense: 130,
    agility: 12,
    speed: 22,
    carry: 0,
    hp: 220,
    foodPerMinute: 12,
    imageSrc: "/units/unit-strip.svg",
    costAddon: { iron: 80, oil: 35, food: 40 },
  },
  // --- Dijital ---
  {
    id: "siber_saldiri",
    name: "Siber Saldırı Ekibi",
    minEra: "dijital",
    trainSeconds: 5400,
    purpose: "saldırı",
    attack: 85,
    defense: 35,
    agility: 45,
    speed: 40,
    carry: 0,
    hp: 40,
    foodPerMinute: 4,
    imageSrc: "/units/unit-strip.svg",
  },
  {
    id: "iha",
    name: "İHA Operatörü",
    minEra: "dijital",
    trainSeconds: 14400,
    purpose: "saldırı",
    attack: 70,
    defense: 18,
    agility: 55,
    speed: 90,
    carry: 0,
    hp: 25,
    foodPerMinute: 3,
    imageSrc: "/units/unit-strip.svg",
    costAddon: { oil: 20, iron: 30, food: 25 },
  },
  // --- Küresel ısınma ---
  {
    id: "cevre_muhafizi",
    name: "Çevre Muhafızı",
    minEra: "kuresel_isinma",
    trainSeconds: 21600,
    purpose: "saldırı/koruma",
    attack: 78,
    defense: 92,
    agility: 30,
    speed: 35,
    carry: 15,
    hp: 110,
    foodPerMinute: 6,
    imageSrc: "/units/unit-strip.svg",
  },
  {
    id: "mech_birim",
    name: "Mech Birim",
    minEra: "kuresel_isinma",
    trainSeconds: 43200,
    purpose: "koruma",
    attack: 95,
    defense: 140,
    agility: 18,
    speed: 28,
    carry: 0,
    hp: 260,
    foodPerMinute: 2,
    imageSrc: "/units/unit-strip.svg",
    costAddon: { iron: 50, oil: 25, food: 15 },
  },

  // --- Legacy (eski kuyruk unitId uyumluluğu) ---
  {
    id: "asil_sovalye",
    name: "Asil Şövalye (eski)",
    minEra: "orta_cag",
    trainSeconds: 1800,
    purpose: "saldırı",
    attack: 52,
    defense: 38,
    agility: 37,
    speed: 28,
    carry: 0,
    hp: 30,
    foodPerMinute: 4,
    imageSrc: "/units/unit-strip.svg",
  },
  {
    id: "kilic_ustasi",
    name: "Kılıç Ustası (eski)",
    minEra: "orta_cag",
    trainSeconds: 130,
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
    name: "Şövalye (eski)",
    minEra: "orta_cag",
    trainSeconds: 120,
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
    id: "tufekli_asker",
    name: "Tüfekli Asker (eski)",
    minEra: "yeniden_dogus",
    trainSeconds: 900,
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
    name: "Bazuka (eski)",
    minEra: "yeniden_dogus",
    trainSeconds: 1200,
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
];

export type UnitId = (typeof UNITS)[number]["id"];

const UNIT_BY_ID = new Map(UNITS.map((u) => [u.id, u]));

export function getUnitSpec(unitId: string): UnitSpec | undefined {
  return UNIT_BY_ID.get(unitId);
}

/** Eski kayıtlı kuyruk id’leri — katalogda gösterme */
const LEGACY_UNIT_IDS = new Set([
  "asil_sovalye",
  "kilic_ustasi",
  "sovalye",
  "tufekli_asker",
  "bazuka",
]);

export function unlockedUnits(playerEra: string | null | undefined): UnitSpec[] {
  const idx = eraIndex(playerEra);
  const seen = new Set<string>();
  const out: UnitSpec[] = [];
  for (const u of UNITS) {
    if (LEGACY_UNIT_IDS.has(u.id)) continue;
    if (eraIndex(u.minEra) > idx) continue;
    if (seen.has(u.id)) continue;
    seen.add(u.id);
    out.push(u);
  }
  return out;
}

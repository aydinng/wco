/**
 * Referans: üst seviye süreler (oyuncunun verdiği değerler).
 * Seviye 1 süresi: kısa süreler (<1 saat) için ref/tier; uzunlar için ref/tier²; üst sınır 48 saat.
 */
export type TechCatalogEntry = {
  id: string;
  eraOrdinal: number;
  tier: number;
  nameTr: string;
  nameEn: string;
  durationTr: string;
  durationEn: string;
  /** Sunucu işi için saniye */
  durationSec: number;
  goalTr: string;
  goalEn: string;
  imageSrc: string;
};

/** Referans süre (saniye) ve tier — seviye 1 süresi hesaplanır */
type RawTech = {
  id: string;
  eraOrdinal: number;
  tier: number;
  nameTr: string;
  nameEn: string;
  refSec: number;
  goalTr: string;
  goalEn: string;
};

const D = 86400;
const H = 3600;
const M = 60;

export function level1DurationSec(refSec: number, tier: number): number {
  if (refSec <= 0) return 0;
  const t = Math.max(1, tier);
  const d = refSec < H ? refSec / t : refSec / (t * t);
  const rounded = Math.round(d);
  if (rounded === 0) return 1;
  return Math.min(48 * H, Math.max(1, rounded));
}

function fmtTr(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${String(r).padStart(2, "0")}s`;
}

function fmtEn(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${String(r).padStart(2, "0")}s`;
}

const RAW: RawTech[] = [
  {
    id: "robotbilim",
    eraOrdinal: 5,
    tier: 11,
    nameTr: "Robotbilim",
    nameEn: "Robotics",
    refSec: 2 * H + 38 * M + 40,
    goalTr: "Diğer teknolojiler için gereklidir.",
    goalEn: "Required for other technologies.",
  },
  {
    id: "accelerated_decay",
    eraOrdinal: 5,
    tier: 20,
    nameTr: "Hızlandırılmış çürüme",
    nameEn: "Accelerated decay",
    refSec: 325 * D + 22 * H + 13 * M + 20,
    goalTr: "Petrol üretimini 1,6 katına çıkarır.",
    goalEn: "Multiplies oil production by 1.6×.",
  },
  {
    id: "moss_cultivation",
    eraOrdinal: 5,
    tier: 18,
    nameTr: "Yosun yetiştirme",
    nameEn: "Moss cultivation",
    refSec: 116 * D + 4 * H + 53 * M + 20,
    goalTr: "Besin üretimini 1,6 katına çıkarır.",
    goalEn: "Multiplies food production by 1.6×.",
  },
  {
    id: "season_control",
    eraOrdinal: 5,
    tier: 27,
    nameTr: "Mevsim kontrolü",
    nameEn: "Season control",
    refSec: 83200 * D,
    goalTr: "Odun üretimini 1,6 katına çıkarır.",
    goalEn: "Multiplies wood production by 1.6×.",
  },
  {
    id: "alloy_processing",
    eraOrdinal: 5,
    tier: 26,
    nameTr: "Alaşım işleme",
    nameEn: "Alloy processing",
    refSec: 39810 * D,
    goalTr: "Demir üretimini 1,6 katına çıkarır.",
    goalEn: "Multiplies iron production by 1.6×.",
  },
  {
    id: "serial_manufacturing",
    eraOrdinal: 5,
    tier: 10,
    nameTr: "Seri imalat",
    nameEn: "Serial manufacturing",
    refSec: 6 * D + 1 * H + 47 * M + 23,
    goalTr: "Üretim hızını artırır.",
    goalEn: "Increases production speed.",
  },
  {
    id: "food_pill",
    eraOrdinal: 5,
    tier: 20,
    nameTr: "Besin hapı",
    nameEn: "Food pill",
    refSec: 4368 * D + 12 * H + 26 * M + 40,
    goalTr: "Üretim kapasitesini artırır.",
    goalEn: "Increases production capacity.",
  },
  {
    id: "sadelik",
    eraOrdinal: 1,
    tier: 10,
    nameTr: "Sadelik",
    nameEn: "Simplicity",
    refSec: 0,
    goalTr: "Filo +1.",
    goalEn: "Fleet +1.",
  },
  {
    id: "orta_cag_unlock",
    eraOrdinal: 1,
    tier: 1,
    nameTr: "Orta çağ",
    nameEn: "Medieval age",
    /** 4 dk 58 sn (298 sn) — level1DurationSec(298,1)=298 */
    refSec: 298,
    goalTr: "Yeni çağ.",
    goalEn: "New age.",
  },
  {
    id: "sosyalizm",
    eraOrdinal: 1,
    tier: 21,
    nameTr: "Sosyalizm",
    nameEn: "Socialism",
    refSec: 3 * M + 20,
    goalTr: "+0,5 insan/saat.",
    goalEn: "+0.5 population/hour.",
  },
  {
    id: "internet",
    eraOrdinal: 4,
    tier: 15,
    nameTr: "İnternet",
    nameEn: "Internet",
    refSec: 5 * M,
    goalTr: "Diğer teknolojiler için gereklidir.",
    goalEn: "Required for other technologies.",
  },
  {
    id: "propaganda",
    eraOrdinal: 4,
    tier: 32,
    nameTr: "Propaganda",
    nameEn: "Propaganda",
    refSec: 1592 * D + 21 * H + 20 * M,
    goalTr: "Düşmanın saldırı gücünü azaltır.",
    goalEn: "Reduces enemy attack power.",
  },
];

function buildCatalog(): TechCatalogEntry[] {
  return RAW.map((r) => {
    const s = level1DurationSec(r.refSec, r.tier);
    return {
      id: r.id,
      eraOrdinal: r.eraOrdinal,
      tier: r.tier,
      nameTr: r.nameTr,
      nameEn: r.nameEn,
      durationSec: s,
      durationTr: fmtTr(s),
      durationEn: fmtEn(s),
      goalTr: r.goalTr,
      goalEn: r.goalEn,
      imageSrc: "/technology/placeholder.svg",
    };
  });
}

/** Çağ numarasına göre sıralı (1. çağ üstte), sonra tier */
export function sortTechCatalog(entries: TechCatalogEntry[]): TechCatalogEntry[] {
  return [...entries].sort((a, b) => {
    if (a.eraOrdinal !== b.eraOrdinal) return a.eraOrdinal - b.eraOrdinal;
    return a.tier - b.tier;
  });
}

/**
 * Hammadde maliyeti: çağ ve tier ile ölçeklenir (kitap / klasik strateji hissi).
 */
export function eraTechResearchCost(entry: Pick<TechCatalogEntry, "eraOrdinal" | "tier">): {
  wood: number;
  iron: number;
  oil: number;
  food: number;
} {
  const mult = 1 + entry.eraOrdinal * 0.14 + entry.tier * 0.012;
  const wood = Math.floor(220 * mult);
  const iron = Math.floor(180 * mult);
  const oil = Math.floor(95 * mult);
  const food = Math.floor(200 * mult);
  /** İlk çağ teknolojileri: yalnız odun + besin */
  if (entry.eraOrdinal === 1) {
    return { wood, iron: 0, oil: 0, food };
  }
  return { wood, iron, oil, food };
}

const _built = buildCatalog();
export const TECH_CATALOG: TechCatalogEntry[] = sortTechCatalog(_built);

const BY_KEY = new Map(_built.map((t) => [t.id, t]));

export function getTechByKey(key: string): TechCatalogEntry | undefined {
  return BY_KEY.get(key);
}

/** Oyuncu çağı bu teknoloji çağından gerideyse kilitli (ör. 5 → 5. çağ ve üstü) */
export function requiredEraIndexForTech(eraOrdinal: number): number {
  return Math.max(0, eraOrdinal - 1);
}

/**
 * Referans: üst seviye süreler (oyuncunun verdiği değerler).
 * Seviye 1 süresi: kısa süreler (<1 saat) için ref/tier; uzunlar için ref/tier²; üst sınır 48 saat.
 */
export type TechCatalogEntry = {
  eraOrdinal: number;
  tier: number;
  nameTr: string;
  nameEn: string;
  durationTr: string;
  durationEn: string;
  goalTr: string;
  goalEn: string;
  /** Satır küçük görseli; ileride teknoloji bazlı değiştirilebilir */
  imageSrc: string;
};

/** Referans süre (saniye) ve tier — seviye 1 süresi hesaplanır */
type RawTech = {
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

function level1DurationSec(refSec: number, tier: number): number {
  if (refSec <= 0) return 0;
  const t = Math.max(1, tier);
  const d = refSec < H ? refSec / t : refSec / (t * t);
  const rounded = Math.round(d);
  if (rounded === 0) return 1;
  return Math.min(48 * H, Math.max(1, rounded));
}

/** Her zaman dakika + saniye göster (0 süre: 0m 00s); “Anında” kullanılmaz */
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
    eraOrdinal: 5,
    tier: 11,
    nameTr: "Robotbilim",
    nameEn: "Robotics",
    refSec: 2 * H + 38 * M + 40,
    goalTr: "Diğer teknolojiler için gereklidir.",
    goalEn: "Required for other technologies.",
  },
  {
    eraOrdinal: 5,
    tier: 20,
    nameTr: "Hızlandırılmış çürüme",
    nameEn: "Accelerated decay",
    refSec: 325 * D + 22 * H + 13 * M + 20,
    goalTr: "Petrol üretimini 1,6 katına çıkarır.",
    goalEn: "Multiplies oil production by 1.6×.",
  },
  {
    eraOrdinal: 5,
    tier: 18,
    nameTr: "Yosun yetiştirme",
    nameEn: "Moss cultivation",
    refSec: 116 * D + 4 * H + 53 * M + 20,
    goalTr: "Besin üretimini 1,6 katına çıkarır.",
    goalEn: "Multiplies food production by 1.6×.",
  },
  {
    eraOrdinal: 5,
    tier: 27,
    nameTr: "Mevsim kontrolü",
    nameEn: "Season control",
    refSec: 83200 * D,
    goalTr: "Odun üretimini 1,6 katına çıkarır.",
    goalEn: "Multiplies wood production by 1.6×.",
  },
  {
    eraOrdinal: 5,
    tier: 26,
    nameTr: "Alaşım işleme",
    nameEn: "Alloy processing",
    refSec: 39810 * D,
    goalTr: "Demir üretimini 1,6 katına çıkarır.",
    goalEn: "Multiplies iron production by 1.6×.",
  },
  {
    eraOrdinal: 5,
    tier: 10,
    nameTr: "Seri imalat",
    nameEn: "Serial manufacturing",
    refSec: 6 * D + 1 * H + 47 * M + 23,
    goalTr: "Üretim hızını artırır.",
    goalEn: "Increases production speed.",
  },
  {
    eraOrdinal: 5,
    tier: 20,
    nameTr: "Besin hapı",
    nameEn: "Food pill",
    refSec: 4368 * D + 12 * H + 26 * M + 40,
    goalTr: "Üretim kapasitesini artırır.",
    goalEn: "Increases production capacity.",
  },
  {
    eraOrdinal: 1,
    tier: 10,
    nameTr: "Sadelik",
    nameEn: "Simplicity",
    refSec: 0,
    goalTr: "Filo +1.",
    goalEn: "Fleet +1.",
  },
  {
    eraOrdinal: 1,
    tier: 1,
    nameTr: "Orta çağ",
    nameEn: "Medieval age",
    refSec: 0,
    goalTr: "Yeni çağ.",
    goalEn: "New age.",
  },
  {
    eraOrdinal: 1,
    tier: 21,
    nameTr: "Sosyalizm",
    nameEn: "Socialism",
    refSec: 3 * M + 20,
    goalTr: "+0,5 insan/saat.",
    goalEn: "+0.5 population/hour.",
  },
  {
    eraOrdinal: 4,
    tier: 15,
    nameTr: "İnternet",
    nameEn: "Internet",
    refSec: 5 * M,
    goalTr: "Diğer teknolojiler için gereklidir.",
    goalEn: "Required for other technologies.",
  },
  {
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
      eraOrdinal: r.eraOrdinal,
      tier: r.tier,
      nameTr: r.nameTr,
      nameEn: r.nameEn,
      durationTr: fmtTr(s),
      durationEn: fmtEn(s),
      goalTr: r.goalTr,
      goalEn: r.goalEn,
      imageSrc: "/technology/placeholder.svg",
    };
  });
}

export const TECH_CATALOG: TechCatalogEntry[] = buildCatalog();

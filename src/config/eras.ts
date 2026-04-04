/**
 * Çağ sırası: 1 İlk → 2 Orta → 3 Rönesans → 4 Sanayi → 5 Modern → 6 Dijital → 7 Küresel Isınma
 * Görseller: public/eras/ altına aynı dosya adıyla koy (jpg/png/svg).
 */
export const ERA_ORDER = [
  "ilk_cag",
  "orta_cag",
  "yeniden_dogus",
  "sanayi",
  "modern",
  "dijital",
  "kuresel_isinma",
] as const;

export type EraId = (typeof ERA_ORDER)[number];

export type EraConfig = {
  id: EraId;
  name: string;
  nameEn: string;
  /** Sol menü / genel arka plan */
  backgroundFile: string;
  /** Genel durum şehir satırı küçük görseli; yoksa backgroundFile */
  overviewThumb?: string;
  banner: {
    titleColor: string;
    subtitleColor: string;
    borderColor: string;
    glow: string;
  };
};

/** Eski kayıtlar (kesif kaldırıldı → sanayi ile eşlenir) */
const LEGACY_ERA_MAP: Record<string, EraId> = {
  kesif: "sanayi",
};

export function normalizeEraId(id: string | null | undefined): EraId {
  const raw = (id ?? "ilk_cag").trim();
  if (raw in LEGACY_ERA_MAP) return LEGACY_ERA_MAP[raw]!;
  if (ERA_ORDER.includes(raw as EraId)) return raw as EraId;
  return "ilk_cag";
}

export const ERAS: Record<EraId, EraConfig> = {
  ilk_cag: {
    id: "ilk_cag",
    name: "İlk Çağ",
    nameEn: "Primitive Age",
    backgroundFile: "bg-ilk_cag.png",
    overviewThumb: "overview-ilk_cag.png",
    banner: {
      titleColor: "#f5e6c8",
      subtitleColor: "#c4b59a",
      borderColor: "#6b5344",
      glow: "rgba(180, 120, 60, 0.35)",
    },
  },
  orta_cag: {
    id: "orta_cag",
    name: "Orta Çağ",
    nameEn: "Medieval Age",
    backgroundFile: "bg-orta_cag.png",
    overviewThumb: "overview-orta_cag.png",
    banner: {
      titleColor: "#e8dcc8",
      subtitleColor: "#a8a090",
      borderColor: "#4a5568",
      glow: "rgba(120, 140, 180, 0.25)",
    },
  },
  yeniden_dogus: {
    id: "yeniden_dogus",
    name: "Rönesans Çağı",
    nameEn: "Renaissance Age",
    backgroundFile: "bg-yeniden_dogus.svg",
    banner: {
      titleColor: "#fff0dd",
      subtitleColor: "#d4b896",
      borderColor: "#8b6914",
      glow: "rgba(212, 175, 55, 0.3)",
    },
  },
  sanayi: {
    id: "sanayi",
    name: "Sanayi Çağı",
    nameEn: "Industrial Age",
    backgroundFile: "bg-sanayi.svg",
    banner: {
      titleColor: "#e2e8f0",
      subtitleColor: "#94a3b8",
      borderColor: "#475569",
      glow: "rgba(148, 163, 184, 0.2)",
    },
  },
  modern: {
    id: "modern",
    name: "Modern Çağ",
    nameEn: "Modern Age",
    backgroundFile: "bg-modern.svg",
    banner: {
      titleColor: "#f8fafc",
      subtitleColor: "#94a3b8",
      borderColor: "#1e293b",
      glow: "rgba(56, 189, 248, 0.2)",
    },
  },
  dijital: {
    id: "dijital",
    name: "Dijital Çağ",
    nameEn: "Digital Age",
    backgroundFile: "bg-dijital.svg",
    banner: {
      titleColor: "#e0f2fe",
      subtitleColor: "#7dd3fc",
      borderColor: "#0369a1",
      glow: "rgba(14, 165, 233, 0.25)",
    },
  },
  kuresel_isinma: {
    id: "kuresel_isinma",
    name: "Küresel Isınma Çağı",
    nameEn: "Global Warming Age",
    backgroundFile: "bg-kuresel_isinma.png",
    overviewThumb: "overview-kuresel_isinma.png",
    banner: {
      titleColor: "#fecaca",
      subtitleColor: "#b91c1c",
      borderColor: "#7f1d1d",
      glow: "rgba(220, 38, 38, 0.3)",
    },
  },
};

export function getEraConfig(id: string | null | undefined): EraConfig {
  const key = normalizeEraId(id);
  return ERAS[key] ?? ERAS.ilk_cag;
}

export function eraBackgroundUrl(id: string | null | undefined): string {
  const cfg = getEraConfig(id);
  return `/eras/${cfg.backgroundFile}`;
}

/** Genel durum — şehir satırındaki çağ görseli */
export function eraOverviewThumbUrl(id: string | null | undefined): string {
  const cfg = getEraConfig(id);
  const f = cfg.overviewThumb ?? cfg.backgroundFile;
  return `/eras/${f}`;
}

export function getEraDisplayName(
  cfg: EraConfig,
  locale: "tr" | "en",
): string {
  return locale === "en" ? cfg.nameEn : cfg.name;
}

export function eraIndex(eraId: string | null | undefined): number {
  const i = ERA_ORDER.indexOf(normalizeEraId(eraId));
  return i >= 0 ? i : 0;
}

export function eraOrdinalNumber(eraId: string | null | undefined): number {
  const i = ERA_ORDER.indexOf(normalizeEraId(eraId));
  return i >= 0 ? i + 1 : 1;
}

export type ResourceUnlocks = {
  wood: boolean;
  food: boolean;
  iron: boolean;
  oil: boolean;
};

/**
 * Demir / petrol hangi çağdan itibaren açılacağını tek yerden ayarlayın
 * (kitap dengesi — ileride güncellenebilir).
 */
export function getResourceUnlocks(
  eraId: string | null | undefined,
): ResourceUnlocks {
  const idx = eraIndex(eraId);
  return {
    wood: true,
    food: true,
    iron: idx >= 1,
    oil: idx >= 3,
  };
}

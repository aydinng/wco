/**
 * Klasik kalıcı tarayıcı strateji (Travian / OGame soyundan “köy alanı” inşaatları) ve
 * WarCityOnline tarzı kademeli süre: T ≈ B × K^(L−1) ÷ (1 + R/100)
 * B: taban süre (hedef seviye 1), K: seviye çarpanı (~1.2–1.5), L: yükseltmeden sonraki seviye,
 * R: hız % toplamı. Her L için süre monoton artar; bitişik seviyeler aynı saniyede yuvarlanmasın
 * diye küçük bir seviye adımı eklenir.
 * Hızlandırma satın alma yok; R yalnızca mevcut bonuslardan (ör. imparatorluk araştırması).
 */

/** Seviye başına süre çarpanı (üstel büyüme — üst seviye inşaat belirgin uzar) */
export const DURATION_LEVEL_COEFF = 1.4;

/** Araştırma: üst süre tavanı (kitap: 24h–168h; tek iş için üst sınır 168 saat) */
export const MAX_RESEARCH_DURATION_SEC = 168 * 3600;

/** Bina yükseltme: üst sınır (yüksek L’lerde süreler üst üste aynı görünmesin diye araştırmadan biraz yüksek) */
export const MAX_BUILDING_DURATION_SEC = 72 * 3600;

/** İmparatorluk araştırma seviyesi başına “üretim/araştırma hızı” bonusu yüzde olarak R’ye katkı */
export function researchSpeedBonusPct(completedResearchTier: number): number {
  return Math.max(0, completedResearchTier) * 4;
}

export function scaledDurationSec(opts: {
  baseSec: number;
  /** Hedef seviye (≥1). Bina: toLevel; araştırma: hedef tier. */
  targetLevel: number;
  coeff?: number;
  /** Toplam hız % bonusu (ör. araştırma + ileride kahraman) */
  speedBonusPct: number;
  maxSec: number;
}): number {
  const coeff = opts.coeff ?? DURATION_LEVEL_COEFF;
  const L = Math.max(1, Math.floor(opts.targetLevel));
  const raw = opts.baseSec * Math.pow(coeff, L - 1);
  const denom = 1 + Math.max(0, opts.speedBonusPct) / 100;
  const t = raw / denom;
  /** Komşu hedef seviyeler aynı saniyeye yuvarlanmasın; taban süreye orantılı küçük adım */
  const stepPerLevel = Math.max(10, Math.round(opts.baseSec * 0.028));
  const levelStepBonusSec = Math.max(0, L - 1) * stepPerLevel;
  return Math.min(
    opts.maxSec,
    Math.max(1, Math.ceil(t) + levelStepBonusSec),
  );
}

/**
 * Bina türüne göre taban süre (saniye, 1. seviye hedefi).
 * Oran: köy merkezi > asker > petrol > demir > taş/odun > avcı/tarla (besin).
 * Üst seviye K ve araştırma bonusu ile ölçeklenir.
 */
export const BUILDING_DURATION_BASE_SEC: Record<string, number> = {
  townHall: 280,
  lumberMill: 160,
  ironMine: 200,
  oilWell: 220,
  farm: 140,
  barracks: 240,
  researchLodge: 109,
  shepherdLodge: 70,
  civilLodge: 90,
  bank: 221,
  policeDept: 153,
};

export function buildingUpgradeDurationSec(opts: {
  buildingId: string;
  toLevel: number;
  /** Tamamlanmış araştırma seviyesi (üretim çarpanı kaynağı) */
  researchTier: number;
}): number {
  const base =
    BUILDING_DURATION_BASE_SEC[opts.buildingId] ??
    BUILDING_DURATION_BASE_SEC.townHall;
  return scaledDurationSec({
    baseSec: base,
    targetLevel: opts.toLevel,
    speedBonusPct: researchSpeedBonusPct(opts.researchTier),
    maxSec: MAX_BUILDING_DURATION_SEC,
  });
}

/** Sonraki araştırma tier’ına giden süre (sn) */
export function researchTierAdvanceDurationSec(opts: {
  targetTier: number;
  completedResearchTier: number;
  /** Araştırma kulübesi: şehirlerdeki seviye toplamına göre ek hız % */
  researchLodgeBonusPct?: number;
}): number {
  const base = 220; // taban (tier 1); K ile üst tier’larda uzar
  const lodge = Math.max(0, opts.researchLodgeBonusPct ?? 0);
  return scaledDurationSec({
    baseSec: base,
    targetLevel: opts.targetTier,
    speedBonusPct: researchSpeedBonusPct(opts.completedResearchTier) + lodge,
    maxSec: MAX_RESEARCH_DURATION_SEC,
  });
}

/** Asker eğitimi: taban süre × adet, imparatorluk araştırması ile kısalır */
export function unitTrainingTotalDurationSec(opts: {
  unitTrainSeconds: number;
  quantity: number;
  researchTier: number;
}): number {
  const raw =
    Math.max(1, opts.unitTrainSeconds) * Math.max(1, Math.floor(opts.quantity));
  const bonus = researchSpeedBonusPct(opts.researchTier);
  const denom = 1 + Math.max(0, bonus) / 100;
  return Math.max(1, Math.ceil(raw / denom));
}

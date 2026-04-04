/**
 * WarCityOnline tarzı kademeli süre: T ≈ B × K^(L−1) ÷ (1 + R/100)
 * B: taban süre (1. seviye), K: seviye katsayısı (~1.2–1.5), L: hedef seviye, R: hızlandırıcı % toplamı.
 * Hızlandırma satın alma yok; R yalnızca mevcut bonuslardan (ör. imparatorluk araştırması).
 */

/** Seviye başına süre çarpanı (1.2–1.5 bandı) */
export const DURATION_LEVEL_COEFF = 1.22;

/** Araştırma: üst süre tavanı (kitap: 24h–168h; tek iş için üst sınır 168 saat) */
export const MAX_RESEARCH_DURATION_SEC = 168 * 3600;

/** Bina yükseltme: aşırı uzun işleri sınırla (oyun akışı) */
export const MAX_BUILDING_DURATION_SEC = 48 * 3600;

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
  return Math.min(opts.maxSec, Math.max(1, Math.ceil(t)));
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
}): number {
  const base = 120; // ~2 dk taban (tier 1); K ile üst tier’larda uzar
  return scaledDurationSec({
    baseSec: base,
    targetLevel: opts.targetTier,
    speedBonusPct: researchSpeedBonusPct(opts.completedResearchTier),
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

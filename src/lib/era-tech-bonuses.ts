/**
 * Çağ teknolojisi seviyelerine göre saatlik üretim çarpanları ve nüfus bonusu.
 * Katalogdaki amaç metinleriyle uyumlu tutulur.
 */
export type EraTechLevels = Record<string, number>;

function lv(key: string, levels: EraTechLevels): number {
  return Math.max(0, Math.floor(levels[key] ?? 0));
}

/** İmparatorluk geneli: saatte ek nüfus (sosyalizm). */
export function hourlyPopulationBonusFromEraTech(levels: EraTechLevels): number {
  return 0.5 * lv("sosyalizm", levels);
}

/**
 * Kaynak üretimine çarpan (1.0 = etkisiz). Tekrarlanabilir teknolojilerde seviye ile büyür.
 */
export function eraTechResourceMultipliers(
  levels: EraTechLevels,
): { wood: number; iron: number; oil: number; food: number } {
  let wood = 1;
  let iron = 1;
  let oil = 1;
  let food = 1;

  /** Sadelik: filo saldırı gücü (suggestedFleetAttack +seviye); odun çarpanı yok */
  const moss = lv("moss_cultivation", levels);
  food *= 1 + 0.08 * Math.min(moss, 40);

  const season = lv("season_control", levels);
  wood *= 1 + 0.08 * Math.min(season, 40);

  const alloy = lv("alloy_processing", levels);
  iron *= 1 + 0.08 * Math.min(alloy, 40);

  const accel = lv("accelerated_decay", levels);
  oil *= 1 + 0.08 * Math.min(accel, 40);

  const serial = lv("serial_manufacturing", levels);
  wood *= 1 + 0.02 * Math.min(serial, 30);
  iron *= 1 + 0.02 * Math.min(serial, 30);
  food *= 1 + 0.02 * Math.min(serial, 30);

  const pill = lv("food_pill", levels);
  food *= 1 + 0.05 * Math.min(pill, 25);

  if (lv("kilise_mimari", levels) >= 1) food *= 1.02;
  if (lv("su_kemeri", levels) >= 1) food *= 1.04;
  if (lv("zirh_dovme", levels) >= 1) iron *= 1.03;
  if (lv("sovalye_efe", levels) >= 1) food *= 1.02;
  if (lv("lonca_duzeni", levels) >= 1) {
    wood *= 1.03;
    iron *= 1.02;
  }
  if (lv("ilk_universite", levels) >= 1) wood *= 1.02;

  if (lv("matbaa", levels) >= 1) {
    wood *= 1.03;
    food *= 1.02;
  }
  if (lv("humanizm", levels) >= 1) food *= 1.05;
  if (lv("ciftci_kira", levels) >= 1) food *= 1.06;
  if (lv("ticaret_ligi", levels) >= 1) {
    wood *= 1.04;
    oil *= 1.04;
  }
  if (lv("perspektif", levels) >= 1) iron *= 1.03;
  if (lv("saray_bahcesi", levels) >= 1) food *= 1.03;

  return { wood, iron, oil, food };
}

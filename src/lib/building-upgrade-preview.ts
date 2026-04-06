/**
 * DB seviyesi iş bitene kadar güncellenmez; kuyrukta iş varken bir sonraki
 * yükseltmenin hedef seviyesi (süre/maliyet önizlemesi) job.toLevel + 1 olur.
 */
export function nextUpgradeTargetLevel(opts: {
  currentLevel: number;
  /** Bu şehir+bina için bekleyen işin hedef seviyesi (yoksa null) */
  queuedTargetLevel: number | null;
  cap: number;
}): number | null {
  const q = opts.queuedTargetLevel;
  const base =
    q != null && q > 0 ? q : Math.max(0, opts.currentLevel);
  const t = base + 1;
  if (t > opts.cap) return null;
  return t;
}

/** Aynı şehir+bina için birden fazla kayıt olursa en yüksek hedef seviyeyi al */
export function mergeQueuedBuildingJobs(
  jobs: { cityId: string; buildingId: string; toLevel: number }[],
): { cityId: string; buildingId: string; toLevel: number }[] {
  const map = new Map<
    string,
    { cityId: string; buildingId: string; toLevel: number }
  >();
  for (const j of jobs) {
    const key = `${j.cityId}\0${j.buildingId}`;
    const prev = map.get(key);
    if (!prev || j.toLevel > prev.toLevel) map.set(key, j);
  }
  return [...map.values()];
}

/**
 * Filo seyahat süreleri — API ile aynı formül (Manhattan × 3 sn, min 5 sn).
 * Gidiş-dönüş toplam süre = tek yön × 2.
 */
export function manhattan3D(
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number,
): number {
  return Math.abs(ax - bx) + Math.abs(ay - by) + Math.abs(az - bz);
}

/** Tek yön süre (saniye) — fleet/send route ile uyumlu */
export function fleetTravelSecondsOneWay(distance: number): number {
  return Math.max(5, Math.round(distance * 3));
}

export function fleetTravelMsOneWay(distance: number): number {
  return fleetTravelSecondsOneWay(distance) * 1000;
}

export function formatTravelHms(totalSeconds: number, locale: string): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (locale === "en") {
    return h > 0
      ? `${h}h ${m}m ${r}s`
      : `${m}m ${String(r).padStart(2, "0")}s`;
  }
  return h > 0
    ? `${h} sa ${m} dk ${r} sn`
    : `${m} dk ${String(r).padStart(2, "0")} sn`;
}

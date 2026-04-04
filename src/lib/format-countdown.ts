/** Tek tip geri sayım metni — locale’e göre */
export function formatCountdownSeconds(sec: number, locale: string): string {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (locale === "en") {
    if (h > 0) {
      return `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
    }
    return `${m}:${String(r).padStart(2, "0")}`;
  }
  if (h > 0) {
    return `${h} sa ${String(m).padStart(2, "0")} dk ${String(r).padStart(2, "0")} sn`;
  }
  return `${m} dk ${String(r).padStart(2, "0")} sn`;
}

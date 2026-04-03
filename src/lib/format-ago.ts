import type { AppLocale } from "@/lib/locale";

/** Referans: `23m 18s` (EN), `23 dk 18 sn` (TR). */
export function formatAgoSince(from: Date, locale: AppLocale): string {
  const sec = Math.max(0, Math.floor((Date.now() - from.getTime()) / 1000));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  if (locale === "en") {
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  }
  if (h > 0) return `${h} sa ${m} dk ${s} sn`;
  if (m > 0) return `${m} dk ${s} sn`;
  return `${s} sn`;
}

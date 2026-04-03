import type { AppLocale } from "@/lib/locale";

/**
 * Geçen süre: 24 saatten az saat/dk/sn; 24 saat ve üzeri gün + kalan saat/dk/sn.
 * EN: "1 day 2 hours", TR: "1 gün 2 saat"
 */
export function formatAgoSince(from: Date, locale: AppLocale): string {
  const sec = Math.max(0, Math.floor((Date.now() - from.getTime()) / 1000));
  const days = Math.floor(sec / 86400);
  const rem = sec % 86400;
  const h = Math.floor(rem / 3600);
  const m = Math.floor((rem % 3600) / 60);
  const s = rem % 60;

  if (days >= 1) {
    if (locale === "en") {
      const parts: string[] = [];
      parts.push(days === 1 ? "1 day" : `${days} days`);
      if (h > 0) parts.push(h === 1 ? "1 hour" : `${h} hours`);
      if (m > 0) parts.push(m === 1 ? "1 min" : `${m} min`);
      if (s > 0) parts.push(s === 1 ? "1 sec" : `${s} sec`);
      return parts.join(" ");
    }
    const parts: string[] = [`${days} gün`];
    if (h > 0) parts.push(`${h} saat`);
    if (m > 0) parts.push(`${m} dk`);
    if (s > 0) parts.push(`${s} sn`);
    return parts.join(" ");
  }

  const totalH = Math.floor(sec / 3600);
  const mm = Math.floor((sec % 3600) / 60);
  const ss = sec % 60;

  if (locale === "en") {
    if (totalH > 0) return `${totalH}h ${mm}m ${ss}s`;
    if (mm > 0) return `${mm}m ${ss}s`;
    return `${ss}s`;
  }
  if (totalH > 0) return `${totalH} sa ${mm} dk ${ss} sn`;
  if (mm > 0) return `${mm} dk ${ss} sn`;
  return `${ss} sn`;
}

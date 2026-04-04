/** Asker / teknoloji / bina katalog satırlarında aynı sütun genişlikleri */

/** Üst düzey grid: isim | süre/amış | (birimlerde istatistik) | eylem */
export const CATALOG_ROW_GRID_UNITS =
  "grid w-full grid-cols-1 items-start gap-3 px-2 py-3 sm:grid-cols-[12.5rem_18rem_10.5rem_auto] sm:items-center sm:gap-x-3 sm:px-3";

/** Teknoloji: istatistik sütunu yok */
export const CATALOG_ROW_GRID_TECH =
  "grid w-full grid-cols-1 items-start gap-3 px-2 py-3 sm:grid-cols-[12.5rem_18rem_auto] sm:items-center sm:gap-x-3 sm:px-3";

/** Bina üst satırı: isim | alan | sağ eylem */
export const CATALOG_ROW_GRID_BUILDING =
  "grid w-full grid-cols-1 items-start gap-3 px-2 py-3 sm:grid-cols-[12.5rem_18rem_auto] sm:items-center sm:gap-x-3 sm:px-3";

/** Görsel + sarı isim — sabit genişlik */
export const CATALOG_NAME_COL =
  "flex w-full shrink-0 items-center gap-3 sm:w-[12.5rem]";

/** Sarı başlık metni — iki satıra kadar, aynı kutu */
export const CATALOG_TITLE_YELLOW =
  "line-clamp-2 min-h-[2.75rem] w-full max-w-[9.5rem] text-center text-sm font-semibold leading-tight text-yellow-300 drop-shadow sm:text-base";

/** Süre / çağ / amış orta sütun — sabit genişlik */
export const CATALOG_MIDDLE_COL =
  "flex min-h-[5.5rem] w-full flex-col justify-center gap-1 text-sm leading-snug sm:w-[18rem] sm:min-w-[18rem] sm:max-w-[18rem] sm:text-[15px]";

/** Birim saldırı istatistikleri */
export const CATALOG_STATS_COL =
  "w-full min-w-0 sm:w-[10.5rem] sm:shrink-0";

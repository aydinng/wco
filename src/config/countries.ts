/** Kayıt formu: ülke listesi (Türkçe görünen ad) */
export const REGISTRATION_COUNTRIES = [
  { id: "tr", name: "Türkiye" },
  { id: "us", name: "Amerika Birleşik Devletleri" },
  { id: "de", name: "Almanya" },
  { id: "gb", name: "Birleşik Krallık" },
  { id: "fr", name: "Fransa" },
  { id: "it", name: "İtalya" },
  { id: "es", name: "İspanya" },
  { id: "nl", name: "Hollanda" },
  { id: "pl", name: "Polonya" },
  { id: "ru", name: "Rusya" },
  { id: "ua", name: "Ukrayna" },
  { id: "az", name: "Azerbaycan" },
  { id: "other", name: "Diğer" },
] as const;

export type RegistrationCountryId =
  (typeof REGISTRATION_COUNTRIES)[number]["id"];

/** Sol menü / API: ülke adı (İngilizce) */
export const COUNTRY_ENGLISH_NAME: Record<RegistrationCountryId, string> = {
  tr: "Turkey",
  us: "United States",
  de: "Germany",
  gb: "United Kingdom",
  fr: "France",
  it: "Italy",
  es: "Spain",
  nl: "Netherlands",
  pl: "Poland",
  ru: "Russia",
  ua: "Ukraine",
  az: "Azerbaijan",
  other: "Other",
};

export function countryLabelById(id: string | null | undefined): string {
  if (!id) return "—";
  const c = REGISTRATION_COUNTRIES.find((x) => x.id === id);
  return c?.name ?? id;
}

export function countryEnglishNameById(id: string | null | undefined): string {
  const t = id?.trim();
  if (!t) return COUNTRY_ENGLISH_NAME.other;
  const k = t as RegistrationCountryId;
  return COUNTRY_ENGLISH_NAME[k] ?? COUNTRY_ENGLISH_NAME.other;
}

/** Tarayıcıda güvenilir görünsün diye flagcdn PNG (Windows’ta Unicode bayrak harf gibi görünebiliyor) */
export function countryFlagImgSrc(id: string | null | undefined): string | null {
  const raw = id?.trim().toLowerCase();
  if (!raw || raw === "other") return null;
  if (raw.length !== 2) return null;
  return `https://flagcdn.com/w20/${raw}.png`;
}

/** Küçük bayrak (Unicode bölgesel göstergeler); bilinmeyen / diğer → 🌍 */
export function countryFlagEmoji(id: string | null | undefined): string {
  if (!id || id === "other") return "🌍";
  const up = id.toUpperCase();
  if (up.length !== 2) return "🌍";
  const A = 0x1f1e6;
  const a = up.codePointAt(0);
  const b = up.codePointAt(1);
  if (
    a === undefined ||
    b === undefined ||
    a < 65 ||
    a > 90 ||
    b < 65 ||
    b > 90
  ) {
    return "🌍";
  }
  return String.fromCodePoint(A + a - 65, A + b - 65);
}

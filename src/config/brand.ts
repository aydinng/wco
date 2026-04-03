import type { AppLocale } from "@/lib/locale";

/** Orijinal oyunlardan bağımsız marka — İngilizce isim (Battle Ages / war tarzı) */
export const BRAND = {
  name: "War of City",
  /** Geniş üst banner */
  bannerSrc: "/banner/war-of-city-banner-wide-v2.png",
  /** Giriş sayfası tam ekran arka planı */
  loginPageBackgroundSrc: "/landing/login-page-bg.png",
  /** Giriş sayfası alt savaş görseli */
  loginHeroSrc: "/landing/warforge-hero.svg",
  /** Oyun ana kabuğu (genel bakış, menü) tam ekran arka planı */
  gameShellBackgroundSrc: "/bg/dystopian-main.png",
} as const;

export function getBrandTagline(locale: AppLocale): string {
  return locale === "en"
    ? "Forged in war. Built in your browser."
    : "Savaşta dövülür. Tarayıcıda kurulur.";
}

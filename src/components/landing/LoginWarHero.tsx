import { BRAND } from "@/config/brand";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/lib/locale";
import Image from "next/image";

/** Giriş sayfası ana içeriğinin altında: yüksek çözünürlüklü kuşatma görseli */
export async function LoginWarHero() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const t = dict.public;

  return (
    <section
      className="relative mt-10 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)] ring-1 ring-amber-900/25"
      aria-label={t.loginHeroAlt}
    >
      <div className="relative w-full min-h-[min(52vw,420px)] sm:min-h-[min(42vw,480px)]">
        <Image
          src={BRAND.loginHeroSrc}
          alt={t.loginHeroAlt}
          fill
          className="object-cover object-[center_35%]"
          sizes="(max-width: 1280px) 100vw, 1280px"
          priority={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0e14] via-[#0a0e14]/35 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a0e14]/50 via-transparent to-[#0a0e14]/50" />
        <div className="absolute bottom-0 left-0 right-0 px-4 py-5 sm:px-8 sm:py-7">
          <p className="max-w-3xl text-center text-sm font-medium leading-relaxed text-amber-100/95 drop-shadow-md sm:text-left sm:text-base">
            {t.loginHeroCaption}
          </p>
        </div>
      </div>
    </section>
  );
}

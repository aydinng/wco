import { LandingFooter } from "@/components/landing/LandingFooter";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { BRAND } from "@/config/brand";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/lib/locale";
import Image from "next/image";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
  activeNav?: "login" | "register" | "kurallar";
  /** Varsayılan true; giriş sayfasında klasik görünüm için false */
  showFooter?: boolean;
};

const WARCITY_FONT = { fontFamily: "var(--font-warcity), serif" } as const;

function linkYellow(active: boolean) {
  return [
    "block rounded px-1.5 py-0.5 text-center text-sm transition-colors",
    active
      ? "bg-amber-900/50 text-yellow-200"
      : "text-yellow-300 hover:bg-white/10 hover:text-yellow-100",
  ].join(" ");
}

export async function PublicPageLayout({
  children,
  activeNav,
  showFooter = true,
}: Props) {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const t = dict.public;

  return (
    <div className="flex min-h-screen flex-col bg-black text-zinc-100">
      <header className="relative w-full shrink-0">
        <div className="mx-auto max-w-7xl px-3 pt-4 sm:px-4">
          <div className="relative overflow-hidden rounded-2xl border border-yellow-900/40 bg-gradient-to-br from-zinc-950 via-black to-black shadow-[0_32px_64px_-20px_rgba(0,0,0,0.9)] ring-1 ring-yellow-900/20">
            <div className="relative px-2 pb-2 pt-2 sm:px-4 sm:pb-3 sm:pt-3">
              <div className="overflow-hidden rounded-xl border border-yellow-900/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <Image
                  src={BRAND.bannerSrc}
                  alt={t.bannerAlt}
                  width={1920}
                  height={480}
                  priority
                  className="h-auto w-full max-h-[220px] object-cover object-center brightness-[1.02] contrast-[1.08] sm:max-h-[260px]"
                  sizes="100vw"
                />
              </div>
            </div>
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 rounded-b-2xl bg-gradient-to-t from-black/95 to-transparent" />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-3 py-4 sm:px-4 lg:flex-row lg:items-stretch lg:gap-6">
        <aside
          className="flex w-full shrink-0 flex-col border-zinc-800 lg:w-56 lg:min-h-[calc(100dvh-13rem)] lg:border-r lg:pr-3"
          style={WARCITY_FONT}
        >
          <nav className="mb-4 space-y-1.5">
            <Link href="/login" className={linkYellow(activeNav === "login")}>
              {t.login}
            </Link>
            <Link
              href="/register"
              className={linkYellow(activeNav === "register")}
            >
              {t.register}
            </Link>
            <Link
              href="/kurallar"
              className={linkYellow(activeNav === "kurallar")}
            >
              {t.rules}
            </Link>
            <Link href="/forum" className={linkYellow(false)}>
              Forum
            </Link>
            <Link href="/login" className={linkYellow(activeNav === "login")}>
              {t.navHome}
            </Link>
          </nav>

          <div className="mt-auto flex w-full flex-col items-center border-t border-zinc-800/80 pt-3">
            <LanguageSwitcher
              locale={locale}
              label={dict.lang.label}
              trLabel={dict.lang.tr}
              enLabel={dict.lang.en}
              variant="compact"
            />
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {showFooter ? (
        <LandingFooter line1={dict.footer.line1} rights={dict.footer.rights} />
      ) : null}
    </div>
  );
}

import { LandingFooter } from "@/components/landing/LandingFooter";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { BRAND } from "@/config/brand";
import { getDictionary } from "@/i18n/dictionaries";
import type { AppLocale } from "@/lib/locale";
import { getLocale } from "@/lib/locale";
import Image from "next/image";
import Link from "next/link";

export type RecentUserRow = {
  username: string;
  registrationCountry: string;
  createdAt: Date;
};

type Props = {
  recent: RecentUserRow[];
  children: React.ReactNode;
  activeNav?: "login" | "register" | "kurallar";
};

function navClass(active: boolean) {
  return [
    "block rounded px-2 py-1.5 transition-colors",
    active
      ? "bg-amber-900/35 text-amber-100"
      : "text-zinc-300 hover:bg-white/5 hover:text-white",
  ].join(" ");
}

export async function PublicPageLayout({ recent, children, activeNav }: Props) {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const t = dict.public;
  const dateLocale: AppLocale = locale;

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0e14] text-zinc-100">
      <header className="relative w-full shrink-0">
        <div className="mx-auto max-w-7xl px-3 pt-4 sm:px-4">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/55 via-slate-950/85 to-[#030508] shadow-[0_32px_64px_-20px_rgba(0,0,0,0.88)] ring-1 ring-cyan-400/15 ring-offset-0 ring-offset-[#0a0e14]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,211,238,0.08),transparent_50%)]" />
            <div className="relative px-2 pb-2 pt-2 sm:px-4 sm:pb-3 sm:pt-3">
              <div className="overflow-hidden rounded-xl border border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-white/5">
                <Image
                  src={BRAND.bannerSrc}
                  alt={t.bannerAlt}
                  width={1920}
                  height={480}
                  priority
                  className="h-auto w-full max-h-[220px] object-cover object-center brightness-[1.02] contrast-[1.08] saturate-[1.12] sm:max-h-[260px]"
                  sizes="100vw"
                />
              </div>
            </div>
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 rounded-b-2xl bg-gradient-to-t from-[#0a0e14]/90 to-transparent" />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-3 py-4 sm:px-4 lg:flex-row lg:items-stretch lg:gap-6">
        <aside className="flex min-h-[calc(100dvh-15rem)] w-full shrink-0 flex-col gap-0 lg:w-80">
          <div className="flex min-h-0 flex-1 flex-col gap-4">
          <nav className="rounded border border-[#2a3441]/90 bg-black/40 p-3 backdrop-blur-sm">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {t.account}
            </div>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  href="/login"
                  className={navClass(activeNav === "login")}
                >
                  {t.login}
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className={navClass(activeNav === "register")}
                >
                  {t.register}
                </Link>
              </li>
            </ul>
          </nav>

          <nav className="rounded border border-[#2a3441]/90 bg-black/40 p-3 backdrop-blur-sm">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {t.guide}
            </div>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  href="/login#nasil-oynanir"
                  className="block rounded px-2 py-1.5 text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {t.howToPlay}
                </Link>
              </li>
              <li>
                <Link
                  href="/login#ozellikler"
                  className="block rounded px-2 py-1.5 text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {t.features}
                </Link>
              </li>
              <li>
                <Link
                  href="/kurallar"
                  className={navClass(activeNav === "kurallar")}
                >
                  {t.rules}
                </Link>
              </li>
            </ul>
          </nav>

          <nav className="rounded border border-[#2a3441]/90 bg-black/40 p-3 backdrop-blur-sm">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {t.community}
            </div>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  href="/forum"
                  className="block rounded px-2 py-1.5 text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  Forum
                </Link>
              </li>
              <li>
                <span
                  className="block cursor-not-allowed rounded px-2 py-1.5 text-zinc-600"
                  title={locale === "en" ? "Soon" : "Yakında"}
                >
                  {t.faqSoon}
                </span>
              </li>
            </ul>
          </nav>

          <div className="rounded border border-[#2a3441]/90 bg-black/40 p-3 backdrop-blur-sm">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {t.recentTitle}
            </div>
            <p className="mb-2 text-[11px] leading-snug text-zinc-500">
              {t.recentHint}
            </p>
            <ul className="max-h-[280px] space-y-2 overflow-y-auto text-xs">
              {recent.length === 0 ? (
                <li className="text-zinc-500">{t.noRegistrations}</li>
              ) : (
                recent.map((u, i) => (
                  <li
                    key={`${u.username}-${u.createdAt.toISOString()}`}
                    className="rounded border border-[#2a3441]/60 bg-black/30 px-2 py-1.5"
                  >
                    <div className="font-medium text-amber-100/90">
                      {i + 1}. {u.username}
                    </div>
                    <div className="text-zinc-400">
                      {t.countryLabel}:{" "}
                      <span className="text-zinc-200">
                        {u.registrationCountry || "—"}
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-600">
                      {u.createdAt.toLocaleString(
                        dateLocale === "en" ? "en-US" : "tr-TR",
                      )}
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
          </div>

          <div className="mt-auto border-t border-[#2a3441]/50 pt-3">
            <LanguageSwitcher
              locale={locale}
              label={dict.lang.label}
              trLabel={dict.lang.tr}
              enLabel={dict.lang.en}
            />
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <LandingFooter line1={dict.footer.line1} rights={dict.footer.rights} />
    </div>
  );
}

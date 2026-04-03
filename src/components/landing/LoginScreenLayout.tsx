import { LoginTopBar } from "@/app/login/LoginTopBar";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LoginSidebarClock } from "@/components/landing/LoginSidebarClock";
import { BRAND } from "@/config/brand";
import type { Dictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/lib/locale";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

const WARCITY: React.CSSProperties = { fontFamily: "var(--font-warcity), serif" };

function navLink(active: boolean) {
  return [
    "block rounded px-1 py-0.5 text-center text-sm font-bold transition-colors",
    active
      ? "text-[#FFFF00]"
      : "text-[#FFFF00]/90 hover:bg-red-900/70 hover:text-yellow-50",
  ].join(" ");
}

export async function LoginScreenLayout({
  dict,
  children,
  serverNow,
}: {
  dict: Dictionary;
  children: React.ReactNode;
  serverNow: Date;
}) {
  const locale = await getLocale();
  const t = dict.public;
  const lang = dict.lang;
  const year = String(new Date().getFullYear());
  const footerText = t.loginFooterNotice.replace("{year}", year);

  const labels = {
    user: t.loginBarUser,
    pass: t.loginBarPass,
    submit: t.loginBarSubmit,
    badCredentials: dict.auth.badCredentials,
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden text-zinc-100">
      <div
        className="pointer-events-none fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BRAND.loginPageBackgroundSrc})` }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-black/35 via-black/45 to-black/55"
        aria-hidden
      />

      <div className="relative z-0">
        <header className="w-full px-2 pt-4 sm:px-4 lg:px-10">
          <h1
            className="mt-1 text-center text-lg font-bold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] sm:text-xl"
            style={WARCITY}
          >
            {t.loginWelcomeTitle}
          </h1>

          <Suspense fallback={<div className="h-12" aria-hidden />}>
            <LoginTopBar labels={labels} />
          </Suspense>
        </header>

        <div className="mx-auto flex w-full max-w-[min(100rem,100%)] flex-col gap-6 px-2 pb-6 pt-2 sm:px-4 lg:flex-row lg:items-start lg:gap-10 lg:px-10">
          <aside
            className="flex w-full shrink-0 flex-col items-center rounded-lg border border-yellow-900/45 bg-black/88 px-3 py-4 backdrop-blur-md lg:w-52 lg:min-w-[12rem]"
            style={WARCITY}
          >
            <nav className="w-full max-w-[13rem] space-y-1 text-center">
              <Link href="/login" className={navLink(true)}>
                {t.loginNavLogin}
              </Link>
              <Link href="/register" className={navLink(false)}>
                {t.loginNavRegister}
              </Link>
              <Link href="/kurallar" className={navLink(false)}>
                {t.loginNavAbout}
              </Link>
              <Link href="/help" className={navLink(false)}>
                {t.loginNavTutorial}
              </Link>
              <Link href="/forum" className={navLink(false)}>
                {t.loginNavForum}
              </Link>
              <Link href="/missions" className={navLink(false)}>
                {t.loginNavManual}
              </Link>
              <Link href="/login" className={navLink(false)}>
                {t.navHome}
              </Link>
            </nav>

            <div className="mt-4 flex w-full max-w-[11rem] justify-center">
              <LanguageSwitcher
                locale={locale}
                label={lang.label}
                trLabel={lang.tr}
                enLabel={lang.en}
                variant="login"
              />
            </div>

            <div className="mt-1 flex w-full justify-center">
              <LoginSidebarClock
                initial={serverNow}
                locale={locale}
                label={t.loginServerClockLabel}
              />
            </div>
          </aside>

          <div className="min-w-0 flex-1">{children}</div>
        </div>

        <footer
          className="border-t border-white/10 px-4 py-6 text-center text-xs leading-relaxed text-zinc-400 sm:px-8"
          style={WARCITY}
        >
          <p className="mx-auto max-w-3xl drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            {footerText}
          </p>
        </footer>
      </div>
    </div>
  );
}

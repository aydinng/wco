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
    "block rounded px-1 py-0.5 text-left text-sm font-bold transition-colors",
    active
      ? "text-[#FFFF00]"
      : "text-[#FFFF00]/90 hover:bg-red-950/40 hover:text-yellow-100",
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

  const labels = {
    user: t.loginBarUser,
    pass: t.loginBarPass,
    submit: t.loginBarSubmit,
    badCredentials: dict.auth.badCredentials,
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <header className="w-full px-2 pt-4 sm:px-4 lg:px-10">
        <div className="mx-auto w-full max-w-[min(100rem,100%)] overflow-hidden rounded-lg border border-yellow-900/35">
          <Image
            src={BRAND.bannerSrc}
            alt={t.bannerAlt}
            width={1920}
            height={480}
            priority
            className="h-auto w-full max-h-[200px] object-cover object-center sm:max-h-[240px]"
            sizes="100vw"
          />
        </div>

        <h1
          className="mt-4 text-center text-lg font-bold tracking-tight text-white sm:text-xl"
          style={WARCITY}
        >
          {t.loginWelcomeTitle}
        </h1>

        <Suspense fallback={<div className="h-12" aria-hidden />}>
          <LoginTopBar labels={labels} />
        </Suspense>
      </header>

      <div className="mx-auto flex w-full max-w-[min(100rem,100%)] flex-col gap-6 px-2 pb-10 pt-2 sm:px-4 lg:flex-row lg:items-start lg:gap-10 lg:px-10">
        <aside
          className="flex w-full shrink-0 flex-col lg:w-52 lg:min-w-[12rem]"
          style={WARCITY}
        >
          <nav className="space-y-1">
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

          <div className="mt-4 w-full max-w-[11rem]">
            <LanguageSwitcher
              locale={locale}
              label={lang.label}
              trLabel={lang.tr}
              enLabel={lang.en}
              variant="login"
            />
          </div>

          <LoginSidebarClock
            initial={serverNow}
            locale={locale}
            label={t.loginServerClockLabel}
          />
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

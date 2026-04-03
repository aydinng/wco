import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LoginTopBar } from "@/app/login/LoginTopBar";
import { BRAND } from "@/config/brand";
import type { Dictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/lib/locale";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

const SANS =
  'ui-sans-serif, system-ui, "Segoe UI", Tahoma, Arial, Helvetica, sans-serif';

function navLink(active: boolean) {
  return [
    "block py-0.5 text-center text-sm font-bold transition-colors",
    active
      ? "text-[#FFFF00]"
      : "text-[#FFFF00]/90 hover:text-[#FFFF00]",
  ].join(" ");
}

export async function LoginScreenLayout({
  dict,
  children,
}: {
  dict: Dictionary;
  children: React.ReactNode;
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
      <header className="w-full px-3 pt-4 sm:px-4">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-lg border border-yellow-900/35">
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
          style={{ fontFamily: SANS }}
        >
          {t.loginWelcomeTitle}
        </h1>

        <Suspense fallback={<div className="h-12" aria-hidden />}>
          <LoginTopBar labels={labels} />
        </Suspense>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-3 pb-10 pt-2 sm:px-4 lg:flex-row lg:items-start lg:gap-10">
        <aside
          className="flex w-full shrink-0 flex-col lg:w-44"
          style={{ fontFamily: SANS }}
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

          <div className="mt-4 w-full max-w-[13rem] self-center">
            <LanguageSwitcher
              locale={locale}
              label={lang.label}
              trLabel={lang.tr}
              enLabel={lang.en}
              variant="compact"
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

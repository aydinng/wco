import type { Dictionary } from "@/i18n/dictionaries";
import type { LoginLandingData } from "@/lib/get-login-landing-data";
import type { AppLocale } from "@/lib/locale";
import Link from "next/link";
import { LoginLandingStatsBlock } from "@/components/landing/LoginLandingStatsBlock";

const WARCITY: React.CSSProperties = { fontFamily: "var(--font-warcity), serif" };

export function LoginLandingContent({
  dict,
  locale,
  stats,
}: {
  dict: Dictionary;
  locale: AppLocale;
  stats: LoginLandingData;
}) {
  const p = dict.public;
  const items = p.loginBulletsFive;
  const statsInitial = {
    totalRegistered: stats.totalRegistered,
    onlineCount: stats.onlineCount,
    lastUser: stats.lastUser
      ? {
          username: stats.lastUser.username,
          registrationCountry: stats.lastUser.registrationCountry,
          createdAt: stats.lastUser.createdAt.toISOString(),
        }
      : null,
    topCountries: stats.topCountries,
    topPlayers: stats.topPlayers,
  };

  return (
    <div
      className="min-w-0 max-w-full space-y-5 break-words text-[15px] font-semibold leading-relaxed text-[#FFFF00] sm:text-base"
      style={WARCITY}
    >
      <LoginLandingStatsBlock dict={dict} locale={locale} initial={statsInitial} />

      <p className="text-[#FFFF00] drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
        {p.loginIntroParagraph1}
      </p>

      <div className="flex w-full max-w-2xl flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <span className="text-[#FFFF00] drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
          {p.loginIntroParagraph2Before}
        </span>
        <Link
          href="/register"
          className="inline-flex h-8 w-fit shrink-0 items-center justify-center rounded-sm border border-amber-900/60 bg-gradient-to-b from-amber-700/95 to-amber-900/95 px-3 text-sm font-bold text-amber-50 shadow-sm hover:from-amber-600 hover:to-amber-800"
        >
          {p.loginIntroRegisterWord}
        </Link>
        <span className="text-[#FFFF00] drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
          {p.loginIntroParagraph2After}
        </span>
      </div>

      <ol className="list-decimal space-y-3 pl-6 marker:font-bold marker:text-white">
        <li className="pl-1 text-[#FFFF00] drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
          {items[0]}
        </li>
        <li className="pl-1 text-[#FFFF00] drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
          {items[1]}
        </li>
        <li className="pl-1 text-[#FFFF00] drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
          {items[2]}
        </li>
        <li className="pl-1 text-[#FFFF00] drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
          {p.loginBullet4Before}
          <Link
            href="/forum"
            className="text-[#FFFF00] underline decoration-yellow-600 underline-offset-2 hover:text-yellow-200"
          >
            {p.loginBullet4LinkWord}
          </Link>
          {p.loginBullet4After}
        </li>
        <li className="pl-1 text-[#FFFF00] drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
          {items[4]}
        </li>
      </ol>

    </div>
  );
}

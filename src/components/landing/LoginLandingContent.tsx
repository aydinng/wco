import {
  countryEnglishNameById,
  countryFlagImgSrc,
  countryLabelById,
} from "@/config/countries";
import type { Dictionary } from "@/i18n/dictionaries";
import type { LoginLandingData } from "@/lib/get-login-landing-data";
import type { AppLocale } from "@/lib/locale";
import Image from "next/image";
import Link from "next/link";
import { LoginLastUserAgo } from "@/components/landing/LoginLastUserAgo";

const WARCITY: React.CSSProperties = { fontFamily: "var(--font-warcity), serif" };

/** Tablo bölüm başlıkları — biraz daha açık sarı */
const TITLE_SOFT_YELLOW = "text-[#fff176]";

function tpl(s: string, vars: Record<string, string>) {
  let out = s;
  for (const [k, v] of Object.entries(vars)) {
    out = out.replaceAll(`{${k}}`, v);
  }
  return out;
}

function countryName(id: string, locale: AppLocale) {
  return locale === "en" ? countryEnglishNameById(id) : countryLabelById(id);
}

function lineWithCount(template: string, count: number) {
  const parts = template.split("{count}");
  return (
    <p className="leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]" style={WARCITY}>
      <span className="text-[#FFFF00]">{parts[0]}</span>
      <span className="font-bold text-white">{count}</span>
      <span className="text-[#FFFF00]">{parts.slice(1).join("{count}")}</span>
    </p>
  );
}

function FlagImg({ countryId }: { countryId: string }) {
  const src = countryFlagImgSrc(countryId);
  if (!src) return <span className="inline-block w-5" aria-hidden />;
  return (
    <Image
      src={src}
      alt=""
      width={20}
      height={14}
      className="inline-block h-[14px] w-5 shrink-0 object-cover align-middle"
      unoptimized
    />
  );
}

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
  const last = stats.lastUser;

  return (
    <div
      className="min-w-0 max-w-full space-y-5 break-words text-[15px] font-semibold leading-relaxed text-[#FFFF00] sm:text-base"
      style={WARCITY}
    >
      <div className="space-y-1">
        {lineWithCount(p.loginStatRegistered, stats.totalRegistered)}
        {lineWithCount(p.loginStatOnline, stats.onlineCount)}
        {last ? (
          <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
            <span className="text-[#FFFF00]">{p.loginStatLastIntro}</span>
            <span className="font-semibold text-white">{last.username}</span>
            <span className="text-[#FFFF00]">{p.loginStatLastBetweenUserAndAgo}</span>
            <LoginLastUserAgo createdAt={last.createdAt} locale={locale} />
            <span className="text-[#FFFF00]">{p.loginStatLastBetweenAgoAndCountry}</span>
            <span className="inline-flex items-center gap-1.5">
              <FlagImg countryId={last.registrationCountry} />
              <span className="font-semibold text-white">
                {countryName(last.registrationCountry, locale)}
              </span>
            </span>
          </p>
        ) : (
          <p className="text-[#FFFF00] drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
            {p.loginStatLastEmpty}
          </p>
        )}
      </div>

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

      <div className="w-full min-w-0 max-w-xl space-y-4 overflow-x-auto pt-2 text-left [-webkit-overflow-scrolling:touch]">
        <p className={`font-bold ${TITLE_SOFT_YELLOW} drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]`}>
          {p.loginTableTopCountriesTitle}
        </p>
        <table className="w-full table-fixed border-collapse text-sm">
          <colgroup>
            <col className="w-10" />
            <col />
          </colgroup>
          <thead>
            <tr className="border-b border-yellow-600/40">
              <th className="w-10 pb-1 pr-2 text-left font-bold text-white">
                {p.loginColRank}
              </th>
              <th className="pb-1 pl-0 text-left font-bold text-[#FFFF00]">
                {p.loginColCountry}
              </th>
            </tr>
          </thead>
          <tbody>
            {stats.topCountries.map((row) => (
              <tr key={`${row.rank}-${row.countryId}`}>
                <td className="w-10 py-0.5 pr-2 align-middle font-bold tabular-nums text-white">
                  {row.rank}
                </td>
                <td className="py-0.5 pl-0 align-middle font-bold text-[#FFFF00]">
                  <span className="inline-flex items-center gap-2">
                    <FlagImg countryId={row.countryId} />
                    <span className="text-left">{countryName(row.countryId, locale)}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className={`font-bold ${TITLE_SOFT_YELLOW} drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]`}>
          {p.loginTableTopPlayersTitle}
        </p>
        <table className="w-full table-fixed border-collapse text-sm">
          <colgroup>
            <col className="w-10" />
            <col />
          </colgroup>
          <thead>
            <tr className="border-b border-yellow-600/40">
              <th className="w-10 pb-1 pr-2 text-left font-bold text-white">
                {p.loginColRank}
              </th>
              <th className="pb-1 pl-0 text-left font-bold text-[#FFFF00]">
                {p.loginColPlayer}
              </th>
            </tr>
          </thead>
          <tbody>
            {stats.topPlayers.map((row) => (
              <tr key={`${row.rank}-${row.username}`}>
                <td className="w-10 py-0.5 pr-2 align-middle font-bold tabular-nums text-white">
                  {row.rank}
                </td>
                <td className="py-0.5 pl-0 align-middle font-bold text-[#FFFF00]">
                  <span className="inline-flex items-center gap-2">
                    <FlagImg countryId={row.countryId} />
                    <span className="text-left">
                      {tpl(p.loginTablePlayerRow, {
                        name: row.username,
                        country: countryName(row.countryId, locale),
                      })}
                    </span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

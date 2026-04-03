import {
  countryEnglishNameById,
  countryFlagImgSrc,
  countryLabelById,
} from "@/config/countries";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatAgoSince } from "@/lib/format-ago";
import type { LoginLandingData } from "@/lib/get-login-landing-data";
import type { AppLocale } from "@/lib/locale";
import Image from "next/image";
import Link from "next/link";

const WARCITY: React.CSSProperties = { fontFamily: "var(--font-warcity), serif" };

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
    <p className="leading-relaxed" style={WARCITY}>
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
      className="space-y-5 text-[15px] leading-relaxed text-[#FFFF00] sm:text-base"
      style={WARCITY}
    >
      <div className="space-y-1">
        {lineWithCount(p.loginStatRegistered, stats.totalRegistered)}
        {lineWithCount(p.loginStatOnline, stats.onlineCount)}
        {last ? (
          <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 leading-relaxed">
            <span className="text-[#FFFF00]">
              {tpl(p.loginStatLastPrefix, {
                user: last.username,
                ago: formatAgoSince(last.createdAt, locale),
              })}
            </span>
            <FlagImg countryId={last.registrationCountry} />
            <span className="text-[#FFFF00]">
              {countryName(last.registrationCountry, locale)}
            </span>
          </p>
        ) : (
          <p className="text-[#FFFF00]">{p.loginStatLastEmpty}</p>
        )}
      </div>

      <p className="text-[#FFFF00]">
        {p.loginIntroBefore}
        <Link
          href="/register"
          className="text-[#FFFF00] underline decoration-yellow-600 underline-offset-2 hover:text-yellow-200"
        >
          {p.loginIntroRegisterWord}
        </Link>
        {p.loginIntroAfter}
      </p>

      <ol className="list-decimal space-y-3 pl-6 marker:text-[#FFFF00]">
        <li className="pl-1">{items[0]}</li>
        <li className="pl-1">{items[1]}</li>
        <li className="pl-1">{items[2]}</li>
        <li className="pl-1">
          {p.loginBullet4Before}
          <Link
            href="/forum"
            className="text-[#FFFF00] underline decoration-yellow-600 underline-offset-2 hover:text-yellow-200"
          >
            {p.loginBullet4LinkWord}
          </Link>
          {p.loginBullet4After}
        </li>
        <li className="pl-1">{items[4]}</li>
      </ol>

      <div className="space-y-4 pt-2">
        <p className="text-[#FFFF00]">{p.loginTableTopCountriesTitle}</p>
        <table className="w-full max-w-xl border-collapse text-sm">
          <thead>
            <tr className="border-b border-yellow-600/40">
              <th className="pb-1 pr-3 text-left font-bold text-white">
                {p.loginColRank}
              </th>
              <th className="pb-1 text-left font-bold text-[#FFFF00]">
                {p.loginColCountry}
              </th>
            </tr>
          </thead>
          <tbody>
            {stats.topCountries.map((row) => (
              <tr key={`${row.rank}-${row.countryId}`}>
                <td className="py-0.5 pr-3 align-middle font-bold text-white">
                  {row.rank}
                </td>
                <td className="py-0.5 align-middle font-bold text-[#FFFF00]">
                  <span className="inline-flex items-center gap-2">
                    <FlagImg countryId={row.countryId} />
                    <span>{countryName(row.countryId, locale)}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-[#FFFF00]">{p.loginTableTopPlayersTitle}</p>
        <table className="w-full max-w-xl border-collapse text-sm">
          <thead>
            <tr className="border-b border-yellow-600/40">
              <th className="pb-1 pr-3 text-left font-bold text-white">
                {p.loginColRank}
              </th>
              <th className="pb-1 text-left font-bold text-[#FFFF00]">
                {p.loginColPlayer}
              </th>
            </tr>
          </thead>
          <tbody>
            {stats.topPlayers.map((row) => (
              <tr key={`${row.rank}-${row.username}`}>
                <td className="py-0.5 pr-3 align-middle font-bold text-white">
                  {row.rank}
                </td>
                <td className="py-0.5 align-middle font-bold text-[#FFFF00]">
                  <span className="inline-flex items-center gap-2">
                    <FlagImg countryId={row.countryId} />
                    <span>
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

"use client";

import {
  countryEnglishNameById,
  countryFlagImgSrc,
  countryLabelById,
} from "@/config/countries";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatAgoSince } from "@/lib/format-ago";
import type { AppLocale } from "@/lib/locale";
import Image from "next/image";
import { useEffect, useState } from "react";

const WARCITY: React.CSSProperties = { fontFamily: "var(--font-warcity), serif" };
const TITLE_SOFT_YELLOW = "text-[#fff176]";

export type LoginStatsSnapshot = {
  totalRegistered: number;
  onlineCount: number;
  lastUser: {
    username: string;
    registrationCountry: string;
    createdAt: string;
  } | null;
  topCountries: { rank: number; countryId: string; score: number }[];
  topPlayers: {
    rank: number;
    username: string;
    countryId: string;
    score: number;
  }[];
};

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

function lineWithCount(template: string, count: number) {
  const parts = template.split("{count}");
  return (
    <p
      className="leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]"
      style={WARCITY}
    >
      <span className="text-[#FFFF00]">{parts[0]}</span>
      <span className="font-bold text-white">{count}</span>
      <span className="text-[#FFFF00]">{parts.slice(1).join("{count}")}</span>
    </p>
  );
}

type Props = {
  dict: Dictionary;
  locale: AppLocale;
  initial: LoginStatsSnapshot;
};

export function LoginLandingStatsBlock({ dict, locale, initial }: Props) {
  const p = dict.public;
  const [stats, setStats] = useState<LoginStatsSnapshot>(initial);
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const r = await fetch("/api/public/login-stats", { cache: "no-store" });
        if (!r.ok || cancelled) return;
        const j = (await r.json()) as LoginStatsSnapshot;
        if (!cancelled) setStats(j);
      } catch {
        /* ignore */
      }
    };
    load();
    const iv = window.setInterval(load, 4000);
    return () => {
      cancelled = true;
      window.clearInterval(iv);
    };
  }, []);

  const last = stats.lastUser;

  return (
    <div className="space-y-1">
      {lineWithCount(p.loginStatRegistered, stats.totalRegistered)}
      {lineWithCount(p.loginStatOnline, stats.onlineCount)}
      {last ? (
        <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
          <span className="text-[#FFFF00]">{p.loginStatLastIntro}</span>
          <span className="font-semibold text-white">{last.username}</span>
          <span className="text-[#FFFF00]">{p.loginStatLastBetweenUserAndAgo}</span>
          <span className="text-white">
            {formatAgoSince(new Date(last.createdAt), locale)}
          </span>
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

      <div className="w-full min-w-0 max-w-xl space-y-4 overflow-x-auto pt-2 text-left [-webkit-overflow-scrolling:touch]">
        <p
          className={`font-bold ${TITLE_SOFT_YELLOW} drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]`}
        >
          {p.loginTableTopCountriesTitle}
        </p>
        <table className="w-full table-fixed border-collapse text-sm">
          <colgroup>
            <col className="w-10" />
            <col />
            <col className="w-24" />
          </colgroup>
          <thead>
            <tr className="border-b border-yellow-600/40">
              <th className="w-10 pb-1 pr-2 text-left font-bold text-white">
                {p.loginColRank}
              </th>
              <th className="pb-1 pl-0 text-left font-bold text-[#FFFF00]">
                {p.loginColCountry}
              </th>
              <th className="pb-1 pr-0 text-right font-bold text-[#FFFF00]">
                {p.loginColScore}
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
                <td className="py-0.5 pr-0 text-right tabular-nums text-white">
                  {row.score.toLocaleString(locale === "en" ? "en-US" : "tr-TR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p
          className={`font-bold ${TITLE_SOFT_YELLOW} drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]`}
        >
          {p.loginTableTopPlayersTitle}
        </p>
        <table className="w-full table-fixed border-collapse text-sm">
          <colgroup>
            <col className="w-10" />
            <col />
            <col className="w-24" />
          </colgroup>
          <thead>
            <tr className="border-b border-yellow-600/40">
              <th className="w-10 pb-1 pr-2 text-left font-bold text-white">
                {p.loginColRank}
              </th>
              <th className="pb-1 pl-0 text-left font-bold text-[#FFFF00]">
                {p.loginColPlayer}
              </th>
              <th className="pb-1 pr-0 text-right font-bold text-[#FFFF00]">
                {p.loginColScore}
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
                <td className="py-0.5 pr-0 text-right tabular-nums text-white">
                  {row.score.toLocaleString(locale === "en" ? "en-US" : "tr-TR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

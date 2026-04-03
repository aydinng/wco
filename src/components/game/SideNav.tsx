"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ServerDateTime } from "@/components/game/ServerClock";
import {
  countryEnglishNameById,
  countryFlagImgSrc,
} from "@/config/countries";
import type { EraConfig } from "@/config/eras";
import {
  eraBackgroundUrl,
  eraOrdinalNumber,
  getEraDisplayName,
} from "@/config/eras";
import type { Dictionary } from "@/i18n/dictionaries";
import type { AppLocale } from "@/lib/locale";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ProductionCitySelect } from "@/components/game/ProductionCitySelect";

type GameNavProps = {
  locale: AppLocale;
  labels: Dictionary["game"];
  lang: Dictionary["lang"];
  era: EraConfig;
  serverNow: Date;
  serverDateLabel: string;
  profile: {
    username: string;
    tribeName: string;
    registrationCountry: string;
  };
  /** Asker üretimi sayfası için hızlı şehir seçimi */
  productionCities?: { id: string; name: string }[];
  activeMissions?: { label: string; etaSec: number }[];
  activeMissionsTitle?: string;
  etaLabel?: string;
};

const WARCITY_FONT = { fontFamily: "var(--font-warcity), serif" } as const;

function fmtEta(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`
    : `${m}:${String(r).padStart(2, "0")}`;
}

function blackSectionTitle(children: ReactNode) {
  return (
    <div className="mb-2 flex w-full justify-center">
      <span className="inline-block bg-black px-2 py-0.5 text-xs font-bold leading-tight text-red-600">
        {children}
      </span>
    </div>
  );
}

export function SideNav({
  locale,
  labels,
  lang,
  era,
  serverNow,
  serverDateLabel,
  profile,
  productionCities,
  activeMissions,
  activeMissionsTitle,
  etaLabel,
}: GameNavProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin === true;

  const GAME_REST = [
    { href: "/resources", label: labels.resources },
    { href: "/buildings", label: labels.buildings },
    { href: "/research", label: labels.research },
    { href: "/production", label: labels.production },
    { href: "/fleet", label: labels.fleet },
    { href: "/diplomacy", label: labels.diplomacy },
    { href: "/market", label: labels.market },
    { href: "/worldmap", label: labels.worldmap },
  ] as const;

  function linkYellow(active: boolean) {
    return [
      "block rounded px-1.5 py-0.5 text-xs transition-colors",
      active
        ? "bg-amber-900/50 text-yellow-200"
        : "text-yellow-300 hover:bg-white/10 hover:text-yellow-100",
    ].join(" ");
  }

  const eraBg = eraBackgroundUrl(era.id);
  const eraName = getEraDisplayName(era, locale);
  const eraNum = eraOrdinalNumber(era.id);
  const eraLine = locale === "en" ? `Age ${eraNum}` : `Çağ ${eraNum}`;

  const countryEn = countryEnglishNameById(profile.registrationCountry);
  const flagSrc = countryFlagImgSrc(profile.registrationCountry);

  return (
    <aside className="flex min-h-screen w-56 shrink-0 flex-col overflow-y-auto border-r border-zinc-800/80 bg-zinc-900/65 backdrop-blur-sm">
      <div className="flex flex-1 flex-col items-center p-3 text-center">
        <div className="flex w-full flex-col items-center">
          {/* Çağ görseli */}
          <div
            className="relative mb-3 w-full overflow-hidden rounded-lg border-2 shadow-lg"
            style={{
              borderColor: era.banner.borderColor,
              boxShadow: `0 0 22px ${era.banner.glow}`,
            }}
          >
            <div className="relative h-24 w-full">
              <Image
                src={eraBg}
                alt=""
                fill
                className="object-cover object-center"
                sizes="224px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
              <div className="absolute bottom-2 left-2 right-2 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  {eraLine}
                </p>
                <p
                  className="text-[11px] font-bold leading-tight drop-shadow-md"
                  style={{ color: era.banner.titleColor }}
                >
                  {eraName}
                </p>
              </div>
            </div>
          </div>

          {blackSectionTitle(labels.menuGameMenu)}

          <nav
            className="mb-2 w-full space-y-1"
            style={WARCITY_FONT}
          >
            <Link
              href="/overview"
              className={linkYellow(pathname === "/overview")}
            >
              {labels.overview}
            </Link>
          </nav>
          <nav
            className="mb-4 w-full space-y-1"
            style={WARCITY_FONT}
          >
            {GAME_REST.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={linkYellow(pathname === item.href)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {productionCities && productionCities.length > 0 && (
            <Suspense fallback={null}>
              <ProductionCitySelect
                cities={productionCities}
                label={
                  locale === "en" ? "Production city" : "Üretim şehri"
                }
              />
            </Suspense>
          )}

          {blackSectionTitle(labels.menuLeaderMenu)}
          <nav
            className="mb-4 w-full space-y-1.5 text-xs"
            style={WARCITY_FONT}
          >
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              <Link href="/stats" className={linkYellow(pathname === "/stats")}>
                {labels.stats}
              </Link>
              <Link
                href="/messages"
                className={linkYellow(pathname === "/messages")}
              >
                {labels.messages}
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              <Link
                href="/options"
                className={linkYellow(pathname === "/options")}
              >
                {labels.options}
              </Link>
              <Link href="/help" className={linkYellow(pathname === "/help")}>
                {labels.help}
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              <Link href="/community" className={linkYellow(pathname === "/community")}>
                {labels.forum}
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="rounded px-1.5 py-0.5 text-yellow-300 hover:bg-white/10 hover:text-yellow-100"
              >
                {labels.logout}
              </button>
            </div>
          </nav>

          {blackSectionTitle(labels.menuLeadership)}
          <div
            className="mb-3 w-full space-y-1 text-[11px]"
            style={WARCITY_FONT}
          >
            <div>
              <span className="font-semibold text-green-500">
                {labels.labelRank}:
              </span>{" "}
              <span className="text-white">{labels.rankLeaderValue}</span>
            </div>
            <div>
              <span className="font-semibold text-green-500">
                {labels.labelManager}:
              </span>{" "}
              <span className="text-white">{profile.username || "—"}</span>
            </div>
            <div>
              <span className="font-semibold text-green-500">
                {labels.labelTribe}:
              </span>{" "}
              <span className="text-white">{profile.tribeName || "—"}</span>
            </div>
          </div>

          <div className="mb-1 flex items-center justify-center gap-1.5 text-xs text-white">
            <span>{countryEn}</span>
            {flagSrc ? (
              <Image
                src={flagSrc}
                alt=""
                width={20}
                height={14}
                className="h-[1em] w-auto object-contain"
                unoptimized
              />
            ) : null}
          </div>

          <div className="mt-1 w-full">
            <div className="text-[11px] font-semibold text-green-500">
              {serverDateLabel}
            </div>
            <div className="mt-0.5 text-[11px]">
              <ServerDateTime initial={serverNow} locale={locale} />
            </div>
          </div>

          <div className="mt-2 w-full">
            <LanguageSwitcher
              variant="compact"
              locale={locale}
              label={lang.label}
              trLabel={lang.tr}
              enLabel={lang.en}
            />
          </div>

          {activeMissions && activeMissions.length > 0 && (
            <>
              <div className="mt-4 mb-2 w-full text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {activeMissionsTitle ?? "Aktif görevler"}
              </div>
            <div className="mb-4 w-full space-y-1 rounded border border-zinc-700/50 bg-black/25 p-2 text-[11px] text-zinc-300">
              {activeMissions.slice(0, 6).map((m, i) => (
                <div
                  key={`${m.label}-${i}`}
                  className="flex items-center justify-between gap-2 border-b border-zinc-700/40 pb-1 last:border-b-0 last:pb-0"
                >
                  <span className="min-w-0 truncate">{m.label}</span>
                  <span className="shrink-0 tabular-nums text-zinc-300">
                    {etaLabel ?? "ETA"} {fmtEta(m.etaSec)}
                  </span>
                </div>
              ))}
              </div>
            </>
          )}

          {isAdmin && (
            <>
              <div className="mb-2 w-full text-xs font-semibold uppercase tracking-wider text-amber-700/90">
                {labels.menuAdmin}
              </div>
              <nav className="mb-2 w-full space-y-1">
                <Link
                  href="/admin"
                  className={[
                    "block rounded px-2 py-1 text-sm",
                    pathname === "/admin"
                      ? "bg-zinc-700/50 text-zinc-100"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                >
                  {labels.adminPanel}
                </Link>
                <Link
                  href="/admin/era"
                  className={[
                    "block rounded px-2 py-1 text-sm",
                    pathname === "/admin/era"
                      ? "bg-zinc-700/50 text-zinc-100"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                >
                  {labels.eraWorld}
                </Link>
              </nav>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

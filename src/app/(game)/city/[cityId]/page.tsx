import { BuildingCatalogCard } from "@/components/game/BuildingCatalogCard";
import { ERA_BUILDING_CATALOG } from "@/config/building-catalog";
import {
  ERA_ORDER,
  eraBackgroundUrl,
  eraOrdinalNumber,
  getEraConfig,
  getEraDisplayName,
  getResourceUnlocks,
} from "@/config/eras";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/current-user";
import { getLocale } from "@/lib/locale";
import type { AppLocale } from "@/lib/locale";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

function eraHeadingLabel(locale: AppLocale, eraOrdinal: number, eraName: string) {
  if (locale === "en") {
    return `Age ${eraOrdinal} · ${eraName}`;
  }
  return `Çağ ${eraOrdinal} · ${eraName}`;
}

export default async function CityDetailPage({
  params,
}: {
  params: Promise<{ cityId: string }>;
}) {
  const { cityId } = await params;
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const p = dict.play;
  const user = await getCurrentUser();
  if (!user) notFound();
  const city = user.cities.find((c) => c.id === cityId);
  if (!city) notFound();

  const cities = [city];
  const unlocks = getResourceUnlocks(user.currentEra);
  const isAdmin = user.isAdmin === true;

  return (
    <div className="rounded border border-[#2a3441]/90 bg-black/35 p-4 backdrop-blur-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/overview"
          className="text-sm text-amber-200/80 hover:text-amber-100 hover:underline"
        >
          ← {p.cityDetailBack}
        </Link>
      </div>
      <h2
        className="mb-1 text-lg text-amber-200/90"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        {city.name} — {p.buildingsTitle}
      </h2>
      <p className="mb-6 text-sm text-zinc-500">{p.cityDetailIntro}</p>

      <div className="mb-8">
        <p className="text-sm leading-relaxed text-zinc-500">
          {p.buildingsCatalogHint}
        </p>
        {isAdmin && (
          <p className="mt-2 text-xs text-amber-200/80">{p.adminBonusHint}</p>
        )}
      </div>

      <div className="space-y-12">
        {ERA_ORDER.map((eraId) => {
          const cfg = getEraConfig(eraId);
          const rows = ERA_BUILDING_CATALOG[eraId];
          const bg = eraBackgroundUrl(eraId);
          const eraName = getEraDisplayName(cfg, locale);
          const ordinal = eraOrdinalNumber(eraId);
          const heading = eraHeadingLabel(locale, ordinal, eraName);

          return (
            <section key={eraId} className="scroll-mt-4">
              <div
                className="relative mb-4 overflow-hidden rounded-xl border-2 shadow-xl"
                style={{
                  borderColor: cfg.banner.borderColor,
                  boxShadow: `0 0 28px ${cfg.banner.glow}`,
                }}
              >
                <div className="relative h-28 w-full sm:h-32">
                  <Image
                    src={bg}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    priority={eraId === "ilk_cag"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-2 px-4 py-3">
                    <h3
                      className="text-lg font-bold tracking-wide drop-shadow-md sm:text-xl"
                      style={{
                        color: cfg.banner.titleColor,
                        fontFamily: "var(--font-warcity), serif",
                      }}
                    >
                      {heading}
                    </h3>
                    <span
                      className="tabular-nums text-sm font-semibold text-zinc-300"
                      style={{ color: cfg.banner.subtitleColor }}
                    >
                      {locale === "en" ? `Age ${ordinal}` : `Çağ ${ordinal}`}
                    </span>
                  </div>
                </div>
              </div>

              {rows.length === 0 ? (
                <p className="rounded border border-[#2a3441]/60 bg-black/20 px-3 py-4 text-sm text-zinc-500">
                  {eraId === "yeniden_dogus"
                    ? p.buildingsEraTechOnly
                    : p.buildingsEraEmpty}
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {rows.map((row) => (
                    <BuildingCatalogCard
                      key={`${eraId}-${row.buildingId}`}
                      building={row.buildingId}
                      title={locale === "en" ? row.titleEn : row.titleTr}
                      cities={cities}
                      unlocks={unlocks}
                      play={p}
                      locale={locale}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

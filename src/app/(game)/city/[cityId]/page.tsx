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

      <div className="w-full overflow-hidden rounded-lg border border-zinc-700/70">
        {ERA_ORDER.map((eraId) => {
          const cfg = getEraConfig(eraId);
          const rows = ERA_BUILDING_CATALOG[eraId];
          const bg = eraBackgroundUrl(eraId);
          const eraName = getEraDisplayName(cfg, locale);
          const ordinal = eraOrdinalNumber(eraId);

          return (
            <div key={eraId} className="scroll-mt-4">
              <div
                className="relative mb-0 w-full overflow-hidden rounded-none border-b-2 shadow-lg"
                style={{
                  borderColor: cfg.banner.borderColor,
                  boxShadow: `0 0 18px ${cfg.banner.glow}`,
                }}
              >
                <div className="relative h-20 w-full sm:h-24">
                  <Image
                    src={bg}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    priority={eraId === "ilk_cag"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                  <div className="absolute bottom-1.5 left-2 right-2 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      {locale === "en" ? `Age ${ordinal}` : `Çağ ${ordinal}`}
                    </p>
                    <p className="text-[11px] font-bold leading-tight text-white drop-shadow-md">
                      {eraName}
                    </p>
                  </div>
                </div>
              </div>

              {rows.length === 0 ? (
                <p className="border-b border-blue-950/70 px-3 py-4 text-sm text-zinc-500">
                  {eraId === "yeniden_dogus"
                    ? p.buildingsEraTechOnly
                    : p.buildingsEraEmpty}
                </p>
              ) : (
                <div>
                  {rows.map((row) => (
                    <BuildingCatalogCard
                      key={`${eraId}-${row.buildingId}`}
                      building={row.buildingId}
                      title={locale === "en" ? row.titleEn : row.titleTr}
                      desc={locale === "en" ? row.descEn : row.descTr}
                      eraOrdinal={ordinal}
                      cities={cities}
                      unlocks={unlocks}
                      play={p}
                      locale={locale}
                      researchTier={user.researchTier}
                      currentEra={user.currentEra}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

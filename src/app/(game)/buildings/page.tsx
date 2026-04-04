import { BuildingCatalogCard } from "@/components/game/BuildingCatalogCard";
import {
  BuildingJobsQueue,
  type BuildingJobQueueItem,
} from "@/components/game/BuildingJobsQueue";
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
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function BuildingsPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const p = dict.play;
  const user = await getCurrentUser();
  const cities = user?.cities ?? [];
  const unlocks = getResourceUnlocks(user?.currentEra);
  if (!user || cities.length === 0) {
    return (
      <div className="rounded border border-[#2a3441]/90 bg-black/35 p-4 backdrop-blur-sm">
        <h2
          className="mb-2 text-lg text-amber-200/90"
          style={{ fontFamily: "var(--font-warcity), serif" }}
        >
          {p.buildingsTitle}
        </h2>
        <p className="text-sm text-zinc-500">{p.overviewNoSeed}</p>
      </div>
    );
  }

  const rawJobs = await prisma.buildingJob.findMany({
    where: { userId: user.id, status: "queued" },
    orderBy: { completesAt: "asc" },
    take: 2,
    include: { city: { select: { name: true } } },
  });
  const buildingQueueItems: BuildingJobQueueItem[] = rawJobs.map((j) => ({
    id: j.id,
    completesAtIso: j.completesAt.toISOString(),
    cityName: j.city.name,
    buildingId: j.buildingId,
    toLevel: j.toLevel,
  }));

  return (
    <div className="rounded border border-[#2a3441]/90 bg-black/35 p-4 backdrop-blur-sm">
      <h2
        className="mb-2 text-center text-lg text-amber-200/90"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        {p.buildingsTitle}
      </h2>
      <BuildingJobsQueue
        jobs={buildingQueueItems}
        locale={locale}
        heading={p.buildingQueueHeading}
        emptyLabel={p.buildingQueueEmpty}
      />
      <div className="space-y-12">
        {ERA_ORDER.map((eraId) => {
          const cfg = getEraConfig(eraId);
          const rows = ERA_BUILDING_CATALOG[eraId];
          const bg = eraBackgroundUrl(eraId);
          const eraName = getEraDisplayName(cfg, locale);
          const ordinal = eraOrdinalNumber(eraId);

          return (
            <section key={eraId} className="scroll-mt-4">
              <div
                className="relative mb-4 w-full overflow-hidden rounded-lg border-2 shadow-lg"
                style={{
                  borderColor: cfg.banner.borderColor,
                  boxShadow: `0 0 22px ${cfg.banner.glow}`,
                }}
              >
                <div className="relative h-24 w-full">
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
                  <div className="absolute bottom-2 left-2 right-2 text-center">
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
                <p className="rounded border border-[#2a3441]/60 bg-black/20 px-3 py-4 text-sm text-zinc-500">
                  {eraId === "yeniden_dogus"
                    ? p.buildingsEraTechOnly
                    : p.buildingsEraEmpty}
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {rows.map((row) => (
                    <BuildingCatalogCard
                      key={`${eraId}-${row.buildingId}`}
                      building={row.buildingId}
                      title={
                        locale === "en" ? row.titleEn : row.titleTr
                      }
                      desc={locale === "en" ? row.descEn : row.descTr}
                      eraOrdinal={ordinal}
                      cities={cities}
                      unlocks={unlocks}
                      play={p}
                      locale={locale}
                      researchTier={user.researchTier}
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

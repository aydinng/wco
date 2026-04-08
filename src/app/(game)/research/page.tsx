import { CityResourceBar } from "@/components/game/CityResourceBar";
import { EraTechJobsQueue } from "@/components/game/EraTechJobsQueue";
import type { EraTechJobQueueItem } from "@/components/game/EraTechJobsQueue";
import { FoundCityForm } from "@/components/game/FoundCityForm";
import { ResearchAdvanceForm } from "@/components/game/ResearchAdvanceForm";
import { ResearchStatusStrip } from "@/components/game/ResearchStatusStrip";
import { TechnologyCatalog } from "@/components/game/TechnologyCatalog";
import { getTechByKey } from "@/config/technology-catalog";
import { getResourceUnlocks } from "@/config/eras";
import { getDictionary } from "@/i18n/dictionaries";
import { canFoundCity } from "@/lib/found-city";
import { MAX_RESEARCH_TIER } from "@/lib/economy";
import { getCurrentUser } from "@/lib/current-user";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const MAX_ERA_QUEUE = 2;

export default async function ResearchPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const p = dict.play;
  const sp = await searchParams;
  const user = await getCurrentUser();
  const cities = user?.cities ?? [];
  const tier = user?.researchTier ?? 0;
  const canFound = user ? canFoundCity(user.currentEra, tier) : false;
  const defaultCityId = cities[0]?.id ?? "";
  const selectedCityId =
    sp.city && cities.some((c) => c.id === sp.city) ? sp.city : defaultCityId;
  const selectedCity =
    cities.find((c) => c.id === selectedCityId) ?? cities[0] ?? null;
  const unlocks = getResourceUnlocks(user?.currentEra);

  const [eraTechRows, rawEraJobs] =
    user && cities.length > 0
      ? await Promise.all([
          prisma.userEraTech.findMany({
            where: { userId: user.id },
          }),
          prisma.eraTechResearchJob.findMany({
            where: { userId: user.id, status: "queued" },
            orderBy: { createdAt: "asc" },
            take: MAX_ERA_QUEUE,
            include: { city: { select: { name: true } } },
          }),
        ])
      : [[], []];

  const eraTechLevels = Object.fromEntries(
    eraTechRows.map((r) => [r.techKey, r.level]),
  );

  const eraTechQueueItems: EraTechJobQueueItem[] = rawEraJobs.map((j) => {
    const spec = getTechByKey(j.techKey);
    const curLv = eraTechLevels[j.techKey] ?? 0;
    const targetLv = curLv + 1;
    const name =
      locale === "en"
        ? spec?.nameEn ?? j.techKey
        : spec?.nameTr ?? j.techKey;
    const summaryLine =
      locale === "en"
        ? `${name} → Lv ${targetLv}`
        : `${name} → Sv. ${targetLv}`;
    return {
      id: j.id,
      completesAtIso: j.completesAt?.toISOString() ?? null,
      cityName: j.city.name,
      summaryLine,
    };
  });

  const activeEraTechJobs = rawEraJobs.map((j) => ({
    id: j.id,
    techKey: j.techKey,
    completesAt: j.completesAt?.toISOString() ?? null,
    cityId: j.cityId,
  }));

  if (!user || cities.length === 0 || !selectedCity) {
    return (
      <div className="rounded border border-[#2a3441]/90 bg-black/35 p-4 backdrop-blur-sm">
        <p className="text-sm text-zinc-500">{p.overviewNoSeed}</p>
      </div>
    );
  }

  return (
    <div className="rounded border border-[#2a3441]/90 bg-black/35 p-4 backdrop-blur-sm">
      <div
        className="sticky top-0 z-20 -mx-4 mb-4 border-b border-amber-900/40 bg-gradient-to-r from-zinc-950/98 via-zinc-900/95 to-zinc-950/98 px-4 py-3 shadow-md backdrop-blur-md"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        <h2 className="text-center text-lg font-bold tracking-wide text-amber-200/95">
          {locale === "en" ? "Technologies" : "Teknolojiler"}
        </h2>
      </div>

      <Suspense
        fallback={
          <div className="mb-4 h-16 max-w-2xl animate-pulse rounded bg-zinc-800/40" />
        }
      >
        <CityResourceBar
          cities={cities.map((c) => ({ id: c.id, name: c.name }))}
          selectLabel={p.overviewSelectCity}
          page="research"
          wood={selectedCity.wood}
          iron={selectedCity.iron}
          oil={selectedCity.oil}
          food={selectedCity.food}
          showIron={unlocks.iron}
          showOil={unlocks.oil}
        />
      </Suspense>

      <EraTechJobsQueue
        jobs={eraTechQueueItems}
        locale={locale}
        heading={p.eraTechQueueHeading}
        emptyLabel={p.eraTechQueueEmpty}
      />

      <ResearchStatusStrip
        locale={locale}
        researchJobEndsAtIso={user.researchJobEndsAt?.toISOString() ?? null}
      />

      <TechnologyCatalog
        locale={locale}
        play={p}
        currentEra={user.currentEra}
        selectedCityId={selectedCity.id}
        eraTechLevels={eraTechLevels}
        activeEraTechJobs={activeEraTechJobs}
      />
      <div className="mt-4 border-t border-zinc-700/50 pt-4">
        <ResearchAdvanceForm
          currentTier={tier}
          cities={cities.map((c) => ({ id: c.id, name: c.name }))}
          payFromLabel={p.researchPayFrom}
          btnLabel={p.researchBtn}
          researchJobEndsAtIso={user.researchJobEndsAt?.toISOString() ?? null}
          locale={locale}
        />
      </div>
      {tier > 0 ? (
        <p
          className="mt-4 text-sm text-zinc-300"
          style={{ fontFamily: "var(--font-warcity), serif" }}
        >
          {p.researchTier}:{" "}
          <span className="text-xl font-semibold text-amber-200">{tier}</span>
          {tier >= MAX_RESEARCH_TIER && (
            <span className="ml-2 text-xs text-zinc-500">{p.researchMax}</span>
          )}
        </p>
      ) : null}
      {canFound ? (
        <>
          <p className="mt-8 text-sm leading-relaxed text-zinc-400">
            {p.foundCityExpl}
          </p>
          <FoundCityForm
            cities={cities.map((c) => ({ id: c.id, name: c.name }))}
            labels={{
              sectionTitle: p.foundCityTitle,
              name: p.foundCityName,
              payFrom: p.foundCityPayFrom,
              cx: p.foundCityCoordX,
              cy: p.foundCityCoordY,
              cz: p.foundCityCoordZ,
              submit: p.foundCitySubmit,
              errGeneric: p.errServer,
            }}
          />
        </>
      ) : (
        <p className="mt-8 rounded-lg border border-zinc-700/60 bg-black/25 px-3 py-2 text-xs text-zinc-500">
          {p.foundCityLocked}
        </p>
      )}
    </div>
  );
}

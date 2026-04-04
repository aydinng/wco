import { FoundCityForm } from "@/components/game/FoundCityForm";
import { ResearchAdvanceForm } from "@/components/game/ResearchAdvanceForm";
import { TechnologyCatalog } from "@/components/game/TechnologyCatalog";
import { getDictionary } from "@/i18n/dictionaries";
import { canFoundCity } from "@/lib/found-city";
import { MAX_RESEARCH_TIER } from "@/lib/economy";
import { getCurrentUser } from "@/lib/current-user";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const p = dict.play;
  const user = await getCurrentUser();
  const cities = user?.cities ?? [];
  const tier = user?.researchTier ?? 0;
  const canFound = user ? canFoundCity(user.currentEra, tier) : false;

  const [eraTechRows, eraJob] =
    user && cities.length > 0
      ? await Promise.all([
          prisma.userEraTech.findMany({
            where: { userId: user.id },
          }),
          prisma.eraTechResearchJob.findFirst({
            where: { userId: user.id, status: "queued" },
            orderBy: { completesAt: "asc" },
          }),
        ])
      : [[], null];

  const eraTechLevels = Object.fromEntries(
    eraTechRows.map((r) => [r.techKey, r.level]),
  );
  const activeEraTechJob = eraJob
    ? {
        techKey: eraJob.techKey,
        completesAt: eraJob.completesAt.toISOString(),
      }
    : null;
  const defaultCityId = cities[0]?.id ?? "";

  if (!user || cities.length === 0) {
    return (
      <div className="rounded border border-[#2a3441]/90 bg-black/35 p-4 backdrop-blur-sm">
        <p className="text-sm text-zinc-500">{p.overviewNoSeed}</p>
      </div>
    );
  }

  return (
    <div className="rounded border border-[#2a3441]/90 bg-black/35 p-4 backdrop-blur-sm">
      <TechnologyCatalog
        locale={locale}
        play={p}
        researchJobEndsAtIso={user.researchJobEndsAt?.toISOString() ?? null}
        currentEra={user.currentEra}
        defaultCityId={defaultCityId}
        eraTechLevels={eraTechLevels}
        activeEraTechJob={activeEraTechJob}
      />
      <div className="mt-4 border-t border-zinc-700/50 pt-4">
        <ResearchAdvanceForm
          currentTier={tier}
          cities={cities.map((c) => ({ id: c.id, name: c.name }))}
          payFromLabel={p.researchPayFrom}
          btnLabel={p.researchBtn}
          researchJobEndsAtIso={user.researchJobEndsAt?.toISOString() ?? null}
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

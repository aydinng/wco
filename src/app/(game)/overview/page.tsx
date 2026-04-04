import { LiveStock } from "@/components/game/LiveStock";
import { ResourceIcon } from "@/components/game/ResourceIcon";
import { WarCityOverviewLike } from "@/components/game/WarCityOverviewLike";
import { WorkersAssignButton } from "@/components/game/WorkersAssignButton";
import { eraIndex, getResourceUnlocks } from "@/config/eras";
import { getDictionary } from "@/i18n/dictionaries";
import {
  hourlyFoodConsumption,
  hourlyProduction,
  safeInt,
} from "@/lib/economy";
import { getCurrentUser } from "@/lib/current-user";
import { getLocale } from "@/lib/locale";
import { getUnitSpec } from "@/config/units";
import { buildingJobSummaryLine } from "@/lib/building-i18n";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const p = dict.play;
  const user = await getCurrentUser();
  const cities = user?.cities ?? [];
  const researchTier = user?.researchTier ?? 0;
  const unlocks = getResourceUnlocks(user?.currentEra);
  const eraIdx = eraIndex(user?.currentEra);

  // Yeni WarCity Online benzeri görünüm
  if (user && cities.length > 0) {
    const now = Date.now();
    const firstJobByCity = await Promise.all(
      cities.map(async (c) => {
        const j = await prisma.trainingJob.findFirst({
          where: { userId: user.id, cityId: c.id, status: "queued" },
          orderBy: { completesAt: "asc" },
          select: { unitId: true, completesAt: true, quantity: true },
        });
        if (!j)
          return {
            cityId: c.id,
            prodLabel: p.overviewNone,
            prodEtaSec: 0,
            prodCompletesAtIso: null as string | null,
          };
        const eta = Math.max(
          0,
          Math.ceil((new Date(j.completesAt).getTime() - now) / 1000),
        );
        const unitName = getUnitSpec(j.unitId)?.name ?? j.unitId;
        const q = j.quantity ?? 1;
        const prodLabel =
          q > 1 ? `${q}× ${unitName}` : unitName;
        return {
          cityId: c.id,
          prodLabel,
          prodEtaSec: eta,
          prodCompletesAtIso: j.completesAt.toISOString(),
        };
      }),
    );
    const prodMap = new Map(firstJobByCity.map((x) => [x.cityId, x]));

    const firstBuildByCity = await Promise.all(
      cities.map(async (c) => {
        const b = await prisma.buildingJob.findFirst({
          where: { userId: user.id, cityId: c.id, status: "queued" },
          orderBy: { completesAt: "asc" },
          select: { buildingId: true, toLevel: true, completesAt: true },
        });
        if (!b)
          return {
            cityId: c.id,
            buildLabel: p.overviewNone,
            buildEtaSec: 0,
            buildCompletesAtIso: null as string | null,
          };
        const eta = Math.max(
          0,
          Math.ceil((new Date(b.completesAt).getTime() - now) / 1000),
        );
        return {
          cityId: c.id,
          buildLabel: buildingJobSummaryLine(
            b.buildingId,
            b.toLevel,
            locale,
          ),
          buildEtaSec: eta,
          buildCompletesAtIso: b.completesAt.toISOString(),
        };
      }),
    );
    const buildMap = new Map(firstBuildByCity.map((x) => [x.cityId, x]));

    const viewCities = cities.map((c) => {
      const ph = hourlyProduction(c, researchTier, unlocks);
      const foodCons = hourlyFoodConsumption(c, eraIdx);
      const fp = safeInt(ph.food);
      const foodNet = fp - foodCons;
      const pm = prodMap.get(c.id);
      const bm = buildMap.get(c.id);
      return {
        id: c.id,
        name: c.name,
        coordX: c.coordX,
        coordY: c.coordY,
        coordZ: c.coordZ,
        wood: c.wood,
        iron: c.iron,
        oil: c.oil,
        food: c.food,
        population: c.population,
        popCap: c.popCap,
        lastTickIso: c.lastResourceTick.toISOString(),
        hw: safeInt(ph.wood),
        hi: safeInt(ph.iron),
        ho: safeInt(ph.oil),
        hn: foodNet,
        buildLabel: bm?.buildLabel ?? p.overviewNone,
        buildEtaSec: bm?.buildEtaSec ?? 0,
        buildCompletesAtIso: bm?.buildCompletesAtIso ?? null,
        prodLabel: pm?.prodLabel ?? p.overviewNone,
        prodEtaSec: pm?.prodEtaSec ?? 0,
        prodCompletesAtIso: pm?.prodCompletesAtIso ?? null,
        workersWood: c.workersWood,
        workersIron: c.workersIron,
        workersOil: c.workersOil,
        workersFood: c.workersFood,
      };
    });

    return (
      <WarCityOverviewLike
        locale={locale}
        currentEra={user.currentEra}
        unlocks={unlocks}
        cities={viewCities}
        researchJobEndsAtIso={user.researchJobEndsAt?.toISOString() ?? null}
        support={
          cities.length >= 2 && researchTier >= 1
            ? {
                allCities: cities.map((c) => ({ id: c.id, name: c.name })),
                labels:
                  locale === "en"
                    ? {
                        support: "Support",
                        fromCity: "From city",
                        sendRes: "Resources",
                        sendTroops: "Troops",
                        wood: "Wood",
                        iron: "Iron",
                        oil: "Oil",
                        food: "Food",
                        unit: "Unit type",
                        qty: "Amount",
                        submit: "Send",
                        close: "Close",
                      }
                    : {
                        support: "Destek",
                        fromCity: "Gönderen şehir",
                        sendRes: "Hammadde",
                        sendTroops: "Asker",
                        wood: "Odun",
                        iron: "Demir",
                        oil: "Petrol",
                        food: "Besin",
                        unit: "Birim",
                        qty: "Adet",
                        submit: "Gönder",
                        close: "Kapat",
                      },
              }
            : null
        }
        labels={{
          wood: p.resWood,
          iron: p.resIron,
          oil: p.resOil,
          food: p.resFood,
          population: locale === "en" ? "Population" : "Nüfus",
          selectCity: p.overviewSelectCity,
          buildingInProgress: p.overviewBuildingInProgress,
          productionInProgress: p.overviewProductionInProgress,
          researchHeading: p.overviewResearchHeading,
          researchIdle: p.overviewResearchIdle,
          time: p.overviewTime,
          idleShownRed: p.overviewIdleShownRed,
          buildIdle: locale === "en" ? "Idle" : "Boşta",
          armyIdle: locale === "en" ? "Idle" : "Boşta",
          workersDialogTitle: p.workersTitle,
          workersSave: p.saveWorkers,
          workersClose: p.dialogClose,
        }}
      />
    );
  }

  return (
    <div className="rounded border border-[#2a3441]/90 bg-black/35 p-3 shadow-inner backdrop-blur-sm sm:p-4">
      <h2
        className="mb-3 text-center text-lg tracking-wide text-amber-200/90 sm:text-xl"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        {p.overviewTitle}
      </h2>

      {!user || cities.length === 0 ? (
        <p className="rounded border border-amber-900/50 bg-black/30 p-4 text-center text-zinc-400">
          {p.overviewNoSeed}{" "}
          <code className="rounded bg-zinc-800 px-1 py-0.5 text-amber-200">
            npm run db:seed
          </code>
        </p>
      ) : (
        <>
          <p className="mb-3 text-center text-sm text-zinc-400">
            {p.overviewResearch}:{" "}
            <span className="font-medium text-amber-200/90">{researchTier}</span>
          </p>
          <div className="overflow-x-auto rounded border border-[#2a3441] bg-[#111827]/80 shadow-lg">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#2a3441] bg-[#0f172a] text-left text-xs uppercase tracking-wide text-zinc-400">
                  <th className="px-3 py-2">{p.resourcesCity}</th>
                      <th className="border-l border-emerald-900/30 bg-emerald-950/20 px-2 py-2 text-emerald-200/90">
                        <span className="inline-flex items-center gap-1">
                          <ResourceIcon kind="wood" />
                          {p.resWood}
                        </span>
                      </th>
                  {unlocks.iron && (
                    <th className="px-2 py-2">
                      <span className="inline-flex items-center gap-1">
                        <ResourceIcon kind="iron" />
                        {p.resIron}
                      </span>
                    </th>
                  )}
                  {unlocks.oil && (
                    <th className="px-2 py-2">
                      <span className="inline-flex items-center gap-1">
                        <ResourceIcon kind="oil" />
                        {p.resOil}
                      </span>
                    </th>
                  )}
                  <th className="border-l border-amber-900/30 bg-amber-950/15 px-2 py-2 text-amber-200/90">
                    <span className="inline-flex items-center gap-1">
                      <ResourceIcon kind="food" />
                      {p.resFood}
                    </span>
                  </th>
                  <th className="px-2 py-2">{p.tableWorkingPop}</th>
                  <th className="px-2 py-2">{p.overviewProdHour}</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((c) => {
                  const assigned =
                    c.workersWood +
                    c.workersIron +
                    c.workersOil +
                    c.workersFood;
                  const idle = Math.max(0, c.population - assigned);
                  const coord = `${c.coordX}:${c.coordY}:${c.coordZ}`;
                  const ph = hourlyProduction(c, researchTier, unlocks);
                  const foodCons = hourlyFoodConsumption(c, eraIdx);
                  const w = safeInt(ph.wood);
                  const ir = safeInt(ph.iron);
                  const oi = safeInt(ph.oil);
                  const fp = safeInt(ph.food);
                  const foodNet = fp - foodCons;
                  const lastTickIso = c.lastResourceTick.toISOString();
                  const prodParts = [
                    `+${w}W`,
                    unlocks.iron ? `+${ir}I` : null,
                    unlocks.oil ? `+${oi}O` : null,
                    `+${foodNet}F`,
                  ].filter(Boolean);
                  return (
                    <tr
                      key={c.id}
                      className="border-b border-[#1f2937] odd:bg-[#0b1220]/90 even:bg-[#0a0f18]/90"
                    >
                      <td className="px-3 py-3 font-medium text-amber-100">
                        <Link
                          href={`/city/${c.id}`}
                          className="hover:text-amber-50 hover:underline"
                        >
                          {c.name}
                        </Link>{" "}
                        <span className="text-xs font-normal text-zinc-500">
                          ({coord})
                        </span>
                      </td>
                      <td className="border-l border-emerald-900/40 bg-emerald-950/25 px-2 py-3 tabular-nums text-emerald-100/95 shadow-[inset_0_0_20px_rgba(16,185,129,0.06)]">
                        <LiveStock
                          base={c.wood}
                          hourlyNet={w}
                          lastTickIso={lastTickIso}
                          locale={locale}
                        />
                      </td>
                      {unlocks.iron && (
                        <td className="px-2 py-3 tabular-nums">
                          <LiveStock
                            base={c.iron}
                            hourlyNet={ir}
                            lastTickIso={lastTickIso}
                            locale={locale}
                          />
                        </td>
                      )}
                      {unlocks.oil && (
                        <td className="px-2 py-3 tabular-nums">
                          <LiveStock
                            base={c.oil}
                            hourlyNet={oi}
                            lastTickIso={lastTickIso}
                            locale={locale}
                          />
                        </td>
                      )}
                      <td className="border-l border-amber-900/40 bg-amber-950/20 px-2 py-3 tabular-nums text-amber-100/95 shadow-[inset_0_0_20px_rgba(245,158,11,0.08)]">
                        <LiveStock
                          base={c.food}
                          hourlyNet={foodNet}
                          lastTickIso={lastTickIso}
                          locale={locale}
                        />
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex items-start gap-2">
                          <div className="min-w-0">
                            <div className="tabular-nums text-zinc-200">
                              {assigned} / {c.population}
                            </div>
                            {idle > 0 && (
                              <div className="text-xs text-red-500">
                                {idle} {p.overviewIdle}
                              </div>
                            )}
                          </div>
                          <WorkersAssignButton
                            cityId={c.id}
                            population={c.population}
                            initial={{
                              workersWood: c.workersWood,
                              workersIron: c.workersIron,
                              workersOil: c.workersOil,
                              workersFood: c.workersFood,
                            }}
                            saveLabel={p.saveWorkers}
                            showIron={unlocks.iron}
                            showOil={unlocks.oil}
                            labels={{
                              w: p.resWood,
                              i: p.resIron,
                              o: p.resOil,
                              f: p.resFood,
                            }}
                            dialogTitle={p.workersTitle}
                            closeLabel={p.dialogClose}
                          />
                        </div>
                      </td>
                      <td className="px-2 py-3 text-[11px] leading-snug text-zinc-400">
                        <div>{prodParts.join(" · ")}</div>
                        {foodCons > 0 && (
                          <div className="mt-0.5 text-[10px] text-zinc-500">
                            {locale === "en"
                              ? `Food net +${foodNet}/h (+${fp} prod, −${foodCons} cons)`
                              : `Besin net +${foodNet}/h (+${fp} ürt, −${foodCons} tük)`}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="border-t border-[#2a3441] px-3 py-2 text-xs text-zinc-500">
              {p.overviewFootnote}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

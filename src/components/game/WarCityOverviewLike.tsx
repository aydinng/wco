"use client";

import { LiveStock } from "@/components/game/LiveStock";
import { ResourceIcon } from "@/components/game/ResourceIcon";
import { eraOverviewThumbUrl } from "@/config/eras";
import { formatCountdownSeconds } from "@/lib/format-countdown";
import { OverviewSupportButton } from "@/components/game/OverviewSupportButton";
import { WorkersAssignButton } from "@/components/game/WorkersAssignButton";
import { useCountdownIso } from "@/components/game/useCountdownIso";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CityRow = {
  id: string;
  name: string;
  coordX: number;
  coordY: number;
  coordZ: number;
  wood: number;
  iron: number;
  oil: number;
  food: number;
  population: number;
  popCap: number;
  lastTickIso: string;
  hw: number;
  hi: number;
  ho: number;
  hn: number;
  buildLabel: string;
  buildEtaSec: number;
  buildCompletesAtIso: string | null;
  prodLabel: string;
  prodEtaSec: number;
  prodCompletesAtIso: string | null;
  workersWood: number;
  workersIron: number;
  workersOil: number;
  workersFood: number;
};

type SupportConfig = {
  allCities: { id: string; name: string }[];
  labels: {
    support: string;
    fromCity: string;
    sendRes: string;
    sendTroops: string;
    wood: string;
    iron: string;
    oil: string;
    food: string;
    unit: string;
    qty: string;
    submit: string;
    close: string;
  };
};

type Props = {
  locale: string;
  currentEra: string | null | undefined;
  unlocks: { iron: boolean; oil: boolean };
  cities: CityRow[];
  researchJobEndsAtIso: string | null;
  support?: SupportConfig | null;
  labels: {
    wood: string;
    iron: string;
    oil: string;
    food: string;
    population: string;
    selectCity: string;
    buildingInProgress: string;
    productionInProgress: string;
    researchHeading: string;
    researchIdle: string;
    time: string;
    idleShownRed: string;
    unassignedWorkersPrefix: string;
    buildIdle: string;
    armyIdle: string;
    workersDialogTitle: string;
    workersSave: string;
    workersClose: string;
  };
};

function PopTotal({
  pop,
  label,
}: {
  pop: number;
  label: string;
}) {
  return (
    <div className="min-w-[120px] text-right">
      <div className="text-[11px] text-zinc-400">{label}</div>
      <div className="tabular-nums text-lg font-semibold text-amber-100/95">
        {pop}
      </div>
    </div>
  );
}

function RowCountdown({
  completesAtIso,
  locale,
}: {
  completesAtIso: string | null;
  locale: string;
}) {
  const sec = useCountdownIso(completesAtIso);
  if (!completesAtIso || sec <= 0) return null;
  return (
    <span className="tabular-nums text-amber-100/90">
      {formatCountdownSeconds(sec, locale)}
    </span>
  );
}

function ResearchCountdownBlock({
  researchJobEndsAtIso,
  locale,
  heading,
}: {
  researchJobEndsAtIso: string | null;
  locale: string;
  heading: string;
}) {
  const sec = useCountdownIso(researchJobEndsAtIso);
  const active = researchJobEndsAtIso && sec > 0;
  if (!active) return null;
  return (
    <div className="border-b border-zinc-700/60 px-3 py-2">
      <div className="rounded border border-zinc-600/50 bg-black/25 px-3 py-2">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-sm">
          <span className="font-semibold text-amber-200/90">{heading}</span>
          <span className="tabular-nums text-zinc-100">
            {formatCountdownSeconds(sec, locale)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function WarCityOverviewLike({
  locale,
  currentEra,
  unlocks,
  cities,
  researchJobEndsAtIso,
  support,
  labels,
}: Props) {
  const eraThumb = eraOverviewThumbUrl(currentEra);
  const [selected, setSelected] = useState(cities[0]?.id ?? "");

  useEffect(() => {
    if (!selected && cities[0]?.id) setSelected(cities[0].id);
  }, [cities, selected]);

  const totals = useMemo(() => {
    const pop = cities.reduce((a, c) => a + c.population, 0);
    return { pop };
  }, [cities]);

  const selectedCityName =
    cities.find((c) => c.id === selected)?.name ?? cities[0]?.name ?? "—";

  const selectedCity = cities.find((c) => c.id === selected);
  const idleWorkersUnassigned = selectedCity
    ? Math.max(
        0,
        selectedCity.population -
          selectedCity.workersWood -
          selectedCity.workersIron -
          selectedCity.workersOil -
          selectedCity.workersFood,
      )
    : 0;

  return (
    <div className="rounded-xl border border-zinc-700/70 bg-zinc-900/65 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.65)] backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-700/60 bg-black/20 px-3 py-2">
        <div className="flex flex-wrap items-baseline gap-2 text-xs text-zinc-400">
          <span className="text-zinc-300">{labels.selectCity}:</span>
          <span className="font-semibold text-amber-200/90">
            {selectedCityName}
          </span>
        </div>
        <select
          className="w-full max-w-[260px] rounded border border-zinc-600/60 bg-black/35 px-2 py-1 text-sm text-zinc-100"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.coordX}:{c.coordY}:{c.coordZ})
            </option>
          ))}
        </select>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <PopTotal pop={totals.pop} label={labels.population} />
          {(() => {
            const sel = cities.find((c) => c.id === selected);
            if (!sel) return null;
            return (
              <WorkersAssignButton
                cityId={sel.id}
                population={sel.population}
                initial={{
                  workersWood: sel.workersWood,
                  workersIron: sel.workersIron,
                  workersOil: sel.workersOil,
                  workersFood: sel.workersFood,
                }}
                saveLabel={labels.workersSave}
                showIron={unlocks.iron}
                showOil={unlocks.oil}
                labels={{
                  w: labels.wood,
                  i: labels.iron,
                  o: labels.oil,
                  f: labels.food,
                }}
                dialogTitle={labels.workersDialogTitle}
                closeLabel={labels.workersClose}
              />
            );
          })()}
        </div>
      </div>

      <ResearchCountdownBlock
        researchJobEndsAtIso={researchJobEndsAtIso}
        locale={locale}
        heading={labels.researchHeading}
      />

      <div className="px-3 pb-3">
        <div className="overflow-hidden rounded-lg border border-zinc-700/60 bg-black/25">
          {cities.map((c, idx) => {
            const active = c.id === selected;
            const showSupport =
              support && idx > 0 && support.allCities.length >= 2;
            return (
              <div
                key={c.id}
                className={[
                  "grid grid-cols-[56px_1fr] items-center gap-3 px-2 py-2 sm:grid-cols-[64px_1fr]",
                  idx === 0 ? "" : "border-t border-zinc-700/50",
                  active ? "bg-zinc-800/40" : "bg-black/15",
                ].join(" ")}
              >
                <div className="relative h-14 w-14 self-center overflow-hidden rounded border border-zinc-600/55 sm:h-16 sm:w-16">
                  <Image
                    src={eraThumb}
                    alt=""
                    fill
                    className="object-cover object-bottom"
                    sizes="64px"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/city/${c.id}`}
                        className="font-semibold text-amber-200 hover:underline"
                      >
                        {c.name}
                      </Link>{" "}
                      <span className="text-xs text-zinc-500">
                        ({c.coordX}:{c.coordY}:{c.coordZ})
                      </span>
                      {showSupport ? (
                        <OverviewSupportButton
                          locale={locale}
                          targetCityId={c.id}
                          targetName={c.name}
                          sourceCities={support.allCities}
                          labels={support.labels}
                        />
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-zinc-300">
                    <div className="space-y-1">
                      <div className="rounded border border-zinc-600/45 bg-black/20 p-2">
                        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="inline-flex items-center gap-1 text-zinc-300">
                              <ResourceIcon kind="wood" /> {labels.wood}:
                            </span>
                            <span className="tabular-nums text-zinc-200">
                              <LiveStock
                                base={c.wood}
                                hourlyNet={c.hw}
                                lastTickIso={c.lastTickIso}
                                locale={locale}
                              />
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="inline-flex items-center gap-1 text-zinc-300">
                              <ResourceIcon kind="food" /> {labels.food}:
                            </span>
                            <span className="tabular-nums text-zinc-200">
                              <LiveStock
                                base={c.food}
                                hourlyNet={c.hn}
                                lastTickIso={c.lastTickIso}
                                locale={locale}
                              />
                            </span>
                          </div>
                          {unlocks.iron && (
                            <div className="flex flex-wrap items-center gap-1">
                              <span className="inline-flex items-center gap-1 text-zinc-300">
                                <ResourceIcon kind="iron" /> {labels.iron}:
                              </span>
                              <span className="tabular-nums text-zinc-200">
                                <LiveStock
                                  base={c.iron}
                                  hourlyNet={c.hi}
                                  lastTickIso={c.lastTickIso}
                                  locale={locale}
                                />
                              </span>
                            </div>
                          )}
                          {unlocks.oil && (
                            <div className="flex flex-wrap items-center gap-1">
                              <span className="inline-flex items-center gap-1 text-zinc-300">
                                <ResourceIcon kind="oil" /> {labels.oil}:
                              </span>
                              <span className="tabular-nums text-zinc-200">
                                <LiveStock
                                  base={c.oil}
                                  hourlyNet={c.ho}
                                  lastTickIso={c.lastTickIso}
                                  locale={locale}
                                />
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="rounded border border-zinc-700/40 bg-black/15 px-2 py-1.5">
                        <div className="text-zinc-200">
                          • {labels.buildingInProgress}:{" "}
                          <span className="text-zinc-400">
                            {c.buildCompletesAtIso ? c.buildLabel : labels.buildIdle}
                          </span>
                        </div>
                        {c.buildCompletesAtIso ? (
                          <div className="mt-0.5 pl-3 text-zinc-400">
                            <span className="text-zinc-400">{labels.time}:</span>{" "}
                            <RowCountdown
                              completesAtIso={c.buildCompletesAtIso}
                              locale={locale}
                            />
                          </div>
                        ) : null}
                      </div>

                      <div className="rounded border border-zinc-700/40 bg-black/15 px-2 py-1.5">
                        <div className="text-zinc-200">
                          • {labels.productionInProgress}:{" "}
                          <span className="text-zinc-400">
                            {c.prodCompletesAtIso ? c.prodLabel : labels.armyIdle}
                          </span>
                        </div>
                        {c.prodCompletesAtIso ? (
                          <div className="mt-0.5 pl-3 text-zinc-400">
                            <span className="text-zinc-400">{labels.time}:</span>{" "}
                            <RowCountdown
                              completesAtIso={c.prodCompletesAtIso}
                              locale={locale}
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-2 space-y-1 text-center text-[11px]">
          <p className="font-semibold text-red-400/95">{labels.idleShownRed}</p>
          <p className="text-zinc-400">
            {labels.unassignedWorkersPrefix}{" "}
            <span className="font-semibold tabular-nums text-red-400">
              {idleWorkersUnassigned}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

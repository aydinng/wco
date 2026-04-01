"use client";

import { LiveStock } from "@/components/game/LiveStock";
import { ResourceIcon } from "@/components/game/ResourceIcon";
import { eraOverviewThumbUrl } from "@/config/eras";
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
  prodLabel: string;
  prodEtaSec: number;
};

type Props = {
  locale: string;
  currentEra: string | null | undefined;
  unlocks: { iron: boolean; oil: boolean };
  cities: CityRow[];
  /** İmparatorluk araştırma süresi (sn); 0 = boşta */
  researchEtaSec: number;
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
    buildIdle: string;
    armyIdle: string;
  };
};

function fmt(n: number, locale: string) {
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString(locale === "en" ? "en-US" : "tr-TR");
}

function fmtEta(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${String(r).padStart(2, "0")}s`;
}

function PopBar({
  pop,
  cap,
  label,
}: {
  pop: number;
  cap: number;
  label: string;
}) {
  const pct = cap > 0 ? Math.min(100, Math.round((pop / cap) * 100)) : 0;
  return (
    <div className="min-w-[160px]">
      <div className="mb-1 flex items-baseline justify-between text-[11px] text-zinc-300">
        <span className="text-amber-200/90">{label}</span>
        <span className="tabular-nums text-zinc-200">
          {pop} / {cap}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded bg-black/35 ring-1 ring-inset ring-white/10">
        <div
          className="h-full bg-gradient-to-r from-emerald-500/80 via-sky-500/75 to-amber-500/75"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function WarCityOverviewLike({
  locale,
  currentEra,
  unlocks,
  cities,
  researchEtaSec,
  labels,
}: Props) {
  const eraThumb = eraOverviewThumbUrl(currentEra);
  const [selected, setSelected] = useState(cities[0]?.id ?? "");
  const [clock, setClock] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setClock(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!selected && cities[0]?.id) setSelected(cities[0].id);
  }, [cities, selected]);

  const totals = useMemo(() => {
    const pop = cities.reduce((a, c) => a + c.population, 0);
    const cap = cities.reduce((a, c) => a + c.popCap, 0);
    return { pop, cap };
  }, [cities]);

  const selectedCityName =
    cities.find((c) => c.id === selected)?.name ?? cities[0]?.name ?? "—";

  return (
    <div className="rounded-xl border border-zinc-700/70 bg-zinc-900/65 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.65)] backdrop-blur-sm">

      {/* Header line: select city */}
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
        <div className="hidden sm:block">
          <PopBar pop={totals.pop} cap={totals.cap} label={labels.population} />
        </div>
      </div>

      {/* Teknoloji araştırması — şehirden bağımsız */}
      <div className="border-b border-zinc-700/60 px-3 py-2">
        <div className="rounded border border-zinc-600/50 bg-black/25 px-3 py-2">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-sm">
            <span className="font-semibold text-amber-200/90">
              {labels.researchHeading}
            </span>
            <span className="tabular-nums text-zinc-200">
              {researchEtaSec > 0
                ? fmtEta(researchEtaSec)
                : labels.researchIdle}
            </span>
          </div>
        </div>
      </div>

      {/* Rows */}
      <div className="px-3 pb-3">
        <div className="overflow-hidden rounded-lg border border-zinc-700/60 bg-black/25">
          {cities.map((c, idx) => {
            const active = c.id === selected;
            const buildSec = Math.max(0, c.buildEtaSec);
            const prodSec = Math.max(0, c.prodEtaSec);
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
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-zinc-300">
                    <div className="space-y-1">
                      {/* Resources inside the city box */}
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
                            {buildSec > 0 ? c.buildLabel : labels.buildIdle}
                          </span>
                        </div>
                        {buildSec > 0 && (
                          <div className="mt-0.5 pl-3 text-zinc-400">
                            <span className="text-zinc-400">{labels.time}:</span>{" "}
                            <span className="tabular-nums text-zinc-200">
                              {fmtEta(buildSec)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="rounded border border-zinc-700/40 bg-black/15 px-2 py-1.5">
                        <div className="text-zinc-200">
                          • {labels.productionInProgress}:{" "}
                          <span className="text-zinc-400">
                            {prodSec > 0 ? c.prodLabel : labels.armyIdle}
                          </span>
                        </div>
                        {prodSec > 0 && (
                          <div className="mt-0.5 pl-3 text-zinc-400">
                            <span className="text-zinc-400">{labels.time}:</span>{" "}
                            <span className="tabular-nums text-zinc-200">
                              {fmtEta(prodSec)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-2 text-center text-[11px] font-semibold text-red-400">
          {labels.idleShownRed}
        </p>
      </div>
    </div>
  );
}


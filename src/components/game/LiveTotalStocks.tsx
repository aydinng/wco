"use client";

import { ResourceIcon } from "@/components/game/ResourceIcon";
import { useEffect, useMemo, useState } from "react";

export type LiveTotalCity = {
  wood: number;
  iron: number;
  oil: number;
  food: number;
  lastTickIso: string;
  hw: number;
  hi: number;
  ho: number;
  hn: number;
};

type Props = {
  cities: LiveTotalCity[];
  locale: string;
  unlocks: { iron: boolean; oil: boolean };
  labels: {
    resWood: string;
    resIron: string;
    resOil: string;
    resFood: string;
  };
};

function tickMs(iso: string): number {
  const t = new Date(iso).getTime();
  return Number.isFinite(t) ? t : Date.now();
}

function projected(
  base: number,
  hourlyNet: number,
  lastTickIso: string,
  now: number,
): number {
  const hours = Math.max(0, (now - tickMs(lastTickIso)) / 3600000);
  return Math.max(0, base + Math.floor(hourlyNet * hours));
}

export function LiveTotalStocks({
  cities,
  locale,
  unlocks,
  labels,
}: Props) {
  const initial = useMemo(() => {
    return {
      wood: cities.reduce((a, c) => a + c.wood, 0),
      iron: cities.reduce((a, c) => a + c.iron, 0),
      oil: cities.reduce((a, c) => a + c.oil, 0),
      food: cities.reduce((a, c) => a + c.food, 0),
    };
  }, [cities]);

  const [totals, setTotals] = useState(initial);

  useEffect(() => {
    setTotals(initial);
  }, [initial]);

  useEffect(() => {
    function tick() {
      const now = Date.now();
      const next = { wood: 0, iron: 0, oil: 0, food: 0 };
      for (const c of cities) {
        next.wood += projected(c.wood, c.hw, c.lastTickIso, now);
        next.iron += projected(c.iron, c.hi, c.lastTickIso, now);
        next.oil += projected(c.oil, c.ho, c.lastTickIso, now);
        next.food += projected(c.food, c.hn, c.lastTickIso, now);
      }
      setTotals(next);
    }
    tick();
    const id = window.setInterval(tick, 100);
    return () => window.clearInterval(id);
  }, [cities]);

  const loc = locale === "en" ? "en-US" : "tr-TR";
  const fmt = (n: number) => n.toLocaleString(loc);

  return (
    <div
      className="flex flex-wrap gap-x-4 gap-y-1 tabular-nums text-zinc-200"
      suppressHydrationWarning
    >
      <span className="inline-flex items-center gap-1">
        <ResourceIcon kind="wood" />
        {labels.resWood}: {fmt(totals.wood)}
      </span>
      {unlocks.iron && (
        <span className="inline-flex items-center gap-1">
          <ResourceIcon kind="iron" />
          {labels.resIron}: {fmt(totals.iron)}
        </span>
      )}
      {unlocks.oil && (
        <span className="inline-flex items-center gap-1">
          <ResourceIcon kind="oil" />
          {labels.resOil}: {fmt(totals.oil)}
        </span>
      )}
      <span className="inline-flex items-center gap-1">
        <ResourceIcon kind="food" />
        {labels.resFood}: {fmt(totals.food)}
      </span>
    </div>
  );
}

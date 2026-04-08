"use client";

import { ResourceIcon } from "@/components/game/ResourceIcon";
import { useRouter, useSearchParams } from "next/navigation";

type CityOpt = { id: string; name: string };

type PathKey = "buildings" | "research" | "production";

const PATH: Record<PathKey, string> = {
  buildings: "/buildings",
  research: "/research",
  production: "/production",
};

/** Binalar / teknoloji / üretim: şehir seçimi + seçili şehir hammaddeleri */
export function CityResourceBar({
  cities,
  selectLabel,
  page,
  wood,
  iron,
  oil,
  food,
  showIron,
  showOil,
}: {
  cities: CityOpt[];
  selectLabel: string;
  page: PathKey;
  wood: number;
  iron: number;
  oil: number;
  food: number;
  showIron: boolean;
  showOil: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (cities.length === 0) return null;

  const base = PATH[page];
  const current = searchParams.get("city") ?? cities[0]?.id ?? "";

  function setCity(id: string) {
    const q = new URLSearchParams(searchParams.toString());
    q.set("city", id);
    router.push(`${base}?${q.toString()}`);
  }

  return (
    <div
      className="mb-4 flex flex-col gap-3 border-b border-zinc-700/40 pb-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between"
      style={{ fontFamily: "var(--font-warcity), serif" }}
    >
      <div className="w-full max-w-md">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
          {selectLabel}
        </label>
        <select
          className="w-full rounded border border-amber-800/50 bg-black/50 px-3 py-2 text-sm text-zinc-100"
          value={current}
          onChange={(e) => setCity(e.target.value)}
        >
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-sm tabular-nums text-zinc-200">
        <span className="inline-flex items-center gap-1">
          <ResourceIcon kind="wood" />
          {wood}
        </span>
        {showIron ? (
          <span className="inline-flex items-center gap-1">
            <ResourceIcon kind="iron" />
            {iron}
          </span>
        ) : null}
        {showOil ? (
          <span className="inline-flex items-center gap-1">
            <ResourceIcon kind="oil" />
            {oil}
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1">
          <ResourceIcon kind="food" />
          {food}
        </span>
      </div>
    </div>
  );
}

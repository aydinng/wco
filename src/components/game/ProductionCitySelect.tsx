"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type CityOpt = { id: string; name: string };

/** Yalnızca /production: hızlı şehir seçimi (sol menü, oyun linklerinin altı) */
export function ProductionCitySelect({
  cities,
  label,
}: {
  cities: CityOpt[];
  label: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  if (pathname !== "/production" || cities.length < 2) return null;

  const current = searchParams.get("city") ?? cities[0]?.id ?? "";

  return (
    <div className="mb-3 w-full px-1">
      <label className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </label>
      <select
        className="w-full max-w-full rounded border border-zinc-600/70 bg-black/40 px-2 py-1 text-xs text-zinc-100"
        value={current}
        onChange={(e) => {
          const city = e.target.value;
          const q = new URLSearchParams(searchParams.toString());
          q.set("city", city);
          router.push(`/production?${q.toString()}`);
        }}
      >
        {cities.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}

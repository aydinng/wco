"use client";

import { useRouter, useSearchParams } from "next/navigation";

type CityOpt = { id: string; name: string };

/** Asker eğitimi sayfası: başlık altında şehir seçimi (sayfa yenilenmeden ?city=) */
export function ProductionCityPicker({
  cities,
  label,
}: {
  cities: CityOpt[];
  label: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (cities.length === 0) return null;

  const current = searchParams.get("city") ?? cities[0]?.id ?? "";

  return (
    <div className="mb-4 max-w-md">
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </label>
      <select
        className="w-full rounded border border-amber-800/50 bg-black/50 px-3 py-2 text-sm text-zinc-100"
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

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type CityOpt = { id: string; name: string };

type Props = {
  cities: CityOpt[];
  labels: {
    sectionTitle: string;
    name: string;
    payFrom: string;
    cx: string;
    cy: string;
    cz: string;
    submit: string;
    errGeneric: string;
  };
};

export function FoundCityForm({ cities, labels }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [payId, setPayId] = useState(cities[0]?.id ?? "");
  const [coordX, setCoordX] = useState(0);
  const [coordY, setCoordY] = useState(0);
  const [coordZ, setCoordZ] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/city/found", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          payFromCityId: payId,
          coordX,
          coordY,
          coordZ,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setErr(data.error ?? labels.errGeneric);
        return;
      }
      router.refresh();
      setName("");
    } finally {
      setLoading(false);
    }
  }

  if (cities.length === 0) return null;

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 rounded-lg border border-amber-800/50 bg-gradient-to-br from-amber-950/40 to-slate-900/50 p-4"
    >
      <h3 className="mb-3 text-sm font-semibold text-amber-100">
        {labels.sectionTitle}
      </h3>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block text-xs text-zinc-400">
          {labels.name}
          <input
            className="mt-1 w-full rounded border border-zinc-600 bg-black/30 px-2 py-1.5 text-sm text-zinc-100"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            maxLength={48}
          />
        </label>
        <label className="block max-w-[10rem] text-xs text-zinc-400">
          {labels.payFrom}
          <select
            className="mt-1 w-full max-w-[10rem] rounded border border-zinc-600 bg-black/30 px-1.5 py-1 text-xs text-zinc-100"
            value={payId}
            onChange={(e) => setPayId(e.target.value)}
          >
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs text-zinc-400">
          {labels.cx}
          <input
            type="number"
            className="mt-1 w-full rounded border border-zinc-600 bg-black/30 px-2 py-1.5 text-sm text-zinc-100"
            value={coordX}
            onChange={(e) => setCoordX(Number(e.target.value))}
          />
        </label>
        <label className="block text-xs text-zinc-400">
          {labels.cy}
          <input
            type="number"
            className="mt-1 w-full rounded border border-zinc-600 bg-black/30 px-2 py-1.5 text-sm text-zinc-100"
            value={coordY}
            onChange={(e) => setCoordY(Number(e.target.value))}
          />
        </label>
        <label className="block text-xs text-zinc-400 sm:col-span-2">
          {labels.cz}
          <input
            type="number"
            className="mt-1 w-full rounded border border-zinc-600 bg-black/30 px-2 py-1.5 text-sm text-zinc-100"
            value={coordZ}
            onChange={(e) => setCoordZ(Number(e.target.value))}
          />
        </label>
      </div>
      {err && <p className="mt-2 text-xs text-red-400">{err}</p>}
      <button
        type="submit"
        disabled={loading}
        className="mt-4 rounded bg-amber-700/80 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50"
      >
        {loading ? "…" : labels.submit}
      </button>
    </form>
  );
}

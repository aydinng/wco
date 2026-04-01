"use client";

import { assignWorkers } from "@/app/actions/game-city";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  cityId: string;
  population: number;
  initial: {
    workersWood: number;
    workersIron: number;
    workersOil: number;
    workersFood: number;
  };
  saveLabel: string;
  showIron: boolean;
  showOil: boolean;
  labels: {
    w: string;
    i: string;
    o: string;
    f: string;
  };
  onSaved?: () => void;
};

export function WorkersAssignForm({
  cityId,
  population,
  initial,
  saveLabel,
  showIron,
  showOil,
  labels,
  onSaved,
}: Props) {
  const router = useRouter();
  const [ww, setWw] = useState(initial.workersWood);
  const [wi, setWi] = useState(showIron ? initial.workersIron : 0);
  const [wo, setWo] = useState(showOil ? initial.workersOil : 0);
  const [wf, setWf] = useState(initial.workersFood);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const sum = ww + wi + wo + wf;
  const over = sum > population;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const r = await assignWorkers(
        cityId,
        ww,
        showIron ? wi : 0,
        showOil ? wo : 0,
        wf,
      );
      if (!r.ok) setErr(r.error);
      else {
        router.refresh();
        onSaved?.();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-2 sm:grid-cols-2">
      <label className="text-xs text-zinc-400">
        {labels.w}
        <input
          type="number"
          min={0}
          className="mt-0.5 w-full rounded border border-[#2a3441] bg-black/40 px-2 py-1 text-zinc-100"
          value={ww}
          onChange={(e) => setWw(Number(e.target.value))}
        />
      </label>
      {showIron && (
        <label className="text-xs text-zinc-400">
          {labels.i}
          <input
            type="number"
            min={0}
            className="mt-0.5 w-full rounded border border-[#2a3441] bg-black/40 px-2 py-1 text-zinc-100"
            value={wi}
            onChange={(e) => setWi(Number(e.target.value))}
          />
        </label>
      )}
      {showOil && (
        <label className="text-xs text-zinc-400">
          {labels.o}
          <input
            type="number"
            min={0}
            className="mt-0.5 w-full rounded border border-[#2a3441] bg-black/40 px-2 py-1 text-zinc-100"
            value={wo}
            onChange={(e) => setWo(Number(e.target.value))}
          />
        </label>
      )}
      <label className="text-xs text-zinc-400">
        {labels.f}
        <input
          type="number"
          min={0}
          className="mt-0.5 w-full rounded border border-[#2a3441] bg-black/40 px-2 py-1 text-zinc-100"
          value={wf}
          onChange={(e) => setWf(Number(e.target.value))}
        />
      </label>
      <div className="sm:col-span-2 flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={busy || over}
          className="rounded bg-amber-900/70 px-3 py-1.5 text-sm text-amber-50 hover:bg-amber-800 disabled:opacity-40"
        >
          {saveLabel}
        </button>
        <span className="text-xs text-zinc-500">
          Σ {sum} / {population}
          {over && (
            <span className="ml-2 text-red-400"> (max {population})</span>
          )}
        </span>
      </div>
      {err && <p className="sm:col-span-2 text-xs text-red-400">{err}</p>}
    </form>
  );
}

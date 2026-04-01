"use client";

import { trainSoldiers } from "@/app/actions/game-city";
import { soldierCap } from "@/lib/economy";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  cityId: string;
  cityName: string;
  barracksLevel: number;
  soldiers: number;
  trainBtn: string;
  amountLabel: string;
  capLabel: string;
  costHint: string;
  trainNeedBarracks: string;
};

export function TrainSoldiersForm({
  cityId,
  cityName,
  barracksLevel,
  soldiers,
  trainBtn,
  amountLabel,
  capLabel,
  costHint,
  trainNeedBarracks,
}: Props) {
  const router = useRouter();
  const [n, setN] = useState(10);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const cap = soldierCap(barracksLevel);
  const room = Math.max(0, cap - soldiers);
  const noBarracks = barracksLevel < 1;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const r = await trainSoldiers(cityId, n);
      if (!r.ok) setErr(r.error);
      else router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (noBarracks) {
    return (
      <div className="border-b border-[#2a3441]/60 pb-3 text-sm text-amber-600/90">
        <div className="font-medium text-amber-200/90">{cityName}</div>
        <p className="mt-1 text-xs">{trainNeedBarracks}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-wrap items-end gap-2 border-b border-[#2a3441]/60 pb-3"
    >
      <div className="min-w-[140px]">
        <div className="text-xs font-medium text-amber-200/90">{cityName}</div>
        <div className="text-[11px] text-zinc-500">
          {capLabel}: {soldiers} / {cap}
        </div>
      </div>
      <label className="text-xs text-zinc-400">
        {amountLabel}
        <input
          type="number"
          min={1}
          max={room || 1}
          className="mt-0.5 w-24 rounded border border-[#2a3441] bg-black/40 px-2 py-1 text-zinc-100"
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
        />
      </label>
      <button
        type="submit"
        disabled={busy || room < 1}
        className="rounded bg-slate-800 px-3 py-1.5 text-xs text-zinc-100 hover:bg-slate-700 disabled:opacity-40"
      >
        {trainBtn}
      </button>
      <span className="text-[10px] text-zinc-600">{costHint}</span>
      {err && <span className="w-full text-xs text-red-400">{err}</span>}
    </form>
  );
}

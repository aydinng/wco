"use client";

import { queueTrainUnit } from "@/app/actions/game-city";
import type { UnitId } from "@/config/units";
import { useRouter } from "next/navigation";
import { useState } from "react";

const BATCH_AMOUNTS = [1, 5, 10, 50] as const;

type Props = {
  cityId: string;
  unitId: string;
  locked: boolean;
  trainLabel: string;
  lockedLabel: string;
};

export function UnitTrainRow({
  cityId,
  unitId,
  locked,
  trainLabel,
  lockedLabel,
}: Props) {
  const router = useRouter();
  const [amount, setAmount] = useState<(typeof BATCH_AMOUNTS)[number]>(1);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onTrain() {
    setErr(null);
    setBusy(true);
    try {
      const r = await queueTrainUnit(cityId, unitId as UnitId, amount);
      if (!r.ok) setErr(r.error);
      else router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (locked) {
    return (
      <span className="rounded border border-zinc-600 bg-black/50 px-2 py-1.5 text-xs text-zinc-500">
        {lockedLabel}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <select
        value={amount}
        onChange={(e) =>
          setAmount(Number(e.target.value) as (typeof BATCH_AMOUNTS)[number])
        }
        className="h-9 min-w-[4.5rem] cursor-pointer rounded border border-amber-700/60 bg-black/60 px-2 text-sm tabular-nums text-amber-100"
        aria-label="Batch size"
      >
        {BATCH_AMOUNTS.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={busy}
        onClick={onTrain}
        className="h-9 min-w-[5.5rem] rounded border border-amber-600/90 bg-amber-950/50 px-3 text-sm font-semibold text-amber-100 shadow-inner hover:bg-amber-900/40 disabled:opacity-50"
      >
        {busy ? "…" : trainLabel}
      </button>
      {err ? (
        <span className="max-w-[200px] text-xs leading-tight text-red-400">
          {err}
        </span>
      ) : null}
    </div>
  );
}

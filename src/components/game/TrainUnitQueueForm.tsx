"use client";

import { queueTrainUnit } from "@/app/actions/game-city";
import type { UnitId, UnitSpec } from "@/config/units";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type JobRow = {
  id: string;
  unitId: string;
  completesAt: string;
};

type Props = {
  cityId: string;
  cityName: string;
  units: UnitSpec[];
  jobs: JobRow[];
  labels: {
    trainBtn: string;
    amountLabel: string;
    queueLabel: string;
  };
};

function fmtEta(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export function TrainUnitQueueForm({ cityId, cityName, units, jobs, labels }: Props) {
  const router = useRouter();
  const [unitId, setUnitId] = useState<string>(units[0]?.id ?? "mizrakci");
  const [n, setN] = useState(1);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [clock, setClock] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setClock(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const unitName = useMemo(() => {
    return units.find((u) => u.id === unitId)?.name ?? unitId;
  }, [unitId, units]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const r = await queueTrainUnit(cityId, unitId as UnitId, n);
      if (!r.ok) setErr(r.error);
      else {
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  const MAX_Q = 3;
  const remainingSlots = Math.max(0, MAX_Q - jobs.length);
  const maxAdd = Math.max(1, Math.min(MAX_Q, remainingSlots));

  return (
    <div className="rounded-xl border border-zinc-700/70 bg-zinc-900/40 p-3 shadow-inner backdrop-blur-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="text-sm font-semibold text-amber-200/90">{cityName}</div>
        <div className="text-xs text-zinc-400">
          {labels.queueLabel}:{" "}
          <span className="tabular-nums text-zinc-200">{jobs.length}/3</span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-2">
        <label className="text-xs text-zinc-400">
          Asker
          <select
            className="mt-0.5 w-48 rounded border border-[#2a3441] bg-black/40 px-2 py-1 text-zinc-100"
            value={unitId}
            onChange={(e) => setUnitId(e.target.value)}
          >
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-zinc-400">
          {labels.amountLabel}
          <input
            type="number"
            min={1}
            max={maxAdd}
            className="mt-0.5 w-20 rounded border border-[#2a3441] bg-black/40 px-2 py-1 text-zinc-100"
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
          />
        </label>
        <button
          type="submit"
          disabled={busy || remainingSlots < 1}
          className="rounded bg-slate-800 px-3 py-1.5 text-xs text-zinc-100 hover:bg-slate-700 disabled:opacity-40"
        >
          {busy ? "…" : labels.trainBtn}
        </button>
        <span className="text-[11px] text-zinc-500">
          Seçili: <span className="text-amber-200/80">{unitName}</span>
        </span>
      </form>

      {err && <p className="mt-2 text-xs text-red-400">{err}</p>}

      {jobs.length > 0 && (
        <div className="mt-3 rounded-lg border border-zinc-700/55 bg-black/20 p-2">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Kuyruk
          </div>
          <ul className="space-y-1 text-xs text-zinc-300">
            {jobs.slice(0, 3).map((j, i) => {
              const end = new Date(j.completesAt).getTime();
              const sec = Math.max(0, Math.ceil((end - clock) / 1000));
              const nm = units.find((u) => u.id === (j.unitId as any))?.name ?? j.unitId;
              return (
                <li
                  key={j.id}
                  className="flex items-center justify-between gap-2 border-b border-zinc-700/40 pb-1 last:border-b-0 last:pb-0"
                >
                  <span className="min-w-0 truncate">
                    {i + 1}. {nm}
                  </span>
                  <span className="shrink-0 tabular-nums text-zinc-300">
                    {fmtEta(sec)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}


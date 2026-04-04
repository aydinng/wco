"use client";

import { useEffect, useState } from "react";

type Job = {
  id: string;
  unitId: string;
  unitName: string;
  quantity: number;
  completesAt: string;
};

function fmtEta(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export function TrainingQueueBar({
  jobs,
  queueLabel,
  emptyHint,
}: {
  jobs: Job[];
  queueLabel: string;
  emptyHint: string;
}) {
  const [clock, setClock] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setClock(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mb-6 rounded-lg border border-amber-900/45 bg-black/35 px-3 py-2">
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {queueLabel}{" "}
        <span className="tabular-nums text-zinc-400">
          ({jobs.length}/3)
        </span>
      </div>
      {jobs.length === 0 ? (
        <p className="text-sm text-zinc-500">{emptyHint}</p>
      ) : (
        <ul className="space-y-1.5">
          {jobs.map((j, i) => {
            const end = new Date(j.completesAt).getTime();
            const sec = Math.max(0, Math.ceil((end - clock) / 1000));
            return (
              <li
                key={j.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-1.5 text-sm last:border-b-0 last:pb-0"
              >
                <span className="min-w-0 text-zinc-200">
                  <span className="text-zinc-500">{i + 1}.</span>{" "}
                  {j.quantity > 1 ? (
                    <span className="tabular-nums text-amber-200/90">
                      ×{j.quantity}{" "}
                    </span>
                  ) : null}
                  {j.unitName}
                </span>
                <span className="shrink-0 tabular-nums text-amber-100/90">
                  {fmtEta(sec)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

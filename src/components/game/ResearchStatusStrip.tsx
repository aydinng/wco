"use client";

import type { AppLocale } from "@/lib/locale";
import { useEffect, useState } from "react";

function fmtEta(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`
    : `${m}:${String(r).padStart(2, "0")}`;
}

type EraJob = { techKey: string; completesAt: string; name: string };

export function ResearchStatusStrip({
  locale,
  researchJobEndsAtIso,
  eraJobs,
  maxEraQueue,
}: {
  locale: AppLocale;
  researchJobEndsAtIso: string | null;
  eraJobs: EraJob[];
  maxEraQueue: number;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const empireEnd = researchJobEndsAtIso
    ? new Date(researchJobEndsAtIso).getTime()
    : 0;
  const empireBusy = empireEnd > now;
  const empireEtaSec = empireBusy
    ? Math.max(0, Math.ceil((empireEnd - now) / 1000))
    : 0;

  const tr = locale === "en";

  return (
    <div className="mb-4 space-y-3 rounded-lg border border-amber-900/45 bg-zinc-950/80 px-3 py-3 text-sm shadow-inner ring-1 ring-white/5">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-b border-zinc-800/90 pb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          {tr ? "Empire tier" : "İmparatorluk"}
        </span>
        {empireBusy ? (
          <span className="text-zinc-200">
            {tr ? "Time left:" : "Kalan:"}{" "}
            <span className="tabular-nums font-semibold text-amber-100">
              {fmtEta(empireEtaSec)}
            </span>
          </span>
        ) : (
          <span className="text-zinc-500">{tr ? "(idle)" : "(boş)"}</span>
        )}
      </div>

      <div>
        <span className="font-semibold text-amber-200/95">
          {tr ? "Technology queue" : "Teknoloji kuyruğu"}
        </span>
        <span className="ml-2 tabular-nums text-zinc-400">
          {eraJobs.length}/{maxEraQueue}
        </span>
        {eraJobs.length > 0 ? (
          <ul className="mt-2 space-y-1 border-t border-zinc-800/80 pt-2 text-zinc-300">
            {eraJobs.map((j) => {
              const end = new Date(j.completesAt).getTime();
              const sec = Math.max(0, Math.ceil((end - now) / 1000));
              return (
                <li key={j.techKey} className="flex flex-wrap justify-between gap-2">
                  <span className="text-amber-100/90">{j.name}</span>
                  <span className="tabular-nums text-zinc-200">
                    {tr ? "ETA" : "Kalan"} {fmtEta(sec)}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-1 text-xs text-zinc-500">
            {tr ? "No research in queue." : "Kuyrukta araştırma yok."}
          </p>
        )}
      </div>
    </div>
  );
}

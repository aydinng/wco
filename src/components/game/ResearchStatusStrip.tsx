"use client";

import type { AppLocale } from "@/lib/locale";
import { formatCountdownSeconds } from "@/lib/format-countdown";
import { useEffect, useState } from "react";

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
      {empireBusy ? (
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-b border-zinc-800/90 pb-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            {tr ? "Empire research" : "İmparatorluk araştırması"}
          </span>
          <span className="text-zinc-200">
            {tr ? "Time left:" : "Kalan süre:"}{" "}
            <span className="tabular-nums font-semibold text-amber-100">
              {formatCountdownSeconds(empireEtaSec, locale)}
            </span>
          </span>
        </div>
      ) : null}

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
                    {tr ? "Remaining" : "Kalan"}{" "}
                    {formatCountdownSeconds(sec, locale)}
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

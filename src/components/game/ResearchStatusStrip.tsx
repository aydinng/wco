"use client";

import type { AppLocale } from "@/lib/locale";
import { formatCountdownSeconds } from "@/lib/format-countdown";
import { useEffect, useState } from "react";

export function ResearchStatusStrip({
  locale,
  researchJobEndsAtIso,
}: {
  locale: AppLocale;
  researchJobEndsAtIso: string | null;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const tr = locale === "en";

  if (!researchJobEndsAtIso) return null;

  const empireEnd = new Date(researchJobEndsAtIso).getTime();
  const empireBusy = empireEnd > now;
  if (!empireBusy) return null;

  const empireEtaSec = Math.max(0, Math.ceil((empireEnd - now) / 1000));

  return (
    <div className="mb-4 rounded-lg border border-amber-900/45 bg-zinc-950/80 px-3 py-3 text-sm shadow-inner ring-1 ring-white/5">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
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
    </div>
  );
}

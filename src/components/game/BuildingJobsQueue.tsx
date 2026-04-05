"use client";

import { buildingJobSummaryLine } from "@/lib/building-i18n";
import { formatCountdownSeconds } from "@/lib/format-countdown";
import type { AppLocale } from "@/lib/locale";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useCountdownIso } from "@/components/game/useCountdownIso";

export type BuildingJobQueueItem = {
  id: string;
  /** null = sırada; henüz süre işlemiyor */
  completesAtIso: string | null;
  cityName: string;
  buildingId: string;
  toLevel: number;
};

function ActiveQueueRow({
  job,
  locale,
  onComplete,
}: {
  job: BuildingJobQueueItem;
  locale: AppLocale;
  onComplete: () => void;
}) {
  const completesAtIso = job.completesAtIso!;
  const sec = useCountdownIso(completesAtIso);
  const prevSec = useRef<number | null>(null);

  useEffect(() => {
    if (
      prevSec.current !== null &&
      prevSec.current > 0 &&
      sec === 0
    ) {
      onComplete();
    }
    prevSec.current = sec;
  }, [sec, onComplete]);

  const line = buildingJobSummaryLine(job.buildingId, job.toLevel, locale);
  const tr = locale !== "en";

  return (
    <div className="rounded border border-amber-900/40 bg-black/50 px-3 py-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
        <span className="min-w-0 font-medium text-amber-100/95">
          <span className="text-zinc-400">
            {tr ? "Şehir:" : "City:"}{" "}
          </span>
          {job.cityName}
        </span>
        <span className="tabular-nums font-semibold text-amber-200">
          {sec > 0 ? formatCountdownSeconds(sec, locale) : tr ? "0 sn" : "0s"}
        </span>
      </div>
      <p className="mt-0.5 text-xs text-zinc-300">{line}</p>
      <p className="mt-1 text-[10px] text-emerald-400/90">
        {tr ? "Süre işliyor" : "Timer running"}
      </p>
    </div>
  );
}

function PendingQueueRow({
  job,
  locale,
}: {
  job: BuildingJobQueueItem;
  locale: AppLocale;
}) {
  const line = buildingJobSummaryLine(job.buildingId, job.toLevel, locale);
  const tr = locale !== "en";

  return (
    <div className="rounded border border-zinc-600/60 bg-black/40 px-3 py-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
        <span className="min-w-0 font-medium text-zinc-300">
          <span className="text-zinc-500">
            {tr ? "Şehir:" : "City:"}{" "}
          </span>
          {job.cityName}
        </span>
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          {tr ? "Sırada" : "Queued"}
        </span>
      </div>
      <p className="mt-0.5 text-xs text-zinc-400">{line}</p>
      <p className="mt-1 text-[10px] leading-snug text-zinc-500">
        {tr
          ? "Birinci iş bitene kadar süre başlamaz."
          : "Timer starts after the first job completes."}
      </p>
    </div>
  );
}

export function BuildingJobsQueue({
  jobs,
  locale,
  heading,
  emptyLabel,
}: {
  jobs: BuildingJobQueueItem[];
  locale: AppLocale;
  heading: string;
  emptyLabel: string;
}) {
  const router = useRouter();
  const refresh = () => router.refresh();

  return (
    <div className="mb-6 space-y-2">
      <p
        className="text-center text-xs font-semibold uppercase tracking-wide text-amber-600/90"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        {heading}
      </p>
      {jobs.length === 0 ? (
        <p className="text-center text-sm text-zinc-500">{emptyLabel}</p>
      ) : (
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
          {jobs.map((j) =>
            j.completesAtIso ? (
              <ActiveQueueRow
                key={j.id}
                job={j}
                locale={locale}
                onComplete={refresh}
              />
            ) : (
              <PendingQueueRow key={j.id} job={j} locale={locale} />
            ),
          )}
        </div>
      )}
    </div>
  );
}

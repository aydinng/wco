"use client";

import {
  cancelEraTechResearch,
  startEraTechResearch,
} from "@/app/actions/era-tech";
import { CatalogFieldLine } from "@/components/game/CatalogGameRow";
import {
  CATALOG_MIDDLE_COL,
  CATALOG_NAME_COL,
  CATALOG_ROW_GRID_TECH,
  CATALOG_TITLE_YELLOW,
} from "@/components/game/catalog-layout";
import { ResourceIcon } from "@/components/game/ResourceIcon";
import type { TechCatalogEntry } from "@/config/technology-catalog";
import {
  eraTechResearchCost,
  isOneShotEraTech,
  requiredEraIndexForTech,
  scaledEraTechDurationSec,
} from "@/config/technology-catalog";
import { eraIndex, getResourceUnlocks } from "@/config/eras";
import type { Dictionary } from "@/i18n/dictionaries";
import type { AppLocale } from "@/lib/locale";
import { formatCountdownSeconds } from "@/lib/format-countdown";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

function fmtEta(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

type EraJob = {
  id: string;
  techKey: string;
  completesAt: string | null;
  cityId: string;
};

type Props = {
  entry: TechCatalogEntry;
  locale: AppLocale;
  play: Dictionary["play"];
  playerEra: string;
  cityId: string;
  level: number;
  activeJobs: EraJob[];
  maxQueue: number;
};

export function EraTechResearchRow({
  entry,
  locale,
  play,
  playerEra,
  cityId,
  level,
  activeJobs,
  maxQueue,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [clock, setClock] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setClock(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const need = requiredEraIndexForTech(entry.eraOrdinal);
  const lockedByEra = eraIndex(playerEra) < need;
  const oneShot = isOneShotEraTech(entry);
  const done = oneShot && level >= 1;

  const thisJob = activeJobs.find((j) => j.techKey === entry.id) ?? null;
  const queueFull = activeJobs.length >= maxQueue && !thisJob;
  const hasJob = thisJob != null;
  /** Kuyruk varken hedef seviye (iş bitince); yoksa DB seviyesi */
  const displayLevel = hasJob ? level + 1 : level;
  const oneShotQueued = oneShot && hasJob;

  /** Sonraki adımın maliyet/süre önizlemesi (iş bitinceki bir sonraki araştırma) */
  const nextCostTargetLevel = hasJob ? level + 2 : level + 1;
  const nextDurFromLevel = hasJob ? level + 1 : level;
  const needPreviewCost =
    !lockedByEra && !done && !oneShotQueued && !queueFull;

  const cost = needPreviewCost
    ? eraTechResearchCost(entry, nextCostTargetLevel)
    : { wood: 0, iron: 0, oil: 0, food: 0 };
  const unlocks = getResourceUnlocks(playerEra);
  const nextDurSec = needPreviewCost
    ? scaledEraTechDurationSec(entry, nextDurFromLevel)
    : 0;

  const name = locale === "en" ? entry.nameEn : entry.nameTr;
  const goal = locale === "en" ? entry.goalEn : entry.goalTr;
  const ageStr = String(entry.eraOrdinal);

  const durLabel = oneShotQueued
    ? "—"
    : nextDurSec < 1
      ? locale === "en"
        ? "Instant"
        : "Anında"
      : formatCountdownSeconds(nextDurSec, locale);

  const waitingInLine = thisJob != null && thisJob.completesAt == null;

  const etaSec =
    thisJob?.completesAt != null
      ? Math.max(
          0,
          Math.ceil(
            (new Date(thisJob.completesAt).getTime() - clock) / 1000,
          ),
        )
      : 0;

  async function onResearch() {
    setErr(null);
    setBusy(true);
    try {
      const r = await startEraTechResearch(cityId, entry.id);
      if (!r.ok) setErr(r.error);
      else router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function onCancel() {
    if (!thisJob?.id) return;
    setErr(null);
    setBusy(true);
    try {
      const r = await cancelEraTechResearch(thisJob.id);
      if (!r.ok) setErr(r.error);
      else router.refresh();
    } finally {
      setBusy(false);
    }
  }

  const labels = {
    research: locale === "en" ? "Research" : "Araştır",
    done: locale === "en" ? "Completed" : "Tamamlandı",
    locked: locale === "en" ? "Locked" : "Kilitli",
    queued: locale === "en" ? "Queue full" : "Kuyruk dolu",
    level: locale === "en" ? "Level" : "Seviye",
    cancel: locale === "en" ? "Cancel" : "İptal",
  };

  const showIron = unlocks.iron && cost.iron > 0;
  const showOil = unlocks.oil && cost.oil > 0;

  let button: ReactNode;
  if (lockedByEra) {
    button = (
      <span className="rounded border border-zinc-600 bg-black/50 px-3 py-2 text-center text-sm text-zinc-500">
        {labels.locked}
      </span>
    );
  } else if (done) {
    button = (
      <span className="rounded border border-emerald-700/80 bg-emerald-950/40 px-3 py-2 text-center text-sm font-semibold text-emerald-200/95">
        {labels.done}
      </span>
    );
  } else if (queueFull) {
    button = (
      <span className="rounded border border-amber-800/60 bg-black/40 px-3 py-2 text-center text-xs text-zinc-500">
        {labels.queued}
      </span>
    );
  } else if (thisJob && waitingInLine) {
    button = (
      <div className="flex w-full min-w-0 flex-col items-end gap-2 sm:flex-row sm:items-center sm:justify-end">
        <div className="text-right">
          <p className="text-xs font-semibold text-amber-200/95">
            {play.buildingUpgradePending}
          </p>
          <p className="mt-0.5 max-w-[14rem] text-[10px] leading-tight text-zinc-500">
            {locale === "en"
              ? "Timer starts when the first job finishes"
              : "İlk iş bitince süre başlar"}
          </p>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={onCancel}
          className="shrink-0 rounded border border-red-800/70 bg-red-950/40 px-3 py-2 text-xs font-semibold text-red-100 hover:bg-red-900/50 disabled:opacity-40"
        >
          {labels.cancel}
        </button>
      </div>
    );
  } else if (thisJob) {
    button = (
      <div className="flex w-full min-w-0 flex-col items-end gap-2 sm:flex-row sm:items-center sm:justify-end">
        <div className="text-right">
          <p className="text-xs font-semibold text-amber-200/95">
            {play.buildingUpgradePending}
          </p>
          <p className="tabular-nums text-lg font-semibold text-amber-100">
            {fmtEta(etaSec)}
          </p>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={onCancel}
          className="shrink-0 rounded border border-red-800/70 bg-red-950/40 px-3 py-2 text-xs font-semibold text-red-100 hover:bg-red-900/50 disabled:opacity-40"
        >
          {labels.cancel}
        </button>
      </div>
    );
  } else {
    button = (
      <button
        type="button"
        disabled={busy}
        onClick={onResearch}
        className="shrink-0 rounded border border-amber-900/50 bg-amber-950/40 px-3 py-2 text-sm font-semibold text-amber-100 hover:bg-amber-900/50 disabled:opacity-40"
      >
        {busy ? "…" : labels.research}
      </button>
    );
  }

  const resourceLine = (
    <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-2 gap-y-0.5 text-xs tabular-nums text-zinc-400">
      <span className="inline-flex items-center gap-0.5">
        <ResourceIcon kind="wood" />
        {cost.wood}
      </span>
      {showIron ? (
        <span className="inline-flex items-center gap-0.5">
          <ResourceIcon kind="iron" />
          {cost.iron}
        </span>
      ) : null}
      {showOil ? (
        <span className="inline-flex items-center gap-0.5">
          <ResourceIcon kind="oil" />
          {cost.oil}
        </span>
      ) : null}
      <span className="inline-flex items-center gap-0.5">
        <ResourceIcon kind="food" />
        {cost.food}
      </span>
    </div>
  );

  const costRow =
    !lockedByEra && !done && needPreviewCost ? (
      <>
        <div className="text-right leading-tight">
          <div className="text-[11px] font-semibold tabular-nums text-sky-300/95">
            {play.catalogFieldLevel}{" "}
            <span className="text-sky-100">{Math.max(0, displayLevel)}</span>
          </div>
          <div className="mt-0.5 text-[10px] tabular-nums text-sky-200/90">
            {nextDurSec > 0
              ? formatCountdownSeconds(nextDurSec, locale)
              : durLabel}
          </div>
        </div>
        <div className="flex w-full min-w-0 flex-row flex-wrap items-center justify-end gap-2">
          {resourceLine}
          {button}
        </div>
      </>
    ) : (
      <div className="flex w-full justify-end">{button}</div>
    );

  return (
    <div
      className="border-b border-blue-950/70"
      style={{ fontFamily: "var(--font-warcity), serif" }}
    >
      <div
        className={CATALOG_ROW_GRID_TECH}
        style={{
          background:
            "linear-gradient(90deg, rgba(61,46,26,0.92) 0%, rgba(26,21,16,0.88) 45%, rgba(0,0,0,0.96) 100%)",
        }}
      >
        <div className={CATALOG_NAME_COL}>
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-blue-950/50 bg-black/50">
            <Image
              src={entry.imageSrc}
              alt=""
              fill
              className="object-cover object-center"
              sizes="56px"
            />
          </div>
          <span className={CATALOG_TITLE_YELLOW}>{name}</span>
        </div>

        <div className={CATALOG_MIDDLE_COL}>
          <CatalogFieldLine
            label={play.catalogFieldTime}
            value={durLabel}
            labelClassName="text-sky-400"
            valueClassName="text-sky-100"
          />
          <CatalogFieldLine
            label={play.catalogFieldAge}
            value={ageStr}
            labelClassName="text-sky-400"
            valueClassName="text-sky-100"
          />
          <CatalogFieldLine
            label={labels.level}
            value={String(Math.max(0, displayLevel))}
            labelClassName="text-sky-400"
            valueClassName="text-sky-100"
          />
          <CatalogFieldLine
            label={play.catalogFieldPurpose}
            value={goal}
            labelClassName="text-sky-400"
            valueClassName="text-sky-50 line-clamp-3"
          />
        </div>

        <div className="flex min-w-0 flex-col items-stretch justify-center gap-1.5 sm:items-end">
          <div className="flex w-full min-w-0 flex-col gap-1">{costRow}</div>
          {err ? (
            <p className="max-w-[14rem] text-right text-xs text-red-400">{err}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

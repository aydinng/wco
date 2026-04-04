"use client";

import { startEraTechResearch } from "@/app/actions/era-tech";
import { CatalogFieldLine } from "@/components/game/CatalogGameRow";
import {
  CATALOG_MIDDLE_COL,
  CATALOG_NAME_COL,
  CATALOG_ROW_GRID_TECH,
  CATALOG_TITLE_YELLOW,
} from "@/components/game/catalog-layout";
import type { TechCatalogEntry } from "@/config/technology-catalog";
import {
  eraTechResearchCost,
  requiredEraIndexForTech,
} from "@/config/technology-catalog";
import { eraIndex } from "@/config/eras";
import type { Dictionary } from "@/i18n/dictionaries";
import type { AppLocale } from "@/lib/locale";
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

type Props = {
  entry: TechCatalogEntry;
  locale: AppLocale;
  play: Dictionary["play"];
  playerEra: string;
  cityId: string;
  level: number;
  activeJobs: { techKey: string; completesAt: string }[];
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
  const done = level >= 1;
  const cost = eraTechResearchCost(entry);

  const name = locale === "en" ? entry.nameEn : entry.nameTr;
  const durLabel = locale === "en" ? entry.durationEn : entry.durationTr;
  const goal = locale === "en" ? entry.goalEn : entry.goalTr;
  const ageStr = String(entry.eraOrdinal);

  const thisJob = activeJobs.find((j) => j.techKey === entry.id) ?? null;
  const queueFull =
    activeJobs.length >= maxQueue && !thisJob;

  const etaSec = thisJob
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

  const labels = {
    research: locale === "en" ? "Research" : "Araştır",
    done: locale === "en" ? "Completed" : "Tamamlandı",
    locked: locale === "en" ? "Locked" : "Kilitli",
    queued: locale === "en" ? "Queue full" : "Kuyruk dolu",
    cost:
      locale === "en"
        ? `Cost: ${cost.wood} W · ${cost.iron} I · ${cost.oil} O · ${cost.food} F`
        : `Maliyet: ${cost.wood} O · ${cost.iron} D · ${cost.oil} P · ${cost.food} B`,
  };

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
  } else if (thisJob) {
    button = (
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-xs font-semibold uppercase tracking-wide text-amber-400/90">
          {locale === "en" ? "Researching" : "Araştırılıyor"}
        </span>
        <span className="tabular-nums text-lg font-semibold text-amber-100">
          {fmtEta(etaSec)}
        </span>
      </div>
    );
  } else {
    button = (
      <button
        type="button"
        disabled={busy}
        onClick={onResearch}
        className="min-w-[7rem] rounded border border-amber-600/90 bg-amber-950/50 px-4 py-2 text-center text-sm font-semibold text-amber-100 shadow-inner hover:bg-amber-900/45 disabled:opacity-50"
      >
        {busy ? "…" : labels.research}
      </button>
    );
  }

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
            label={play.catalogFieldLevel}
            value={String(Math.min(1, Math.max(0, level)))}
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

        <div className="flex min-w-0 flex-col items-center justify-center gap-2">
          {button}
          {!lockedByEra && !done ? (
            <p className="max-w-[18rem] text-center text-[11px] leading-tight text-zinc-500">
              {labels.cost}
            </p>
          ) : null}
          {err ? (
            <p className="max-w-[14rem] text-center text-xs text-red-400">{err}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

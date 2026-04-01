import { CatalogFieldLine } from "@/components/game/CatalogGameRow";
import {
  ERA_ORDER,
  eraOrdinalNumber,
  getEraDisplayName,
  getEraConfig,
  eraIndex,
} from "@/config/eras";
import type { UnitSpec } from "@/config/units";
import type { Dictionary } from "@/i18n/dictionaries";
import type { AppLocale } from "@/lib/locale";
import Image from "next/image";
import Link from "next/link";

function fmtDuration(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${String(r).padStart(2, "0")}s`;
}

function purposeText(
  p: UnitSpec["purpose"],
  locale: AppLocale,
): string {
  if (locale === "en") {
    if (p === "saldırı") return "Attack";
    if (p === "koruma") return "Defense";
    return "Attack/Defense";
  }
  if (p === "saldırı") return "Saldırı";
  if (p === "koruma") return "Koruma";
  return "Saldırı/Koruma";
}

type Props = {
  units: UnitSpec[];
  playerEra?: string | null;
  play: Dictionary["play"];
  locale: AppLocale;
};

export function UnitCatalog({ units, playerEra, play, locale }: Props) {
  if (units.length === 0) return null;
  const pIdx = eraIndex(playerEra);

  const sections = ERA_ORDER.map((eraId) => {
    const list = units
      .filter((u) => u.minEra === eraId)
      .sort((a, b) => a.name.localeCompare(b.name, locale === "en" ? "en" : "tr"));
    if (list.length === 0) return null;
    const cfg = getEraConfig(eraId);
    const eraName = getEraDisplayName(cfg, locale);
    return { eraId, list, eraName };
  }).filter(Boolean) as {
    eraId: string;
    list: UnitSpec[];
    eraName: string;
  }[];

  return (
    <div className="mb-6 w-full space-y-8 overflow-hidden rounded-lg border border-zinc-700/70">
      {sections.map(({ eraId, list, eraName }) => (
        <div key={eraId}>
          <div className="mb-2 w-full rounded bg-red-800 px-3 py-2 text-center shadow-inner">
            <span className="text-sm font-bold tracking-wide text-white">
              {eraName}
            </span>
          </div>
          <div>
            {list.map((u) => {
              const locked = eraIndex(u.minEra) > pIdx;
              const ageNum = eraOrdinalNumber(u.minEra);
              return (
                <div
                  key={u.id}
                  id={`unit-${u.id}`}
                  className="border-b border-blue-950/70"
                  style={{ fontFamily: "var(--font-warcity), serif" }}
                >
                  <div
                    className="flex w-full max-w-none flex-row flex-wrap items-stretch gap-2 px-2 py-2 sm:gap-4 sm:px-3"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(61,46,26,0.92) 0%, rgba(26,21,16,0.88) 45%, rgba(0,0,0,0.96) 100%)",
                    }}
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-blue-950/50 bg-black/50">
                      <Image
                        src={u.imageSrc}
                        alt=""
                        fill
                        className="object-cover object-center"
                        sizes="56px"
                      />
                    </div>

                    <div className="flex min-w-[140px] shrink-0 flex-col gap-2 sm:min-w-[180px]">
                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px] text-white sm:text-[10px]">
                        <span className="text-cyan-400">{play.catalogStatAttack}</span>
                        <span>{u.attack}</span>
                        <span className="text-cyan-400">{play.catalogStatDefense}</span>
                        <span>{u.defense}</span>
                        <span className="text-cyan-400">{play.catalogStatAgility}</span>
                        <span>{u.agility}</span>
                        <span className="text-cyan-400">{play.catalogStatSpeed}</span>
                        <span>{u.speed}</span>
                      </div>
                      {locked ? (
                        <span className="rounded border border-zinc-600 bg-black/60 px-2 py-1 text-center text-[9px] text-zinc-500">
                          {locale === "en" ? "Locked" : "Kilitli"}
                        </span>
                      ) : (
                        <Link
                          href={`/production#unit-${u.id}`}
                          className="inline-block w-max rounded border border-amber-600/90 bg-black/70 px-3 py-1.5 text-center text-[10px] text-amber-100 shadow-inner hover:bg-amber-950/50"
                        >
                          {play.catalogBtnProduce}
                        </Link>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="mb-1 text-sm font-normal leading-tight text-yellow-300 drop-shadow-sm">
                        {u.name}
                      </h4>
                      <div className="flex flex-col gap-0.5 text-[9px] leading-relaxed text-zinc-100/95 sm:text-[10px]">
                        <CatalogFieldLine
                          label={play.catalogFieldTime}
                          value={fmtDuration(u.trainSeconds)}
                        />
                        <CatalogFieldLine
                          label={play.catalogFieldAge}
                          value={String(ageNum)}
                        />
                        <CatalogFieldLine
                          label={play.catalogFieldPurpose}
                          value={purposeText(u.purpose, locale)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

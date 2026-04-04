import { CatalogFieldLine } from "@/components/game/CatalogGameRow";
import { UnitTrainRow } from "@/components/game/UnitTrainRow";
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
  cityId: string;
};

export function UnitCatalog({
  units,
  playerEra,
  play,
  locale,
  cityId,
}: Props) {
  if (units.length === 0) return null;
  const pIdx = eraIndex(playerEra);

  const sections = ERA_ORDER.map((eraId) => {
    const list = units
      .filter((u) => u.minEra === eraId)
      .sort((a, b) =>
        a.name.localeCompare(b.name, locale === "en" ? "en" : "tr"),
      );
    if (list.length === 0) return null;
    const cfg = getEraConfig(eraId);
    const eraName = getEraDisplayName(cfg, locale);
    return { eraId, list, eraName };
  }).filter(Boolean) as {
    eraId: string;
    list: UnitSpec[];
    eraName: string;
  }[];

  const lockedLabel = locale === "en" ? "Locked" : "Kilitli";

  return (
    <div className="mb-2 w-full space-y-8 overflow-hidden rounded-lg border border-zinc-700/70">
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
                    className="flex w-full flex-col gap-3 px-2 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:px-3"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(61,46,26,0.92) 0%, rgba(26,21,16,0.88) 45%, rgba(0,0,0,0.96) 100%)",
                    }}
                  >
                    <div className="flex shrink-0 items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-blue-950/50 bg-black/50">
                        <Image
                          src={u.imageSrc}
                          alt=""
                          fill
                          className="object-cover object-center"
                          sizes="56px"
                        />
                      </div>
                      <span className="max-w-[10rem] text-sm font-semibold leading-tight text-yellow-300 drop-shadow sm:text-base">
                        {u.name}
                      </span>
                    </div>

                    <div className="flex min-h-[5.5rem] min-w-[min(100%,220px)] flex-1 flex-col justify-center sm:min-w-[200px]">
                      <div className="flex flex-col gap-1 text-sm leading-snug text-zinc-100/95 sm:text-[15px]">
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

                    <div className="min-w-[140px] shrink-0 sm:min-w-[160px]">
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-white sm:text-[15px]">
                        <span className="text-cyan-300">
                          {play.catalogStatAttack}
                        </span>
                        <span className="tabular-nums">{u.attack}</span>
                        <span className="text-cyan-300">
                          {play.catalogStatDefense}
                        </span>
                        <span className="tabular-nums">{u.defense}</span>
                        <span className="text-cyan-300">
                          {play.catalogStatAgility}
                        </span>
                        <span className="tabular-nums">{u.agility}</span>
                        <span className="text-cyan-300">
                          {play.catalogStatSpeed}
                        </span>
                        <span className="tabular-nums">{u.speed}</span>
                      </div>
                    </div>

                    <div className="flex shrink-0 justify-end sm:ml-auto">
                      <UnitTrainRow
                        cityId={cityId}
                        unitId={u.id}
                        locked={locked}
                        trainLabel={play.trainBtn}
                        lockedLabel={lockedLabel}
                      />
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

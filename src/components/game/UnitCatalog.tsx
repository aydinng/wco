import { CatalogFieldLine } from "@/components/game/CatalogGameRow";
import {
  CATALOG_MIDDLE_COL,
  CATALOG_NAME_COL,
  CATALOG_ROW_GRID_UNITS,
  CATALOG_STATS_COL,
  CATALOG_TITLE_YELLOW,
} from "@/components/game/catalog-layout";
import { ResourceIcon } from "@/components/game/ResourceIcon";
import { UnitTrainRow } from "@/components/game/UnitTrainRow";
import {
  ERA_ORDER,
  eraBackgroundUrl,
  eraOrdinalNumber,
  eraIndex,
  getEraConfig,
  getEraDisplayName,
  type ResourceUnlocks,
} from "@/config/eras";
import type { UnitSpec } from "@/config/units";
import type { Dictionary } from "@/i18n/dictionaries";
import type { AppLocale } from "@/lib/locale";
import { unitTrainCostPerSoldierTotal } from "@/lib/economy";
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
    if (p === "taşıma") return "Transport";
    if (p === "casusluk") return "Scouting";
    return "Attack/Defense";
  }
  if (p === "saldırı") return "Saldırı";
  if (p === "koruma") return "Koruma";
  if (p === "taşıma") return "Taşıma";
  if (p === "casusluk") return "Casusluk";
  return "Saldırı/Koruma";
}

function UnitCostBlock({
  spec,
  unlocks,
  playerEra,
  play,
}: {
  spec: UnitSpec;
  unlocks: ResourceUnlocks;
  playerEra?: string | null;
  play: Dictionary["play"];
}) {
  const c = unitTrainCostPerSoldierTotal(spec, unlocks, playerEra);
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-amber-100/95">
      {c.wood > 0 ? (
        <span className="inline-flex items-center gap-1">
          <ResourceIcon kind="wood" />
          <span className="text-zinc-200">{play.resWood}</span>
          <span className="tabular-nums">{c.wood}</span>
        </span>
      ) : null}
      {c.iron > 0 ? (
        <span className="inline-flex items-center gap-1">
          <ResourceIcon kind="iron" />
          <span className="text-zinc-200">{play.resIron}</span>
          <span className="tabular-nums">{c.iron}</span>
        </span>
      ) : null}
      {c.oil > 0 ? (
        <span className="inline-flex items-center gap-1">
          <ResourceIcon kind="oil" />
          <span className="text-zinc-200">{play.resOil}</span>
          <span className="tabular-nums">{c.oil}</span>
        </span>
      ) : null}
      {c.food > 0 ? (
        <span className="inline-flex items-center gap-1">
          <ResourceIcon kind="food" />
          <span className="text-zinc-200">{play.resFood}</span>
          <span className="tabular-nums">{c.food}</span>
        </span>
      ) : null}
    </div>
  );
}

type Props = {
  units: UnitSpec[];
  playerEra?: string | null;
  play: Dictionary["play"];
  locale: AppLocale;
  cityId: string;
  unlocks: ResourceUnlocks;
};

export function UnitCatalog({
  units,
  playerEra,
  play,
  locale,
  cityId,
  unlocks,
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
      {sections.map(({ eraId, list, eraName }) => {
        const cfg = getEraConfig(eraId);
        const bg = eraBackgroundUrl(eraId);
        const ordinal = eraOrdinalNumber(eraId);
        return (
        <div key={eraId}>
          <div
            className="relative mb-2 w-full overflow-hidden rounded-lg border-2 shadow-lg"
            style={{
              borderColor: cfg.banner.borderColor,
              boxShadow: `0 0 22px ${cfg.banner.glow}`,
            }}
          >
            <div className="relative h-20 w-full sm:h-24">
              <Image
                src={bg}
                alt=""
                fill
                className="object-cover object-center"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority={eraId === "ilk_cag"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
              <div className="absolute bottom-1.5 left-2 right-2 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  {locale === "en" ? `Age ${ordinal}` : `Çağ ${ordinal}`}
                </p>
                <p className="text-[11px] font-bold leading-tight text-white drop-shadow-md">
                  {eraName}
                </p>
              </div>
            </div>
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
                    className={CATALOG_ROW_GRID_UNITS}
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(61,46,26,0.92) 0%, rgba(26,21,16,0.88) 45%, rgba(0,0,0,0.96) 100%)",
                    }}
                  >
                    <div className={CATALOG_NAME_COL}>
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-blue-950/50 bg-black/50">
                        <Image
                          src={u.imageSrc}
                          alt=""
                          fill
                          className="object-cover object-center"
                          sizes="56px"
                        />
                      </div>
                      <span className={CATALOG_TITLE_YELLOW}>{u.name}</span>
                    </div>

                    <div className={CATALOG_MIDDLE_COL}>
                      <div className="flex flex-col gap-1 text-zinc-100/95">
                        <CatalogFieldLine
                          label={play.catalogFieldTime}
                          value={fmtDuration(u.trainSeconds)}
                        />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-cyan-400">
                            {locale === "en" ? "Resources" : "Hammadde"}
                          </span>
                          <UnitCostBlock
                            spec={u}
                            unlocks={unlocks}
                            playerEra={playerEra}
                            play={play}
                          />
                        </div>
                        <CatalogFieldLine
                          label={play.catalogFieldPurpose}
                          value={purposeText(u.purpose, locale)}
                        />
                        <CatalogFieldLine
                          label={play.catalogFieldAge}
                          value={String(ageNum)}
                        />
                      </div>
                    </div>

                    <div className={CATALOG_STATS_COL}>
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

                    <div className="flex shrink-0 justify-center sm:justify-end">
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
        );
      })}
    </div>
  );
}

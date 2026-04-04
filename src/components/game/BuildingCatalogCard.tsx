import type { BuildingId } from "@/app/actions/game-city";
import { CatalogFieldLine } from "@/components/game/CatalogGameRow";
import {
  CATALOG_MIDDLE_COL,
  CATALOG_NAME_COL,
  CATALOG_ROW_GRID_BUILDING,
  CATALOG_TITLE_YELLOW,
} from "@/components/game/catalog-layout";
import { UpgradeBuildingButton } from "@/components/game/UpgradeBuildingButton";
import type { Dictionary } from "@/i18n/dictionaries";
import { buildingImagePath } from "@/config/buildings";
import type { ResourceUnlocks } from "@/config/eras";
import { formatBuildingBonusLine } from "@/lib/building-display";
import type { City } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

function levelFor(c: City, id: BuildingId): number {
  switch (id) {
    case "townHall":
      return c.townHallLevel;
    case "lumberMill":
      return c.lumberMillLevel;
    case "ironMine":
      return c.ironMineLevel;
    case "oilWell":
      return c.oilWellLevel;
    case "farm":
      return c.farmLevel;
    case "barracks":
      return c.barracksLevel;
    default:
      return 0;
  }
}

function isBuildingLocked(
  building: BuildingId,
  unlocks: ResourceUnlocks,
): boolean {
  if (building === "ironMine") return !unlocks.iron;
  if (building === "oilWell") return !unlocks.oil;
  return false;
}

type Props = {
  orderInEra: number;
  building: BuildingId;
  title: string;
  desc: string;
  cities: City[];
  unlocks: ResourceUnlocks;
  play: Dictionary["play"];
  showBonus: boolean;
  eraOrdinal: number;
};

export function BuildingCatalogCard({
  orderInEra,
  building,
  title,
  desc,
  cities,
  unlocks,
  play,
  showBonus,
  eraOrdinal,
}: Props) {
  const locked = isBuildingLocked(building, unlocks);
  const img = buildingImagePath(building);
  const bonusTpl = {
    bonusNone: play.bonusNone,
    bonusTownHall: play.bonusTownHall,
    bonusResource: play.bonusResource,
    bonusBarracks: play.bonusBarracks,
  };

  const maxLv = cities.reduce(
    (m, c) => Math.max(m, levelFor(c, building)),
    0,
  );
  const levelStr = maxLv < 1 ? play.levelNone : String(maxLv);

  return (
    <div className="w-full overflow-hidden rounded-lg border border-zinc-700/70">
      <div
        className="border-b border-blue-950/70"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        <div
          className={CATALOG_ROW_GRID_BUILDING}
          style={{
            background:
              "linear-gradient(90deg, rgba(61,46,26,0.92) 0%, rgba(26,21,16,0.88) 45%, rgba(0,0,0,0.96) 100%)",
          }}
        >
          <div className={CATALOG_NAME_COL}>
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-blue-950/50 bg-black/50">
              <Image
                src={img}
                alt=""
                fill
                className="object-cover object-center"
                sizes="56px"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5">
              <span
                className="text-xl font-bold tabular-nums leading-none text-amber-300 drop-shadow"
                aria-hidden
              >
                {orderInEra}
              </span>
              <span className={CATALOG_TITLE_YELLOW}>{title}</span>
            </div>
          </div>

          <div className={CATALOG_MIDDLE_COL}>
            <div className="flex flex-col gap-1 text-zinc-100/95">
              <CatalogFieldLine
                label={play.catalogFieldTime}
                value={play.catalogNoDuration}
              />
              <CatalogFieldLine
                label={play.catalogFieldAge}
                value={String(eraOrdinal)}
              />
              <CatalogFieldLine
                label={play.catalogFieldLevel}
                value={levelStr}
              />
              <CatalogFieldLine
                label={play.catalogFieldPurpose}
                value={desc}
                valueClassName="line-clamp-2"
              />
            </div>
          </div>

          <div className="flex items-center justify-center">
            {locked ? (
              <span className="rounded border border-zinc-600 bg-black/60 px-2 py-1.5 text-center text-xs text-zinc-500">
                {play.errBuildingLocked}
              </span>
            ) : (
              <Link
                href="/buildings"
                className="inline-block rounded border border-amber-600/90 bg-black/70 px-3 py-2 text-center text-sm font-semibold text-amber-100 shadow-inner hover:bg-amber-950/50"
              >
                {play.catalogBtnUpgrade}
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 border-t border-zinc-700/50 bg-black/20 px-3 pb-3 pt-2">
        {cities.map((c) => {
          const lv = levelFor(c, building);
          const bonus = formatBuildingBonusLine(building, lv, c, bonusTpl);
          return (
            <div
              key={c.id}
              className="rounded border border-zinc-700/50 bg-black/25 p-2"
            >
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-amber-200/90">
                  {c.name}
                </span>
                <span className="tabular-nums text-xs text-zinc-400">
                  {play.levelShort}: {lv < 1 ? play.levelNone : lv}
                </span>
              </div>
              {showBonus && (
                <p className="mb-2 text-[11px] leading-snug text-amber-200/70">
                  {bonus}
                </p>
              )}
              {locked ? (
                <p className="text-[11px] text-amber-600/90">
                  {play.errBuildingLocked}
                </p>
              ) : (
                <UpgradeBuildingButton
                  cityId={c.id}
                  building={building}
                  currentLevel={lv}
                  buildLabel={play.buildFirst}
                  upgradeLabel={play.upgrade}
                  costPrefix={play.cost}
                  unlocks={unlocks}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

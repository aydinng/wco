import type { BuildingId } from "@/app/actions/game-city";
import { CatalogFieldLine } from "@/components/game/CatalogGameRow";
import {
  CATALOG_MIDDLE_COL,
  CATALOG_NAME_COL,
  CATALOG_ROW_GRID_TECH,
} from "@/components/game/catalog-layout";
import { UpgradeBuildingButton } from "@/components/game/UpgradeBuildingButton";
import type { Dictionary } from "@/i18n/dictionaries";
import { buildingImagePath } from "@/config/buildings";
import { eraIndex, type ResourceUnlocks } from "@/config/eras";
import { buildingUpgradeDurationSec } from "@/lib/duration-scaling";
import { maxLevelForBuilding } from "@/lib/economy";
import type { City } from "@prisma/client";
import type { AppLocale } from "@/lib/locale";
import { formatCountdownSeconds } from "@/lib/format-countdown";
import Image from "next/image";

const SKY = "text-sky-400";
const SKY_VAL = "text-sky-100";

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
    case "researchLodge":
      return c.researchLodgeLevel;
    case "shepherdLodge":
      return c.shepherdLodgeLevel;
    case "civilLodge":
      return c.civilLodgeLevel;
    case "bank":
      return c.bankLevel;
    case "policeDept":
      return c.policeDeptLevel;
    default:
      return 0;
  }
}

function isBuildingLocked(
  building: BuildingId,
  unlocks: ResourceUnlocks,
  currentEra: string,
): boolean {
  if (building === "ironMine") return !unlocks.iron;
  if (building === "oilWell") return !unlocks.oil;
  if (building === "bank" || building === "policeDept")
    return eraIndex(currentEra) < 1;
  return false;
}

type Props = {
  building: BuildingId;
  title: string;
  desc: string;
  cities: City[];
  unlocks: ResourceUnlocks;
  play: Dictionary["play"];
  locale: AppLocale;
  eraOrdinal: number;
  researchTier: number;
  currentEra: string;
};

export function BuildingCatalogCard({
  building,
  title,
  desc,
  cities,
  unlocks,
  play,
  locale,
  eraOrdinal,
  researchTier,
  currentEra,
}: Props) {
  const locked = isBuildingLocked(building, unlocks, currentEra);
  const img = buildingImagePath(building);

  const maxLv = cities.reduce(
    (m, c) => Math.max(m, levelFor(c, building)),
    0,
  );
  const levelStr = maxLv < 1 ? play.levelNone : String(maxLv);

  const capLv = maxLevelForBuilding(building);
  const nextDurSec =
    locked || maxLv >= capLv
      ? undefined
      : buildingUpgradeDurationSec({
          buildingId: building,
          toLevel: maxLv + 1,
          researchTier,
        });

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
              src={img}
              alt=""
              fill
              className="object-cover object-center"
              sizes="56px"
            />
          </div>
          <span className="line-clamp-2 min-h-[2.75rem] w-full max-w-[9.5rem] text-center text-sm font-medium leading-tight text-zinc-100 sm:text-base">
            {title}
          </span>
        </div>

        <div className={CATALOG_MIDDLE_COL}>
          <CatalogFieldLine
            label={play.catalogFieldTime}
            value={
              locked || maxLv >= capLv
                ? "—"
                : nextDurSec != null && nextDurSec > 0
                  ? formatCountdownSeconds(nextDurSec, locale)
                  : "—"
            }
            labelClassName={SKY}
            valueClassName={SKY_VAL}
          />
          <CatalogFieldLine
            label={play.catalogFieldAge}
            value={String(eraOrdinal)}
            labelClassName={SKY}
            valueClassName={SKY_VAL}
          />
          <CatalogFieldLine
            label={play.catalogFieldLevel}
            value={levelStr}
            labelClassName={SKY}
            valueClassName={SKY_VAL}
          />
          <CatalogFieldLine
            label={play.catalogFieldPurpose}
            value={desc}
            labelClassName={SKY}
            valueClassName="text-sky-50 line-clamp-3"
          />
        </div>

        <div className="flex min-w-0 flex-col items-stretch justify-center gap-3 sm:items-end">
          {cities.map((c) => {
            const lv = levelFor(c, building);
            return (
              <div key={c.id} className="w-full max-w-[22rem] sm:ml-auto">
                {locked ? (
                  <span className="block text-center text-[11px] text-amber-600/90 sm:text-right">
                    {play.errBuildingLocked}
                  </span>
                ) : (
                  <UpgradeBuildingButton
                    cityId={c.id}
                    building={building}
                    currentLevel={lv}
                    buildLabel={play.buildFirst}
                    upgradeLabel={play.upgrade}
                    unlocks={unlocks}
                    locale={locale}
                    ilkCagWoodFoodOnly={eraIndex(currentEra) < 1}
                    currentEra={currentEra}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

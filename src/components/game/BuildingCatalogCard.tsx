import type { BuildingId } from "@/app/actions/game-city";
import { CatalogFieldLine } from "@/components/game/CatalogGameRow";
import {
  CATALOG_MIDDLE_COL,
  CATALOG_TITLE_YELLOW,
} from "@/components/game/catalog-layout";
import { UpgradeBuildingButton } from "@/components/game/UpgradeBuildingButton";
import type { Dictionary } from "@/i18n/dictionaries";
import { buildingImagePath } from "@/config/buildings";
import type { ResourceUnlocks } from "@/config/eras";
import { buildingUpgradeDurationSec } from "@/lib/duration-scaling";
import { MAX_BUILDING_LEVEL } from "@/lib/economy";
import type { City } from "@prisma/client";
import type { AppLocale } from "@/lib/locale";
import { formatCountdownSeconds } from "@/lib/format-countdown";
import Image from "next/image";

const BUILDING_CARD_GRID =
  "grid w-full grid-cols-1 items-start gap-3 px-2 py-3 sm:grid-cols-[11rem_minmax(0,16rem)_minmax(0,1fr)] sm:gap-x-3 sm:px-3";

const BUILDING_IMG_BOX =
  "relative h-28 w-28 shrink-0 overflow-hidden rounded-md border border-blue-950/50 bg-black/50 sm:h-28 sm:w-28";

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
  building: BuildingId;
  title: string;
  desc: string;
  cities: City[];
  unlocks: ResourceUnlocks;
  play: Dictionary["play"];
  locale: AppLocale;
  eraOrdinal: number;
  researchTier: number;
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
}: Props) {
  const locked = isBuildingLocked(building, unlocks);
  const img = buildingImagePath(building);

  const resourceLabels = {
    wood: play.resWood,
    iron: play.resIron,
    oil: play.resOil,
    food: play.resFood,
  };

  const maxLv = cities.reduce(
    (m, c) => Math.max(m, levelFor(c, building)),
    0,
  );
  const levelStr = maxLv < 1 ? play.levelNone : String(maxLv);

  const durationLevel1Sec = buildingUpgradeDurationSec({
    buildingId: building,
    toLevel: 1,
    researchTier,
  });

  return (
    <div className="w-full overflow-hidden rounded-lg border border-zinc-700/70">
      <div
        className="border-b border-blue-950/70"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        <div
          className={BUILDING_CARD_GRID}
          style={{
            background:
              "linear-gradient(90deg, rgba(61,46,26,0.92) 0%, rgba(26,21,16,0.88) 45%, rgba(0,0,0,0.96) 100%)",
          }}
        >
          <div className="flex w-full flex-col items-center gap-2 sm:w-[11rem]">
            <div className={BUILDING_IMG_BOX}>
              <Image
                src={img}
                alt=""
                fill
                className="object-cover object-center"
                sizes="112px"
              />
            </div>
            <span className={`${CATALOG_TITLE_YELLOW} w-full text-center`}>
              {title}
            </span>
          </div>

          <div className={CATALOG_MIDDLE_COL}>
            <div className="flex flex-col gap-1 text-zinc-100/95">
              <CatalogFieldLine
                label={play.catalogFieldTime}
                value={formatCountdownSeconds(durationLevel1Sec, locale)}
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
                valueClassName="line-clamp-3"
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-3">
            {cities.map((c) => {
              const lv = levelFor(c, building);
              const maxed = lv >= MAX_BUILDING_LEVEL;
              const nextDurSec =
                maxed || locked
                  ? undefined
                  : buildingUpgradeDurationSec({
                      buildingId: building,
                      toLevel: lv + 1,
                      researchTier,
                    });
              return (
                <div
                  key={c.id}
                  className="flex flex-col gap-2 rounded border border-zinc-600/50 bg-black/30 px-2 py-2"
                >
                  <span className="text-sm font-medium text-amber-200/90">
                    {c.name}
                  </span>
                  {locked ? (
                    <span className="text-[11px] text-amber-600/90">
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
                      resourceLabels={resourceLabels}
                      durationSec={nextDurSec}
                      timeLabel={play.catalogFieldTime}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

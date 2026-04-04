import type { BuildingId } from "@/app/actions/game-city";
import {
  CATALOG_TITLE_YELLOW,
} from "@/components/game/catalog-layout";
import { UpgradeBuildingButton } from "@/components/game/UpgradeBuildingButton";
import type { Dictionary } from "@/i18n/dictionaries";
import { buildingImagePath } from "@/config/buildings";
import type { ResourceUnlocks } from "@/config/eras";
import type { City } from "@prisma/client";
import type { AppLocale } from "@/lib/locale";
import Image from "next/image";

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
  cities: City[];
  unlocks: ResourceUnlocks;
  play: Dictionary["play"];
  locale: AppLocale;
};

export function BuildingCatalogCard({
  building,
  title,
  cities,
  unlocks,
  play,
  locale,
}: Props) {
  const locked = isBuildingLocked(building, unlocks);
  const img = buildingImagePath(building);

  const resourceLabels = {
    wood: play.resWood,
    iron: play.resIron,
    oil: play.resOil,
    food: play.resFood,
  };

  return (
    <div className="w-full overflow-hidden rounded-lg border border-zinc-700/70">
      <div
        className="flex items-center gap-3 border-b border-blue-950/70 px-3 py-3"
        style={{
          fontFamily: "var(--font-warcity), serif",
          background:
            "linear-gradient(90deg, rgba(61,46,26,0.92) 0%, rgba(26,21,16,0.88) 45%, rgba(0,0,0,0.96) 100%)",
        }}
      >
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-blue-950/50 bg-black/50">
          <Image
            src={img}
            alt=""
            fill
            className="object-cover object-center"
            sizes="56px"
          />
        </div>
        <h3 className={`min-w-0 flex-1 text-center ${CATALOG_TITLE_YELLOW}`}>
          {title}
        </h3>
      </div>

      <div className="space-y-2 bg-black/20 px-3 py-3">
        {cities.map((c) => {
          const lv = levelFor(c, building);
          return (
            <div
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded border border-zinc-700/50 bg-black/25 px-2 py-2"
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
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

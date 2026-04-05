"use client";

import {
  type BuildingId,
  upgradeBuilding,
} from "@/app/actions/game-city";
import type { ResourceUnlocks } from "@/config/eras";
import { ResourceIcon } from "@/components/game/ResourceIcon";
import { getUpgradeCost, MAX_BUILDING_LEVEL } from "@/lib/economy";
import type { AppLocale } from "@/lib/locale";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  cityId: string;
  building: BuildingId;
  currentLevel: number;
  buildLabel: string;
  upgradeLabel: string;
  unlocks: ResourceUnlocks;
  locale: AppLocale;
  resourceLabels: {
    wood: string;
    iron: string;
    oil: string;
    food: string;
  };
  /** İlk çağda inşaat yalnız odun + besin */
  ilkCagWoodFoodOnly?: boolean;
};

export function UpgradeBuildingButton({
  cityId,
  building,
  currentLevel,
  buildLabel,
  upgradeLabel,
  unlocks,
  locale,
  resourceLabels,
  ilkCagWoodFoodOnly = false,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const maxed = currentLevel >= MAX_BUILDING_LEVEL;
  const cost = getUpgradeCost(currentLevel, unlocks, {
    ilkCagWoodFoodOnly,
  });
  const actionLabel = currentLevel < 1 ? buildLabel : upgradeLabel;
  const tr = locale !== "en";

  async function onClick() {
    setErr(null);
    setBusy(true);
    try {
      const r = await upgradeBuilding(cityId, building);
      if (!r.ok) setErr(r.error);
      else router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-2">
      <div className="flex w-full min-w-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
        {!maxed && (
          <div
            className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-3 gap-y-1 rounded-md border-2 border-amber-700/55 bg-gradient-to-br from-amber-950/45 to-black/45 px-3 py-2 shadow-inner"
            style={{ fontFamily: "var(--font-warcity), serif" }}
          >
            <span className="inline-flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-sm font-semibold tabular-nums text-amber-50">
              <span className="inline-flex items-center gap-1">
                <ResourceIcon kind="wood" />
                {resourceLabels.wood} {cost.wood}
              </span>
              {unlocks.iron && cost.iron > 0 ? (
                <span className="inline-flex items-center gap-1">
                  <ResourceIcon kind="iron" />
                  {resourceLabels.iron} {cost.iron}
                </span>
              ) : null}
              {unlocks.oil && cost.oil > 0 ? (
                <span className="inline-flex items-center gap-1">
                  <ResourceIcon kind="oil" />
                  {resourceLabels.oil} {cost.oil}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1">
                <ResourceIcon kind="food" />
                {resourceLabels.food} {cost.food}
              </span>
            </span>
          </div>
        )}
        <button
          type="button"
          disabled={busy || maxed}
          onClick={onClick}
          className="shrink-0 rounded border border-amber-900/50 bg-amber-950/40 px-3 py-2 text-sm font-semibold text-amber-100 hover:bg-amber-900/50 disabled:opacity-40"
        >
          {maxed ? (tr ? "ÜST" : "MAX") : actionLabel}
        </button>
      </div>
      {err ? (
        <span className="max-w-[20rem] text-right text-xs text-red-400">
          {err}
        </span>
      ) : null}
    </div>
  );
}

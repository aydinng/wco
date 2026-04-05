"use client";

import {
  type BuildingId,
  upgradeBuilding,
} from "@/app/actions/game-city";
import type { ResourceUnlocks } from "@/config/eras";
import { ResourceIcon } from "@/components/game/ResourceIcon";
import { getUpgradeCost, maxLevelForBuilding } from "@/lib/economy";
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
  /** İlk çağda inşaat yalnız odun + besin; demir gösterilmez ve maliyete girmez */
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
  ilkCagWoodFoodOnly = false,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const cap = maxLevelForBuilding(building);
  const maxed = currentLevel >= cap;
  const cost = getUpgradeCost(currentLevel, unlocks, {
    ilkCagWoodFoodOnly,
  });
  const actionLabel = currentLevel < 1 ? buildLabel : upgradeLabel;
  const tr = locale !== "en";
  const showIron = !ilkCagWoodFoodOnly && unlocks.iron && cost.iron > 0;
  const showOil = !ilkCagWoodFoodOnly && unlocks.oil && cost.oil > 0;

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
          <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-3 gap-y-1 text-sm tabular-nums text-zinc-200">
            <span className="inline-flex items-center gap-1">
              <ResourceIcon kind="wood" />
              {cost.wood}
            </span>
            {showIron ? (
              <span className="inline-flex items-center gap-1">
                <ResourceIcon kind="iron" />
                {cost.iron}
              </span>
            ) : null}
            {showOil ? (
              <span className="inline-flex items-center gap-1">
                <ResourceIcon kind="oil" />
                {cost.oil}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1">
              <ResourceIcon kind="food" />
              {cost.food}
            </span>
          </div>
        )}
        {maxed ? (
          <span
            className="shrink-0 rounded border border-emerald-800/70 bg-emerald-950/35 px-3 py-1.5 text-center text-sm font-semibold text-emerald-100/95"
            style={{ fontFamily: "var(--font-warcity), serif" }}
          >
            {tr ? "Tamamlandı" : "Completed"}
          </span>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={onClick}
            className="shrink-0 rounded border border-amber-900/50 bg-amber-950/40 px-3 py-2 text-sm font-semibold text-amber-100 hover:bg-amber-900/50 disabled:opacity-40"
          >
            {busy ? "…" : actionLabel}
          </button>
        )}
      </div>
      {err ? (
        <span className="max-w-[20rem] text-right text-xs text-red-400">
          {err}
        </span>
      ) : null}
    </div>
  );
}

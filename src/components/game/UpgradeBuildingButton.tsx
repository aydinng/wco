"use client";

import {
  type BuildingId,
  upgradeBuilding,
} from "@/app/actions/game-city";
import { eraIndex, type ResourceUnlocks } from "@/config/eras";
import { ResourceIcon } from "@/components/game/ResourceIcon";
import {
  getUpgradeCost,
  isIlkCagCoreBuilding,
  maxLevelForBuilding,
} from "@/lib/economy";
import { buildingUpgradeDurationSec } from "@/lib/duration-scaling";
import { formatCountdownSeconds } from "@/lib/format-countdown";
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
  /** İlk çağ: yalnız odun + besin; demir/petrol yok */
  ilkCagWoodFoodOnly?: boolean;
  /** Sunucu ile aynı kaynak: `currentEra` verilirse ilk çağ maliyeti buna göre de hesaplanır */
  currentEra?: string | null;
  /** İmparatorluk araştırma seviyesi — bir sonraki yükseltme süresi */
  researchTier: number;
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
  currentEra,
  researchTier,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const cap = maxLevelForBuilding(building);
  const maxed = currentLevel >= cap;
  const cost = getUpgradeCost(currentLevel, unlocks, {
    ilkCagWoodFoodOnly,
    currentEra,
    buildingId: building,
  });
  const actionLabel = currentLevel < 1 ? buildLabel : upgradeLabel;
  const tr = locale !== "en";
  /** İlk çağ çağı veya ilk çağ kataloğundaki çekirdek binalar → yalnız odun + besin */
  const woodFoodOnly =
    ilkCagWoodFoodOnly === true ||
    (currentEra != null && eraIndex(currentEra) < 1) ||
    isIlkCagCoreBuilding(building);
  const showIron = !woodFoodOnly && unlocks.iron && cost.iron > 0;
  const showOil = !woodFoodOnly && unlocks.oil && cost.oil > 0;

  const nextDurSec =
    !maxed && currentLevel < cap
      ? buildingUpgradeDurationSec({
          buildingId: building,
          toLevel: currentLevel + 1,
          researchTier,
        })
      : 0;

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
    <div className="flex w-full min-w-0 flex-col gap-1.5">
      <div className="flex w-full min-w-0 flex-col items-stretch gap-1">
        {!maxed && nextDurSec > 0 ? (
          <div className="text-right text-[10px] tabular-nums text-sky-200/90">
            {formatCountdownSeconds(nextDurSec, locale)}
          </div>
        ) : null}
        <div className="flex w-full min-w-0 flex-row flex-wrap items-center justify-end gap-2">
        {maxed ? (
          <span
            className="shrink-0 rounded border border-emerald-800/70 bg-emerald-950/35 px-3 py-1.5 text-center text-sm font-semibold text-emerald-100/95"
            style={{ fontFamily: "var(--font-warcity), serif" }}
          >
            {tr ? "Tamamlandı" : "Completed"}
          </span>
        ) : (
          <>
            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-2 gap-y-0.5 text-xs tabular-nums text-zinc-400">
              <span className="inline-flex items-center gap-0.5">
                <ResourceIcon kind="wood" />
                {cost.wood}
              </span>
              {showIron ? (
                <span className="inline-flex items-center gap-0.5">
                  <ResourceIcon kind="iron" />
                  {cost.iron}
                </span>
              ) : null}
              {showOil ? (
                <span className="inline-flex items-center gap-0.5">
                  <ResourceIcon kind="oil" />
                  {cost.oil}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-0.5">
                <ResourceIcon kind="food" />
                {cost.food}
              </span>
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={onClick}
              className="shrink-0 rounded border border-amber-900/50 bg-amber-950/40 px-3 py-2 text-sm font-semibold text-amber-100 hover:bg-amber-900/50 disabled:opacity-40"
            >
              {busy ? "…" : actionLabel}
            </button>
          </>
        )}
        </div>
      </div>
      {err ? (
        <span className="max-w-[20rem] text-right text-xs text-red-400">
          {err}
        </span>
      ) : null}
    </div>
  );
}

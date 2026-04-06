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
import { nextUpgradeTargetLevel } from "@/lib/building-upgrade-preview";
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
  /** Bu şehir+bina için kuyruktaki işin hedef seviyesi (varsa süre bir sonraki tier için gösterilir) */
  queuedTargetLevel?: number | null;
  /** Kuyrukta iken buton yazısı */
  queuedLabel: string;
  /** Orta sütunla aynı: "Seviye:" / "Level:" — önizleme satırında kullanılır */
  levelFieldLabel: string;
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
  queuedTargetLevel = null,
  queuedLabel,
  levelFieldLabel,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const cap = maxLevelForBuilding(building);
  const queued =
    queuedTargetLevel != null && queuedTargetLevel > 0
      ? queuedTargetLevel
      : null;
  const nextTargetLevel = nextUpgradeTargetLevel({
    currentLevel,
    queuedTargetLevel: queued,
    cap,
  });
  const pendingToMax = queued != null && queued >= cap;
  const maxed = currentLevel >= cap || pendingToMax;
  const costLevel =
    nextTargetLevel != null ? nextTargetLevel - 1 : currentLevel;
  const cost = getUpgradeCost(costLevel, unlocks, {
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
    !maxed && nextTargetLevel != null
      ? buildingUpgradeDurationSec({
          buildingId: building,
          toLevel: nextTargetLevel,
          researchTier,
        })
      : 0;

  /** Kuyruk varken hedef seviye (ör. 4→5 işinde 5), yoksa DB seviyesi — süre bir sonraki tier için */
  const displayLevel = queued ?? currentLevel;

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
          <div className="text-right leading-tight">
            <div className="text-[11px] font-semibold tabular-nums text-sky-300/95">
              {levelFieldLabel}{" "}
              <span className="text-sky-100">{displayLevel}</span>
            </div>
            <div className="mt-0.5 text-[10px] tabular-nums text-sky-200/90">
              {formatCountdownSeconds(nextDurSec, locale)}
            </div>
          </div>
        ) : null}
        <div className="flex w-full min-w-0 flex-row flex-wrap items-center justify-end gap-2">
        {maxed ? (
          <span
            className="shrink-0 rounded border border-emerald-800/70 bg-emerald-950/35 px-3 py-1.5 text-center text-sm font-semibold text-emerald-100/95"
            style={{ fontFamily: "var(--font-warcity), serif" }}
          >
            {pendingToMax
              ? queuedLabel
              : tr
                ? "Tamamlandı"
                : "Completed"}
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
              disabled={busy || queued != null}
              onClick={onClick}
              className="shrink-0 rounded border border-amber-900/50 bg-amber-950/40 px-3 py-2 text-sm font-semibold text-amber-100 hover:bg-amber-900/50 disabled:opacity-40"
            >
              {busy ? "…" : queued != null ? queuedLabel : actionLabel}
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

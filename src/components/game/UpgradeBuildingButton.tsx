"use client";

import {
  type BuildingId,
  upgradeBuilding,
} from "@/app/actions/game-city";
import type { ResourceUnlocks } from "@/config/eras";
import { ResourceIcon } from "@/components/game/ResourceIcon";
import { getUpgradeCost, MAX_BUILDING_LEVEL } from "@/lib/economy";
import type { AppLocale } from "@/lib/locale";
import { formatCountdownSeconds } from "@/lib/format-countdown";
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
  /** Bir sonraki yükseltme süresi (saniye); yoksa süre satırı gösterilmez */
  durationSec?: number;
  /** Örn. "Süre:" */
  timeLabel: string;
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
  durationSec,
  timeLabel,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const maxed = currentLevel >= MAX_BUILDING_LEVEL;
  const cost = getUpgradeCost(currentLevel, unlocks);
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
      {!maxed && durationSec != null && durationSec > 0 ? (
        <p className="text-[10px] leading-snug text-zinc-400">
          <span className="text-cyan-400">{timeLabel}</span>{" "}
          <span className="font-semibold tabular-nums text-zinc-100">
            {formatCountdownSeconds(durationSec, locale)}
          </span>
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1.5">
        {!maxed && (
          <span className="flex flex-wrap items-center justify-end gap-x-2 gap-y-0.5 text-[10px] font-medium leading-snug text-zinc-200">
            <span className="inline-flex items-center gap-0.5">
              <ResourceIcon kind="wood" />
              {resourceLabels.wood} {cost.wood}
            </span>
            {unlocks.iron && cost.iron > 0 ? (
              <span className="inline-flex items-center gap-0.5">
                <ResourceIcon kind="iron" />
                {resourceLabels.iron} {cost.iron}
              </span>
            ) : null}
            {unlocks.oil && cost.oil > 0 ? (
              <span className="inline-flex items-center gap-0.5">
                <ResourceIcon kind="oil" />
                {resourceLabels.oil} {cost.oil}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-0.5">
              <ResourceIcon kind="food" />
              {resourceLabels.food} {cost.food}
            </span>
          </span>
        )}
        <button
          type="button"
          disabled={busy || maxed}
          onClick={onClick}
          className="shrink-0 rounded border border-amber-900/50 bg-amber-950/40 px-2 py-1 text-xs text-amber-100 hover:bg-amber-900/50 disabled:opacity-40"
        >
          {maxed ? (tr ? "ÜST" : "MAX") : actionLabel}
        </button>
      </div>
      {err ? (
        <span className="max-w-[20rem] text-right text-[10px] text-red-400">
          {err}
        </span>
      ) : null}
    </div>
  );
}

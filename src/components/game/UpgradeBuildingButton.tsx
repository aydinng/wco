"use client";

import {
  type BuildingId,
  upgradeBuilding,
} from "@/app/actions/game-city";
import type { ResourceUnlocks } from "@/config/eras";
import { getUpgradeCost, MAX_BUILDING_LEVEL } from "@/lib/economy";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  cityId: string;
  building: BuildingId;
  currentLevel: number;
  buildLabel: string;
  upgradeLabel: string;
  costPrefix: string;
  unlocks: ResourceUnlocks;
};

export function UpgradeBuildingButton({
  cityId,
  building,
  currentLevel,
  buildLabel,
  upgradeLabel,
  costPrefix: _costPrefix,
  unlocks,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const maxed = currentLevel >= MAX_BUILDING_LEVEL;
  const cost = getUpgradeCost(currentLevel, unlocks);
  const actionLabel = currentLevel < 1 ? buildLabel : upgradeLabel;

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

  const parts: string[] = [`ODUN ${cost.wood}`];
  if (unlocks.iron && cost.iron > 0) parts.push(`DEMİR ${cost.iron}`);
  if (unlocks.oil && cost.oil > 0) parts.push(`PETROL ${cost.oil}`);
  parts.push(`BESİN ${cost.food}`);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={busy || maxed}
          onClick={onClick}
          className="shrink-0 rounded border border-amber-900/50 bg-amber-950/40 px-2 py-1 text-xs text-amber-100 hover:bg-amber-900/50 disabled:opacity-40"
        >
          {maxed ? "MAX" : actionLabel}
        </button>
        {!maxed && (
          <span className="text-[10px] font-semibold uppercase leading-snug tracking-wide text-zinc-300">
            {parts.join(" · ")}
          </span>
        )}
      </div>
      {err && <span className="text-[10px] text-red-400">{err}</span>}
    </div>
  );
}

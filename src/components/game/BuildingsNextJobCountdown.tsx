"use client";

import { formatCountdownSeconds } from "@/lib/format-countdown";
import type { AppLocale } from "@/lib/locale";
import { useCountdownIso } from "@/components/game/useCountdownIso";

export function BuildingsNextJobCountdown({
  completesAtIso,
  locale,
  labelBusy,
}: {
  completesAtIso: string | null;
  locale: AppLocale;
  labelBusy: string;
}) {
  const sec = useCountdownIso(completesAtIso);
  if (!completesAtIso || sec <= 0) return null;
  return (
    <p className="mb-6 text-center text-sm text-amber-200/90">
      {labelBusy}{" "}
      <span className="tabular-nums font-semibold text-amber-100">
        {formatCountdownSeconds(sec, locale)}
      </span>
    </p>
  );
}

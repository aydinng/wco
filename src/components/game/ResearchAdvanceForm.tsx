"use client";

import { advanceResearch } from "@/app/actions/game-city";
import { MAX_RESEARCH_TIER } from "@/lib/economy";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type CityOpt = { id: string; name: string };

type Props = {
  currentTier: number;
  cities: CityOpt[];
  payFromLabel: string;
  btnLabel: string;
  researchJobEndsAtIso: string | null;
};

export function ResearchAdvanceForm({
  currentTier,
  cities,
  payFromLabel,
  btnLabel,
  researchJobEndsAtIso,
}: Props) {
  const router = useRouter();
  const [cityId, setCityId] = useState(cities[0]?.id ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [remainSec, setRemainSec] = useState(0);

  const maxed = currentTier >= MAX_RESEARCH_TIER;
  const endsMs = researchJobEndsAtIso
    ? new Date(researchJobEndsAtIso).getTime()
    : 0;
  const inProgress = !maxed && endsMs > Date.now();

  useEffect(() => {
    if (!inProgress || !researchJobEndsAtIso) {
      setRemainSec(0);
      return;
    }
    const tick = () =>
      setRemainSec(
        Math.max(0, Math.ceil((endsMs - Date.now()) / 1000)),
      );
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [inProgress, endsMs, researchJobEndsAtIso]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cityId || inProgress) return;
    setErr(null);
    setBusy(true);
    try {
      const r = await advanceResearch(cityId);
      if (!r.ok) setErr(r.error);
      else router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (cities.length === 0) {
    return <p className="text-sm text-zinc-500">—</p>;
  }

  const rm = Math.floor(remainSec / 60);
  const rs = remainSec % 60;

  return (
    <form
      onSubmit={onSubmit}
      className="mt-4 max-w-md space-y-3 text-sm"
      style={{ fontFamily: "var(--font-warcity), serif" }}
    >
      <label className="block text-zinc-400">
        {payFromLabel}
        <select
          className="mt-1 max-w-[10rem] rounded border border-[#2a3441] bg-black/40 px-1.5 py-1.5 text-xs text-zinc-100"
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
          disabled={inProgress || maxed}
        >
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      {inProgress && (
        <p className="text-xs text-amber-200/90">
          Araştırma sürüyor: {rm}dk {String(rs).padStart(2, "0")}sn
        </p>
      )}
      <button
        type="submit"
        disabled={busy || maxed || inProgress}
        className="rounded bg-amber-800/80 px-4 py-2 text-amber-50 hover:bg-amber-700 disabled:opacity-40"
      >
        {busy ? "…" : btnLabel}
      </button>
      {err && <p className="text-xs text-red-400">{err}</p>}
    </form>
  );
}

"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { suggestedFleetAttack } from "@/lib/economy";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type FleetCityOption = {
  id: string;
  name: string;
  coordX: number;
  coordY: number;
  coordZ: number;
  soldiers: number;
  barracksLevel: number;
};

type Props = {
  cities: FleetCityOption[];
  play: Dictionary["play"];
  /** Sadelik teknolojisi seviyesi — her seviye filo öneri saldırısına +1 */
  sadelikLevel?: number;
};

function suggestedAttack(
  c: FleetCityOption | undefined,
  sadelikLevel: number,
) {
  if (!c) return 1000;
  return Math.max(
    100,
    suggestedFleetAttack(c.soldiers, c.barracksLevel, sadelikLevel),
  );
}

export function FleetSendForm({
  cities,
  play,
  sadelikLevel = 0,
}: Props) {
  const router = useRouter();
  const [fromCityId, setFromCityId] = useState(cities[0]?.id ?? "");
  const [toCoordX, setToCoordX] = useState(22);
  const [toCoordY, setToCoordY] = useState(3);
  const [toCoordZ, setToCoordZ] = useState(3);
  const [attackPower, setAttackPower] = useState(() =>
    suggestedAttack(cities[0], sadelikLevel),
  );
  const [defensePower, setDefensePower] = useState(800);
  const [defenderDefense, setDefenderDefense] = useState(900);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const c = cities.find((x) => x.id === fromCityId);
    setAttackPower(suggestedAttack(c, sadelikLevel));
  }, [fromCityId, cities, sadelikLevel]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const r = await fetch("/api/fleet/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromCityId,
          toCoordX,
          toCoordY,
          toCoordZ,
          attackPower,
          defensePower,
          defenderDefense,
        }),
      });
      const j = (await r.json()) as {
        error?: string;
        outcome?: string;
        travelSeconds?: number;
      };
      if (!r.ok) throw new Error(j.error ?? "Error");
      setMsg(
        `${play.fleetSentOk}. ${j.outcome ?? "?"} · ~${j.travelSeconds ?? "?"}s`,
      );
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  if (cities.length === 0) {
    return (
      <p className="text-sm text-zinc-500">{play.fleetNoCity}</p>
    );
  }

  return (
    <div className="mt-4">
      {play.fleetHint && (
        <p className="mb-3 max-w-xl text-xs text-zinc-500">{play.fleetHint}</p>
      )}
      <form onSubmit={onSubmit} className="grid max-w-xl gap-3 text-sm sm:grid-cols-2">
        <label className="sm:col-span-2 text-zinc-400">
          {play.fleetDepartCity}
          <select
            className="mt-1 w-full rounded border border-[#2a3441] bg-black/40 px-2 py-2 text-zinc-100"
            value={fromCityId}
            onChange={(e) => setFromCityId(e.target.value)}
          >
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.coordX}:{c.coordY}:{c.coordZ}) · {play.soldiers}{" "}
                {c.soldiers}
              </option>
            ))}
          </select>
        </label>
        <label className="text-zinc-400">
          {play.fleetTargetX}
          <input
            type="number"
            className="mt-1 w-full rounded border border-[#2a3441] bg-black/40 px-2 py-2 text-zinc-100"
            value={toCoordX}
            onChange={(e) => setToCoordX(Number(e.target.value))}
          />
        </label>
        <label className="text-zinc-400">
          {play.fleetTargetY}
          <input
            type="number"
            className="mt-1 w-full rounded border border-[#2a3441] bg-black/40 px-2 py-2 text-zinc-100"
            value={toCoordY}
            onChange={(e) => setToCoordY(Number(e.target.value))}
          />
        </label>
        <label className="text-zinc-400">
          {play.fleetTargetZ}
          <input
            type="number"
            className="mt-1 w-full rounded border border-[#2a3441] bg-black/40 px-2 py-2 text-zinc-100"
            value={toCoordZ}
            onChange={(e) => setToCoordZ(Number(e.target.value))}
          />
        </label>
        <label className="text-zinc-400">
          {play.fleetAttack}
          <input
            type="number"
            className="mt-1 w-full rounded border border-[#2a3441] bg-black/40 px-2 py-2 text-zinc-100"
            value={attackPower}
            onChange={(e) => setAttackPower(Number(e.target.value))}
          />
        </label>
        <label className="text-zinc-400">
          {play.fleetDefenseFleet}
          <input
            type="number"
            className="mt-1 w-full rounded border border-[#2a3441] bg-black/40 px-2 py-2 text-zinc-100"
            value={defensePower}
            onChange={(e) => setDefensePower(Number(e.target.value))}
          />
        </label>
        <label className="sm:col-span-2 text-zinc-400">
          {play.fleetDefenseTarget}
          <input
            type="number"
            className="mt-1 w-full rounded border border-[#2a3441] bg-black/40 px-2 py-2 text-zinc-100"
            value={defenderDefense}
            onChange={(e) => setDefenderDefense(Number(e.target.value))}
          />
        </label>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded bg-amber-800/80 px-4 py-2 text-amber-50 hover:bg-amber-700 disabled:opacity-50"
          >
            {busy ? play.fleetSending : play.fleetSendBtn}
          </button>
          {msg && <p className="mt-2 text-xs text-zinc-400">{msg}</p>}
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { UNITS } from "@/config/units";

type CityMini = { id: string; name: string };

export function OverviewSupportButton({
  locale,
  targetCityId,
  targetName,
  sourceCities,
  labels,
}: {
  locale: string;
  targetCityId: string;
  targetName: string;
  sourceCities: CityMini[];
  labels: {
    support: string;
    fromCity: string;
    sendRes: string;
    sendTroops: string;
    wood: string;
    iron: string;
    oil: string;
    food: string;
    unit: string;
    qty: string;
    submit: string;
    close: string;
  };
}) {
  const [open, setOpen] = useState(false);
  const [fromId, setFromId] = useState(sourceCities[0]?.id ?? "");
  const [wood, setWood] = useState(0);
  const [iron, setIron] = useState(0);
  const [oil, setOil] = useState(0);
  const [food, setFood] = useState(0);
  const [unitId, setUnitId] = useState(UNITS[0]?.id ?? "mizrakci");
  const [unitQty, setUnitQty] = useState(0);
  const [mode, setMode] = useState<"res" | "troops">("res");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const sources = sourceCities.filter((c) => c.id !== targetCityId);

  async function submit() {
    setErr(null);
    setBusy(true);
    try {
      const body =
        mode === "res"
          ? {
              fromCityId: fromId,
              toCityId: targetCityId,
              wood,
              iron,
              oil,
              food,
            }
          : {
              fromCityId: fromId,
              toCityId: targetCityId,
              unitId,
              unitQty,
            };
      const res = await fetch("/api/city/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(j.error ?? "Hata");
        setBusy(false);
        return;
      }
      setOpen(false);
      window.location.reload();
    } catch {
      setErr("Ağ hatası");
    }
    setBusy(false);
  }

  if (sources.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ml-2 rounded border border-sky-700/70 bg-sky-950/40 px-2 py-0.5 text-[10px] font-bold text-sky-100 hover:bg-sky-900/50 sm:text-[11px]"
      >
        {labels.support}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg border border-amber-800/50 bg-zinc-900 p-4 shadow-xl"
            style={{ fontFamily: "var(--font-warcity), serif" }}
          >
            <h4 className="mb-2 text-sm font-bold text-amber-100">
              {targetName} — {labels.support}
            </h4>
            <p className="mb-3 text-xs text-zinc-400">
              {locale === "en"
                ? "Send resources or troops from another of your cities."
                : "Diğer şehrinizden kaynak veya asker gönderin."}
            </p>
            <label className="mb-2 block text-xs text-zinc-300">
              {labels.fromCity}
              <select
                className="mt-1 w-full rounded border border-zinc-600 bg-black/40 px-2 py-1 text-sm"
                value={fromId}
                onChange={(e) => setFromId(e.target.value)}
              >
                {sources.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="mb-3 flex gap-2">
              <button
                type="button"
                className={`rounded px-2 py-1 text-xs ${mode === "res" ? "bg-amber-800 text-white" : "bg-zinc-800 text-zinc-400"}`}
                onClick={() => setMode("res")}
              >
                {labels.sendRes}
              </button>
              <button
                type="button"
                className={`rounded px-2 py-1 text-xs ${mode === "troops" ? "bg-amber-800 text-white" : "bg-zinc-800 text-zinc-400"}`}
                onClick={() => setMode("troops")}
              >
                {labels.sendTroops}
              </button>
            </div>
            {mode === "res" ? (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="text-zinc-300">
                  {labels.wood}
                  <input
                    type="number"
                    min={0}
                    className="mt-0.5 w-full rounded border border-zinc-600 bg-black/40 px-1"
                    value={wood}
                    onChange={(e) => setWood(+e.target.value || 0)}
                  />
                </label>
                <label className="text-zinc-300">
                  {labels.iron}
                  <input
                    type="number"
                    min={0}
                    className="mt-0.5 w-full rounded border border-zinc-600 bg-black/40 px-1"
                    value={iron}
                    onChange={(e) => setIron(+e.target.value || 0)}
                  />
                </label>
                <label className="text-zinc-300">
                  {labels.oil}
                  <input
                    type="number"
                    min={0}
                    className="mt-0.5 w-full rounded border border-zinc-600 bg-black/40 px-1"
                    value={oil}
                    onChange={(e) => setOil(+e.target.value || 0)}
                  />
                </label>
                <label className="text-zinc-300">
                  {labels.food}
                  <input
                    type="number"
                    min={0}
                    className="mt-0.5 w-full rounded border border-zinc-600 bg-black/40 px-1"
                    value={food}
                    onChange={(e) => setFood(+e.target.value || 0)}
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <label className="block text-zinc-300">
                  {labels.unit}
                  <select
                    className="mt-1 w-full rounded border border-zinc-600 bg-black/40 px-2 py-1"
                    value={unitId}
                    onChange={(e) => setUnitId(e.target.value)}
                  >
                    {UNITS.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-zinc-300">
                  {labels.qty}
                  <input
                    type="number"
                    min={0}
                    className="mt-1 w-full rounded border border-zinc-600 bg-black/40 px-2 py-1"
                    value={unitQty}
                    onChange={(e) => setUnitQty(+e.target.value || 0)}
                  />
                </label>
              </div>
            )}
            {err ? <p className="mt-2 text-xs text-red-400">{err}</p> : null}
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="rounded border border-zinc-600 px-3 py-1 text-xs text-zinc-300"
                onClick={() => setOpen(false)}
              >
                {labels.close}
              </button>
              <button
                type="button"
                disabled={busy}
                className="rounded border border-amber-600 bg-amber-900/50 px-3 py-1 text-xs font-bold text-amber-50 disabled:opacity-50"
                onClick={() => void submit()}
              >
                {busy ? "…" : labels.submit}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

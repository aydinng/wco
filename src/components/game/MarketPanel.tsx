"use client";

import { MARKET_OPEN_DELAY_SEC } from "@/config/game-rules";
import { getResourceUnlocks } from "@/config/eras";
import type { EraId } from "@/config/eras";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type CityOpt = { id: string; name: string };

type ListingRow = {
  id: string;
  sellerId: string;
  quantity: number;
  priceWood: number;
  priceIron: number;
  priceFood: number;
  opensAt: string;
  sellerName: string;
  tribeName: string;
  cityName: string;
};

type Props = {
  currentUserId: string;
  buyerCities: CityOpt[];
  listCities: CityOpt[];
  listings: ListingRow[];
  currentEra: EraId | string;
  labels: {
    intro: string;
    delayNote: string;
    listSoldiers: string;
    fromCity: string;
    qty: string;
    pw: string;
    pi: string;
    pf: string;
    submitList: string;
    buy: string;
    receiveCity: string;
    empty: string;
    seller: string;
    opensAt: string;
    wait: string;
    ready: string;
    errGeneric: string;
    soldiersUnit: string;
    yourListing: string;
  };
};

export function MarketPanel({
  currentUserId,
  buyerCities,
  listCities,
  listings,
  currentEra,
  labels,
}: Props) {
  const router = useRouter();
  const unlocks = getResourceUnlocks(currentEra);
  const [clock, setClock] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setClock(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const [cityId, setCityId] = useState(listCities[0]?.id ?? "");
  const [qty, setQty] = useState(10);
  const [pw, setPw] = useState(1000);
  const [pi, setPi] = useState(0);
  const [pf, setPf] = useState(500);
  const [buyCity, setBuyCity] = useState(buyerCities[0]?.id ?? "");
  const [loading, setLoading] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submitList(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading("list");
    try {
      const res = await fetch("/api/market/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cityId,
          quantity: qty,
          priceWood: pw,
          priceIron: unlocks.iron ? pi : 0,
          priceFood: pf,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setErr(data.error ?? labels.errGeneric);
        return;
      }
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  async function buy(listingId: string) {
    setErr(null);
    setLoading(listingId);
    try {
      const res = await fetch("/api/market/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, buyerCityId: buyCity }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setErr(data.error ?? labels.errGeneric);
        return;
      }
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  const delayText = labels.delayNote.replace(
    "{sec}",
    String(MARKET_OPEN_DELAY_SEC),
  );

  return (
    <div className="space-y-8">
      <p className="text-sm leading-relaxed text-zinc-200">{labels.intro}</p>
      <p className="text-xs text-amber-200/90">{delayText}</p>

      {listCities.length > 0 && (
        <form
          onSubmit={submitList}
          className="rounded-lg border border-amber-800/45 bg-gradient-to-br from-amber-950/35 to-slate-900/45 p-4"
        >
          <h3 className="mb-3 text-sm font-semibold text-amber-100">
            {labels.listSoldiers}
          </h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-xs text-zinc-400">
              {labels.fromCity}
              <select
                className="mt-1 w-full rounded border border-zinc-600 bg-black/25 px-2 py-1.5 text-sm text-zinc-100"
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
              >
                {listCities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs text-zinc-400">
              {labels.qty}
              <input
                type="number"
                min={1}
                className="mt-1 w-full rounded border border-zinc-600 bg-black/25 px-2 py-1.5 text-sm text-zinc-100"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
              />
            </label>
            <label className="text-xs text-zinc-400">
              {labels.pw}
              <input
                type="number"
                min={0}
                className="mt-1 w-full rounded border border-zinc-600 bg-black/25 px-2 py-1.5 text-sm text-zinc-100"
                value={pw}
                onChange={(e) => setPw(Number(e.target.value))}
              />
            </label>
            {unlocks.iron && (
              <label className="text-xs text-zinc-400">
                {labels.pi}
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded border border-zinc-600 bg-black/25 px-2 py-1.5 text-sm text-zinc-100"
                  value={pi}
                  onChange={(e) => setPi(Number(e.target.value))}
                />
              </label>
            )}
            <label className="text-xs text-zinc-400">
              {labels.pf}
              <input
                type="number"
                min={0}
                className="mt-1 w-full rounded border border-zinc-600 bg-black/25 px-2 py-1.5 text-sm text-zinc-100"
                value={pf}
                onChange={(e) => setPf(Number(e.target.value))}
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={loading === "list"}
            className="mt-4 rounded bg-amber-700/85 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50"
          >
            {loading === "list" ? "…" : labels.submitList}
          </button>
        </form>
      )}

      {err && <p className="text-sm text-red-400">{err}</p>}

      <div>
        <h3 className="mb-2 text-sm font-semibold text-sky-200/90">
          {labels.opensAt}
        </h3>
        {buyerCities.length > 0 && (
          <label className="mb-3 block text-xs text-zinc-400">
            {labels.receiveCity}
            <select
              className="mt-1 w-full max-w-xs rounded border border-zinc-600 bg-black/25 px-2 py-1.5 text-sm text-zinc-100"
              value={buyCity}
              onChange={(e) => setBuyCity(e.target.value)}
            >
              {buyerCities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        )}

        {listings.length === 0 ? (
          <p className="text-sm text-zinc-500">{labels.empty}</p>
        ) : (
          <ul className="space-y-3">
            {listings.map((L) => {
              const open = new Date(L.opensAt).getTime();
              const canBuy = clock >= open;
              const locked = !canBuy;
              const sec = Math.max(0, Math.ceil((open - clock) / 1000));
              const isMine = L.sellerId === currentUserId;
              return (
                <li
                  key={L.id}
                  className="rounded-lg border border-sky-900/50 bg-slate-900/50 px-3 py-3 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-amber-100/90">
                        {L.quantity} {labels.soldiersUnit}
                      </span>
                      <span className="ml-2 text-zinc-500">
                        {L.cityName} · {labels.seller}: {L.sellerName} (
                        {L.tribeName})
                      </span>
                      {isMine && (
                        <span className="ml-2 text-xs text-amber-400">
                          ({labels.yourListing})
                        </span>
                      )}
                    </div>
                    <div className="tabular-nums text-xs text-zinc-400">
                      W{L.priceWood} {L.priceIron > 0 && `I${L.priceIron} `}
                      F{L.priceFood}
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <span
                      className={locked ? "text-amber-400" : "text-emerald-400"}
                    >
                      {locked
                        ? `${labels.wait}: ${sec}s`
                        : labels.ready}
                    </span>
                    {!isMine && (
                      <button
                        type="button"
                        disabled={
                          locked ||
                          loading === L.id ||
                          buyerCities.length === 0
                        }
                        onClick={() => buy(L.id)}
                        className="rounded bg-sky-700/80 px-3 py-1 text-xs font-medium text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {loading === L.id ? "…" : labels.buy}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

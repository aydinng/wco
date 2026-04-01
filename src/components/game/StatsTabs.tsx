"use client";

import { useState } from "react";

type Row = { rank: number; name: string; score: number };

export function StatsTabs({
  locale,
  playerRows,
  allianceRows,
}: {
  locale: string;
  playerRows: Row[];
  allianceRows: { rank: number; name: string; founder: string; total: number }[];
}) {
  const [tab, setTab] = useState<"players" | "alliances">("players");
  const t =
    locale === "en"
      ? { players: "Player ranking", alliances: "Alliance power" }
      : { players: "Oyuncu skor sıralaması", alliances: "İttifak güç sıralaması" };

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab("players")}
          className={`rounded border px-3 py-1.5 text-sm ${
            tab === "players"
              ? "border-amber-600/80 bg-amber-950/40 text-amber-100"
              : "border-zinc-600 text-zinc-400 hover:bg-white/5"
          }`}
        >
          {t.players}
        </button>
        <button
          type="button"
          onClick={() => setTab("alliances")}
          className={`rounded border px-3 py-1.5 text-sm ${
            tab === "alliances"
              ? "border-amber-600/80 bg-amber-950/40 text-amber-100"
              : "border-zinc-600 text-zinc-400 hover:bg-white/5"
          }`}
        >
          {t.alliances}
        </button>
      </div>

      {tab === "players" && (
        <table className="w-full border-collapse border border-zinc-700 text-sm">
          <thead className="bg-black/30 text-left text-xs uppercase text-zinc-500">
            <tr>
              <th className="border border-zinc-700 p-2">#</th>
              <th className="border border-zinc-700 p-2">
                {locale === "en" ? "Player" : "Oyuncu"}
              </th>
              <th className="border border-zinc-700 p-2 tabular-nums">
                {locale === "en" ? "Score" : "Skor"}
              </th>
            </tr>
          </thead>
          <tbody>
            {playerRows.map((r) => (
              <tr key={r.rank} className="text-zinc-300">
                <td className="border border-zinc-800 p-2 tabular-nums">
                  {r.rank}
                </td>
                <td className="border border-zinc-800 p-2">{r.name}</td>
                <td className="border border-zinc-800 p-2 tabular-nums">
                  {r.score.toLocaleString(locale === "en" ? "en-US" : "tr-TR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "alliances" && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse border border-zinc-700 text-sm">
            <thead className="bg-black/30 text-left text-xs uppercase text-zinc-500">
              <tr>
                <th className="border border-zinc-700 p-2">#</th>
                <th className="border border-zinc-700 p-2">
                  {locale === "en" ? "Alliance" : "İttifak"}
                </th>
                <th className="border border-zinc-700 p-2">
                  {locale === "en" ? "Founder" : "Kurucu"}
                </th>
                <th className="border border-zinc-700 p-2">
                  {locale === "en" ? "Power" : "Güç"}
                </th>
              </tr>
            </thead>
            <tbody>
              {allianceRows.map((r) => (
                <tr key={r.rank} className="text-zinc-300">
                  <td className="border border-zinc-800 p-2 align-top tabular-nums">
                    {r.rank}
                  </td>
                  <td className="border border-zinc-800 p-2 align-top font-medium text-amber-100/90">
                    {r.name}
                  </td>
                  <td className="border border-zinc-800 p-2 align-top text-zinc-400">
                    {r.founder}
                  </td>
                  <td className="border border-zinc-800 p-2 align-top">
                    <span className="tabular-nums text-zinc-200">
                      {r.total.toLocaleString(
                        locale === "en" ? "en-US" : "tr-TR",
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

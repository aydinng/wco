"use client";

import { useState } from "react";

type Row = { rank: number; name: string; score: number };

type Props = {
  playerRows: Row[];
  allianceRows: { rank: number; name: string; founder: string; prod: number; tech: number; bld: number; total: number }[];
  initialTab?: "p" | "a";
  /** Sadece ittifak tablosu (diplomasi sayfası) */
  allianceOnly?: boolean;
  labels: {
    tabPlayers: string;
    tabAlliances: string;
    colRank: string;
    colName: string;
    colScore: string;
    colFounder: string;
    colProd: string;
    colTech: string;
    colBld: string;
    colTotal: string;
  };
};

function ScoreBar({ pct, color }: { pct: number; color: string }) {
  const p = Math.max(0, Math.min(100, pct));
  return (
    <div className="flex min-w-[100px] items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded bg-zinc-800">
        <div className={`h-full ${color}`} style={{ width: `${p}%` }} />
      </div>
      <span className="shrink-0 tabular-nums text-xs text-zinc-400">{p}%</span>
    </div>
  );
}

function AllianceTable({
  allianceRows,
  labels,
}: {
  allianceRows: Props["allianceRows"];
  labels: Props["labels"];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse border border-zinc-700 text-sm">
        <thead>
          <tr className="border-b border-zinc-600 bg-black/30 text-left text-xs text-zinc-500">
            <th className="p-2">{labels.colRank}</th>
            <th className="p-2">{labels.colName}</th>
            <th className="p-2">{labels.colFounder}</th>
            <th className="p-2">{labels.colProd}</th>
            <th className="p-2">{labels.colTech}</th>
            <th className="p-2">{labels.colBld}</th>
            <th className="p-2">{labels.colTotal}</th>
          </tr>
        </thead>
        <tbody>
          {allianceRows.map((r) => (
            <tr key={r.rank} className="border-b border-zinc-800 align-top">
              <td className="p-2 tabular-nums text-zinc-400">{r.rank}</td>
              <td className="p-2 font-medium text-amber-100/90">{r.name}</td>
              <td className="p-2 text-zinc-300">{r.founder}</td>
              <td className="p-2">
                <ScoreBar pct={r.prod} color="bg-red-600" />
              </td>
              <td className="p-2">
                <ScoreBar pct={r.tech} color="bg-yellow-500" />
              </td>
              <td className="p-2">
                <ScoreBar pct={r.bld} color="bg-blue-600" />
              </td>
              <td className="p-2">
                <ScoreBar pct={r.total} color="bg-zinc-500" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatsRankingsTabs({
  playerRows,
  allianceRows,
  initialTab = "p",
  allianceOnly = false,
  labels,
}: Props) {
  const [tab, setTab] = useState<"p" | "a">(allianceOnly ? "a" : initialTab);

  if (allianceOnly) {
    return (
      <div className="w-full">
        <AllianceTable allianceRows={allianceRows} labels={labels} />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab("p")}
          className={`rounded border px-3 py-1.5 text-sm ${
            tab === "p"
              ? "border-amber-600 bg-amber-950/50 text-amber-100"
              : "border-zinc-600 text-zinc-400 hover:bg-white/5"
          }`}
        >
          {labels.tabPlayers}
        </button>
        <button
          type="button"
          onClick={() => setTab("a")}
          className={`rounded border px-3 py-1.5 text-sm ${
            tab === "a"
              ? "border-amber-600 bg-amber-950/50 text-amber-100"
              : "border-zinc-600 text-zinc-400 hover:bg-white/5"
          }`}
        >
          {labels.tabAlliances}
        </button>
      </div>

      {tab === "p" ? (
        <div className="overflow-x-auto">
          {playerRows.length === 0 ? (
            <p className="text-sm text-zinc-500">—</p>
          ) : (
          <table className="w-full border-collapse border border-zinc-700 text-sm">
            <thead>
              <tr className="border-b border-zinc-600 bg-black/30 text-left text-xs text-zinc-500">
                <th className="p-2">{labels.colRank}</th>
                <th className="p-2">{labels.colName}</th>
                <th className="p-2">{labels.colScore}</th>
              </tr>
            </thead>
            <tbody>
              {playerRows.map((r) => (
                <tr key={r.rank} className="border-b border-zinc-800">
                  <td className="p-2 tabular-nums text-zinc-400">{r.rank}</td>
                  <td className="p-2 text-amber-100/90">{r.name}</td>
                  <td className="p-2 tabular-nums">{r.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      ) : (
        <AllianceTable allianceRows={allianceRows} labels={labels} />
      )}
    </div>
  );
}

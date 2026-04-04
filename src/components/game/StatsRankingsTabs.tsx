"use client";

import { useState } from "react";

type Row = { rank: number; name: string; score: number };

type AllianceRow = {
  rank: number;
  name: string;
  founder: string;
  prod: number;
  tech: number;
  bld: number;
  total: number;
  id?: string;
  inviteOnly?: boolean;
};

type Props = {
  playerRows: Row[];
  allianceRows: AllianceRow[];
  initialTab?: "p" | "a";
  allianceOnly?: boolean;
  /** Klasik siyah / kırmızı başlık / sarı metin (örnek görsel) */
  classic?: boolean;
  /** Bu kullanıcı adı satırı vurgulanır */
  highlightUsername?: string | null;
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

function ScoreBar({
  pct,
  color,
  classic,
}: {
  pct: number;
  color: string;
  classic?: boolean;
}) {
  const p = Math.max(0, Math.min(100, pct));
  return (
    <div className="flex min-w-[100px] items-center gap-2">
      <div
        className={
          classic
            ? "h-2.5 flex-1 overflow-hidden border border-[#333] bg-black"
            : "h-2 flex-1 overflow-hidden rounded bg-zinc-800"
        }
      >
        <div className={`h-full ${color}`} style={{ width: `${p}%` }} />
      </div>
      <span
        className={
          classic
            ? "shrink-0 tabular-nums text-xs text-[#FFFF00]"
            : "shrink-0 tabular-nums text-xs text-zinc-400"
        }
      >
        {p}%
      </span>
    </div>
  );
}

function AllianceTable({
  allianceRows,
  labels,
  classic,
}: {
  allianceRows: AllianceRow[];
  labels: Props["labels"];
  classic?: boolean;
}) {
  const wrap = classic
    ? "relative border border-[#333] bg-black"
    : "overflow-x-auto";

  return (
    <div className={wrap}>
      {classic ? (
        <p
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-4xl font-bold text-emerald-500/15 sm:text-6xl"
          aria-hidden
        >
          İTTİFAKLAR
        </p>
      ) : null}
      <div className={classic ? "relative overflow-x-auto" : ""}>
        <table
          className={
            classic
              ? "w-full min-w-[640px] border-collapse border border-[#333] text-sm"
              : "w-full min-w-[640px] border-collapse border border-zinc-700 text-sm"
          }
        >
          <thead>
            <tr
              className={
                classic
                  ? "border-b border-[#333] bg-black text-left text-xs font-semibold text-red-600"
                  : "border-b border-zinc-600 bg-black/30 text-left text-xs text-zinc-500"
              }
            >
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
              <tr
                key={`${r.rank}-${r.name}`}
                className={
                  classic
                    ? "border-b border-[#333] align-top text-[#FFFF00]"
                    : "border-b border-zinc-800 align-top"
                }
              >
                <td
                  className={
                    classic
                      ? "p-2 tabular-nums text-[#FFFF00]"
                      : "p-2 tabular-nums text-zinc-400"
                  }
                >
                  {r.rank}
                </td>
                <td
                  className={
                    classic
                      ? "p-2 font-medium text-[#FFFF00]"
                      : "p-2 font-medium text-amber-100/90"
                  }
                >
                  {r.name}
                </td>
                <td
                  className={
                    classic ? "p-2 text-[#FFFF00]" : "p-2 text-zinc-300"
                  }
                >
                  {r.founder}
                </td>
                <td className="p-2">
                  <ScoreBar pct={r.prod} color="bg-red-600" classic={classic} />
                </td>
                <td className="p-2">
                  <ScoreBar
                    pct={r.tech}
                    color="bg-yellow-500"
                    classic={classic}
                  />
                </td>
                <td className="p-2">
                  <ScoreBar pct={r.bld} color="bg-blue-600" classic={classic} />
                </td>
                <td className="p-2">
                  <ScoreBar pct={r.total} color="bg-zinc-500" classic={classic} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function StatsRankingsTabs({
  playerRows,
  allianceRows,
  initialTab = "p",
  allianceOnly = false,
  classic = false,
  highlightUsername,
  labels,
}: Props) {
  const [tab, setTab] = useState<"p" | "a">(allianceOnly ? "a" : initialTab);

  if (allianceOnly) {
    return (
      <div className="w-full">
        <AllianceTable
          allianceRows={allianceRows}
          labels={labels}
          classic={classic}
        />
      </div>
    );
  }

  const tabBtn = (active: boolean) =>
    classic
      ? `rounded border px-3 py-1.5 text-sm ${
          active
            ? "border-[#FFFF00] bg-black text-[#FFFF00]"
            : "border-[#333] text-zinc-500 hover:border-zinc-600"
        }`
      : `rounded border px-3 py-1.5 text-sm ${
          active
            ? "border-amber-600 bg-amber-950/50 text-amber-100"
            : "border-zinc-600 text-zinc-400 hover:bg-white/5"
        }`;

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab("p")}
          className={tabBtn(tab === "p")}
        >
          {labels.tabPlayers}
        </button>
        <button
          type="button"
          onClick={() => setTab("a")}
          className={tabBtn(tab === "a")}
        >
          {labels.tabAlliances}
        </button>
      </div>

      {tab === "p" ? (
        <div
          className={
            classic
              ? "overflow-x-auto border border-[#333] bg-black"
              : "overflow-x-auto"
          }
        >
          {playerRows.length === 0 ? (
            <p className={classic ? "p-4 text-sm text-[#FFFF00]" : "text-sm text-zinc-500"}>
              —
            </p>
          ) : (
            <table
              className={
                classic
                  ? "w-full border-collapse border border-[#333] text-sm"
                  : "w-full border-collapse border border-zinc-700 text-sm"
              }
            >
              <thead>
                <tr
                  className={
                    classic
                      ? "border-b border-[#333] bg-black text-left text-xs font-semibold text-red-600"
                      : "border-b border-zinc-600 bg-black/30 text-left text-xs text-zinc-500"
                  }
                >
                  <th className="p-2">{labels.colRank}</th>
                  <th className="p-2">{labels.colName}</th>
                  <th className="p-2">{labels.colScore}</th>
                </tr>
              </thead>
              <tbody>
                {playerRows.map((r) => {
                  const hi =
                    highlightUsername &&
                    r.name.toLowerCase() === highlightUsername.toLowerCase();
                  return (
                    <tr
                      key={r.rank}
                      className={
                        classic
                          ? `border-b border-[#333] ${hi ? "bg-zinc-900/80" : ""}`
                          : "border-b border-zinc-800"
                      }
                    >
                      <td
                        className={
                          classic
                            ? "p-2 tabular-nums text-[#FFFF00]"
                            : "p-2 tabular-nums text-zinc-400"
                        }
                      >
                        {r.rank}
                      </td>
                      <td
                        className={
                          classic
                            ? "p-2 text-[#FFFF00]"
                            : "p-2 text-amber-100/90"
                        }
                      >
                        {r.name}
                      </td>
                      <td
                        className={
                          classic
                            ? "p-2 tabular-nums text-[#FFFF00]"
                            : "p-2 tabular-nums"
                        }
                      >
                        {r.score.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <AllianceTable
          allianceRows={allianceRows}
          labels={labels}
          classic={classic}
        />
      )}
    </div>
  );
}

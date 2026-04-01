"use client";

import { useMemo } from "react";

export type MapCityPoint = {
  id: string;
  x: number;
  y: number;
  name: string;
  owner: string;
  tribe: string;
  isMine: boolean;
};

type Props = {
  points: MapCityPoint[];
  legendYou: string;
  legendOther: string;
  planeHint: string;
};

export function WorldMap2D({ points, legendYou, legendOther, planeHint }: Props) {
  const circles = useMemo(() => {
    if (points.length === 0) return [];
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const p of points) {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    }
    const dx = maxX - minX || 1;
    const dy = maxY - minY || 1;
    return points.map((p) => {
      const nx = 6 + ((p.x - minX) / dx) * 88;
      const ny = 6 + ((maxY - p.y) / dy) * 88;
      return {
        key: p.id,
        name: `${p.name} — ${p.owner} (${p.tribe})`,
        cx: nx,
        cy: ny,
        r: p.isMine ? 3.5 : 2.5,
        fill: p.isMine ? "#f59e0b" : "#0ea5e9",
      };
    });
  }, [points]);

  if (points.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-slate-900/80 via-amber-950/30 to-sky-950/40 p-3 shadow-inner">
      <div className="mb-2 flex flex-wrap gap-4 text-xs text-zinc-200">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />{" "}
          {legendYou}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-sky-500" />{" "}
          {legendOther}
        </span>
      </div>
      <svg
        viewBox="0 0 100 100"
        className="h-auto max-h-[min(420px,55vh)] w-full rounded-lg border border-amber-800/30 bg-[linear-gradient(180deg,rgba(15,23,42,0.92)_0%,rgba(30,58,95,0.45)_45%,rgba(25,55,40,0.7)_100%)]"
        preserveAspectRatio="xMidYMid meet"
        aria-label="World map"
      >
        <defs>
          <pattern
            id="grid"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 10 0 L 0 0 0 10"
              fill="none"
              stroke="rgba(251,191,36,0.14)"
              strokeWidth="0.35"
            />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        {circles.map((c) => (
          <g key={c.key}>
            <circle
              cx={c.cx}
              cy={c.cy}
              r={c.r}
              fill={c.fill}
              fillOpacity={0.95}
              stroke="rgba(0,0,0,0.35)"
              strokeWidth="0.35"
            />
            <title>{c.name}</title>
          </g>
        ))}
      </svg>
      <p className="mt-2 text-center text-[10px] text-zinc-500">{planeHint}</p>
    </div>
  );
}

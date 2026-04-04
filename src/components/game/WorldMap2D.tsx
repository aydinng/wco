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

type CoordBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

type Props = {
  points: MapCityPoint[];
  legendYou: string;
  legendOther: string;
  planeHint: string;
  coordBounds: CoordBounds;
};

/** Modern uydu / taktik görünüm: koordinat ızgarası ve sektör hissi. */
export function WorldMap2D({
  points,
  legendYou,
  legendOther,
  planeHint,
  coordBounds,
}: Props) {
  const { circles, sectorLabels } = useMemo(() => {
    if (points.length === 0) {
      return { circles: [], sectorLabels: [] };
    }
    const { minX, maxX, minY, maxY } = coordBounds;
    const dx = maxX - minX || 1;
    const dy = maxY - minY || 1;

    const built = points.map((p) => {
      const nx = 8 + ((p.x - minX) / dx) * 84;
      const ny = 8 + ((maxY - p.y) / dy) * 84;
      return {
        key: p.id,
        name: `${p.name} — ${p.owner} (${p.tribe}) — ${p.x}:${p.y}`,
        cx: nx,
        cy: ny,
        r: p.isMine ? 2.8 : 2.1,
        fill: p.isMine ? "#fbbf24" : "#38bdf8",
        stroke: p.isMine ? "#f59e0b" : "#0ea5e9",
      };
    });

    const sectors: { x: number; y: number; t: string }[] = [];
    for (let i = 0; i <= 4; i++) {
      const gx = 8 + (i / 4) * 84;
      const vx = Math.round(minX + (i / 4) * dx);
      sectors.push({ x: gx, y: 97, t: String(vx) });
    }
    for (let j = 0; j <= 4; j++) {
      const gy = 8 + (j / 4) * 84;
      const vy = Math.round(maxY - (j / 4) * dy);
      sectors.push({ x: 1, y: gy, t: String(vy) });
    }

    return { circles: built, sectorLabels: sectors };
  }, [points, coordBounds]);

  if (points.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-600/50 bg-gradient-to-br from-slate-950/95 via-[#0c1829]/95 to-emerald-950/40 p-3 shadow-inner ring-1 ring-white/5">
      <div className="mb-2 flex flex-wrap gap-4 text-xs text-zinc-200">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]" />{" "}
          {legendYou}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.55)]" />{" "}
          {legendOther}
        </span>
      </div>
      <svg
        viewBox="0 0 100 100"
        className="h-auto max-h-[min(480px,60vh)] w-full rounded-lg border border-slate-700/60 shadow-lg"
        preserveAspectRatio="xMidYMid meet"
        aria-label="World map"
      >
        <defs>
          <linearGradient id="satBase" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0b1220" />
            <stop offset="35%" stopColor="#132a1f" />
            <stop offset="65%" stopColor="#0f2740" />
            <stop offset="100%" stopColor="#0a1628" />
          </linearGradient>
          <pattern
            id="wmGridFine"
            width="4"
            height="4"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 4 0 L 0 0 0 4"
              fill="none"
              stroke="rgba(148,163,184,0.12)"
              strokeWidth="0.15"
            />
          </pattern>
          <pattern
            id="wmGridMajor"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="rgba(251,191,36,0.18)"
              strokeWidth="0.35"
            />
          </pattern>
          <filter id="glowPin" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="100" height="100" fill="url(#satBase)" />
        <rect width="100" height="100" fill="url(#wmGridFine)" opacity={0.9} />
        <rect width="100" height="100" fill="url(#wmGridMajor)" opacity={0.55} />

        <g opacity={0.35} stroke="rgba(56,189,248,0.25)" strokeWidth="0.2">
          <line x1="8" y1="8" x2="92" y2="8" />
          <line x1="8" y1="92" x2="92" y2="92" />
          <line x1="8" y1="8" x2="8" y2="92" />
          <line x1="92" y1="8" x2="92" y2="92" />
        </g>

        {sectorLabels.map((s, i) => (
          <text
            key={`lbl-${i}`}
            x={s.x}
            y={s.y}
            fill="rgba(226,232,240,0.55)"
            fontSize="2.8"
            textAnchor={s.x < 5 ? "start" : "middle"}
            className="select-none font-mono"
          >
            {s.t}
          </text>
        ))}

        {circles.map((c) => (
          <g key={c.key} filter="url(#glowPin)">
            <rect
              x={c.cx - c.r}
              y={c.cy - c.r}
              width={c.r * 2}
              height={c.r * 2}
              transform={`rotate(45 ${c.cx} ${c.cy})`}
              fill={c.fill}
              fillOpacity={0.92}
              stroke={c.stroke}
              strokeWidth={0.4}
            />
            <title>{c.name}</title>
          </g>
        ))}
      </svg>
      <p className="mt-2 text-center text-[11px] leading-snug text-slate-400">
        {planeHint}
      </p>
    </div>
  );
}

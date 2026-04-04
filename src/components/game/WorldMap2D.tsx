"use client";

import { useMemo } from "react";

export type MapMarkerKind = "me" | "ally" | "neutral";

export type MapCityPoint = {
  id: string;
  x: number;
  y: number;
  name: string;
  owner: string;
  tribe: string;
  marker: MapMarkerKind;
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
  legendAlly: string;
  planeHint: string;
  coordBounds: CoordBounds;
  footerExtra?: string;
};

function markerColors(kind: MapMarkerKind): {
  fill: string;
  stroke: string;
  glow: string;
} {
  if (kind === "me") {
    return { fill: "#fcd34d", stroke: "#f59e0b", glow: "rgba(251,191,36,0.35)" };
  }
  if (kind === "ally") {
    return { fill: "#4ade80", stroke: "#16a34a", glow: "rgba(34,197,94,0.35)" };
  }
  return { fill: "#38bdf8", stroke: "#0ea5e9", glow: "rgba(56,189,248,0.25)" };
}

/** Şehir kale işareti — tüm oyuncular için aynı silüet */
function CityGlyph({
  cx,
  cy,
  fill,
  stroke,
}: {
  cx: number;
  cy: number;
  fill: string;
  stroke: string;
}) {
  return (
    <g transform={`translate(${cx},${cy}) scale(0.14)`}>
      <path
        transform="translate(-12,-14)"
        d="M4 22h16v2H4v-2zm2-4h2v2H6v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM5 8h2v10H5V8zm4 0h2v4H9V8zm4 0h2v4h-2V8zm4 0h2v10h-2V8zm4-2l2-2v2h2l-8-6-8 6h2V6l2 2V4h12v2z"
        fill={fill}
        stroke={stroke}
        strokeWidth={0.5}
      />
    </g>
  );
}

export function WorldMap2D({
  points,
  legendYou,
  legendOther,
  legendAlly,
  planeHint,
  coordBounds,
  footerExtra,
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
      const col = markerColors(p.marker);
      return {
        key: p.id,
        name: `${p.name} — ${p.owner} (${p.tribe}) — ${p.x}:${p.y}`,
        cx: nx,
        cy: ny,
        mine: p.marker === "me",
        fill: col.fill,
        stroke: col.stroke,
        glow: col.glow,
        marker: p.marker,
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
    <div className="w-full max-w-[1600px] rounded-xl border border-slate-500/60 bg-gradient-to-br from-slate-950 via-[#071a2e] to-emerald-950/50 p-4 shadow-[0_0_40px_-8px_rgba(251,191,36,0.15)] ring-1 ring-amber-900/20">
      <div className="mb-2 flex flex-wrap gap-4 text-xs text-zinc-200">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]" />{" "}
          {legendYou}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-400 shadow-[0_0_6px_rgba(34,197,94,0.55)]" />{" "}
          {legendAlly}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.55)]" />{" "}
          {legendOther}
        </span>
      </div>
      <svg
        viewBox="0 0 100 100"
        className="h-auto min-h-[420px] w-full max-h-[min(720px,78vh)] rounded-lg border border-slate-700/60 shadow-lg"
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
              stroke="rgba(148,163,184,0.14)"
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
              stroke="rgba(251,191,36,0.22)"
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
          <g
            key={c.key}
            filter="url(#glowPin)"
            className={c.mine ? "animate-pulse" : undefined}
          >
            <circle
              cx={c.cx}
              cy={c.cy}
              r={5}
              fill="none"
              stroke={c.glow}
              strokeWidth={0.45}
              opacity={0.65}
            />
            <CityGlyph cx={c.cx} cy={c.cy} fill={c.fill} stroke={c.stroke} />
            <title>{c.name}</title>
          </g>
        ))}
      </svg>
      <p className="mt-2 text-center text-[11px] leading-snug text-slate-400">
        {planeHint}
      </p>
      {footerExtra ? (
        <p className="mt-2 border-t border-slate-700/50 pt-2 text-center text-[11px] leading-relaxed text-slate-500">
          {footerExtra}
        </p>
      ) : null}
    </div>
  );
}

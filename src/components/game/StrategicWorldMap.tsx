"use client";

import type { StrategicWorldMapData } from "@/config/strategic-world-map.types";
import { useMemo } from "react";

type Locale = "tr" | "en";

const VB = 100;

/** 0–1000 JSON koordinatını SVG viewBox (0–100) ile hizala */
function n(x: number) {
  return (x / 1000) * VB;
}

function pathFromPoints(points: [number, number][]) {
  if (points.length === 0) return "";
  const [fx, fy] = points[0]!;
  let d = `M ${n(fx)} ${n(fy)}`;
  for (let i = 1; i < points.length; i++) {
    const [x, y] = points[i]!;
    d += ` L ${n(x)} ${n(y)}`;
  }
  d += " Z";
  return d;
}

function polylineFromPath(path: [number, number][]) {
  if (path.length === 0) return "";
  return path.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${n(x)} ${n(y)}`).join(" ");
}

type Props = {
  data: StrategicWorldMapData;
  locale: Locale;
};

function nodeGlyph(type: string, cx: number, cy: number) {
  const r = 1.8;
  switch (type) {
    case "chokepoint":
      return (
        <polygon
          points={`${cx},${cy - r} ${cx + r},${cy + r * 0.6} ${cx - r},${cy + r * 0.6}`}
          className="fill-amber-400 stroke-amber-200"
          strokeWidth={0.25}
        />
      );
    case "energy_basin":
      return (
        <circle cx={cx} cy={cy} r={r} className="fill-emerald-500/90 stroke-emerald-200" strokeWidth={0.25} />
      );
    case "tech_hub":
      return (
        <rect
          x={cx - r}
          y={cy - r}
          width={r * 2}
          height={r * 2}
          className="fill-sky-500/90 stroke-sky-200"
          strokeWidth={0.25}
        />
      );
    default:
      return <circle cx={cx} cy={cy} r={r * 0.6} className="fill-zinc-400" />;
  }
}

export function StrategicWorldMap({ data, locale }: Props) {
  const t = (o: { tr: string; en: string }) => o[locale];

  const routeDash = useMemo(
    () =>
      ({
        sea: "0.4 0.8",
        land: "1.2 0.6",
        air_corridor: "0.2 0.6",
      }) as Record<string, string>,
    [],
  );

  return (
    <div className="rounded-xl border border-slate-600/50 bg-gradient-to-b from-slate-950/95 via-slate-900/90 to-slate-950/95 p-3 shadow-inner">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3
            className="text-base font-bold text-slate-100"
            style={{ fontFamily: "var(--font-warcity), serif" }}
          >
            {t(data.meta.title)}
          </h3>
          <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-slate-500">
            {data.meta.inspiration.join(" · ")}
          </p>
        </div>
        <div className="text-[10px] text-slate-600">
          {data.meta.coordinateSystem.note}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        className="h-auto max-h-[min(480px,60vh)] w-full rounded-lg border border-slate-700/60 bg-[#0a0f18]"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={t(data.meta.title)}
      >
        <defs>
          <pattern id="stratGrid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path
              d="M 5 0 L 0 0 0 5"
              fill="none"
              className="stroke-slate-700/35"
              strokeWidth={0.08}
            />
          </pattern>
        </defs>
        <rect width={VB} height={VB} fill="url(#stratGrid)" />

        {data.factions.map((f) => (
          <path
            key={f.id}
            d={pathFromPoints(f.territory.points)}
            fill={f.fillColor}
            fillOpacity={0.28}
            stroke={f.strokeColor}
            strokeWidth={0.35}
            strokeOpacity={0.85}
          />
        ))}

        {data.logisticsRoutes.map((r) => (
          <path
            key={r.id}
            d={polylineFromPath(r.path)}
            fill="none"
            strokeWidth={0.45}
            strokeDasharray={routeDash[r.type] ?? "0.5 0.5"}
            className={
              r.type === "sea"
                ? "stroke-cyan-400/85"
                : r.type === "land"
                  ? "stroke-amber-500/90"
                  : "stroke-fuchsia-400/80"
            }
          />
        ))}

        {data.strategicNodes.map((node) => {
          const [px, py] = node.position;
          const cx = n(px);
          const cy = n(py);
          return (
            <g key={node.id}>
              {nodeGlyph(node.type, cx, cy)}
              <title>
                {t(node.names)} · {node.type}
              </title>
            </g>
          );
        })}

      </svg>

      <div className="mt-3 grid gap-3 text-[10px] sm:grid-cols-2">
        <div className="rounded border border-slate-700/50 bg-black/30 p-2">
          <div className="mb-1 font-semibold uppercase tracking-wide text-red-400/90">
            {locale === "en" ? "Factions" : "Bloklar"}
          </div>
          <ul className="space-y-1 text-slate-400">
            {data.factions.map((f) => (
              <li key={f.id} className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-sm border border-white/20"
                  style={{ backgroundColor: f.fillColor }}
                />
                <span className="font-mono text-slate-500">{f.code}</span>
                <span className="text-slate-300">{t(f.names)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded border border-slate-700/50 bg-black/30 p-2">
          <div className="mb-1 font-semibold uppercase tracking-wide text-amber-500/90">
            {locale === "en" ? "Nodes & routes" : "Düğümler & hatlar"}
          </div>
          <ul className="space-y-0.5 text-slate-500">
            <li className="flex items-center gap-1">
              <span className="text-amber-400">▲</span>{" "}
              {locale === "en" ? "Choke" : "Dar geçit"}
            </li>
            <li className="flex items-center gap-1">
              <span className="text-emerald-400">●</span>{" "}
              {locale === "en" ? "Energy" : "Enerji"}
            </li>
            <li className="flex items-center gap-1">
              <span className="text-sky-400">■</span>{" "}
              {locale === "en" ? "Tech hub" : "Teknoloji üssü"}
            </li>
            <li className="pt-1 text-slate-600">
              — {locale === "en" ? "Sea / land / air logistics" : "Deniz / kara / hava lojistiği"}{" "}
              (çizgi türleri)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

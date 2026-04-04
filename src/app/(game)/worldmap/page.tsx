import { FleetSendForm } from "@/components/game/FleetSendForm";
import { WorldMap2D, type MapCityPoint } from "@/components/game/WorldMap2D";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/current-user";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

function coordBoundsFromRows(
  rows: { coordX: number; coordY: number }[],
): { minX: number; maxX: number; minY: number; maxY: number } {
  if (rows.length === 0) {
    return { minX: 0, maxX: 1, minY: 0, maxY: 1 };
  }
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const c of rows) {
    minX = Math.min(minX, c.coordX);
    maxX = Math.max(maxX, c.coordX);
    minY = Math.min(minY, c.coordY);
    maxY = Math.max(maxY, c.coordY);
  }
  if (!Number.isFinite(minX)) {
    return { minX: 0, maxX: 1, minY: 0, maxY: 1 };
  }
  return { minX, maxX, minY, maxY };
}

export default async function WorldmapPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const p = dict.play;
  const me = await getCurrentUser();

  const rows = await prisma.city.findMany({
    include: {
      user: { select: { id: true, username: true, tribeName: true } },
    },
    orderBy: { name: "asc" },
  });

  const coordBounds = coordBoundsFromRows(rows);

  const points: MapCityPoint[] = rows.map((c) => ({
    id: c.id,
    x: c.coordX,
    y: c.coordY,
    name: c.name,
    owner: c.user.username,
    tribe: c.user.tribeName,
    isMine: me?.id === c.userId,
  }));

  return (
    <div className="rounded-xl border border-amber-800/40 bg-gradient-to-br from-slate-900/65 via-amber-950/20 to-emerald-950/25 p-4 shadow-lg backdrop-blur-sm sm:p-6">
      <h2
        className="mb-2 text-xl text-amber-100"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        {p.worldmapTitle}
      </h2>
      <p className="mb-4 max-w-3xl text-sm leading-relaxed text-zinc-200">
        {p.worldmapIntro}
      </p>

      <h3 className="mb-2 text-sm font-semibold text-amber-200/90">
        {p.worldmapAllPlayers}
      </h3>
      {points.length > 0 ? (
        <WorldMap2D
          points={points}
          coordBounds={coordBounds}
          legendYou={p.worldmapLegendYou}
          legendOther={p.worldmapLegendOther}
          planeHint={p.worldmapPlaneHint}
        />
      ) : (
        <p className="text-sm text-zinc-500">{p.worldmapNoCities}</p>
      )}

      {me && me.cities.length > 0 && (
        <div className="mt-6 rounded-lg border border-amber-900/40 bg-black/30 p-4">
          <h3
            className="mb-3 text-sm font-semibold text-amber-200/90"
            style={{ fontFamily: "var(--font-warcity), serif" }}
          >
            {locale === "en" ? "Send fleet" : "Filo gönder"}
          </h3>
          <FleetSendForm
            cities={me.cities.map((c) => ({
              id: c.id,
              name: c.name,
              coordX: c.coordX,
              coordY: c.coordY,
              coordZ: c.coordZ,
              soldiers: c.soldiers,
              barracksLevel: c.barracksLevel,
            }))}
            play={p}
          />
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border border-[#2a3441]/70 bg-black/20">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-amber-900/40 bg-amber-950/30 text-left text-xs uppercase text-amber-200/80">
              <th className="px-3 py-2">{p.resourcesCity}</th>
              <th className="px-3 py-2">{p.worldmapCoord}</th>
              <th className="px-3 py-2">{p.marketSeller}</th>
              <th className="px-3 py-2">{p.marketTribe}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr
                key={c.id}
                className="border-b border-zinc-800/80 odd:bg-black/15 even:bg-black/10"
              >
                <td className="px-3 py-2">
                  {me?.id === c.userId ? (
                    <Link
                      href={`/city/${c.id}`}
                      className="font-medium text-amber-100 hover:underline"
                    >
                      {c.name}
                    </Link>
                  ) : (
                    <span className="text-zinc-200">{c.name}</span>
                  )}
                </td>
                <td className="px-3 py-2 tabular-nums text-zinc-300">
                  {c.coordX}:{c.coordY}:{c.coordZ}
                </td>
                <td className="px-3 py-2 text-zinc-400">
                  {c.user.username}
                </td>
                <td className="px-3 py-2 text-zinc-500">
                  {c.user.tribeName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col gap-2 border-t border-amber-900/30 pt-4 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <Link
            href="/fleet"
            className="text-amber-200/90 underline underline-offset-2 hover:text-amber-50"
          >
            {dict.game.fleet}
          </Link>
          {" — "}
          {locale === "en"
            ? "View troops by city and unit type."
            : "Şehir ve birim türüne göre askerleri görüntüle."}
        </p>
        <p className="text-xs text-zinc-500">{p.worldmapComingSoon}</p>
      </div>
    </div>
  );
}

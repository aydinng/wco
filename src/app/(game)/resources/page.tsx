import { LiveStock } from "@/components/game/LiveStock";
import { LiveTotalStocks } from "@/components/game/LiveTotalStocks";
import { ResourceIcon } from "@/components/game/ResourceIcon";
import { eraIndex, getResourceUnlocks } from "@/config/eras";
import { getDictionary } from "@/i18n/dictionaries";
import {
  hourlyFoodConsumption,
  hourlyProduction,
  safeInt,
  sumProduction,
} from "@/lib/economy";
import { getCurrentUser } from "@/lib/current-user";
import { getLocale } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const p = dict.play;
  const user = await getCurrentUser();
  const cities = user?.cities ?? [];
  const researchTier = user?.researchTier ?? 0;
  const unlocks = getResourceUnlocks(user?.currentEra);
  const eraIdx = eraIndex(user?.currentEra);

  if (!user || cities.length === 0) {
    return (
      <div className="rounded border border-[#2a3441]/90 bg-black/35 p-4 backdrop-blur-sm">
        <h2
          className="mb-2 text-lg text-amber-200/90"
          style={{ fontFamily: "var(--font-warcity), serif" }}
        >
          {p.resourcesTitle}
        </h2>
        <p className="text-sm text-zinc-500">{p.overviewNoSeed}</p>
      </div>
    );
  }

  const sumH = sumProduction(cities, researchTier, unlocks);
  const sumFoodCons = cities.reduce(
    (a, c) => a + hourlyFoodConsumption(c, eraIdx),
    0,
  );
  const netFoodHour = sumH.food - sumFoodCons;

  const liveCities = cities.map((c) => {
    const h = hourlyProduction(c, researchTier, unlocks);
    const fc = hourlyFoodConsumption(c, eraIdx);
    return {
      wood: c.wood,
      iron: c.iron,
      oil: c.oil,
      food: c.food,
      lastTickIso: c.lastResourceTick.toISOString(),
      hw: safeInt(h.wood),
      hi: safeInt(h.iron),
      ho: safeInt(h.oil),
      hn: safeInt(h.food) - fc,
    };
  });

  return (
    <div className="rounded border border-[#2a3441]/90 bg-black/35 p-4 backdrop-blur-sm">
      <h2
        className="mb-4 text-lg text-amber-200/90"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        {p.resourcesTitle}
      </h2>

      <div className="mb-6 rounded border border-[#2a3441]/80 bg-[#0f172a]/60 p-3 text-sm">
        <div className="mb-1 text-xs uppercase tracking-wide text-zinc-500">
          {p.resourcesStock}
        </div>
        <LiveTotalStocks
          cities={liveCities}
          locale={locale}
          unlocks={unlocks}
          labels={{
            resWood: p.resWood,
            resIron: p.resIron,
            resOil: p.resOil,
            resFood: p.resFood,
          }}
        />
        <div className="mt-3 rounded border border-amber-800/50 bg-zinc-950/90 px-3 py-2 text-sm font-medium text-amber-100/95 shadow-inner">
          {locale === "en" ? (
            <>
              Net / hour: +{safeInt(sumH.wood)} {p.resWood}
              {unlocks.iron && ` · +${safeInt(sumH.iron)} ${p.resIron}`}
              {unlocks.oil && ` · +${safeInt(sumH.oil)} ${p.resOil}`} · +
              {safeInt(netFoodHour)} {p.resFood}
              <span className="mt-1 block text-xs font-normal text-zinc-400">
                {p.resFood} production +{safeInt(sumH.food)} − {sumFoodCons}{" "}
                consumption
              </span>
            </>
          ) : (
            <>
              Net / saat: +{safeInt(sumH.wood)} {p.resWood}
              {unlocks.iron && ` · +${safeInt(sumH.iron)} ${p.resIron}`}
              {unlocks.oil && ` · +${safeInt(sumH.oil)} ${p.resOil}`} · +
              {safeInt(netFoodHour)} {p.resFood}
              <span className="mt-1 block text-xs font-normal text-zinc-400">
                {p.resFood} üretimi +{safeInt(sumH.food)} − {sumFoodCons}{" "}
                tüketim
              </span>
            </>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#2a3441] text-left text-xs uppercase text-zinc-500">
              <th className="py-2 pr-3">{p.resourcesCity}</th>
              <th className="px-1 py-2">
                <span className="inline-flex items-center gap-1">
                  <ResourceIcon kind="wood" />
                  {p.resWood}
                </span>
              </th>
              {unlocks.iron && (
                <th className="px-1 py-2">
                  <span className="inline-flex items-center gap-1">
                    <ResourceIcon kind="iron" />
                    {p.resIron}
                  </span>
                </th>
              )}
              {unlocks.oil && (
                <th className="px-1 py-2">
                  <span className="inline-flex items-center gap-1">
                    <ResourceIcon kind="oil" />
                    {p.resOil}
                  </span>
                </th>
              )}
              <th className="px-1 py-2">
                <span className="inline-flex items-center gap-1">
                  <ResourceIcon kind="food" />
                  {p.resFood}
                </span>
              </th>
              <th className="py-2 pl-2">{p.resourcesHourly}</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((c) => {
              const h = hourlyProduction(c, researchTier, unlocks);
              const fc = hourlyFoodConsumption(c, eraIdx);
              const nf = safeInt(h.food) - fc;
              const lastTickIso = c.lastResourceTick.toISOString();
              return (
                <tr
                  key={c.id}
                  className="border-b border-[#1f2937]/80 text-zinc-300"
                >
                  <td className="py-2 pr-3 font-medium text-amber-100/90">
                    {c.name}
                  </td>
                  <td className="tabular-nums">
                    <LiveStock
                      base={c.wood}
                      hourlyNet={safeInt(h.wood)}
                      lastTickIso={lastTickIso}
                      locale={locale}
                    />
                  </td>
                  {unlocks.iron && (
                    <td className="tabular-nums">
                      <LiveStock
                        base={c.iron}
                        hourlyNet={safeInt(h.iron)}
                        lastTickIso={lastTickIso}
                        locale={locale}
                      />
                    </td>
                  )}
                  {unlocks.oil && (
                    <td className="tabular-nums">
                      <LiveStock
                        base={c.oil}
                        hourlyNet={safeInt(h.oil)}
                        lastTickIso={lastTickIso}
                        locale={locale}
                      />
                    </td>
                  )}
                  <td className="tabular-nums">
                    <LiveStock
                      base={c.food}
                      hourlyNet={nf}
                      lastTickIso={lastTickIso}
                      locale={locale}
                    />
                  </td>
                  <td className="bg-zinc-950/85 py-2 pl-3 text-xs font-semibold text-zinc-100 ring-1 ring-inset ring-amber-900/30">
                    {locale === "en" ? (
                      <>
                        <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="inline-flex items-center gap-0.5">
                            <ResourceIcon kind="wood" />+{safeInt(h.wood)}{" "}
                            {p.resWood}
                          </span>
                          {unlocks.iron && (
                            <span className="inline-flex items-center gap-0.5">
                              <ResourceIcon kind="iron" />+
                              {safeInt(h.iron)} {p.resIron}
                            </span>
                          )}
                          {unlocks.oil && (
                            <span className="inline-flex items-center gap-0.5">
                              <ResourceIcon kind="oil" />+
                              {safeInt(h.oil)} {p.resOil}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-0.5">
                            <ResourceIcon kind="food" />+{nf} {p.resFood}
                          </span>
                        </span>
                        <span className="mt-1 block text-[10px] font-normal text-zinc-400">
                          {p.resFood}: +{safeInt(h.food)} − {fc} consumption
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="inline-flex items-center gap-0.5">
                            <ResourceIcon kind="wood" />+{safeInt(h.wood)}{" "}
                            {p.resWood}
                          </span>
                          {unlocks.iron && (
                            <span className="inline-flex items-center gap-0.5">
                              <ResourceIcon kind="iron" />+
                              {safeInt(h.iron)} {p.resIron}
                            </span>
                          )}
                          {unlocks.oil && (
                            <span className="inline-flex items-center gap-0.5">
                              <ResourceIcon kind="oil" />+
                              {safeInt(h.oil)} {p.resOil}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-0.5">
                            <ResourceIcon kind="food" />+{nf} {p.resFood}
                          </span>
                        </span>
                        <span className="mt-1 block text-[10px] font-normal text-zinc-400">
                          {p.resFood}: +{safeInt(h.food)} − {fc} tüketim
                        </span>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

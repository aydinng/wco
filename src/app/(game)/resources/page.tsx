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
        <div className="mt-3 text-xs text-amber-200/80">
          {locale === "en" ? (
            <>
              Σ/h: +{safeInt(sumH.wood)}W
              {unlocks.iron && ` +${safeInt(sumH.iron)}I`}
              {unlocks.oil && ` +${safeInt(sumH.oil)}O`} +{safeInt(netFoodHour)}F
              <span className="text-zinc-500">
                {" "}
                ({p.resFood} +{safeInt(sumH.food)} − {sumFoodCons} cons)
              </span>
            </>
          ) : (
            <>
              Σ/sa: +{safeInt(sumH.wood)}O
              {unlocks.iron && ` +${safeInt(sumH.iron)}D`}
              {unlocks.oil && ` +${safeInt(sumH.oil)}P`} +{safeInt(netFoodHour)}B
              <span className="text-zinc-500">
                {" "}
                (B: +{safeInt(sumH.food)} − {sumFoodCons} tük)
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
                  <td className="py-2 pl-2 text-xs text-zinc-400">
                    {locale === "en" ? (
                      <>
                        +{safeInt(h.wood)}W
                        {unlocks.iron && ` / +${safeInt(h.iron)}I`}
                        {unlocks.oil && ` / +${safeInt(h.oil)}O`} / +{nf}F
                        <span className="block text-[10px] text-zinc-500">
                          ({p.resFood} +{safeInt(h.food)} − {fc})
                        </span>
                      </>
                    ) : (
                      <>
                        +{safeInt(h.wood)}O
                        {unlocks.iron && ` / +${safeInt(h.iron)}D`}
                        {unlocks.oil && ` / +${safeInt(h.oil)}P`} / +{nf}B
                        <span className="block text-[10px] text-zinc-500">
                          (B: +{safeInt(h.food)} − {fc})
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

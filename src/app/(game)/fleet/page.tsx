import { FleetSendForm } from "@/components/game/FleetSendForm";
import { PlaceholderPage } from "@/components/game/PlaceholderPage";
import { getDictionary } from "@/i18n/dictionaries";
import { soldierCap } from "@/lib/economy";
import { getCurrentUser } from "@/lib/current-user";
import { getLocale } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function FleetPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const p = dict.play;
  const user = await getCurrentUser();
  if (!user) {
    return (
      <PlaceholderPage title={dict.game.fleet}>
        <p className="mt-2 text-sm text-zinc-500">{p.errLogin}</p>
      </PlaceholderPage>
    );
  }

  const cities = user.cities.map((c) => ({
    id: c.id,
    name: c.name,
    coordX: c.coordX,
    coordY: c.coordY,
    coordZ: c.coordZ,
    soldiers: c.soldiers,
    barracksLevel: c.barracksLevel,
  }));

  const totalSoldiers = cities.reduce((a, c) => a + c.soldiers, 0);

  return (
    <PlaceholderPage title={dict.game.fleet}>
      <p className="mt-2 text-sm text-zinc-400">{p.fleetIntro}</p>
      <FleetSendForm cities={cities} play={p} />

      <div className="mt-8 border-t border-[#2a3441]/80 pt-4">
        <h3
          className="mb-3 text-base text-amber-200/80"
          style={{ fontFamily: "var(--font-warcity), serif" }}
        >
          {locale === "en"
            ? "Soldiers by city"
            : "Şehirlere göre askerler"}
        </h3>
        <p className="mb-2 text-xs text-zinc-500">
          {locale === "en"
            ? `Total soldiers (all cities): ${totalSoldiers}`
            : `Toplam asker (tüm şehirler): ${totalSoldiers}`}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse border border-zinc-700/80 text-sm">
            <thead>
              <tr className="border-b border-zinc-600 bg-black/30 text-left text-xs uppercase text-zinc-500">
                <th className="p-2">{p.resourcesCity}</th>
                <th className="p-2">X:Y:Z</th>
                <th className="p-2 tabular-nums">{p.soldiers}</th>
                <th className="p-2 tabular-nums">
                  {locale === "en" ? "Cap" : "Üst limit"}
                </th>
              </tr>
            </thead>
            <tbody>
              {cities.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-zinc-800/90 text-zinc-300"
                >
                  <td className="p-2 font-medium text-amber-100/90">
                    {c.name}
                  </td>
                  <td className="p-2 tabular-nums text-zinc-400">
                    {c.coordX}:{c.coordY}:{c.coordZ}
                  </td>
                  <td className="p-2 tabular-nums">{c.soldiers}</td>
                  <td className="p-2 tabular-nums text-zinc-400">
                    {soldierCap(c.barracksLevel)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PlaceholderPage>
  );
}

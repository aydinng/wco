import { MarketPanel } from "@/components/game/MarketPanel";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/current-user";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MarketPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const p = dict.play;
  const user = await getCurrentUser();

  const listingsRaw = await prisma.marketListing.findMany({
    where: { status: "listed" },
    include: {
      seller: { select: { id: true, username: true, tribeName: true } },
      city: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const listings = listingsRaw.map((L) => ({
    id: L.id,
    sellerId: L.sellerId,
    quantity: L.quantity,
    priceWood: L.priceWood,
    priceIron: L.priceIron,
    priceFood: L.priceFood,
    opensAt: L.opensAt.toISOString(),
    sellerName: L.seller.username,
    tribeName: L.seller.tribeName,
    cityName: L.city.name,
  }));

  const cities =
    user?.cities.map((c) => ({ id: c.id, name: c.name })) ?? [];
  const uid = user?.id ?? "";

  return (
    <div className="rounded-xl border border-amber-800/40 bg-gradient-to-br from-slate-900/70 via-amber-950/25 to-sky-950/30 p-4 shadow-lg backdrop-blur-sm sm:p-6">
      <h2
        className="mb-4 text-xl text-amber-100"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        {p.marketTitle}
      </h2>
      {user ? (
        <MarketPanel
          currentUserId={uid}
          buyerCities={cities}
          listCities={cities}
          listings={listings}
          currentEra={user.currentEra}
          labels={{
            intro: p.marketIntro,
            delayNote: p.marketDelayNote,
            listSoldiers: p.marketListSoldiers,
            fromCity: p.marketFromCity,
            qty: p.marketQty,
            pw: p.marketPriceWood,
            pi: p.marketPriceIron,
            pf: p.marketPriceFood,
            submitList: p.marketSubmitList,
            buy: p.marketBuy,
            receiveCity: p.marketReceiveCity,
            empty: p.marketEmpty,
            seller: p.marketSeller,
            opensAt: p.marketOpensAt,
            wait: p.marketTimerWait,
            ready: p.marketTimerReady,
            errGeneric: p.errServer,
            soldiersUnit: p.marketSoldiersUnit,
            yourListing: p.marketYourListing,
          }}
        />
      ) : (
        <p className="text-sm text-zinc-500">{p.errLogin}</p>
      )}
    </div>
  );
}

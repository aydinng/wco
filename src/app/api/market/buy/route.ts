import { auth } from "@/auth";
import { getResourceUnlocks } from "@/config/eras";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Body = {
  listingId: string;
  buyerCityId: string;
};

export async function POST(req: Request) {
  try {
    const locale = await getLocale();
    const dict = getDictionary(locale);
    const play = dict.play;

    const body = (await req.json()) as Partial<Body>;
    const { listingId, buyerCityId } = body;

    if (typeof listingId !== "string" || typeof buyerCityId !== "string") {
      return NextResponse.json({ error: play.errMissingFields }, { status: 400 });
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: play.errLogin }, { status: 401 });
    }

    const buyer = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!buyer) {
      return NextResponse.json({ error: play.errUser }, { status: 404 });
    }

    const listing = await prisma.marketListing.findUnique({
      where: { id: listingId },
      include: { city: true, seller: true },
    });

    if (!listing || listing.status !== "listed") {
      return NextResponse.json({ error: play.errMarketGone }, { status: 400 });
    }

    if (listing.sellerId === buyer.id) {
      return NextResponse.json({ error: play.errMarketSelf }, { status: 400 });
    }

    if (new Date() < listing.opensAt) {
      return NextResponse.json({ error: play.errMarketNotOpen }, { status: 400 });
    }

    const buyerCity = await prisma.city.findFirst({
      where: { id: buyerCityId, userId: buyer.id },
    });
    if (!buyerCity) {
      return NextResponse.json({ error: play.errCity }, { status: 404 });
    }

    const unlocks = getResourceUnlocks(buyer.currentEra);
    if (listing.priceIron > 0 && !unlocks.iron) {
      return NextResponse.json({ error: play.errBuildingLocked }, { status: 400 });
    }
    const needIron = listing.priceIron;

    if (
      buyerCity.wood < listing.priceWood ||
      buyerCity.food < listing.priceFood ||
      buyerCity.iron < needIron
    ) {
      return NextResponse.json({ error: play.errInsufficient }, { status: 400 });
    }

    const sellerCity = listing.city;

    await prisma.$transaction(async (tx) => {
      await tx.city.update({
        where: { id: buyerCity.id },
        data: {
          wood: buyerCity.wood - listing.priceWood,
          food: buyerCity.food - listing.priceFood,
          iron: buyerCity.iron - needIron,
          soldiers: buyerCity.soldiers + listing.quantity,
        },
      });
      await tx.city.update({
        where: { id: sellerCity.id },
        data: {
          wood: sellerCity.wood + listing.priceWood,
          food: sellerCity.food + listing.priceFood,
          iron: sellerCity.iron + needIron,
        },
      });
      await tx.marketListing.update({
        where: { id: listing.id },
        data: {
          status: "sold",
          buyerId: buyer.id,
          buyerCityId: buyerCity.id,
        },
      });
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[market/buy]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

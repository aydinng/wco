import { auth } from "@/auth";
import { eraIndex, getResourceUnlocks } from "@/config/eras";
import { MARKET_OPEN_DELAY_SEC } from "@/config/game-rules";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Body = {
  cityId: string;
  quantity: number;
  priceWood: number;
  priceIron: number;
  priceFood: number;
};

export async function POST(req: Request) {
  try {
    const locale = await getLocale();
    const dict = getDictionary(locale);
    const play = dict.play;

    const body = (await req.json()) as Partial<Body>;
    const { cityId, quantity, priceWood, priceIron, priceFood } = body;

    if (
      typeof cityId !== "string" ||
      typeof quantity !== "number" ||
      typeof priceWood !== "number" ||
      typeof priceIron !== "number" ||
      typeof priceFood !== "number"
    ) {
      return NextResponse.json({ error: play.errMissingFields }, { status: 400 });
    }

    if (quantity < 1 || quantity > 500_000) {
      return NextResponse.json({ error: play.errInvalidAmount }, { status: 400 });
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: play.errLogin }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user) {
      return NextResponse.json({ error: play.errUser }, { status: 404 });
    }

    const unlocks = getResourceUnlocks(user.currentEra);
    if (priceIron > 0 && !unlocks.iron) {
      return NextResponse.json({ error: play.errBuildingLocked }, { status: 400 });
    }

    const city = await prisma.city.findFirst({
      where: { id: cityId, userId: user.id },
    });
    if (!city) {
      return NextResponse.json({ error: play.errCity }, { status: 404 });
    }

    if (city.soldiers < quantity) {
      return NextResponse.json({ error: play.errInsufficient }, { status: 400 });
    }

    if (eraIndex(user.currentEra) < 1) {
      return NextResponse.json(
        { error: play.errMarketNeedMedieval },
        { status: 400 },
      );
    }
    if ((city.bankLevel ?? 0) < 1) {
      return NextResponse.json(
        { error: play.errMarketNeedBank },
        { status: 400 },
      );
    }

    const now = Date.now();
    const opensAt = new Date(now + MARKET_OPEN_DELAY_SEC * 1000);

    await prisma.$transaction(async (tx) => {
      await tx.city.update({
        where: { id: city.id },
        data: { soldiers: city.soldiers - quantity },
      });
      await tx.marketListing.create({
        data: {
          sellerId: user.id,
          cityId: city.id,
          kind: "soldiers",
          quantity,
          priceWood,
          priceIron: unlocks.iron ? priceIron : 0,
          priceFood,
          opensAt,
          status: "listed",
        },
      });
    });

    return NextResponse.json({ ok: true, opensAt: opensAt.toISOString() });
  } catch (e) {
    console.error("[market/list]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

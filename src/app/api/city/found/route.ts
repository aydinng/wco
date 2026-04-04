import { auth } from "@/auth";
import { getResourceUnlocks } from "@/config/eras";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/lib/locale";
import {
  canFoundCity,
  foundCityCostWoodIronFood,
} from "@/lib/found-city";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Body = {
  name: string;
  payFromCityId: string;
  coordX: number;
  coordY: number;
  coordZ: number;
};

export async function POST(req: Request) {
  try {
    const locale = await getLocale();
    const dict = getDictionary(locale);
    const play = dict.play;

    const body = (await req.json()) as Partial<Body>;
    const { name, payFromCityId, coordX, coordY, coordZ } = body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof payFromCityId !== "string" ||
      typeof coordX !== "number" ||
      typeof coordY !== "number" ||
      typeof coordZ !== "number"
    ) {
      return NextResponse.json({ error: play.errMissingFields }, { status: 400 });
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: play.errLogin }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { cities: true },
    });
    if (!user) {
      return NextResponse.json({ error: play.errUser }, { status: 404 });
    }

    if (!canFoundCity(user.currentEra, user.researchTier)) {
      return NextResponse.json({ error: play.errFoundCityLocked }, { status: 403 });
    }

    const payCity = user.cities.find((c) => c.id === payFromCityId);
    if (!payCity) {
      return NextResponse.json({ error: play.errCity }, { status: 404 });
    }

    const n = user.cities.length;
    const cost = foundCityCostWoodIronFood(n);
    const unlocks = getResourceUnlocks(user.currentEra);

    const needIron = unlocks.iron ? cost.iron : 0;
    if (
      payCity.wood < cost.wood ||
      payCity.food < cost.food ||
      (needIron > 0 && payCity.iron < needIron)
    ) {
      return NextResponse.json({ error: play.errInsufficient }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.city.update({
        where: { id: payCity.id },
        data: {
          wood: payCity.wood - cost.wood,
          food: payCity.food - cost.food,
          iron: needIron > 0 ? payCity.iron - needIron : payCity.iron,
        },
      });
      await tx.city.create({
        data: {
          name: name.trim().slice(0, 48),
          userId: user.id,
          coordX,
          coordY,
          coordZ,
          wood: 1200,
          iron: unlocks.iron ? 400 : 0,
          oil: 0,
          food: 1800,
          population: 200,
          popCap: 340,
          workersWood: 80,
          workersIron: unlocks.iron ? 10 : 0,
          workersOil: 0,
          workersFood: 120,
          townHallLevel: 1,
          lumberMillLevel: 1,
          ironMineLevel: unlocks.iron ? 1 : 0,
          oilWellLevel: 0,
          farmLevel: 1,
          barracksLevel: 0,
          soldiers: 0,
          lastResourceTick: new Date(),
        },
      });
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[city/found]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

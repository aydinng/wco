import { auth } from "@/auth";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Body = {
  fromCityId: string;
  toCoordX: number;
  toCoordY: number;
  toCoordZ: number;
  attackPower: number;
  defensePower: number;
  defenderDefense: number;
};

function travelMs(
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number,
) {
  const d =
    Math.abs(ax - bx) + Math.abs(ay - by) + Math.abs(az - bz);
  return Math.max(5_000, d * 3_000);
}

export async function POST(req: Request) {
  try {
    const locale = await getLocale();
    const dict = getDictionary(locale);
    const play = dict.play;

    const body = (await req.json()) as Partial<Body>;
    const {
      fromCityId,
      toCoordX,
      toCoordY,
      toCoordZ,
      attackPower,
      defensePower,
      defenderDefense,
    } = body;

    if (
      !fromCityId ||
      typeof toCoordX !== "number" ||
      typeof toCoordY !== "number" ||
      typeof toCoordZ !== "number" ||
      typeof attackPower !== "number" ||
      typeof defensePower !== "number" ||
      typeof defenderDefense !== "number"
    ) {
      return NextResponse.json({ error: play.errMissingFields }, { status: 400 });
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: play.errLogin }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return NextResponse.json({ error: play.errUser }, { status: 404 });

    const city = await prisma.city.findFirst({
      where: { id: fromCityId, userId: user.id },
    });
    if (!city) {
      return NextResponse.json({ error: play.errCity }, { status: 404 });
    }

    const departAt = new Date();
    const ms = travelMs(
      city.coordX,
      city.coordY,
      city.coordZ,
      toCoordX,
      toCoordY,
      toCoordZ,
    );
    const arriveAt = new Date(departAt.getTime() + ms);

    const won = attackPower > defenderDefense;
    const outcome = won ? play.fleetOutcomeWin : play.fleetOutcomeLoss;
    const sec = Math.round(ms / 1000);
    const summary =
      locale === "en"
        ? `Target ${toCoordX}:${toCoordY}:${toCoordZ}. Attack ${attackPower} vs Defense ${defenderDefense}. Result: ${outcome}. (~${sec}s travel, MVP.)`
        : `Hedef ${toCoordX}:${toCoordY}:${toCoordZ}. Saldırı ${attackPower} vs Savunma ${defenderDefense}. Sonuç: ${outcome}. (Yol ~${sec} sn, MVP.)`;

    const fleet = await prisma.fleet.create({
      data: {
        fromCityId: city.id,
        toCoordX,
        toCoordY,
        toCoordZ,
        departAt,
        arriveAt,
        status: "completed",
        attackPower,
        defensePower,
        userId: user.id,
      },
    });

    const report = await prisma.battleReport.create({
      data: {
        fleetId: fleet.id,
        attackerUserId: user.id,
        defenderCoord: `${toCoordX}:${toCoordY}:${toCoordZ}`,
        attackerTotal: attackPower,
        defenderTotal: defenderDefense,
        outcome,
        summary,
      },
    });

    return NextResponse.json({
      ok: true,
      fleetId: fleet.id,
      reportId: report.id,
      arriveAt: arriveAt.toISOString(),
      travelSeconds: sec,
      outcome,
    });
  } catch (e) {
    console.error(e);
    const dict = getDictionary(await getLocale());
    return NextResponse.json({ error: dict.play.errServer }, { status: 500 });
  }
}

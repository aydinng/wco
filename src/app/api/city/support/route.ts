import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/** Aynı oyuncunun bir şehrinden diğerine kaynak veya birim aktarır (destek). */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    fromCityId?: string;
    toCityId?: string;
    wood?: number;
    iron?: number;
    oil?: number;
    food?: number;
    unitId?: string;
    unitQty?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const fromId = body.fromCityId ?? "";
  const toId = body.toCityId ?? "";
  if (!fromId || !toId || fromId === toId) {
    return NextResponse.json({ error: "Geçersiz şehir seçimi." }, { status: 400 });
  }

  const wood = Math.max(0, Math.floor(Number(body.wood) || 0));
  const iron = Math.max(0, Math.floor(Number(body.iron) || 0));
  const oil = Math.max(0, Math.floor(Number(body.oil) || 0));
  const food = Math.max(0, Math.floor(Number(body.food) || 0));
  const unitQty = Math.max(0, Math.floor(Number(body.unitQty) || 0));
  const unitId = (body.unitId ?? "").trim();

  const hasRes = wood + iron + oil + food > 0;
  const hasUnits = unitId && unitQty > 0;
  if ((hasRes && hasUnits) || (!hasRes && !hasUnits)) {
    return NextResponse.json(
      { error: "Ya kaynak ya da birim gönderin (ikisini birden değil)." },
      { status: 400 },
    );
  }

  const [from, to] = await Promise.all([
    prisma.city.findFirst({
      where: { id: fromId, userId: session.user.id },
    }),
    prisma.city.findFirst({
      where: { id: toId, userId: session.user.id },
    }),
  ]);

  if (!from || !to) {
    return NextResponse.json({ error: "Şehir bulunamadı." }, { status: 404 });
  }

  if (hasRes) {
    if (from.wood < wood || from.iron < iron || from.oil < oil || from.food < food) {
      return NextResponse.json({ error: "Yetersiz kaynak." }, { status: 400 });
    }
    await prisma.$transaction([
      prisma.city.update({
        where: { id: from.id },
        data: {
          wood: { decrement: wood },
          iron: { decrement: iron },
          oil: { decrement: oil },
          food: { decrement: food },
        },
      }),
      prisma.city.update({
        where: { id: to.id },
        data: {
          wood: { increment: wood },
          iron: { increment: iron },
          oil: { increment: oil },
          food: { increment: food },
        },
      }),
    ]);
    return NextResponse.json({ ok: true });
  }

  const stock = await prisma.cityUnitStock.findUnique({
    where: { cityId_unitId: { cityId: from.id, unitId } },
  });
  const have = stock?.quantity ?? 0;
  if (have < unitQty) {
    return NextResponse.json({ error: "Yetersiz birim." }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.cityUnitStock.update({
      where: { cityId_unitId: { cityId: from.id, unitId } },
      data: { quantity: { decrement: unitQty } },
    });
    await tx.cityUnitStock.upsert({
      where: { cityId_unitId: { cityId: to.id, unitId } },
      create: { cityId: to.id, unitId, quantity: unitQty },
      update: { quantity: { increment: unitQty } },
    });
    await tx.city.update({
      where: { id: from.id },
      data: { soldiers: { decrement: unitQty } },
    });
    await tx.city.update({
      where: { id: to.id },
      data: { soldiers: { increment: unitQty } },
    });
  });

  return NextResponse.json({ ok: true });
}

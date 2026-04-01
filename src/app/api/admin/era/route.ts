import { auth } from "@/auth";
import { ERA_ORDER, type EraId } from "@/config/eras";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!admin?.isAdmin) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
    }

    const body = (await req.json()) as { eraId?: string };
    const id = body.eraId as EraId | undefined;
    if (!id || !ERA_ORDER.includes(id)) {
      return NextResponse.json({ error: "Geçersiz çağ" }, { status: 400 });
    }

    await prisma.gameSettings.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", currentEra: id },
      update: { currentEra: id },
    });

    return NextResponse.json({ ok: true, eraId: id });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

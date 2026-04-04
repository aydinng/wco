import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { targetUserId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const targetUserId = (body.targetUserId ?? "").trim();
  if (!targetUserId) {
    return NextResponse.json({ error: "targetUserId gerekli" }, { status: 400 });
  }

  if (targetUserId === session.user.id) {
    return NextResponse.json({ error: "Kendinizi atamazsınız." }, { status: 400 });
  }

  const alliance = await prisma.alliance.findFirst({
    where: { founderId: session.user.id },
  });
  if (!alliance) {
    return NextResponse.json(
      { error: "Yalnızca ittifak kurucusu (lider) üye çıkarabilir." },
      { status: 403 },
    );
  }

  if (targetUserId === alliance.founderId) {
    return NextResponse.json({ error: "Lider çıkarılamaz." }, { status: 400 });
  }

  const targetMem = await prisma.allianceMember.findFirst({
    where: { allianceId: alliance.id, userId: targetUserId },
  });
  if (!targetMem) {
    return NextResponse.json({ error: "Üye bulunamadı." }, { status: 404 });
  }

  await prisma.allianceMember.delete({ where: { id: targetMem.id } });

  return NextResponse.json({ ok: true });
}

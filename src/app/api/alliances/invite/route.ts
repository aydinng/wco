import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { username?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const uname = (body.username ?? "").trim();
  if (uname.length < 2) {
    return NextResponse.json({ error: "Kullanıcı adı geçersiz." }, { status: 400 });
  }

  const alliance = await prisma.alliance.findFirst({
    where: { founderId: session.user.id },
    include: { _count: { select: { members: true } } },
  });
  if (!alliance) {
    return NextResponse.json(
      { error: "Yalnızca ittifak lideri davet gönderebilir." },
      { status: 403 },
    );
  }

  if (alliance._count.members >= alliance.maxMembers) {
    return NextResponse.json({ error: "İttifak dolu." }, { status: 400 });
  }

  const target = await prisma.user.findUnique({
    where: { username: uname },
    select: { id: true },
  });
  if (!target) {
    return NextResponse.json({ error: "Oyuncu bulunamadı." }, { status: 404 });
  }

  if (target.id === session.user.id) {
    return NextResponse.json({ error: "Kendinizi davet edemezsiniz." }, { status: 400 });
  }

  const already = await prisma.allianceMember.findUnique({
    where: { userId: target.id },
  });
  if (already) {
    return NextResponse.json(
      { error: "Bu oyuncu zaten bir ittifakta." },
      { status: 400 },
    );
  }

  const pending = await prisma.allianceInvite.findFirst({
    where: {
      allianceId: alliance.id,
      toUserId: target.id,
      status: "pending",
    },
  });
  if (pending) {
    return NextResponse.json({ error: "Bu oyuncuya zaten davet var." }, { status: 400 });
  }

  await prisma.allianceInvite.create({
    data: {
      allianceId: alliance.id,
      fromUserId: session.user.id,
      toUserId: target.id,
      status: "pending",
    },
  });

  return NextResponse.json({ ok: true });
}

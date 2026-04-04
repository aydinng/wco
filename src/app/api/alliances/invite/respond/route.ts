import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { inviteId?: string; accept?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const inviteId = (body.inviteId ?? "").trim();
  if (!inviteId) {
    return NextResponse.json({ error: "inviteId gerekli" }, { status: 400 });
  }

  const inv = await prisma.allianceInvite.findUnique({
    where: { id: inviteId },
    include: {
      alliance: { include: { _count: { select: { members: true } } } },
    },
  });
  if (!inv || inv.status !== "pending") {
    return NextResponse.json({ error: "Davet bulunamadı." }, { status: 404 });
  }
  if (inv.toUserId !== session.user.id) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  if (!body.accept) {
    await prisma.allianceInvite.update({
      where: { id: inviteId },
      data: { status: "declined" },
    });
    return NextResponse.json({ ok: true });
  }

  const existing = await prisma.allianceMember.findUnique({
    where: { userId: session.user.id },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Zaten bir ittifaktasınız." },
      { status: 400 },
    );
  }

  if (inv.alliance._count.members >= inv.alliance.maxMembers) {
    await prisma.allianceInvite.update({
      where: { id: inviteId },
      data: { status: "declined" },
    });
    return NextResponse.json({ error: "İttifak doldu." }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.allianceMember.create({
      data: {
        allianceId: inv.allianceId,
        userId: session.user.id,
        role: "member",
      },
    }),
    prisma.allianceInvite.update({
      where: { id: inviteId },
      data: { status: "accepted" },
    }),
  ]);

  return NextResponse.json({ ok: true });
}

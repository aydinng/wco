import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { allianceId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const allianceId = (body.allianceId ?? "").trim();
  if (!allianceId) {
    return NextResponse.json({ error: "allianceId gerekli" }, { status: 400 });
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

  const alliance = await prisma.alliance.findUnique({
    where: { id: allianceId },
    include: {
      _count: { select: { members: true } },
    },
  });
  if (!alliance) {
    return NextResponse.json({ error: "İttifak bulunamadı." }, { status: 404 });
  }

  if (alliance._count.members >= alliance.maxMembers) {
    return NextResponse.json(
      { error: "İttifak üye limiti dolu." },
      { status: 400 },
    );
  }

  if (alliance.inviteOnly) {
    return NextResponse.json(
      {
        error:
          "Bu ittifak yalnızca davet ile katılıma açıktır. Liderden davet isteyin.",
      },
      { status: 403 },
    );
  }

  await prisma.allianceMember.create({
    data: {
      allianceId: alliance.id,
      userId: session.user.id,
      role: "member",
    },
  });

  return NextResponse.json({ ok: true });
}

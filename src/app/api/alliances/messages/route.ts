import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mem = await prisma.allianceMember.findUnique({
    where: { userId: session.user.id },
    select: { allianceId: true },
  });
  if (!mem) {
    return NextResponse.json({ error: "İttifak yok" }, { status: 400 });
  }

  const rows = await prisma.allianceMessage.findMany({
    where: { allianceId: mem.allianceId },
    orderBy: { createdAt: "desc" },
    take: 80,
    include: {
      user: { select: { username: true } },
    },
  });

  const messages = rows.reverse().map((m) => ({
    id: m.id,
    userId: m.userId,
    username: m.user.username,
    body: m.body,
    createdAt: m.createdAt.toISOString(),
  }));

  return NextResponse.json({ messages });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { body?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const text = (body.body ?? "").trim();
  if (text.length < 1 || text.length > 2000) {
    return NextResponse.json({ error: "Mesaj 1–2000 karakter" }, { status: 400 });
  }

  const mem = await prisma.allianceMember.findUnique({
    where: { userId: session.user.id },
    select: { allianceId: true },
  });
  if (!mem) {
    return NextResponse.json({ error: "İttifak yok" }, { status: 400 });
  }

  const m = await prisma.allianceMessage.create({
    data: {
      allianceId: mem.allianceId,
      userId: session.user.id,
      body: text,
    },
    include: { user: { select: { username: true } } },
  });

  return NextResponse.json({
    message: {
      id: m.id,
      userId: m.userId,
      username: m.user.username,
      body: m.body,
      createdAt: m.createdAt.toISOString(),
    },
  });
}

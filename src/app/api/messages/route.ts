import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.directMessage.findMany({
    where: { toUserId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { fromUser: { select: { username: true } } },
  });

  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { toUsername?: string; subject?: string; body?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const un = (body.toUsername ?? "").trim();
  const subject = (body.subject ?? "").trim();
  const text = (body.body ?? "").trim();
  if (!un || !subject || !text) {
    return NextResponse.json(
      { error: "Alıcı adı, konu ve mesaj gerekli." },
      { status: 400 },
    );
  }

  const target = await prisma.user.findUnique({ where: { username: un } });
  if (!target || target.id === session.user.id) {
    return NextResponse.json({ error: "Oyuncu bulunamadı." }, { status: 404 });
  }

  if (target.blockIncomingMessages) {
    return NextResponse.json(
      { error: "Bu oyuncu gelen mesajları kapatmış." },
      { status: 403 },
    );
  }

  await prisma.directMessage.create({
    data: {
      fromUserId: session.user.id,
      toUserId: target.id,
      subject: subject.slice(0, 200),
      body: text.slice(0, 8000),
    },
  });

  return NextResponse.json({ ok: true });
}

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { subject?: string; body?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const subject = (body.subject ?? "").trim();
  const text = (body.body ?? "").trim();
  if (!subject || !text) {
    return NextResponse.json(
      { error: "Konu ve mesaj zorunludur." },
      { status: 400 },
    );
  }

  await prisma.adminTicket.create({
    data: {
      userId: session.user.id,
      subject: subject.slice(0, 200),
      body: text.slice(0, 8000),
    },
  });

  return NextResponse.json({ ok: true });
}

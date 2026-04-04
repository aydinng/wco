import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data: {
    blockIncomingMessages?: boolean;
    settingSoundEnabled?: boolean;
    settingNotifyBattle?: boolean;
    settingCompactTables?: boolean;
  } = {};

  if (typeof body.blockIncomingMessages === "boolean") {
    data.blockIncomingMessages = body.blockIncomingMessages;
  }
  if (typeof body.settingSoundEnabled === "boolean") {
    data.settingSoundEnabled = body.settingSoundEnabled;
  }
  if (typeof body.settingNotifyBattle === "boolean") {
    data.settingNotifyBattle = body.settingNotifyBattle;
  }
  if (typeof body.settingCompactTables === "boolean") {
    data.settingCompactTables = body.settingCompactTables;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data,
  });

  return NextResponse.json({ ok: true });
}

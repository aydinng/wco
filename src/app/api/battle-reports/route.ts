import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 });
  }

  const items = await prisma.battleReport.findMany({
    where: { attackerUserId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { fleet: true },
  });

  return NextResponse.json({ items });
}

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/** Oyuncu oyun kabuğundayken periyodik çağrılır; çevrim içi sayımı için lastSeenAt güncellenir */
export async function POST() {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  await prisma.user.update({
    where: { id },
    data: { lastSeenAt: new Date() },
  });
  return NextResponse.json({ ok: true });
}

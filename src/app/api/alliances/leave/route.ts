import { auth } from "@/auth";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: dict.play.errLogin }, { status: 401 });
  }

  const member = await prisma.allianceMember.findUnique({
    where: { userId: session.user.id },
    include: {
      alliance: {
        include: {
          members: {
            include: {
              user: { select: { id: true, scoreTotal: true } },
            },
          },
        },
      },
    },
  });

  if (!member) {
    return NextResponse.json(
      { error: locale === "en" ? "Not in an alliance." : "İttifakta değilsiniz." },
      { status: 400 },
    );
  }

  const alliance = member.alliance;
  const others = alliance.members.filter((m) => m.userId !== session.user.id);

  await prisma.$transaction(async (tx) => {
    await tx.allianceMember.delete({ where: { id: member.id } });

    if (others.length === 0) {
      await tx.alliance.delete({ where: { id: alliance.id } });
      return;
    }

    if (alliance.founderId === session.user.id) {
      const next = others.reduce((best, m) =>
        m.user.scoreTotal > best.user.scoreTotal ? m : best,
      );
      await tx.alliance.update({
        where: { id: alliance.id },
        data: { founderId: next.userId },
      });
    }
  });

  return NextResponse.json({ ok: true });
}

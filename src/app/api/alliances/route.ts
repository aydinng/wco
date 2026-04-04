import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const DEFAULT_MAX_MEMBERS = 50;

/** Yeni ittifak (kurucu otomatik üye olur) */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  if (name.length < 2 || name.length > 48) {
    return NextResponse.json(
      { error: "İttifak adı 2–48 karakter olmalı." },
      { status: 400 },
    );
  }

  const taken = await prisma.allianceMember.findUnique({
    where: { userId: session.user.id },
  });
  if (taken) {
    return NextResponse.json(
      { error: "Zaten bir ittifaktasınız." },
      { status: 400 },
    );
  }

  const dup = await prisma.alliance.findUnique({ where: { name } });
  if (dup) {
    return NextResponse.json(
      { error: "Bu ittifak adı kullanılıyor." },
      { status: 400 },
    );
  }

  const a = await prisma.alliance.create({
    data: {
      name,
      founderId: session.user.id,
      inviteOnly: false,
      maxMembers: DEFAULT_MAX_MEMBERS,
      members: {
        create: { userId: session.user.id, role: "founder" },
      },
    },
    select: { id: true, name: true },
  });

  return NextResponse.json({ ok: true, alliance: a });
}

/** İttifak listesi + üye skor toplamları (istatistik çubuğu için) */
export async function GET() {
  const alliances = await prisma.alliance.findMany({
    take: 50,
    orderBy: { createdAt: "asc" },
    include: {
      founder: { select: { username: true } },
      members: {
        include: {
          user: {
            select: {
              scoreProduction: true,
              scoreTech: true,
              scoreBuilding: true,
              scoreTotal: true,
            },
          },
        },
      },
    },
  });

  const mapped = alliances.map((a) => {
    let prod = 0,
      tech = 0,
      bld = 0,
      tot = 0;
    for (const m of a.members) {
      prod += m.user.scoreProduction;
      tech += m.user.scoreTech;
      bld += m.user.scoreBuilding;
      tot += m.user.scoreTotal;
    }
    return {
      id: a.id,
      name: a.name,
      founder: a.founder.username,
      inviteOnly: a.inviteOnly,
      prod,
      tech,
      bld,
      total: tot,
    };
  });

  const maxProd = Math.max(1, ...mapped.map((m) => m.prod));
  const maxTech = Math.max(1, ...mapped.map((m) => m.tech));
  const maxBld = Math.max(1, ...mapped.map((m) => m.bld));
  const maxTot = Math.max(1, ...mapped.map((m) => m.total));

  const ranked = [...mapped]
    .sort((a, b) => b.total - a.total)
    .map((r, i) => ({
      rank: i + 1,
      name: r.name,
      founder: r.founder,
      inviteOnly: r.inviteOnly,
      id: r.id,
      prod: Math.round((r.prod / maxProd) * 100),
      tech: Math.round((r.tech / maxTech) * 100),
      bld: Math.round((r.bld / maxBld) * 100),
      total: Math.round((r.total / maxTot) * 100),
    }));

  return NextResponse.json({ alliances: ranked });
}

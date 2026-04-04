import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

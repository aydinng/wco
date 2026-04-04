import { prisma } from "@/lib/prisma";

export type PlayerRankRow = {
  rank: number;
  name: string;
  score: number;
};

export async function getPlayerRankingRows(
  limit = 50,
): Promise<PlayerRankRow[]> {
  const users = await prisma.user.findMany({
    take: limit,
    orderBy: { scoreTotal: "desc" },
    select: { username: true, scoreTotal: true },
  });
  return users.map((u, i) => ({
    rank: i + 1,
    name: u.username,
    score: u.scoreTotal,
  }));
}

export async function getPlayerRankByUsername(
  username: string,
): Promise<number | null> {
  const u = await prisma.user.findUnique({
    where: { username },
    select: { scoreTotal: true },
  });
  if (!u) return null;
  const above = await prisma.user.count({
    where: { scoreTotal: { gt: u.scoreTotal } },
  });
  return above + 1;
}

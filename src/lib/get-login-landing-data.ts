import { aggregateTopCountries, aggregateTopPlayers } from "@/lib/login-landing-stats";
import { prisma } from "@/lib/prisma";

export type LoginLandingData = {
  totalRegistered: number;
  onlineCount: number;
  lastUser: {
    username: string;
    registrationCountry: string;
    createdAt: Date;
  } | null;
  topCountries: { rank: number; countryId: string; score: number }[];
  topPlayers: {
    rank: number;
    username: string;
    countryId: string;
    score: number;
  }[];
};

const emptyLandingData: LoginLandingData = {
  totalRegistered: 0,
  onlineCount: 0,
  lastUser: null,
  topCountries: [],
  topPlayers: [],
};

export async function getLoginLandingData(): Promise<LoginLandingData> {
  const whereRegistered = { passwordHash: { not: null } as const };

  try {
    const onlineThreshold = new Date(Date.now() - 5 * 60 * 1000);

    const [totalRegistered, allUsers, lastUser, onlineCount] = await Promise.all([
      prisma.user.count({ where: whereRegistered }),
      prisma.user.findMany({
        where: whereRegistered,
        select: {
          username: true,
          registrationCountry: true,
          scoreTotal: true,
        },
      }),
      prisma.user.findFirst({
        orderBy: { createdAt: "desc" },
        where: whereRegistered,
        select: { username: true, registrationCountry: true, createdAt: true },
      }),
      prisma.user.count({
        where: {
          ...whereRegistered,
          lastSeenAt: { gte: onlineThreshold },
        },
      }),
    ]);

    return {
      totalRegistered,
      onlineCount,
      lastUser,
      topCountries: aggregateTopCountries(allUsers, 5),
      topPlayers: aggregateTopPlayers(allUsers, 5),
    };
  } catch (e) {
    console.error("[getLoginLandingData] veritabanı okunamadı", e);
    return emptyLandingData;
  }
}

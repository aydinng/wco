import { StatsRankingsTabs } from "@/components/game/StatsRankingsTabs";
import { PlaceholderPage } from "@/components/game/PlaceholderPage";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/current-user";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const user = await getCurrentUser();

  const players = await prisma.user.findMany({
    take: 50,
    orderBy: { createdAt: "asc" },
    select: { username: true, researchTier: true },
  });

  const playerRows = players.map((u, i) => ({
    rank: i + 1,
    name: u.username,
    score: u.researchTier * 1000 + i * 17,
  }));

  const allianceRows = [
    {
      rank: 1,
      name: "4 Knights",
      founder: "Leader1",
      prod: 100,
      tech: 58,
      bld: 41,
      total: 72,
    },
    {
      rank: 2,
      name: "Turks",
      founder: "Leader2",
      prod: 88,
      tech: 72,
      bld: 65,
      total: 68,
    },
    {
      rank: 3,
      name: "odtü",
      founder: "Leader3",
      prod: 65,
      tech: 80,
      bld: 55,
      total: 61,
    },
  ];

  const labels =
    locale === "en"
      ? {
          tabPlayers: "Player ranking",
          tabAlliances: "Alliance power",
          colRank: "#",
          colName: "Name",
          colScore: "Score",
          colFounder: "Founder",
          colProd: "Production",
          colTech: "Technology",
          colBld: "Building",
          colTotal: "Total",
        }
      : {
          tabPlayers: "Oyuncu sıralaması",
          tabAlliances: "İttifak gücü",
          colRank: "Sıra",
          colName: "Ad",
          colScore: "Skor",
          colFounder: "Kurucu",
          colProd: "Üretim",
          colTech: "Teknoloji",
          colBld: "Bina",
          colTotal: "Toplam",
        };

  return (
    <PlaceholderPage title={dict.game.stats}>
      <p className="mb-4 text-sm text-zinc-400">
        {locale === "en"
          ? "Rankings are illustrative until full scoring is wired."
          : "Skorlar tam bağlanana kadar örnek veridir."}
      </p>
      {user && (
        <p className="mb-4 text-xs text-zinc-500">
          {locale === "en" ? "You: " : "Sen: "}
          <span className="text-amber-200/90">{user.username}</span>
        </p>
      )}
      <StatsRankingsTabs
        playerRows={playerRows}
        allianceRows={allianceRows}
        labels={labels}
      />
    </PlaceholderPage>
  );
}

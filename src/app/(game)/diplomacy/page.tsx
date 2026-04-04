import { JoinAlliancePanel } from "@/components/game/JoinAlliancePanel";
import { StatsRankingsTabs } from "@/components/game/StatsRankingsTabs";
import { PlaceholderPage } from "@/components/game/PlaceholderPage";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllianceRankingRows } from "@/lib/alliance-rankings";
import { getCurrentUser } from "@/lib/current-user";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DiplomacyPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const user = await getCurrentUser();

  const allianceRows = await getAllianceRankingRows();

  const joinList = await prisma.alliance.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      inviteOnly: true,
      maxMembers: true,
      founder: { select: { username: true } },
      _count: { select: { members: true } },
    },
  });

  const inAlliance = !!user?.allianceMember;

  const labels =
    locale === "en"
      ? {
          tabPlayers: "Player ranking",
          tabAlliances: "Alliance rankings",
          colRank: "#",
          colName: "Alliance",
          colScore: "Score",
          colFounder: "Founder",
          colProd: "Production",
          colTech: "Technology",
          colBld: "Building",
          colTotal: "Total",
        }
      : {
          tabPlayers: "Oyuncu sıralaması",
          tabAlliances: "İttifak sıralaması",
          colRank: "Sıra",
          colName: "İttifak Adı",
          colScore: "Skor",
          colFounder: "Kurucu",
          colProd: "Üretim",
          colTech: "Teknoloji",
          colBld: "Bina",
          colTotal: "Toplam",
        };

  return (
    <PlaceholderPage title={dict.game.diplomacy}>
      <JoinAlliancePanel
        locale={locale}
        alreadyInAlliance={inAlliance}
        alliances={joinList.map((a) => ({
          id: a.id,
          name: a.name,
          founder: a.founder.username,
          inviteOnly: a.inviteOnly,
          memberCount: a._count.members,
          maxMembers: a.maxMembers,
        }))}
      />

      <h2
        className="mb-2 text-center text-sm font-bold uppercase tracking-wide text-red-600"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        {locale === "en"
          ? "Top 50 alliance scores (by member totals)"
          : "İlk 50 İttifak Skorları Dağılımı (Üyelerin Skorları Toplamına Göre Sıralanmıştır)"}
      </h2>
      <StatsRankingsTabs
        playerRows={[]}
        allianceRows={allianceRows}
        allianceOnly
        initialTab="a"
        labels={labels}
        classic
      />
    </PlaceholderPage>
  );
}

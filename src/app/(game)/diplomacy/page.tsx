import { AllianceDiplomacySection } from "@/components/game/AllianceDiplomacySection";
import { JoinAlliancePanel } from "@/components/game/JoinAlliancePanel";
import { PendingAllianceInvites } from "@/components/game/PendingAllianceInvites";
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

  const pendingInvites =
    user && !inAlliance
      ? await prisma.allianceInvite.findMany({
          where: { toUserId: user.id, status: "pending" },
          include: {
            alliance: { select: { name: true } },
            fromUser: { select: { username: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        })
      : [];

  let allianceHub: {
    name: string;
    founderId: string;
    meId: string;
    members: { userId: string; username: string; role: string }[];
    messages: {
      id: string;
      userId: string;
      username: string;
      body: string;
      createdAt: string;
    }[];
  } | null = null;

  if (user?.allianceMember) {
    const a = await prisma.alliance.findUnique({
      where: { id: user.allianceMember.allianceId },
      include: {
        members: {
          include: {
            user: { select: { id: true, username: true } },
          },
          orderBy: { joinedAt: "asc" },
        },
      },
    });
    if (a) {
      const msgs = await prisma.allianceMessage.findMany({
        where: { allianceId: a.id },
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { user: { select: { username: true } } },
      });
      allianceHub = {
        name: a.name,
        founderId: a.founderId,
        meId: user.id,
        members: a.members.map((m) => ({
          userId: m.user.id,
          username: m.user.username,
          role: m.role,
        })),
        messages: msgs.reverse().map((m) => ({
          id: m.id,
          userId: m.userId,
          username: m.user.username,
          body: m.body,
          createdAt: m.createdAt.toISOString(),
        })),
      };
    }
  }

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
      {user && !inAlliance ? (
        <PendingAllianceInvites
          locale={locale === "en" ? "en" : "tr"}
          invites={pendingInvites.map((i) => ({
            id: i.id,
            allianceName: i.alliance.name,
            fromUsername: i.fromUser.username,
          }))}
        />
      ) : null}

      {inAlliance && allianceHub ? (
        <AllianceDiplomacySection
          locale={locale === "en" ? "en" : "tr"}
          allianceName={allianceHub.name}
          founderId={allianceHub.founderId}
          meId={allianceHub.meId}
          members={allianceHub.members}
          initialMessages={allianceHub.messages}
        />
      ) : null}

      {!inAlliance ? (
        <JoinAlliancePanel
          locale={locale === "en" ? "en" : "tr"}
          alreadyInAlliance={false}
          alliances={joinList.map((a) => ({
            id: a.id,
            name: a.name,
            founder: a.founder.username,
            inviteOnly: a.inviteOnly,
            memberCount: a._count.members,
            maxMembers: a.maxMembers,
          }))}
        />
      ) : null}

      <h2
        className="mb-2 mt-8 text-center text-sm font-bold uppercase tracking-wide text-red-600"
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

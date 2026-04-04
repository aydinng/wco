import { StatsRankingsTabs } from "@/components/game/StatsRankingsTabs";
import { PlaceholderPage } from "@/components/game/PlaceholderPage";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllianceRankingRows } from "@/lib/alliance-rankings";
import { getCurrentUser } from "@/lib/current-user";
import { getLocale } from "@/lib/locale";
import { getPlayerRankingRows } from "@/lib/player-rankings";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const user = await getCurrentUser();

  const [playerRows, allianceRows] = await Promise.all([
    getPlayerRankingRows(50),
    getAllianceRankingRows(),
  ]);

  const labels =
    locale === "en"
      ? {
          tabPlayers: "Player ranking (top 50)",
          tabAlliances: "Alliance score distribution (top 50)",
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
          tabPlayers: "Oyuncu sıralaması (ilk 50)",
          tabAlliances:
            "İlk 50 İttifak Skorları Dağılımı (Üyelerin Skorları Toplamına Göre Sıralanmıştır)",
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
          ? "Your rank is also shown in the left sidebar under Logout."
          : "Sıranız ayrıca sol menüde Çıkışın altındaki skor kutusunda gösterilir."}
      </p>
      {user && (
        <p className="mb-4 text-xs text-zinc-500">
          {locale === "en" ? "You: " : "Sen: "}
          <span className="text-amber-200/90">{user.username}</span>
          {" — "}
          <span className="tabular-nums text-[#FFFF00]">
            {user.scoreTotal.toLocaleString()}
          </span>
        </p>
      )}
      <StatsRankingsTabs
        playerRows={playerRows}
        allianceRows={allianceRows}
        labels={labels}
        classic
        highlightUsername={user?.username ?? null}
      />
    </PlaceholderPage>
  );
}

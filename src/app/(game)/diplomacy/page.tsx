import { PlaceholderPage } from "@/components/game/PlaceholderPage";
import { StatsRankingsTabs } from "@/components/game/StatsRankingsTabs";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/lib/locale";
import Link from "next/link";

export const dynamic = "force-dynamic";

const MOCK_ALLIANCES = [
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

export default async function DiplomacyPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const inAlliance = false;

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
          colName: "İttifak",
          colScore: "Skor",
          colFounder: "Kurucu",
          colProd: "Üretim",
          colTech: "Teknoloji",
          colBld: "Bina",
          colTotal: "Toplam",
        };

  return (
    <PlaceholderPage title={dict.game.diplomacy}>
      {!inAlliance && (
        <div className="mb-6 rounded border border-amber-800/50 bg-amber-950/20 px-4 py-3 text-center">
          <Link
            href="#ittifaklar"
            className="text-sm font-semibold text-amber-200 underline hover:text-amber-100"
          >
            {locale === "en" ? "Join an alliance" : "İttifaka katıl"}
          </Link>
        </div>
      )}

      <div id="ittifaklar" className="relative">
        <h2
          className="mb-2 text-center text-sm font-bold uppercase tracking-wide text-red-500/90"
          style={{ fontFamily: "var(--font-warcity), serif" }}
        >
          {locale === "en"
            ? "Top 50 alliance scores (by member totals)"
            : "İlk 50 ittifak skorları (üyelerin skorları toplamına göre)"}
        </h2>
        <StatsRankingsTabs
          playerRows={[]}
          allianceRows={MOCK_ALLIANCES}
          initialTab="a"
          labels={labels}
        />
        <p className="mt-4 text-xs text-zinc-500">
          {locale === "en"
            ? "Placeholder data — your alliance UI will plug in here."
            : "Örnek liste — gerçek ittifak verisi bağlanınca güncellenecek."}
        </p>
      </div>
    </PlaceholderPage>
  );
}

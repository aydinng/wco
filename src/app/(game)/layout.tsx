import { SideNav } from "@/components/game/SideNav";
import { TopBanner } from "@/components/game/TopBanner";
import { BRAND } from "@/config/brand";
import { getEraConfig } from "@/config/eras";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/current-user";
import { getLocale } from "@/lib/locale";
import { getPlayerRankByUsername } from "@/lib/player-rankings";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function GameShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const playerEraId = user?.currentEra ?? "ilk_cag";
  const era = getEraConfig(playerEraId);
  const bg = BRAND.gameShellBackgroundSrc;
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const now = Date.now();

  const scoreLine =
    user && user.username
      ? {
          total: user.scoreTotal,
          rank: (await getPlayerRankByUsername(user.username)) ?? 1,
        }
      : null;

  const activeMissions =
    user?.id
      ? (
          await prisma.fleet.findMany({
            where: {
              userId: user.id,
              status: "traveling",
              arriveAt: { gt: new Date(now) },
            },
            orderBy: { arriveAt: "asc" },
            take: 6,
            select: {
              toCoordX: true,
              toCoordY: true,
              toCoordZ: true,
              arriveAt: true,
            },
          })
        ).map((f) => ({
          label: `Filo → ${f.toCoordX}:${f.toCoordY}:${f.toCoordZ}`,
          etaSec: Math.max(0, Math.ceil((f.arriveAt.getTime() - now) / 1000)),
        }))
      : [];

  return (
    <div
      className="min-h-screen text-[#eef2f0]"
      style={{
        backgroundImage: `linear-gradient(155deg, rgba(55,40,28,0.88) 0%, rgba(28,42,58,0.82) 38%, rgba(22,48,38,0.86) 72%, rgba(18,28,40,0.92) 100%), url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full px-2 sm:px-4">
        <TopBanner era={era} bannerAlt={dict.public.bannerAlt} />
      </div>
      <div className="mx-auto flex min-h-[60vh] max-w-7xl gap-2 px-2 pb-10 sm:px-4">
        <SideNav
          locale={locale}
          labels={dict.game}
          lang={dict.lang}
          era={era}
          serverNow={new Date()}
          serverDateLabel={dict.game.serverDate}
          profile={{
            username: user?.username ?? "",
            tribeName: user?.tribeName ?? "",
            registrationCountry: user?.registrationCountry ?? "",
          }}
          scoreLine={scoreLine}
          productionCities={
            user?.cities?.map((c) => ({ id: c.id, name: c.name })) ?? []
          }
          activeMissions={activeMissions}
          activeMissionsTitle={locale === "en" ? "Active missions" : "Aktif görevler"}
          etaLabel="ETA"
        />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

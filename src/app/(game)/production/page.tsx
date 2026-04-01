import { TrainUnitQueueForm } from "@/components/game/TrainUnitQueueForm";
import { UnitCatalog } from "@/components/game/UnitCatalog";
import { unlockedUnits } from "@/config/units";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/current-user";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProductionPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const p = dict.play;
  const user = await getCurrentUser();
  const cities = user?.cities ?? [];
  const sp = await searchParams;
  const units = unlockedUnits(user?.currentEra);

  if (!user || cities.length === 0) {
    return (
      <div className="rounded border border-[#2a3441]/90 bg-black/35 p-4 backdrop-blur-sm">
        <h2
          className="mb-2 text-lg text-amber-200/90"
          style={{ fontFamily: "var(--font-warcity), serif" }}
        >
          {p.productionTitle}
        </h2>
        <p className="text-sm text-zinc-500">{p.overviewNoSeed}</p>
      </div>
    );
  }

  const defaultCityId = cities[0]?.id ?? "";
  const selectedCityId =
    sp.city && cities.some((c) => c.id === sp.city) ? sp.city : defaultCityId;
  const selectedCity =
    cities.find((c) => c.id === selectedCityId) ?? cities[0]!;

  const jobs = await (prisma as any).trainingJob.findMany({
    where: {
      userId: user.id,
      cityId: selectedCity.id,
      status: "queued",
    },
    orderBy: { completesAt: "asc" },
    take: 3,
    select: { id: true, unitId: true, completesAt: true },
  });
  const typedJobs = jobs as {
    id: string;
    unitId: string;
    completesAt: Date;
  }[];

  return (
    <div className="rounded border border-[#2a3441]/90 bg-black/35 p-4 backdrop-blur-sm">
      <h2
        className="mb-4 text-lg text-amber-200/90"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        {p.productionTitle}
      </h2>
      <UnitCatalog
        units={units}
        playerEra={user.currentEra}
        play={p}
        locale={locale}
      />
      <TrainUnitQueueForm
        cityId={selectedCity.id}
        cityName={selectedCity.name}
        units={units}
        jobs={typedJobs.map((j) => ({
          id: j.id,
          unitId: j.unitId,
          completesAt: j.completesAt.toISOString(),
        }))}
        labels={{
          trainBtn: p.trainBtn,
          amountLabel: p.trainAmount,
          queueLabel: locale === "en" ? "Queue" : "Kuyruk",
        }}
      />
    </div>
  );
}

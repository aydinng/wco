import { ProductionCityPicker } from "@/components/game/ProductionCityPicker";
import { TrainingQueueBar } from "@/components/game/TrainingQueueBar";
import { UnitCatalog } from "@/components/game/UnitCatalog";
import { catalogUnits, getUnitSpec } from "@/config/units";
import { getResourceUnlocks } from "@/config/eras";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/current-user";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";

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
  const units = catalogUnits();

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

  const unlocks = getResourceUnlocks(user.currentEra);
  const defaultCityId = cities[0]?.id ?? "";
  const selectedCityId =
    sp.city && cities.some((c) => c.id === sp.city) ? sp.city : defaultCityId;
  const selectedCity =
    cities.find((c) => c.id === selectedCityId) ?? cities[0]!;

  const jobs = await prisma.trainingJob.findMany({
    where: {
      userId: user.id,
      cityId: selectedCity.id,
      status: "queued",
    },
    orderBy: { completesAt: "asc" },
    take: 3,
    select: { id: true, unitId: true, completesAt: true, quantity: true },
  });

  const queueJobs = jobs.map((j) => ({
    id: j.id,
    unitId: j.unitId,
    unitName: getUnitSpec(j.unitId)?.name ?? j.unitId,
    quantity: j.quantity ?? 1,
    completesAt: j.completesAt.toISOString(),
  }));

  return (
    <div className="rounded border border-[#2a3441]/90 bg-black/35 p-4 backdrop-blur-sm">
      <h2
        className="mb-1 text-lg text-amber-200/90"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        {p.productionTitle}
      </h2>

      <Suspense
        fallback={
          <div className="mb-4 h-10 max-w-md animate-pulse rounded bg-zinc-800/40" />
        }
      >
        <ProductionCityPicker
          cities={cities.map((c) => ({ id: c.id, name: c.name }))}
          label={p.overviewSelectCity}
        />
      </Suspense>

      <TrainingQueueBar
        jobs={queueJobs}
        queueLabel={locale === "en" ? "Training queue" : "Eğitim kuyruğu"}
        locale={locale}
        emptyHint={
          locale === "en"
            ? "No units in training for this city."
            : "Bu şehirde eğitimde birim yok."
        }
      />

      <UnitCatalog
        units={units}
        playerEra={user.currentEra}
        play={p}
        locale={locale}
        cityId={selectedCity.id}
        unlocks={unlocks}
      />
    </div>
  );
}

"use server";

import { auth } from "@/auth";
import { getResourceUnlocks } from "@/config/eras";
import type { Dictionary } from "@/i18n/dictionaries";
import { getDictionary } from "@/i18n/dictionaries";
import {
  canAfford,
  getResearchCost,
  getUpgradeCost,
  isIlkCagCoreBuilding,
  maxLevelForBuilding,
  MAX_RESEARCH_TIER,
  soldierCap,
  trainCostPerSoldier,
  unitTrainCostPerSoldierTotal,
} from "@/lib/economy";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import {
  buildingUpgradeDurationSec,
  researchTierAdvanceDurationSec,
} from "@/lib/duration-scaling";
import { flushResearchJob } from "@/lib/research-tick";
import { eraIndex } from "@/config/eras";
import { enqueueTrainingJobsTx } from "@/lib/training-tick";
import { revalidatePath } from "next/cache";
import type { UnitId } from "@/config/units";
import { getUnitSpec } from "@/config/units";

export type ActionResult = { ok: true } | { ok: false; error: string };

type PlayErr = keyof Pick<
  Dictionary["play"],
  | "errLogin"
  | "errCity"
  | "errUser"
  | "errWorkersOver"
  | "errBuildingMax"
  | "errInsufficient"
  | "errBarracksFull"
  | "errInvalidAmount"
  | "errBuildingLocked"
  | "errBuildBusy"
  | "errBuildingPending"
  | "errBuildQueueFull"
  | "errResearchMax"
  | "errResearchBusy"
  | "errUnitEraLocked"
  | "errTrainQueueFull"
  | "errResearchLodgeRequired"
  | "errNoBarracks"
>;

async function pe(key: PlayErr): Promise<string> {
  const dict = getDictionary(await getLocale());
  return dict.play[key];
}

function paths() {
  revalidatePath("/overview");
  revalidatePath("/resources");
  revalidatePath("/buildings");
  revalidatePath("/research");
  revalidatePath("/production");
  revalidatePath("/fleet");
}

async function requireUserCity(cityId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false as const, error: await pe("errLogin") };
  const city = await prisma.city.findFirst({
    where: { id: cityId, userId },
  });
  if (!city) return { ok: false as const, error: await pe("errCity") };
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false as const, error: await pe("errUser") };
  const unlocks = getResourceUnlocks(user.currentEra);
  return { ok: true as const, city, user, unlocks };
}

export async function assignWorkers(
  cityId: string,
  workersWood: number,
  workersIron: number,
  workersOil: number,
  workersFood: number,
): Promise<ActionResult> {
  const r = await requireUserCity(cityId);
  if (!r.ok) return r;
  const { city, unlocks } = r;
  const ww = Math.max(0, Math.floor(workersWood));
  let wi = Math.max(0, Math.floor(workersIron));
  let wo = Math.max(0, Math.floor(workersOil));
  const wf = Math.max(0, Math.floor(workersFood));
  if (!unlocks.iron) wi = 0;
  if (!unlocks.oil) wo = 0;
  const sum = ww + wi + wo + wf;
  if (sum > city.population) {
    return { ok: false, error: await pe("errWorkersOver") };
  }
  await prisma.city.update({
    where: { id: cityId },
    data: { workersWood: ww, workersIron: wi, workersOil: wo, workersFood: wf },
  });
  paths();
  return { ok: true };
}

const BUILDING_FIELD = {
  townHall: "townHallLevel",
  lumberMill: "lumberMillLevel",
  ironMine: "ironMineLevel",
  oilWell: "oilWellLevel",
  farm: "farmLevel",
  barracks: "barracksLevel",
  researchLodge: "researchLodgeLevel",
  shepherdLodge: "shepherdLodgeLevel",
  civilLodge: "civilLodgeLevel",
  bank: "bankLevel",
  policeDept: "policeDeptLevel",
} as const;

export type BuildingId = keyof typeof BUILDING_FIELD;

export async function upgradeBuilding(
  cityId: string,
  building: BuildingId,
): Promise<ActionResult> {
  const r = await requireUserCity(cityId);
  if (!r.ok) return r;
  const { city, unlocks, user } = r;
  if (building === "ironMine" && !unlocks.iron) {
    return { ok: false, error: await pe("errBuildingLocked") };
  }
  if (building === "oilWell" && !unlocks.oil) {
    return { ok: false, error: await pe("errBuildingLocked") };
  }
  if (
    (building === "bank" || building === "policeDept") &&
    eraIndex(user.currentEra) < 1
  ) {
    return { ok: false, error: await pe("errBuildingLocked") };
  }

  const queueCount = await prisma.buildingJob.count({
    where: { userId: user.id, status: "queued" },
  });
  if (queueCount >= 2) {
    return { ok: false, error: await pe("errBuildQueueFull") };
  }

  const sameBuildingQueued = await prisma.buildingJob.findFirst({
    where: {
      userId: user.id,
      cityId,
      buildingId: building,
      status: "queued",
    },
    select: { id: true },
  });
  if (sameBuildingQueued) {
    return { ok: false, error: await pe("errBuildingPending") };
  }

  const hasActive = await prisma.buildingJob.findFirst({
    where: {
      userId: user.id,
      status: "queued",
      completesAt: { not: null },
    },
    select: { id: true },
  });

  const field = BUILDING_FIELD[building];
  const cur = city[field as keyof typeof city] as number;
  const cap = maxLevelForBuilding(building);
  if (cur >= cap) {
    return { ok: false, error: await pe("errBuildingMax") };
  }
  const firstAge = eraIndex(user.currentEra) < 1;
  let cost = getUpgradeCost(cur, unlocks, {
    ilkCagWoodFoodOnly: firstAge,
    currentEra: user.currentEra,
    buildingId: building,
  });
  if (firstAge || isIlkCagCoreBuilding(building)) {
    cost = { ...cost, iron: 0, oil: 0 };
  }
  if (!canAfford(city, cost)) {
    return { ok: false, error: await pe("errInsufficient") };
  }
  const next = cur + 1;

  const durationSec = buildingUpgradeDurationSec({
    buildingId: building,
    toLevel: next,
    researchTier: user.researchTier,
  });
  const startsAt = new Date();
  /** Aktif iş varken yeni kayıt sırada bekler (completesAt sonra dolar). */
  const completesAt: Date | null = hasActive
    ? null
    : new Date(Date.now() + durationSec * 1000);

  await prisma.$transaction(async (tx) => {
    await tx.city.update({
      where: { id: cityId },
      data: {
        wood: city.wood - cost.wood,
        iron: city.iron - cost.iron,
        oil: city.oil - cost.oil,
        food: city.food - cost.food,
      },
    });
    await tx.buildingJob.create({
      data: {
        userId: user.id,
        cityId,
        buildingId: building,
        fromLevel: cur,
        toLevel: next,
        durationSec,
        startsAt,
        completesAt,
        status: "queued",
      },
    });
  });
  paths();
  return { ok: true };
}

export async function cancelBuildingJob(jobId: string): Promise<ActionResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false, error: await pe("errLogin") };

  const job = await prisma.buildingJob.findFirst({
    where: { id: jobId, userId, status: "queued" },
  });
  if (!job) return { ok: false, error: await pe("errCity") };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false, error: await pe("errUser") };

  const city = await prisma.city.findFirst({
    where: { id: job.cityId, userId },
  });
  if (!city) return { ok: false, error: await pe("errCity") };

  const unlocks = getResourceUnlocks(user.currentEra);
  const firstAge = eraIndex(user.currentEra) < 1;
  const jobBuilding = job.buildingId as BuildingId;
  let cost = getUpgradeCost(job.fromLevel, unlocks, {
    ilkCagWoodFoodOnly: firstAge,
    currentEra: user.currentEra,
    buildingId: jobBuilding,
  });
  if (firstAge || isIlkCagCoreBuilding(jobBuilding)) {
    cost = { ...cost, iron: 0, oil: 0 };
  }

  const now = new Date();
  const wasActive = job.completesAt != null;

  await prisma.$transaction(async (tx) => {
    await tx.city.update({
      where: { id: city.id },
      data: {
        wood: city.wood + cost.wood,
        iron: city.iron + cost.iron,
        oil: city.oil + cost.oil,
        food: city.food + cost.food,
      },
    });
    await tx.buildingJob.update({
      where: { id: jobId },
      data: { status: "cancelled" },
    });
  });

  if (wasActive) {
    const pending = await prisma.buildingJob.findFirst({
      where: { userId, status: "queued", completesAt: null },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    });
    if (pending) {
      await prisma.buildingJob.update({
        where: { id: pending.id },
        data: {
          startsAt: now,
          completesAt: new Date(now.getTime() + pending.durationSec * 1000),
        },
      });
    }
  }

  paths();
  return { ok: true };
}

export async function advanceResearch(payCityId: string): Promise<ActionResult> {
  const r = await requireUserCity(payCityId);
  if (!r.ok) return r;
  const { city, unlocks } = r;
  let { user } = r;

  const fresh = await flushResearchJob(user.id);
  if (fresh) user = fresh;

  const anyResearchLodge = await prisma.city.findFirst({
    where: { userId: user.id, researchLodgeLevel: { gte: 1 } },
    select: { id: true },
  });
  if (!anyResearchLodge) {
    return { ok: false, error: await pe("errResearchLodgeRequired") };
  }

  if (user.researchTier >= MAX_RESEARCH_TIER) {
    return { ok: false, error: await pe("errResearchMax") };
  }
  if (user.researchJobEndsAt && user.researchJobEndsAt.getTime() > Date.now()) {
    return { ok: false, error: await pe("errResearchBusy") };
  }

  const nextTier = user.researchTier + 1;
  const firstAgeResearch = eraIndex(user.currentEra) < 1;
  let cost = getResearchCost(nextTier, unlocks, {
    ilkCagWoodFoodOnly: firstAgeResearch,
    currentEra: user.currentEra,
  });
  if (firstAgeResearch) {
    cost = { ...cost, iron: 0, oil: 0 };
  }
  if (!canAfford(city, cost)) {
    return { ok: false, error: await pe("errInsufficient") };
  }

  const allCities = await prisma.city.findMany({
    where: { userId: user.id },
    select: { researchLodgeLevel: true },
  });
  const researchLodgeBonusPct = Math.min(
    28,
    allCities.reduce((s, c) => s + c.researchLodgeLevel, 0) * 1.4,
  );

  const durationSec = researchTierAdvanceDurationSec({
    targetTier: nextTier,
    completedResearchTier: user.researchTier,
    researchLodgeBonusPct,
  });
  const endsAt = new Date(Date.now() + durationSec * 1000);

  await prisma.$transaction([
    prisma.city.update({
      where: { id: payCityId },
      data: {
        wood: city.wood - cost.wood,
        iron: city.iron - cost.iron,
        oil: city.oil - cost.oil,
        food: city.food - cost.food,
      },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { researchJobEndsAt: endsAt },
    }),
  ]);
  paths();
  return { ok: true };
}

export async function trainSoldiers(
  cityId: string,
  amount: number,
): Promise<ActionResult> {
  const r = await requireUserCity(cityId);
  if (!r.ok) return r;
  const { city, unlocks, user } = r;
  const n = Math.max(0, Math.floor(amount));
  if (n < 1) return { ok: false, error: await pe("errInvalidAmount") };
  if (city.barracksLevel < 1) {
    return { ok: false, error: await pe("errNoBarracks") };
  }
  const cap = soldierCap(city.barracksLevel);
  if (city.soldiers + n > cap) {
    return { ok: false, error: await pe("errBarracksFull") };
  }
  const per = unitTrainCostPerSoldierTotal(
    { costAddon: undefined },
    unlocks,
    user.currentEra,
  );
  const w = per.wood * n;
  const i = per.iron * n;
  const f = per.food * n;
  if (city.wood < w || city.iron < i || city.food < f) {
    return { ok: false, error: await pe("errInsufficient") };
  }
  await prisma.city.update({
    where: { id: cityId },
    data: {
      wood: city.wood - w,
      iron: city.iron - i,
      food: city.food - f,
      soldiers: city.soldiers + n,
    },
  });
  paths();
  return { ok: true };
}

export async function queueTrainUnit(
  cityId: string,
  unitId: UnitId,
  amount: number,
): Promise<ActionResult> {
  const r = await requireUserCity(cityId);
  if (!r.ok) return r;
  const { city, unlocks, user } = r;

  const spec = getUnitSpec(unitId);
  if (!spec) return { ok: false, error: await pe("errInvalidAmount") };

  if (eraIndex(spec.minEra) > eraIndex(user.currentEra)) {
    return { ok: false, error: await pe("errUnitEraLocked") };
  }

  const n = Math.max(0, Math.floor(amount));
  if (n < 1 || n > 50) return { ok: false, error: await pe("errInvalidAmount") };

  if (city.barracksLevel < 1) {
    return { ok: false, error: await pe("errBuildingLocked") };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const active = await tx.trainingJob.count({
        where: { userId: user.id, cityId, status: "queued" },
      });
      if (active >= 3) {
        throw Object.assign(new Error("queue"), { code: "QUEUE" as const });
      }

      const queuedAgg = await tx.trainingJob.aggregate({
        where: { userId: user.id, cityId, status: "queued" },
        _sum: { quantity: true },
      });
      const queuedSoldiers = queuedAgg._sum.quantity ?? 0;
      const cap = soldierCap(city.barracksLevel);
      if (city.soldiers + queuedSoldiers + n > cap) {
        throw Object.assign(new Error("barracks"), { code: "BARRACKS" as const });
      }

      const per = unitTrainCostPerSoldierTotal(spec, unlocks, user.currentEra);
      const w = per.wood * n;
      const i = per.iron * n;
      const o = per.oil * n;
      const f = per.food * n;
      if (city.wood < w || city.iron < i || city.oil < o || city.food < f) {
        throw Object.assign(new Error("res"), { code: "RES" as const });
      }

      await tx.city.update({
        where: { id: cityId },
        data: {
          wood: city.wood - w,
          iron: city.iron - i,
          oil: city.oil - o,
          food: city.food - f,
        },
      });

      await enqueueTrainingJobsTx(tx, {
        userId: user.id,
        cityId,
        unitId,
        amount: n,
        researchTier: user.researchTier,
      });
    });
  } catch (e: unknown) {
    const code =
      e && typeof e === "object" && "code" in e
        ? (e as { code?: string }).code
        : undefined;
    if (code === "QUEUE") {
      return { ok: false, error: await pe("errTrainQueueFull") };
    }
    if (code === "BARRACKS") {
      return { ok: false, error: await pe("errBarracksFull") };
    }
    if (code === "RES") {
      return { ok: false, error: await pe("errInsufficient") };
    }
    throw e;
  }

  paths();
  return { ok: true };
}

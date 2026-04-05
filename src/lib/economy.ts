import type { City } from "@prisma/client";
import type { ResourceUnlocks } from "@/config/eras";
import type { UnitSpec } from "@/config/units";

export const MAX_BUILDING_LEVEL = 20;
export const MAX_RESEARCH_TIER = 20;

/** Saatlik taban / işçi — erken oyun hissi için kitap tarzı daha yüksek başlangıç üretimi */
const BASE = { wood: 22, iron: 14, oil: 9, food: 26 } as const;

/**
 * Bina üretim çarpanı — WarCity / Battle of Ages tarzı: seviye 1 taban,
 * sonraki her seviye ~%10 ek (seviye 0 = bina yok → 0).
 */
export function buildingProductionMultiplier(level: number): number {
  if (level < 1) return 0;
  return 1 + Math.max(0, level - 1) * 0.1;
}

function buildingMult(level: number) {
  return buildingProductionMultiplier(level);
}

/**
 * Odun / besin: bina seviyesi 0 iken bile işçiyle çok düşük “ilkel toplama”
 * (aksi halde çarpan 0 olurdu ve stok hiç artmazdı).
 * Demir / petrol için bina şart (0 = üretim yok).
 */
function woodFoodMult(level: number): number {
  if (level < 1) return 0.34;
  return buildingProductionMultiplier(level);
}

function mineOilMult(level: number): number {
  return buildingProductionMultiplier(level);
}

/** İmparatorluk araştırması: her seviye ~%5 üretim (tasarım bandı %5–10) */
export function researchMultiplier(researchTier: number) {
  return 1 + researchTier * 0.05;
}

export function computePopCap(city: {
  townHallLevel: number;
  barracksLevel: number;
  civilLodgeLevel?: number;
}) {
  const th = Math.max(0, city.townHallLevel);
  const br = Math.max(0, city.barracksLevel);
  const cl = Math.max(0, city.civilLodgeLevel ?? 0);
  return Math.min(8000, 140 + th * 50 + br * 20 + cl * 10);
}

/** DB’deki popCap ile formülü birleştir (eski kayıtlar için) */
export function effectivePopCap(
  city: {
    popCap: number;
    townHallLevel: number;
    barracksLevel: number;
    civilLodgeLevel?: number;
  },
) {
  return Math.max(city.popCap, computePopCap(city));
}

/** Polis: savunma önerisine küçük katkı (MVP). */
export function policeDefenseBonus(policeDeptLevel: number): number {
  return Math.max(0, Math.floor(policeDeptLevel)) * 10;
}

export type ProductionRates = {
  wood: number;
  iron: number;
  oil: number;
  food: number;
};

/** Saatlik üretim (işçi × bina × araştırma); kilitli çağda demir/petrol yok */
export function hourlyProduction(
  city: Pick<
    City,
    | "workersWood"
    | "workersIron"
    | "workersOil"
    | "workersFood"
    | "lumberMillLevel"
    | "ironMineLevel"
    | "oilWellLevel"
    | "farmLevel"
    | "shepherdLodgeLevel"
  >,
  researchTier: number,
  unlocks: ResourceUnlocks,
): ProductionRates {
  const r = researchMultiplier(researchTier);
  const ironOn = unlocks.iron;
  const oilOn = unlocks.oil;
  const shLv = Math.max(0, city.shepherdLodgeLevel ?? 0);
  /** Çoban kulübesi: seviye başına +0,1 besin/dk → saatte 6 × seviye × araştırma */
  const shepherdFoodHourly = Math.floor(6 * shLv * r);

  const lmLv = Math.max(0, city.lumberMillLevel);
  /** Oduncu kulübesi: seviye başına +0,1 odun/dk → saatte 6 × seviye × araştırma */
  const lumberLodgeWoodFlat = Math.floor(6 * lmLv * r);

  const woodFromWorkers = Math.floor(
    city.workersWood * BASE.wood * woodFoodMult(city.lumberMillLevel) * r,
  );
  return {
    wood: woodFromWorkers + lumberLodgeWoodFlat,
    iron: ironOn
      ? Math.floor(
          city.workersIron *
            BASE.iron *
            mineOilMult(city.ironMineLevel) *
            r,
        )
      : 0,
    oil: oilOn
      ? Math.floor(
          city.workersOil * BASE.oil * mineOilMult(city.oilWellLevel) * r,
        )
      : 0,
    food:
      Math.floor(
        city.workersFood *
          BASE.food *
          woodFoodMult(city.farmLevel) *
          r,
      ) + shepherdFoodHourly,
  };
}

export function sumProduction(
  cities: Parameters<typeof hourlyProduction>[0][],
  researchTier: number,
  unlocks: ResourceUnlocks,
): ProductionRates {
  return cities.reduce(
    (acc, c) => {
      const p = hourlyProduction(c, researchTier, unlocks);
      return {
        wood: acc.wood + p.wood,
        iron: acc.iron + p.iron,
        oil: acc.oil + p.oil,
        food: acc.food + p.food,
      };
    },
    { wood: 0, iron: 0, oil: 0, food: 0 },
  );
}

/**
 * Saatlik besin tüketimi: nüfus + asker + kışla (taşıyıcı/lojistik).
 * Çağ indeksi arttıkça taban tüketim artar (daha “modern” ekonomi).
 */
export function hourlyFoodConsumption(
  city: Pick<City, "population" | "soldiers" | "barracksLevel">,
  eraIndex: number,
): number {
  const eraFactor = 1 + Math.max(0, eraIndex) * 0.07;
  const pop = Math.max(0, city.population);
  const soldiers = Math.max(0, city.soldiers);
  const br = Math.max(0, city.barracksLevel);
  const fromPop = pop * 0.22;
  const fromSoldiers = soldiers * 2.1;
  const fromBarracks = br * 4.5;
  return Math.floor((fromPop + fromSoldiers + fromBarracks) * eraFactor);
}

export function safeInt(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.floor(Math.max(0, n));
}

export function getUpgradeCost(
  currentLevel: number,
  unlocks: ResourceUnlocks,
  opts?: { ilkCagWoodFoodOnly?: boolean },
) {
  const L = Math.max(1, currentLevel);
  const base = {
    wood: 65 * L * L,
    iron: 55 * L * L,
    oil: 38 * L * L,
    food: 55 * L * L,
  };
  const onlyWF = opts?.ilkCagWoodFoodOnly === true;
  return {
    wood: base.wood,
    iron: onlyWF || !unlocks.iron ? 0 : base.iron,
    oil: onlyWF || !unlocks.oil ? 0 : base.oil,
    food: base.food,
  };
}

export function getResearchCost(
  nextTier: number,
  unlocks: ResourceUnlocks,
  opts?: { ilkCagWoodFoodOnly?: boolean },
) {
  const t = Math.max(1, nextTier);
  const base = {
    wood: 200 * t * t,
    iron: 200 * t * t,
    oil: 100 * t * t,
    food: 150 * t * t,
  };
  const onlyWF = opts?.ilkCagWoodFoodOnly === true;
  return {
    wood: base.wood,
    iron: onlyWF || !unlocks.iron ? 0 : base.iron,
    oil: onlyWF || !unlocks.oil ? 0 : base.oil,
    food: base.food,
  };
}

export function canAfford(
  city: Pick<City, "wood" | "iron" | "oil" | "food">,
  cost: { wood: number; iron: number; oil: number; food: number },
) {
  return (
    city.wood >= cost.wood &&
    city.iron >= cost.iron &&
    city.oil >= cost.oil &&
    city.food >= cost.food
  );
}

export function soldierCap(barracksLevel: number) {
  if (barracksLevel < 1) return 0;
  const base = 200;
  const mult = buildingProductionMultiplier(barracksLevel);
  return Math.floor(base * barracksLevel * mult);
}

/** Filo saldırı gücü için öneri (MVP) */
export function suggestedFleetAttack(soldiers: number, barracksLevel: number) {
  return Math.max(0, soldiers * 12 + barracksLevel * 80);
}

export function trainCostPerSoldier(unlocks: ResourceUnlocks) {
  return {
    wood: 8,
    iron: unlocks.iron ? 18 : 0,
    food: 22,
  };
}

/** Katalog / UI: birim başına toplam hammadde (kilitli çağda demir/petrol 0) */
export function unitTrainCostPerSoldierTotal(
  spec: Pick<UnitSpec, "costAddon">,
  unlocks: ResourceUnlocks,
) {
  const tc = trainCostPerSoldier(unlocks);
  const add = spec.costAddon ?? {};
  return {
    wood: tc.wood + (add.wood ?? 0),
    iron: tc.iron + (add.iron ?? 0),
    oil: unlocks.oil ? (add.oil ?? 0) : 0,
    food: tc.food + (add.food ?? 0),
  };
}

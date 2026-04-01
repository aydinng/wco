import { eraIndex, getResourceUnlocks } from "@/config/eras";
import {
  hourlyFoodConsumption,
  hourlyProduction,
} from "@/lib/economy";
import { prisma } from "@/lib/prisma";
import type { City, User } from "@prisma/client";

const MAX_TICK_HOURS = 168;
/** Çok sık DB yazmayı kes — en az ~5 sn aralık */
const MIN_TICK_HOURS = 5 / 3600;

type CityWithTick = City & { lastResourceTick: Date };

function lastTickMs(city: City): number {
  const t = (city as CityWithTick).lastResourceTick;
  const d = new Date(t ?? city.createdAt);
  const ms = d.getTime();
  return Number.isFinite(ms) ? ms : Date.now();
}

/**
 * Şehirler arası saatlik üretim ve besin tüketimini uygular (offline süre max 7 gün).
 */
export async function applyResourceTicksFromSnapshot(
  user: User & { cities: City[] },
): Promise<void> {
  if (user.cities.length === 0) return;
  const unlocks = getResourceUnlocks(user.currentEra);
  const eIdx = eraIndex(user.currentEra);
  const now = Date.now();

  for (const city of user.cities) {
    const last = lastTickMs(city);
    const hoursRaw = (now - last) / 3600000;
    if (!Number.isFinite(hoursRaw) || hoursRaw < MIN_TICK_HOURS) continue;
    const capped = Math.min(hoursRaw, MAX_TICK_HOURS);
    const ph = hourlyProduction(city, user.researchTier, unlocks);
    const foodCons = hourlyFoodConsumption(city, eIdx);
    const w = Number.isFinite(ph.wood) ? ph.wood : 0;
    const ir = Number.isFinite(ph.iron) ? ph.iron : 0;
    const oi = Number.isFinite(ph.oil) ? ph.oil : 0;
    const fd = Number.isFinite(ph.food) ? ph.food : 0;
    const fc = Number.isFinite(foodCons) ? foodCons : 0;
    const deltaWood = Math.floor(w * capped);
    const deltaIron = Math.floor(ir * capped);
    const deltaOil = Math.floor(oi * capped);
    const deltaFood = Math.floor(fd * capped - fc * capped);
    await prisma.city.update({
      where: { id: city.id },
      data: {
        wood: city.wood + deltaWood,
        iron: city.iron + deltaIron,
        oil: city.oil + deltaOil,
        food: Math.max(0, city.food + deltaFood),
        lastResourceTick: new Date(now),
      },
    });
  }
}

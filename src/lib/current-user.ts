import { auth } from "@/auth";
import { applyResourceTicksFromSnapshot } from "@/lib/resource-tick";
import { applyBuildingJobs } from "@/lib/building-tick";
import { applyTrainingJobs } from "@/lib/training-tick";
import { applyResearchJobs } from "@/lib/research-tick";
import { applyEraTechJobs } from "@/lib/era-tech-tick";
import { syncLegacySoldiersToUnitStocks } from "@/lib/ensure-unit-stocks";
import { computeUserScores } from "@/lib/score";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getCurrentUser = cache(async () => {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { cities: { orderBy: { name: "asc" } } },
    });
    if (!user) return null;

    try {
      await applyResourceTicksFromSnapshot(user);
    } catch (e) {
      console.error("[applyResourceTicksFromSnapshot]", e);
    }

    try {
      await applyBuildingJobs(user);
    } catch (e) {
      console.error("[applyBuildingJobs]", e);
    }

    try {
      await applyResearchJobs(user);
    } catch (e) {
      console.error("[applyResearchJobs]", e);
    }

    try {
      await applyEraTechJobs(user.id);
    } catch (e) {
      console.error("[applyEraTechJobs]", e);
    }

    try {
      await applyTrainingJobs(user);
    } catch (e) {
      console.error("[applyTrainingJobs]", e);
    }

    try {
      await syncLegacySoldiersToUnitStocks(id);
    } catch (e) {
      console.error("[syncLegacySoldiersToUnitStocks]", e);
    }

    const fresh = await prisma.user.findUnique({
      where: { id },
      include: { cities: { orderBy: { name: "asc" } } },
    });
    if (fresh) {
      try {
        const s = computeUserScores(fresh);
        if (
          s.scoreTotal !== fresh.scoreTotal ||
          s.scoreProduction !== fresh.scoreProduction ||
          s.scoreTech !== fresh.scoreTech ||
          s.scoreBuilding !== fresh.scoreBuilding
        ) {
          await prisma.user.update({
            where: { id },
            data: {
              scoreTotal: s.scoreTotal,
              scoreProduction: s.scoreProduction,
              scoreTech: s.scoreTech,
              scoreBuilding: s.scoreBuilding,
            },
          });
          return prisma.user.findUnique({
            where: { id },
            include: {
              cities: { orderBy: { name: "asc" } },
              allianceMember: { include: { alliance: true } },
            },
          });
        }
      } catch (e) {
        console.error("[computeUserScores]", e);
      }
    }

    return prisma.user.findUnique({
      where: { id },
      include: {
        cities: { orderBy: { name: "asc" } },
        allianceMember: { include: { alliance: true } },
      },
    });
  } catch (e) {
    console.error("[getCurrentUser]", e);
    return null;
  }
});

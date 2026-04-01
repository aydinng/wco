import { auth } from "@/auth";
import { applyResourceTicksFromSnapshot } from "@/lib/resource-tick";
import { applyBuildingJobs } from "@/lib/building-tick";
import { applyTrainingJobs } from "@/lib/training-tick";
import { applyResearchJobs } from "@/lib/research-tick";
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
      await applyTrainingJobs(user);
    } catch (e) {
      console.error("[applyTrainingJobs]", e);
    }

    return prisma.user.findUnique({
      where: { id },
      include: { cities: { orderBy: { name: "asc" } } },
    });
  } catch (e) {
    console.error("[getCurrentUser]", e);
    return null;
  }
});

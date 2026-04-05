import { getTechByKey, isOneShotEraTech } from "@/config/technology-catalog";
import type { PrismaClient } from "@prisma/client";

type Tx = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;

/**
 * Tamamlanan çağ teknolojisi: tek seferlik (orta çağ + orta çağ kilidi) veya seviye +1.
 * orta_cag_unlock tamamlanınca oyuncu çağı orta çağa yükselir.
 */
export async function applyCompletedEraTech(
  tx: Tx,
  userId: string,
  techKey: string,
) {
  const entry = getTechByKey(techKey);
  if (!entry) return;

  const oneShot = isOneShotEraTech(entry);
  const existing = await tx.userEraTech.findUnique({
    where: { userId_techKey: { userId, techKey } },
  });

  if (oneShot) {
    await tx.userEraTech.upsert({
      where: { userId_techKey: { userId, techKey } },
      create: { userId, techKey, level: 1 },
      update: { level: 1 },
    });
  } else if (existing) {
    await tx.userEraTech.update({
      where: { userId_techKey: { userId, techKey } },
      data: { level: { increment: 1 } },
    });
  } else {
    await tx.userEraTech.create({
      data: { userId, techKey, level: 1 },
    });
  }

  if (techKey === "orta_cag_unlock") {
    await tx.user.update({
      where: { id: userId },
      data: { currentEra: "orta_cag" },
    });
  }
}

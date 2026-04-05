"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  /** En yakın işin bitişi (ISO); süre dolunca sayfa yenilenir */
  nextCompletionIso: string | null;
  /** Sırada bekleyen bina (henüz süre yok) — aralıklı yenileme */
  pollStalledBuildingQueue: boolean;
};

/**
 * Bina yükseltmesi, asker üretimi, imparatorluk araştırması veya çağ teknolojisi
 * bittiğinde skor ve kaynakların sunucu ile eşitlenmesi için `router.refresh()`.
 */
export function GameAutoRefresh({
  nextCompletionIso,
  pollStalledBuildingQueue,
}: Props) {
  const router = useRouter();

  useEffect(() => {
    const refresh = () => {
      router.refresh();
    };

    const onVis = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [router]);

  useEffect(() => {
    if (!nextCompletionIso) return;
    const t = new Date(nextCompletionIso).getTime();
    const delay = Math.max(0, t - Date.now()) + 500;
    const id = window.setTimeout(() => router.refresh(), delay);
    return () => window.clearTimeout(id);
  }, [nextCompletionIso, router]);

  useEffect(() => {
    if (!pollStalledBuildingQueue) return;
    const id = window.setInterval(() => router.refresh(), 12_000);
    return () => window.clearInterval(id);
  }, [pollStalledBuildingQueue, router]);

  return null;
}

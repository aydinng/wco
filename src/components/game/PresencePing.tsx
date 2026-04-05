"use client";

import { useEffect } from "react";

const INTERVAL_MS = 45_000;

/** Oyun kabuğunda çevrim içi sayımı için sunucuya periyodik ping */
export function PresencePing() {
  useEffect(() => {
    const ping = () => {
      void fetch("/api/presence/ping", { method: "POST" }).catch(() => {});
    };
    ping();
    const id = window.setInterval(ping, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);
  return null;
}

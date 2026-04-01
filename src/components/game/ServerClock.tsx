"use client";

import type { AppLocale } from "@/lib/locale";
import { useEffect, useState } from "react";

type Props = { initial: Date; locale: AppLocale };

export function ServerClock({ initial, locale }: Props) {
  const [now, setNow] = useState(initial);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const s = now.toLocaleString(locale === "en" ? "en-US" : "tr-TR", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return <span className="tabular-nums">{s}</span>;
}

/** Tam tarih + saat (sol menü sunucu zamanı) */
export function ServerDateTime({ initial, locale }: Props) {
  const [now, setNow] = useState(initial);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const s = now.toLocaleString(locale === "en" ? "en-US" : "tr-TR", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return <span className="tabular-nums text-white">{s}</span>;
}

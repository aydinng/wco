"use client";

import { formatAgoSince } from "@/lib/format-ago";
import type { AppLocale } from "@/lib/locale";
import { useEffect, useState } from "react";

/** Son kayıt satırında geçen süreyi saniyede bir yeniler (sayfa yenilemeden). */
export function LoginLastUserAgo({
  createdAt,
  locale,
}: {
  createdAt: Date;
  locale: AppLocale;
}) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="text-white">{formatAgoSince(createdAt, locale)}</span>
  );
}

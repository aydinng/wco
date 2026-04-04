"use client";

import { useEffect, useState } from "react";

/** ISO bitiş zamanına göre kalan saniye (her saniye güncellenir) */
export function useCountdownIso(endsAtIso: string | null | undefined): number {
  const [sec, setSec] = useState(0);

  useEffect(() => {
    if (!endsAtIso) {
      setSec(0);
      return;
    }
    const end = new Date(endsAtIso).getTime();
    if (!Number.isFinite(end)) {
      setSec(0);
      return;
    }
    const tick = () =>
      setSec(Math.max(0, Math.ceil((end - Date.now()) / 1000)));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [endsAtIso]);

  return sec;
}

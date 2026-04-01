"use client";

import { useEffect, useState } from "react";

type Props = {
  base: number;
  hourlyNet: number;
  lastTickIso: string;
  locale: string;
  className?: string;
};

function tickMs(iso: string): number {
  const t = new Date(iso).getTime();
  return Number.isFinite(t) ? t : Date.now();
}

/**
 * Sunucudaki son kayıttan bu yana saatlik net oranla projeksiyon; sayfa yenilenmeden anlık artış.
 */
export function LiveStock({
  base,
  hourlyNet,
  lastTickIso,
  locale,
  className,
}: Props) {
  const [value, setValue] = useState(base);

  useEffect(() => {
    setValue(base);
  }, [base, hourlyNet, lastTickIso]);

  useEffect(() => {
    function tick() {
      const now = Date.now();
      const last = tickMs(lastTickIso);
      const hours = Math.max(0, (now - last) / 3600000);
      setValue(Math.max(0, base + Math.floor(hourlyNet * hours)));
    }
    tick();
    const id = window.setInterval(tick, 100);
    return () => window.clearInterval(id);
  }, [base, hourlyNet, lastTickIso]);

  const loc = locale === "en" ? "en-US" : "tr-TR";
  return (
    <span className={className} suppressHydrationWarning>
      {value.toLocaleString(loc)}
    </span>
  );
}

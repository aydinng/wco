"use client";

import { ServerDateTime } from "@/components/game/ServerClock";
import type { AppLocale } from "@/lib/locale";

export function LoginSidebarClock({
  initial,
  locale,
  label,
}: {
  initial: Date;
  locale: AppLocale;
  label: string;
}) {
  return (
    <div className="mt-2 w-full max-w-[13rem] text-center text-[11px] leading-tight">
      <div className="font-semibold text-green-500">{label}</div>
      <div className="mt-0.5 flex justify-center font-semibold text-green-500">
        <ServerDateTime
          initial={initial}
          locale={locale}
          className="text-green-500"
        />
      </div>
    </div>
  );
}

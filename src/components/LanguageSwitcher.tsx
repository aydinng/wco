"use client";

import type { AppLocale } from "@/lib/locale";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  locale: AppLocale;
  label: string;
  trLabel: string;
  enLabel: string;
  /** Sol menü: daha ince çerçeve, gri tonlar */
  variant?: "default" | "compact";
};

export function LanguageSwitcher({
  locale,
  label,
  trLabel,
  enLabel,
  variant = "default",
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setLocale(next: AppLocale) {
    if (next === locale) return;
    setBusy(true);
    try {
      await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (variant === "compact") {
    return (
      <div className="w-full rounded-md border border-zinc-700/45 bg-zinc-950/35 px-2 py-2">
        <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
          {label}
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            disabled={busy}
            onClick={() => setLocale("tr")}
            className={`flex-1 rounded border py-1.5 text-xs font-medium transition-colors ${
              locale === "tr"
                ? "border-amber-800/50 bg-zinc-800/60 text-amber-100/95"
                : "border-zinc-600/35 bg-zinc-900/40 text-zinc-400 hover:border-zinc-500/50 hover:text-zinc-200"
            }`}
          >
            {trLabel}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => setLocale("en")}
            className={`flex-1 rounded border py-1.5 text-xs font-medium transition-colors ${
              locale === "en"
                ? "border-amber-800/50 bg-zinc-800/60 text-amber-100/95"
                : "border-zinc-600/35 bg-zinc-900/40 text-zinc-400 hover:border-zinc-500/50 hover:text-zinc-200"
            }`}
          >
            {enLabel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded border border-[#2a3441]/90 bg-black/40 p-3 backdrop-blur-sm">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => setLocale("tr")}
          className={`flex-1 rounded px-2 py-2 text-sm font-medium transition-colors ${
            locale === "tr"
              ? "bg-amber-900/45 text-amber-100"
              : "bg-black/30 text-zinc-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          {trLabel}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => setLocale("en")}
          className={`flex-1 rounded px-2 py-2 text-sm font-medium transition-colors ${
            locale === "en"
              ? "bg-amber-900/45 text-amber-100"
              : "bg-black/30 text-zinc-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          {enLabel}
        </button>
      </div>
    </div>
  );
}

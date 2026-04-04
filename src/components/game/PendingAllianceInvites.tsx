"use client";

import { useState } from "react";

type Inv = {
  id: string;
  allianceName: string;
  fromUsername: string;
};

export function PendingAllianceInvites({
  invites,
  locale,
}: {
  invites: Inv[];
  locale: string;
}) {
  const [busy, setBusy] = useState<string | null>(null);

  async function respond(inviteId: string, accept: boolean) {
    setBusy(inviteId);
    try {
      const res = await fetch("/api/alliances/invite/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteId, accept }),
      });
      if (res.ok) window.location.reload();
    } finally {
      setBusy(null);
    }
  }

  if (invites.length === 0) return null;

  return (
    <div className="mb-4 rounded-lg border border-sky-800/50 bg-sky-950/20 p-3">
      <h3 className="mb-2 text-sm font-bold text-sky-200/90">
        {locale === "en" ? "Pending invites" : "Bekleyen davetler"}
      </h3>
      <ul className="space-y-2">
        {invites.map((i) => (
          <li
            key={i.id}
            className="flex flex-wrap items-center justify-between gap-2 text-sm"
          >
            <span className="text-zinc-300">
              <span className="font-semibold text-amber-100">{i.allianceName}</span>
              {" — "}
              {locale === "en" ? "from" : "gönderen"}: {i.fromUsername}
            </span>
            <span className="flex gap-1">
              <button
                type="button"
                disabled={busy === i.id}
                onClick={() => respond(i.id, true)}
                className="rounded border border-emerald-700/70 bg-emerald-950/40 px-2 py-1 text-xs text-emerald-100"
              >
                {locale === "en" ? "Accept" : "Kabul"}
              </button>
              <button
                type="button"
                disabled={busy === i.id}
                onClick={() => respond(i.id, false)}
                className="rounded border border-zinc-600 px-2 py-1 text-xs text-zinc-400"
              >
                {locale === "en" ? "Decline" : "Red"}
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

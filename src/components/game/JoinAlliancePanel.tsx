"use client";

import { useState } from "react";

type AllianceOpt = {
  id: string;
  name: string;
  founder: string;
  inviteOnly: boolean;
};

export function JoinAlliancePanel({
  alliances,
  locale,
  alreadyInAlliance,
}: {
  alliances: AllianceOpt[];
  locale: string;
  alreadyInAlliance: boolean;
}) {
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function join(id: string) {
    setMsg(null);
    setBusy(id);
    try {
      const res = await fetch("/api/alliances/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ allianceId: id }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(j.error ?? "Hata");
        setBusy(null);
        return;
      }
      window.location.reload();
    } catch {
      setMsg("Ağ hatası");
      setBusy(null);
    }
  }

  if (alreadyInAlliance) {
    return (
      <p className="mb-4 text-sm text-zinc-400">
        {locale === "en"
          ? "You are already in an alliance."
          : "Zaten bir ittifaktasınız."}
      </p>
    );
  }

  return (
    <div className="mb-6 space-y-2">
      <h3
        className="text-sm font-bold text-amber-200/90"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        {locale === "en" ? "Joinable alliances" : "Katılabileceğiniz ittifaklar"}
      </h3>
      {alliances.length === 0 ? (
        <p className="text-sm text-zinc-500">
          {locale === "en" ? "No alliances yet." : "Henüz ittifak yok."}
        </p>
      ) : (
        <ul className="space-y-2">
          {alliances.map((a) => (
            <li
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded border border-zinc-700/60 bg-black/25 px-3 py-2 text-sm"
            >
              <div>
                <span className="font-semibold text-amber-100">{a.name}</span>
                <span className="ml-2 text-zinc-500">
                  {locale === "en" ? "Founder:" : "Kurucu:"}{" "}
                  {a.founder}
                </span>
                {a.inviteOnly ? (
                  <span className="ml-2 text-xs text-amber-600">
                    {locale === "en"
                      ? "(Invite only — request invite from leader)"
                      : "(Yalnızca davet — liderden davet isteyin)"}
                  </span>
                ) : null}
              </div>
              {!a.inviteOnly ? (
                <button
                  type="button"
                  disabled={busy === a.id}
                  onClick={() => join(a.id)}
                  className="rounded border border-amber-700/80 bg-amber-950/40 px-3 py-1 text-xs font-bold text-amber-100 hover:bg-amber-900/50 disabled:opacity-50"
                >
                  {busy === a.id
                    ? "…"
                    : locale === "en"
                      ? "Join"
                      : "Katıl"}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      {msg ? <p className="text-sm text-red-400">{msg}</p> : null}
    </div>
  );
}

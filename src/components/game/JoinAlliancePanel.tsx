"use client";

import { useState } from "react";

type AllianceOpt = {
  id: string;
  name: string;
  founder: string;
  inviteOnly: boolean;
  memberCount: number;
  maxMembers: number;
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
  const [createName, setCreateName] = useState("");
  const [creating, setCreating] = useState(false);

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

  async function createAlliance(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const name = createName.trim();
    if (name.length < 2) {
      setMsg(
        locale === "en"
          ? "Alliance name is too short."
          : "İttifak adı çok kısa.",
      );
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/alliances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(j.error ?? "Hata");
        setCreating(false);
        return;
      }
      window.location.reload();
    } catch {
      setMsg("Ağ hatası");
      setCreating(false);
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
    <div className="mb-6 space-y-4">
      <form
        onSubmit={createAlliance}
        className="rounded-lg border border-amber-800/50 bg-black/30 p-3"
      >
        <h3
          className="mb-2 text-sm font-bold text-amber-200/90"
          style={{ fontFamily: "var(--font-warcity), serif" }}
        >
          {locale === "en" ? "Create alliance" : "İttifak kur"}
        </h3>
        <p className="mb-2 text-xs text-zinc-500">
          {locale === "en"
            ? `Member limit per alliance: ${alliances[0]?.maxMembers ?? 50}.`
            : `İttifak başına üye limiti: ${alliances[0]?.maxMembers ?? 50}.`}
        </p>
        <div className="flex flex-wrap items-end gap-2">
          <label className="flex min-w-[200px] flex-1 flex-col text-xs text-zinc-400">
            {locale === "en" ? "Alliance name" : "İttifak adı"}
            <input
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              maxLength={48}
              className="mt-1 rounded border border-zinc-600 bg-black/40 px-2 py-1.5 text-sm text-zinc-100"
              placeholder={
                locale === "en" ? "2–48 characters" : "2–48 karakter"
              }
            />
          </label>
          <button
            type="submit"
            disabled={creating}
            className="rounded border border-amber-600/90 bg-amber-950/50 px-4 py-2 text-sm font-bold text-amber-100 hover:bg-amber-900/45 disabled:opacity-50"
          >
            {creating ? "…" : locale === "en" ? "Create" : "Kur"}
          </button>
        </div>
      </form>

      <div className="space-y-2">
        <h3
          className="text-sm font-bold text-amber-200/90"
          style={{ fontFamily: "var(--font-warcity), serif" }}
        >
          {locale === "en" ? "Join an alliance" : "İttifaka katıl"}
        </h3>
        {alliances.length === 0 ? (
          <p className="text-sm text-zinc-500">
            {locale === "en" ? "No alliances yet." : "Henüz ittifak yok."}
          </p>
        ) : (
          <ul className="space-y-2">
            {alliances.map((a) => {
              const full = a.memberCount >= a.maxMembers;
              return (
                <li
                  key={a.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded border border-zinc-700/60 bg-black/25 px-3 py-2 text-sm"
                >
                  <div>
                    <span className="font-semibold text-amber-100">{a.name}</span>
                    <span className="ml-2 text-xs text-zinc-500">
                      {a.memberCount}/{a.maxMembers}
                    </span>
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
                  {!a.inviteOnly && !full ? (
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
                  ) : full && !a.inviteOnly ? (
                    <span className="text-xs text-zinc-500">
                      {locale === "en" ? "Full" : "Dolu"}
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {msg ? <p className="text-sm text-red-400">{msg}</p> : null}
    </div>
  );
}

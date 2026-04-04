"use client";

import { useEffect, useState } from "react";

type Member = {
  userId: string;
  username: string;
  role: string;
};

type ChatMessage = {
  id: string;
  userId: string;
  username: string;
  body: string;
  createdAt: string;
};

export function AllianceDiplomacySection({
  locale,
  allianceName,
  founderId,
  meId,
  members,
  initialMessages,
}: {
  locale: string;
  allianceName: string;
  founderId: string;
  meId: string;
  members: Member[];
  initialMessages: ChatMessage[];
}) {
  const isLeader = meId === founderId;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [kickBusy, setKickBusy] = useState<string | null>(null);
  const [inviteName, setInviteName] = useState("");
  const [inviteMsg, setInviteMsg] = useState<string | null>(null);
  const [leaveBusy, setLeaveBusy] = useState(false);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  async function refreshMessages() {
    const res = await fetch("/api/alliances/messages");
    const j = await res.json().catch(() => ({}));
    if (res.ok && Array.isArray(j.messages)) {
      setMessages(j.messages);
    }
  }

  useEffect(() => {
    if (!open) return;
    void refreshMessages();
    const t = setInterval(refreshMessages, 12_000);
    return () => clearInterval(t);
  }, [open]);

  async function sendChat(e: React.FormEvent) {
    e.preventDefault();
    const t = draft.trim();
    if (t.length < 1) return;
    setBusy(true);
    try {
      const res = await fetch("/api/alliances/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: t }),
      });
      if (res.ok) {
        setDraft("");
        await refreshMessages();
      }
    } finally {
      setBusy(false);
    }
  }

  async function kick(targetUserId: string) {
    setKickBusy(targetUserId);
    try {
      const res = await fetch("/api/alliances/kick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      });
      if (res.ok) window.location.reload();
    } finally {
      setKickBusy(null);
    }
  }

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviteMsg(null);
    const u = inviteName.trim();
    if (u.length < 2) return;
    setBusy(true);
    try {
      const res = await fetch("/api/alliances/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) setInviteMsg(j.error ?? "Hata");
      else {
        setInviteName("");
        setInviteMsg(
          locale === "en" ? "Invite sent." : "Davet gönderildi.",
        );
      }
    } finally {
      setBusy(false);
    }
  }

  const t = {
    chatStrip:
      locale === "en" ? "Alliance chat — tap to open" : "İttifak sohbeti — açmak için tıkla",
    roster:
      locale === "en" ? "Members" : "Üyeler",
    kick:
      locale === "en" ? "Remove" : "Çıkar",
    invitePh:
      locale === "en" ? "Player username" : "Oyuncu adı",
    inviteBtn:
      locale === "en" ? "Send invite" : "Davet gönder",
    leave:
      locale === "en" ? "Leave alliance" : "İttifaktan çık",
    leaveBusy: "…",
  };

  async function leaveAlliance() {
    if (!window.confirm(
      locale === "en"
        ? "Leave this alliance?"
        : "Bu ittifaktan ayrılmak istiyor musunuz?",
    )) {
      return;
    }
    setLeaveBusy(true);
    try {
      const res = await fetch("/api/alliances/leave", { method: "POST" });
      if (res.ok) window.location.reload();
    } finally {
      setLeaveBusy(false);
    }
  }

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          disabled={leaveBusy}
          onClick={() => void leaveAlliance()}
          className="rounded border border-zinc-600 bg-zinc-900/60 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 disabled:opacity-50"
        >
          {leaveBusy ? t.leaveBusy : t.leave}
        </button>
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-lg border border-amber-700/60 bg-amber-950/30 px-4 py-3 text-left text-sm font-semibold text-amber-100 hover:bg-amber-900/25"
      >
        <span>{t.chatStrip}</span>
        <span className="text-zinc-500">{open ? "▲" : "▼"}</span>
      </button>

      {open ? (
        <div className="rounded-lg border border-zinc-700/60 bg-black/35 p-3">
          <div className="mb-2 max-h-64 space-y-2 overflow-y-auto text-sm">
            {messages.length === 0 ? (
              <p className="text-zinc-500">
                {locale === "en" ? "No messages yet." : "Henüz mesaj yok."}
              </p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className="border-b border-zinc-800/80 pb-2 last:border-0"
                >
                  <div className="text-xs text-amber-600/90">
                    {m.username}{" "}
                    <span className="text-zinc-600">
                      {new Date(m.createdAt).toLocaleString(
                        locale === "en" ? "en-US" : "tr-TR",
                        { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" },
                      )}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-zinc-200">{m.body}</p>
                </div>
              ))
            )}
          </div>
          <form onSubmit={sendChat} className="flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={2000}
              className="min-w-0 flex-1 rounded border border-zinc-600 bg-black/50 px-2 py-1.5 text-sm text-zinc-100"
              placeholder={
                locale === "en"
                  ? "Requests, attacks, scouting…"
                  : "İstek, saldırı, casusluk…"
              }
            />
            <button
              type="submit"
              disabled={busy}
              className="shrink-0 rounded border border-amber-700/80 bg-amber-950/40 px-3 py-1.5 text-xs font-bold text-amber-100 disabled:opacity-50"
            >
              {locale === "en" ? "Send" : "Gönder"}
            </button>
          </form>
        </div>
      ) : null}

      <div>
        <h3
          className="mb-2 text-center text-sm font-bold text-amber-200/90"
          style={{ fontFamily: "var(--font-warcity), serif" }}
        >
          {allianceName} — {t.roster}
        </h3>
        <ul className="space-y-2">
          {members.map((m) => {
            const leader = m.userId === founderId;
            const canKick = isLeader && !leader && m.userId !== meId;
            return (
              <li
                key={m.userId}
                className="flex flex-wrap items-center justify-between gap-2 rounded border border-zinc-700/50 bg-black/25 px-3 py-2 text-sm"
              >
                <div>
                  <span className="font-medium text-amber-100">{m.username}</span>
                </div>
                {canKick ? (
                  <button
                    type="button"
                    disabled={kickBusy === m.userId}
                    onClick={() => kick(m.userId)}
                    className="rounded border border-red-900/60 bg-red-950/30 px-2 py-1 text-xs text-red-200 hover:bg-red-950/50 disabled:opacity-50"
                  >
                    {kickBusy === m.userId ? "…" : t.kick}
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>

      {isLeader ? (
        <form
          onSubmit={sendInvite}
          className="rounded-lg border border-zinc-700/60 bg-black/25 p-3"
        >
          <div className="mb-2 text-xs font-semibold uppercase text-zinc-500">
            {locale === "en" ? "Invite player" : "Oyuncu davet et"}
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              className="min-w-[12rem] flex-1 rounded border border-zinc-600 bg-black/40 px-2 py-1.5 text-sm"
              placeholder={t.invitePh}
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded border border-amber-700/80 bg-amber-950/40 px-3 py-1.5 text-xs font-bold text-amber-100"
            >
              {t.inviteBtn}
            </button>
          </div>
          {inviteMsg ? (
            <p className="mt-2 text-xs text-amber-200/80">{inviteMsg}</p>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}

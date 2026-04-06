"use client";

import { useCallback, useEffect, useState } from "react";

type BattleRow = {
  id: string;
  createdAt: string;
  summary: string;
  outcome: string;
  defenderCoord: string;
};

type DmRow = {
  id: string;
  createdAt: string;
  subject: string;
  body: string;
  fromUser: { username: string };
};

export function MessagesHub({
  labels,
}: {
  labels: {
    reports: string;
    inbox: string;
    compose: string;
    to: string;
    subject: string;
    body: string;
    send: string;
    empty: string;
  };
}) {
  const [tab, setTab] = useState<"reports" | "inbox">("reports");
  const [reports, setReports] = useState<BattleRow[]>([]);
  const [inbox, setInbox] = useState<DmRow[]>([]);
  const [to, setTo] = useState("");
  const [subj, setSubj] = useState("");
  const [body, setBody] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [r1, r2] = await Promise.all([
      fetch("/api/battle-reports").then((r) => r.json()),
      fetch("/api/messages").then((r) => r.json()),
    ]);
    if (r1.items) setReports(r1.items);
    if (r2.items) setInbox(r2.items);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function sendDm() {
    setErr(null);
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toUsername: to.trim(),
        subject: subj.trim(),
        body: body.trim(),
      }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErr(j.error ?? "Error");
      return;
    }
    setTo("");
    setSubj("");
    setBody("");
    void load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 border-b border-zinc-700 pb-2">
        <button
          type="button"
          className={`rounded px-3 py-1 text-sm ${
            tab === "reports"
              ? "bg-amber-900/50 text-amber-100"
              : "text-zinc-400"
          }`}
          onClick={() => setTab("reports")}
        >
          {labels.reports}
        </button>
        <button
          type="button"
          className={`rounded px-3 py-1 text-sm ${
            tab === "inbox" ? "bg-amber-900/50 text-amber-100" : "text-zinc-400"
          }`}
          onClick={() => setTab("inbox")}
        >
          {labels.inbox}
        </button>
      </div>

      {tab === "reports" ? (
        <div className="space-y-2">
          {reports.length === 0 ? (
            <p className="text-sm text-zinc-500">{labels.empty}</p>
          ) : (
            reports.map((r) => (
              <div
                key={r.id}
                className="rounded border border-zinc-700/60 bg-black/30 p-3 text-sm"
              >
                <div className="text-xs text-zinc-500">
                  {new Date(r.createdAt).toLocaleString()}
                </div>
                <div className="font-semibold text-amber-200">{r.outcome}</div>
                <div className="text-zinc-300">{r.defenderCoord}</div>
                <p className="mt-1 text-zinc-400">{r.summary}</p>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            {inbox.length === 0 ? (
              <p className="text-sm text-zinc-500">{labels.empty}</p>
            ) : (
              inbox.map((m) => (
                <div
                  key={m.id}
                  className="rounded border border-zinc-700/60 bg-black/30 p-3 text-sm"
                >
                  <div className="text-xs text-zinc-500">
                    {m.fromUser.username} ·{" "}
                    {new Date(m.createdAt).toLocaleString()}
                  </div>
                  <div className="font-semibold text-amber-200">
                    {m.subject}
                  </div>
                  <p className="whitespace-pre-wrap text-zinc-300">{m.body}</p>
                </div>
              ))
            )}
          </div>

          <div
            className="rounded border border-amber-900/40 bg-black/25 p-4"
            style={{ fontFamily: "var(--font-warcity), serif" }}
          >
            <h3 className="mb-2 text-sm font-bold text-amber-200">
              {labels.compose}
            </h3>
            <label className="mb-2 block text-xs text-zinc-400">
              {labels.to}
              <input
                className="mt-1 w-full rounded border border-zinc-600 bg-black/40 px-2 py-1 text-sm text-zinc-100"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="username"
              />
            </label>
            <label className="mb-2 block text-xs text-zinc-400">
              {labels.subject}
              <input
                className="mt-1 w-full rounded border border-zinc-600 bg-black/40 px-2 py-1 text-sm text-zinc-100"
                value={subj}
                onChange={(e) => setSubj(e.target.value)}
              />
            </label>
            <label className="mb-2 block text-xs text-zinc-400">
              {labels.body}
              <textarea
                className="mt-1 w-full rounded border border-zinc-600 bg-black/40 px-2 py-1 text-sm text-zinc-100"
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </label>
            {err ? <p className="mb-2 text-xs text-red-400">{err}</p> : null}
            <button
              type="button"
              onClick={() => void sendDm()}
              className="rounded border border-amber-600 bg-amber-950/50 px-4 py-2 text-sm font-bold text-amber-50"
            >
              {labels.send}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

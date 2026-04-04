"use client";

import { useState } from "react";

export function HelpAdminRequest({
  locale,
}: {
  locale: string;
}) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subject.trim(), body: body.trim() }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(j.error ?? "Error");
        setBusy(false);
        return;
      }
      setOk(true);
      setSubject("");
      setBody("");
    } catch {
      setErr("Network error");
    }
    setBusy(false);
  }

  return (
    <div
      className="mt-6 rounded border border-amber-900/45 bg-black/50 p-4"
      style={{ fontFamily: "var(--font-warcity), serif" }}
    >
      <h3 className="mb-2 text-sm font-bold text-amber-200">
        {locale === "en"
          ? "Request to administrators"
          : "Yöneticilere istek / mesaj"}
      </h3>
      <p className="mb-3 text-xs text-zinc-500">
        {locale === "en"
          ? "Subject is required. Your message goes directly to admins."
          : "Konu zorunludur. Mesaj doğrudan yöneticilere iletilir."}
      </p>
      <label className="mb-2 block text-xs text-zinc-300">
        {locale === "en" ? "Subject" : "Konu"}
        <input
          className="mt-1 w-full rounded border border-zinc-600 bg-black/40 px-2 py-1 text-sm"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </label>
      <label className="mb-3 block text-xs text-zinc-300">
        {locale === "en" ? "Message" : "Mesaj"}
        <textarea
          className="mt-1 w-full rounded border border-zinc-600 bg-black/40 px-2 py-1 text-sm"
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </label>
      {err ? <p className="mb-2 text-xs text-red-400">{err}</p> : null}
      {ok ? (
        <p className="mb-2 text-xs text-emerald-400">
          {locale === "en" ? "Sent. Thank you." : "Gönderildi. Teşekkürler."}
        </p>
      ) : null}
      <button
        type="button"
        disabled={busy || !subject.trim() || !body.trim()}
        onClick={() => void submit()}
        className="rounded border border-amber-600 bg-amber-900/40 px-4 py-2 text-sm font-bold text-amber-50 disabled:opacity-40"
      >
        {busy ? "…" : locale === "en" ? "Send" : "Gönder"}
      </button>
    </div>
  );
}

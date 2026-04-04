"use client";

import { useState } from "react";

type Initial = {
  blockIncomingMessages: boolean;
  settingSoundEnabled: boolean;
  settingNotifyBattle: boolean;
  settingCompactTables: boolean;
};

export function OptionsSettingsForm({
  locale,
  initial,
}: {
  locale: string;
  initial: Initial;
}) {
  const [v, setV] = useState(initial);
  const [msg, setMsg] = useState<string | null>(null);

  async function save(patch: Partial<Initial>) {
    setMsg(null);
    const next = { ...v, ...patch };
    const res = await fetch("/api/user/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      setMsg("Kaydedilemedi");
      return;
    }
    setV(next);
    setMsg(locale === "en" ? "Saved." : "Kaydedildi.");
  }

  const lab = (tr: string, en: string) => (locale === "en" ? en : tr);

  return (
    <div
      className="space-y-4 text-sm"
      style={{ fontFamily: "var(--font-warcity), serif" }}
    >
      <label className="flex cursor-pointer items-center gap-2 text-zinc-200">
        <input
          type="checkbox"
          checked={v.blockIncomingMessages}
          onChange={(e) =>
            void save({ blockIncomingMessages: e.target.checked })
          }
        />
        {lab(
          "Diğer oyunculardan gelen mesajları engelle",
          "Block messages from other players",
        )}
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-zinc-200">
        <input
          type="checkbox"
          checked={v.settingSoundEnabled}
          onChange={(e) => void save({ settingSoundEnabled: e.target.checked })}
        />
        {lab("Ses efektleri (tarayıcı)", "Sound effects (browser)")}
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-zinc-200">
        <input
          type="checkbox"
          checked={v.settingNotifyBattle}
          onChange={(e) =>
            void save({ settingNotifyBattle: e.target.checked })
          }
        />
        {lab("Savaş bildirimleri (sayfa içi)", "Battle notifications (in-page)")}
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-zinc-200">
        <input
          type="checkbox"
          checked={v.settingCompactTables}
          onChange={(e) =>
            void save({ settingCompactTables: e.target.checked })
          }
        />
        {lab("Kompakt tablolar", "Compact tables")}
      </label>
      <p className="text-xs text-zinc-500">
        {lab(
          "Dil seçimi sol menüde. Sunucu çağı yalnızca admin: Admin → Çağ.",
          "Language is in the left menu. World era: Admin → Era only.",
        )}
      </p>
      {msg ? <p className="text-xs text-emerald-400">{msg}</p> : null}
    </div>
  );
}

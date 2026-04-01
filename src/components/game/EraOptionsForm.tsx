"use client";

import { ERA_ORDER, ERAS, type EraId } from "@/config/eras";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = { currentEra: string };

export function EraOptionsForm({ currentEra }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(currentEra);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const r = await fetch("/api/admin/era", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eraId: value }),
      });
      if (!r.ok) throw new Error("Kaydedilemedi");
      setMsg("Kaydedildi. Çağa göre arka plan güncellendi.");
      router.refresh();
    } catch {
      setMsg("Hata oluştu.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 text-sm">
      <label className="block text-zinc-400">
        Aktif çağ
        <select
          className="mt-1 w-full rounded border border-[#2a3441] bg-black/40 px-2 py-2 text-zinc-100"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          {ERA_ORDER.map((id) => (
            <option key={id} value={id}>
              {ERAS[id as EraId].name}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        disabled={busy}
        className="rounded bg-amber-800/80 px-4 py-2 text-amber-50 hover:bg-amber-700 disabled:opacity-50"
      >
        {busy ? "Kaydediliyor…" : "Kaydet"}
      </button>
      {msg && <p className="text-xs text-zinc-400">{msg}</p>}
      <p className="text-xs text-zinc-500">
        Kendi arka plan fotoğrafını kullanmak için:{" "}
        <code className="text-amber-200/90">public/eras/</code> içinde{" "}
        <code className="text-amber-200/90">bg-ilk_cag.jpg</code> gibi aynı isimle
        dosya koy (veya <code className="text-amber-200/90">src/config/eras.ts</code>{" "}
        içinde dosya adını değiştir).
      </p>
    </form>
  );
}

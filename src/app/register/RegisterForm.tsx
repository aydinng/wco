"use client";

import {
  REGISTRATION_COUNTRIES,
  type RegistrationCountryId,
} from "@/config/countries";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [countryId, setCountryId] = useState<RegistrationCountryId>(
    REGISTRATION_COUNTRIES[0].id,
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, countryId }),
      });
      const j = (await r.json()) as { error?: string };
      if (!r.ok) {
        setError(j.error ?? "Kayıt olmadı");
        return;
      }
      router.push("/login");
      router.refresh();
    } catch {
      setError("Bağlantı hatası");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="w-full max-w-md rounded border border-[#2a3441] bg-black/40 p-6 shadow-xl backdrop-blur-sm"
      style={{ fontFamily: "var(--font-warcity), serif" }}
    >
      <h1
        className="mb-1 text-center text-xl text-amber-200/90"
        style={{ fontFamily: "var(--font-warcity), serif" }}
      >
        Yeni hesap
      </h1>
      <p className="mb-6 text-center text-sm text-zinc-500">
        Ülke seçimi kayıt listesinde görünür
      </p>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block text-sm text-zinc-400">
          Kullanıcı adı
          <input
            autoComplete="username"
            className="mt-1 w-full rounded border border-[#2a3441] bg-black/50 px-3 py-2 text-zinc-100"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={2}
          />
        </label>
        <label className="block text-sm text-zinc-400">
          Şifre (en az 6)
          <input
            type="password"
            autoComplete="new-password"
            className="mt-1 w-full rounded border border-[#2a3441] bg-black/50 px-3 py-2 text-zinc-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>
        <label className="block text-sm text-zinc-400">
          Ülke
          <select
            className="mt-1 w-full rounded border border-[#2a3441] bg-black/50 px-3 py-2 text-zinc-100"
            value={countryId}
            onChange={(e) =>
              setCountryId(e.target.value as RegistrationCountryId)
            }
          >
            {REGISTRATION_COUNTRIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded bg-amber-800/90 py-2 text-amber-50 hover:bg-amber-700 disabled:opacity-50"
        >
          {busy ? "…" : "Kayıt ol"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-zinc-500">
        Zaten hesabın var mı?{" "}
        <Link href="/login" className="text-amber-400 hover:underline">
          Giriş
        </Link>
      </p>
    </div>
  );
}

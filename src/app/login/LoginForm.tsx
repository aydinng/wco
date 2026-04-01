"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    setBusy(false);
    if (res?.error) {
      setError("Kullanıcı adı veya şifre hatalı.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
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
        Oyuncu girişi
      </h1>
      <p className="mb-6 text-center text-sm text-zinc-500">
        Hesabınla oyuna bağlan
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
          />
        </label>
        <label className="block text-sm text-zinc-400">
          Şifre
          <input
            type="password"
            autoComplete="current-password"
            className="mt-1 w-full rounded border border-[#2a3441] bg-black/50 px-3 py-2 text-zinc-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded bg-amber-800/90 py-2 text-amber-50 hover:bg-amber-700 disabled:opacity-50"
        >
          {busy ? "…" : "Giriş yap"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-zinc-500">
        Hesabın yok mu?{" "}
        <Link href="/register" className="text-amber-400 hover:underline">
          Kayıt ol
        </Link>
      </p>
    </div>
  );
}

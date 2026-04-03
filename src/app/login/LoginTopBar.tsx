"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const SANS = "ui-sans-serif, system-ui, 'Segoe UI', Tahoma, Arial, sans-serif";

type Labels = {
  user: string;
  pass: string;
  submit: string;
  badCredentials: string;
};

export function LoginTopBar({ labels }: { labels: Labels }) {
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
      setError(labels.badCredentials);
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-wrap items-center justify-center gap-2 px-2 py-3"
      style={{ fontFamily: SANS }}
    >
      <div className="flex items-stretch border border-yellow-500 bg-black px-2.5 py-1.5 text-xs font-bold text-white sm:text-sm">
        <label htmlFor="login-user" className="cursor-pointer whitespace-nowrap">
          {labels.user}
        </label>
      </div>
      <input
        id="login-user"
        autoComplete="username"
        className="h-8 w-[140px] border border-white bg-white px-2 text-sm text-black sm:w-[160px]"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <div className="flex items-stretch border border-yellow-500 bg-black px-2.5 py-1.5 text-xs font-bold text-white sm:text-sm">
        <label htmlFor="login-pass" className="cursor-pointer whitespace-nowrap">
          {labels.pass}
        </label>
      </div>
      <input
        id="login-pass"
        type="password"
        autoComplete="current-password"
        className="h-8 w-[140px] border border-white bg-white px-2 text-sm text-black sm:w-[160px]"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={busy}
        className="h-8 min-w-[72px] border border-zinc-400 bg-white px-3 text-sm font-bold text-black enabled:hover:bg-zinc-100 disabled:opacity-50"
      >
        {busy ? "…" : labels.submit}
      </button>

      {error ? (
        <p className="w-full text-center text-xs text-red-400">{error}</p>
      ) : null}
    </form>
  );
}

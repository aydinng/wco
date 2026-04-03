"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const WARCITY: React.CSSProperties = { fontFamily: "var(--font-warcity), serif" };

type Labels = {
  user: string;
  pass: string;
  submit: string;
  badCredentials: string;
};

export function LoginTopBar({ labels }: { labels: Labels }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/overview";

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
    <div className="mx-auto flex w-full max-w-[min(100rem,100%)] justify-center px-2">
      <form
        onSubmit={onSubmit}
        className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 rounded-sm border border-yellow-500/90 bg-black px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,200,100,0.08)]"
        style={WARCITY}
      >
        <div className="flex items-stretch border border-[#FFFF00] bg-black px-2 py-1.5 text-xs font-bold text-[#FFFF00] sm:text-sm">
          <label htmlFor="login-user" className="cursor-pointer whitespace-nowrap">
            {labels.user}
          </label>
        </div>
        <input
          id="login-user"
          autoComplete="username"
          className="h-8 w-[132px] border border-white bg-white px-2 text-sm text-black sm:w-[152px]"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <div className="flex items-stretch border border-[#FFFF00] bg-black px-2 py-1.5 text-xs font-bold text-[#FFFF00] sm:text-sm">
          <label htmlFor="login-pass" className="cursor-pointer whitespace-nowrap">
            {labels.pass}
          </label>
        </div>
        <input
          id="login-pass"
          type="password"
          autoComplete="current-password"
          className="h-8 w-[132px] border border-white bg-white px-2 text-sm text-black sm:w-[152px]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={busy}
          className="h-8 min-w-[76px] border border-white bg-white px-3 text-sm font-bold text-black enabled:hover:bg-zinc-200 disabled:opacity-50"
        >
          {busy ? "…" : labels.submit}
        </button>

        {error ? (
          <p className="w-full basis-full text-center text-xs text-red-400">{error}</p>
        ) : null}
      </form>
    </div>
  );
}

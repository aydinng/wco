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
    <div className="mx-auto flex w-full min-w-0 max-w-[min(100rem,100%)] justify-center px-2">
      <form
        onSubmit={onSubmit}
        className="flex max-w-full min-w-0 flex-wrap items-center justify-center gap-x-1.5 gap-y-2 rounded-sm border border-yellow-600/50 bg-black/55 px-2.5 py-2 shadow-[inset_0_1px_0_rgba(255,200,100,0.06)] backdrop-blur-sm"
        style={WARCITY}
      >
        <div className="flex items-stretch border border-[#d4a84b]/90 bg-black/60 px-1.5 py-1 text-[10px] font-bold text-[#FFFF00] sm:text-[11px]">
          <label htmlFor="login-user" className="cursor-pointer whitespace-nowrap">
            {labels.user}
          </label>
        </div>
        <input
          id="login-user"
          autoComplete="username"
          className="h-9 w-[min(118px,28vw)] border border-stone-500/70 bg-[#e4e0d6] px-1.5 text-base text-stone-900 placeholder:text-stone-500 sm:h-7 sm:w-[132px] sm:text-xs"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <div className="flex items-stretch border border-[#d4a84b]/90 bg-black/60 px-1.5 py-1 text-[10px] font-bold text-[#FFFF00] sm:text-[11px]">
          <label htmlFor="login-pass" className="cursor-pointer whitespace-nowrap">
            {labels.pass}
          </label>
        </div>
        <input
          id="login-pass"
          type="password"
          autoComplete="current-password"
          className="h-9 w-[min(118px,28vw)] border border-stone-500/70 bg-[#e4e0d6] px-1.5 text-base text-stone-900 sm:h-7 sm:w-[132px] sm:text-xs"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={busy}
          className="h-9 min-w-[68px] rounded-sm border border-amber-900/60 bg-gradient-to-b from-amber-700/95 to-amber-900/95 px-2.5 text-xs font-bold text-amber-50 shadow-sm enabled:hover:from-amber-600 enabled:hover:to-amber-800 disabled:opacity-50 sm:h-7 sm:text-[11px]"
        >
          {busy ? "…" : labels.submit}
        </button>

        {error ? (
          <p className="w-full basis-full text-center text-xs text-red-300 drop-shadow">{error}</p>
        ) : null}
      </form>
    </div>
  );
}

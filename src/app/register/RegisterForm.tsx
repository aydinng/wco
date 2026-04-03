"use client";

import {
  REGISTRATION_COUNTRIES,
  type RegistrationCountryId,
} from "@/config/countries";
import { KVKK_REGISTER_TEXT_EN, KVKK_REGISTER_TEXT_TR } from "@/content/kvkk-register";
import type { Dictionary } from "@/i18n/dictionaries";
import type { AppLocale } from "@/lib/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const INPUT =
  "mt-1 w-full rounded border border-stone-400/55 bg-[#f5f2eb] px-2.5 py-1.5 text-sm text-stone-800 placeholder:text-stone-500";

type Props = {
  dict: Dictionary;
  locale: AppLocale;
};

export function RegisterForm({ dict, locale }: Props) {
  const router = useRouter();
  const p = dict.public;
  const a = dict.auth;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  const [cityName, setCityName] = useState("");
  const [countryId, setCountryId] = useState<RegistrationCountryId>(
    REGISTRATION_COUNTRIES[0].id,
  );
  const [kvkk, setKvkk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const kvkkText =
    locale === "en" ? KVKK_REGISTER_TEXT_EN : KVKK_REGISTER_TEXT_TR;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    if (!kvkk) {
      setError(p.registerKvkkRequired);
      setBusy(false);
      return;
    }
    if (password !== password2) {
      setError(p.registerPasswordMismatch);
      setBusy(false);
      return;
    }
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          passwordConfirm: password2,
          email,
          cityName,
          countryId,
          kvkkAccepted: kvkk,
        }),
      });
      const j = (await r.json()) as { error?: string };
      if (!r.ok) {
        setError(j.error ?? "Kayıt olmadı");
        return;
      }
      router.push("/login");
      router.refresh();
    } catch {
      setError(a.errorConnection);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="w-full max-w-md rounded-lg border border-yellow-800/50 bg-black/75 px-3 py-4 shadow-xl backdrop-blur-sm sm:px-5"
      style={{ fontFamily: "var(--font-warcity), serif" }}
    >
      <h1 className="mb-0.5 text-center text-lg font-bold text-[#FFFF00] sm:text-xl">
        {p.registerPageTitle}
      </h1>
      <p className="mb-4 text-center text-xs leading-snug text-zinc-400 sm:text-[13px]">
        {p.registerPageSubtitle}
      </p>
      <form
        onSubmit={onSubmit}
        className="space-y-2.5 text-[13px] font-semibold leading-snug sm:text-sm"
      >
        <label className="block text-[#FFFF00]">
          {a.username}
          <input
            autoComplete="username"
            className={INPUT}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={2}
            maxLength={32}
          />
        </label>
        <label className="block text-[#FFFF00]">
          {a.password}
          <input
            type="password"
            autoComplete="new-password"
            className={INPUT}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>
        <label className="block text-[#FFFF00]">
          {p.registerPasswordConfirm}
          <input
            type="password"
            autoComplete="new-password"
            className={INPUT}
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
            minLength={6}
          />
        </label>
        <label className="block text-[#FFFF00]">
          {p.registerEmail}
          <input
            type="email"
            autoComplete="email"
            className={INPUT}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block text-[#FFFF00]">
          {p.registerFirstCityName}
          <input
            autoComplete="off"
            className={INPUT}
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            required
            minLength={2}
            maxLength={48}
          />
        </label>
        <label className="block text-[#FFFF00]">
          {a.country}
          <select className={INPUT} value={countryId} onChange={(e) => setCountryId(e.target.value as RegistrationCountryId)}>
            {REGISTRATION_COUNTRIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded border border-yellow-800/40 bg-black/50 p-2.5 text-[11px] font-normal leading-relaxed text-zinc-300 sm:text-xs">
          <p className="mb-1.5 font-semibold text-[#FFFF00]">
            {p.registerKvkkHeading}
          </p>
          <p className="mb-2.5">{kvkkText}</p>
          <label className="flex cursor-pointer items-start gap-2 text-[#FFFF00]">
            <input
              type="checkbox"
              checked={kvkk}
              onChange={(e) => setKvkk(e.target.checked)}
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
            />
            <span className="text-[12px] font-medium sm:text-[13px]">
              {p.registerKvkkAccept}
            </span>
          </label>
        </div>

        {error ? <p className="text-xs text-red-400">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-sm border border-amber-900/60 bg-gradient-to-b from-amber-700/95 to-amber-900/95 py-2 text-sm font-bold text-amber-50 shadow-sm hover:from-amber-600 hover:to-amber-800 disabled:opacity-50"
        >
          {busy ? a.registering : a.registerBtn}
        </button>
      </form>
      <p className="mt-3 text-center text-xs text-zinc-500">
        {a.hasAccount}{" "}
        <Link href="/login" className="text-[#FFFF00] underline hover:text-yellow-200">
          {a.signInCta}
        </Link>
      </p>
    </div>
  );
}

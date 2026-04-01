import { cookies } from "next/headers";

export const LOCALE_COOKIE = "warcity_locale";
export type AppLocale = "tr" | "en";

export async function getLocale(): Promise<AppLocale> {
  const c = await cookies();
  const v = c.get(LOCALE_COOKIE)?.value;
  return v === "en" ? "en" : "tr";
}

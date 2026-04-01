import { LOCALE_COOKIE, type AppLocale } from "@/lib/locale";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { locale?: string };
    const loc: AppLocale = body.locale === "en" ? "en" : "tr";
    const store = await cookies();
    store.set(LOCALE_COOKIE, loc, {
      path: "/",
      maxAge: 60 * 60 * 24 * 400,
      sameSite: "lax",
    });
    return NextResponse.json({ ok: true, locale: loc });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

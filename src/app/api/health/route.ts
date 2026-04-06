import { getAuthSecret } from "@/lib/auth-secret";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Canlıda oturum anahtarının sunucuya gelip gelmediğini kontrol için (değeri göstermez).
 * Tarayıcıda: https://senin-siten.vercel.app/api/health
 */
export async function GET() {
  const hasSecret = Boolean(getAuthSecret());
  return NextResponse.json({
    ok: true,
    authSecretConfigured: hasSecret,
  });
}

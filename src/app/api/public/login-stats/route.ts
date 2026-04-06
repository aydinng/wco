import { getLoginLandingData } from "@/lib/get-login-landing-data";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Giriş sayfası canlı istatistikleri (poll) */
export async function GET() {
  try {
    const stats = await getLoginLandingData();
    return NextResponse.json({
      ...stats,
      lastUser: stats.lastUser
        ? {
            ...stats.lastUser,
            createdAt: stats.lastUser.createdAt.toISOString(),
          }
        : null,
    });
  } catch (e) {
    console.error("[login-stats]", e);
    return NextResponse.json({ error: "stats" }, { status: 500 });
  }
}

import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** Edge’de `@/auth` import etme — Prisma vb. ile 1 MB limiti aşılır. Sadece JWT. */
const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  if (!secret) {
    console.error("AUTH_SECRET / NEXTAUTH_SECRET tanımlı değil");
  }

  const path = req.nextUrl.pathname;
  const isProd = process.env.NODE_ENV === "production";

  const token = await getToken({
    req,
    secret,
    secureCookie: isProd,
  });

  if (path === "/") {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    return NextResponse.redirect(new URL("/overview", req.nextUrl));
  }

  const isPublic =
    path === "/login" ||
    path === "/register" ||
    path === "/kurallar" ||
    path === "/egitim" ||
    path === "/forum" ||
    path === "/missions" ||
    path.startsWith("/api/auth") ||
    path === "/api/locale";

  if (isPublic) {
    return NextResponse.next();
  }

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  const isAdmin = (token as { isAdmin?: boolean }).isAdmin === true;
  if (path.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/overview", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

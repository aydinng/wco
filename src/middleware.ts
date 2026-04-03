import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const path = req.nextUrl.pathname;

  /** Kök `/` her zaman burada netleşsin (Vercel’de eski `/` oyun sayfası önbelleği / oturum karışmasını önler). */
  if (path === "/") {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    return NextResponse.redirect(new URL("/overview", req.nextUrl));
  }

  const isPublic =
    path === "/login" ||
    path === "/register" ||
    path === "/kurallar" ||
    path.startsWith("/api/auth") ||
    path === "/api/locale";

  if (isPublic) {
    return NextResponse.next();
  }

  if (!req.auth) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  const isAdmin = req.auth.user?.isAdmin === true;
  if (path.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/overview", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  /** Kök `/` açıkça eşleşmeli; aksi halde Vercel’de oturumsuz kullanıcı doğrudan oyun kabuğuna düşebiliyor. */
  matcher: [
    "/",
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

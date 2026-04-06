import type { NextConfig } from "next";

const hasAuthSecret =
  Boolean(process.env.AUTH_SECRET?.trim()) ||
  Boolean(process.env.NEXTAUTH_SECRET?.trim());

/** Vercel Production’da oturum imzası yoksa build bitsin; canlıda “Configuration” hatası yerine log’da net uyarı. */
if (
  process.env.VERCEL === "1" &&
  process.env.VERCEL_ENV === "production" &&
  !hasAuthSecret
) {
  throw new Error(
    "Vercel Production: AUTH_SECRET veya NEXTAUTH_SECRET tanımlı değil. " +
      "Dashboard → Project → Settings → Environment Variables → ekleyin (Production işaretli), sonra Redeploy.",
  );
}

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

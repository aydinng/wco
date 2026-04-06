import type { NextConfig } from "next";

const hasAuthSecret =
  Boolean(process.env.AUTH_SECRET?.trim()) ||
  Boolean(process.env.NEXTAUTH_SECRET?.trim());

/** Vercel Production’da secret yoksa log’da uyar; build’i düşürme (deploy log’unda görünür). İmzasız prod istemiyorsanız `NEXT_CONFIG_FAIL_ON_MISSING_AUTH=1` ekleyin. */
if (
  process.env.VERCEL === "1" &&
  process.env.VERCEL_ENV === "production" &&
  !hasAuthSecret
) {
  const msg =
    "Vercel Production: AUTH_SECRET veya NEXTAUTH_SECRET tanımlı değil. " +
    "Dashboard → Project → Settings → Environment Variables → ekleyin (Production), sonra Redeploy.";
  if (process.env.NEXT_CONFIG_FAIL_ON_MISSING_AUTH === "1") {
    throw new Error(msg);
  }
  console.warn(`[warcity-clone] ${msg}`);
}

/**
 * next-auth istemci paketi tarayıcıda process.env.VERCEL_URL görmez; NEXTAUTH_URL da
 * NEXT_PUBLIC_ olmadığı için boş kalır → baseUrl localhost olur → giriş "Configuration" hatası.
 * Build anında kök adresi burada sabitleriz (Vercel’de VERCEL_URL otomatik gelir).
 */
const authPublicUrl =
  process.env.NEXTAUTH_URL?.trim() ||
  process.env.AUTH_URL?.trim() ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
  "http://localhost:3000";

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_URL: authPublicUrl,
    AUTH_URL: authPublicUrl,
  },
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

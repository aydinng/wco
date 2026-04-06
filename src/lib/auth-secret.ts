/**
 * Vercel / .env: AUTH_SECRET veya NEXTAUTH_SECRET (tırnak veya fazladan boşluk temizlenir).
 */
export function getAuthSecret(): string | undefined {
  const raw = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  const s = typeof raw === "string" ? raw.trim() : "";
  return s.length > 0 ? s : undefined;
}

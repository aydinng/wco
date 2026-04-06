"use client";

import { SessionProvider } from "next-auth/react";

/**
 * baseUrl sunucudan (Host / X-Forwarded-*) gelir; tarayıcıda next-auth her zaman doğru köke istek atar.
 * Sadece next.config env’e güvenmek özel alan adı / Vercel önizlemede yanılabilir.
 */
export function Providers({
  children,
  baseUrl,
}: {
  children: React.ReactNode;
  baseUrl: string;
}) {
  return (
    <SessionProvider baseUrl={baseUrl} basePath="/api/auth">
      {children}
    </SessionProvider>
  );
}

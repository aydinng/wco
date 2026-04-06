import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import { Cinzel, Press_Start_2P } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

function publicSiteUrlFromHeaders(h: Headers): string {
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return "http://localhost:3000";
  const isLocal =
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("[::1]");
  const proto =
    h.get("x-forwarded-proto") ?? (isLocal ? "http" : "https");
  return `${proto}://${host}`;
}

const warcityTitle = Cinzel({
  variable: "--font-warcity",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

/** Teknoloji / birlik / bina katalog satırları (referans görsel) */
const pixelGame = Press_Start_2P({
  weight: "400",
  variable: "--font-pixel-game",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "War of City — browser strategy",
  description:
    "War of City: siege, empire, and armies in your browser. Cities, fleets, diplomacy — real-time strategy.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const siteUrl = publicSiteUrlFromHeaders(h);

  return (
    <html
      lang="tr"
      className={`${warcityTitle.variable} ${pixelGame.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh flex-col overflow-x-clip">
        <Providers baseUrl={siteUrl}>{children}</Providers>
      </body>
    </html>
  );
}

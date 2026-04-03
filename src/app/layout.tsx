import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import { Cinzel, Press_Start_2P } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${warcityTitle.variable} ${pixelGame.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh flex-col overflow-x-clip">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

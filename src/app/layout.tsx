import type { Metadata, Viewport } from "next";
import { Geist, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Gungir — Cotizá y gestioná tu negocio sobre Yggdra",
  description:
    "Landing, cotizador y operación comercial general. Public, Local y Admin — 100% Yggdra.",
  applicationName: "Gungir",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0e14",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

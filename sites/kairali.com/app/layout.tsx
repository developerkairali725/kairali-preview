import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Kurale, Asap, Lato } from "next/font/google";
import { buildMetadata } from "@kairali/seo";
import { ConsentScripts, ConsentBanner } from "@kairali/consent";
import { Analytics } from "@kairali/analytics";
import "@kairali/ui/brand-tokens.css";
import "./globals.css";
import ChatbaseLoader from "./chatbase-loader";
import siteConfig from "../site.config.json";

// Brand Manual ch.04: Kurale (display, weight 400 only) · Asap (body/UI) ·
// Lato (captions, overlines, numerals). next/font self-hosts at build —
// no runtime Google Fonts CDN (docs/ENGINEERING_STANDARDS.md).
const kurale = Kurale({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-kurale",
});
const asap = Asap({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-asap",
});
const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lato",
});

// First Factory site with a REAL OG image: /og.jpg is a 1200×630 derivative
// of the Healing Village footbridge photograph (IMAGE_MANIFEST.md).
export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "Kairali Ayurvedic Group — Since 1908",
  description:
    "Kairali Ayurvedic Group: NABH-accredited hospital, WHO-GMP medicines, centres in nine countries, Ayurveda training, Villa Raag — since 1908.",
  siteName: "Kairali Ayurvedic Group",
  ogImage: "/og.jpg",
}) as Metadata;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${kurale.variable} ${asap.variable} ${lato.variable}`}>
      <head>
        {/* Order is law: consent defaults (denied) BEFORE any tag loader */}
        <ConsentScripts />
        <Analytics />
      </head>
      <body>
        {children}
        <ChatbaseLoader />
        {/* No privacyHref yet: /privacy doesn't exist — Ship Gate A12 gap
            stays visible until the entity privacy page ships */}
        <ConsentBanner />
      </body>
    </html>
  );
}

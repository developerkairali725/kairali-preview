import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Kurale, Asap, Lato } from "next/font/google";
import { buildMetadata, faviconIcons } from "@kairali/seo";
import { ConsentScripts, ConsentBanner } from "@kairali/consent";
import { Analytics } from "@kairali/analytics";
import "@kairali/ui/brand-tokens.css";
import "./globals.css";
import siteConfig from "../site.config.json";

// Brand Manual ch.04 faces; next/font self-hosts at build. latin-ext is
// REQUIRED here: the programme names carry macrons (Dhyāna, Dīpanam, Sāmya).
const kurale = Kurale({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-kurale",
});
const asap = Asap({
  weight: ["400", "600", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-asap",
});
const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-lato",
});

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Kairali Yoga — Residential Yoga Programmes in Kerala",
    description:
      "Private sunrise yoga, one Ayurvedic therapy a day and physician-guided programmes at Kairali — The Ayurvedic Healing Village, Palakkad. Enquire for dates.",
    siteName: "Kairali Yoga",
    ogImage: "/og.jpg", // WhatsApp-share card — this audience's channel
  }) as Metadata),
  icons: faviconIcons(),
};

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
        <ConsentBanner privacyHref="/privacy" />
      </body>
    </html>
  );
}

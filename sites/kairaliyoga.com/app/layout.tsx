import type { Metadata } from "next";
import type { ReactNode } from "react";
import { asap, kurale, lato } from "@kairali/ui/fonts/kairali";
import "@kairali/ui/fonts/kairali.css";
import { buildMetadata, faviconIcons } from "@kairali/seo";
import { ConsentScripts, ConsentBanner } from "@kairali/consent";
import { Analytics } from "@kairali/analytics";
import { ChatbaseLoader } from "@kairali/chat";
import "@kairali/ui/brand-tokens.css";
import "./globals.css";
import siteConfig from "../site.config.json";

// Brand Manual ch.04 faces. The repository-local Asap and Lato assets retain
// upstream glyph coverage for macrons (Dhyāna, Dīpanam, Prāna, Sāmya) without
// any build-time or runtime Google Fonts request.

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
        <ChatbaseLoader />
        <ConsentBanner privacyHref="/privacy" />
      </body>
    </html>
  );
}

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

// Brand Manual ch.04 faces; repository-local next/font assets make builds
// independent from the Google Fonts service.

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Arogya Shala — Kairali Branding for Ayurvedic Counters",
    description:
      "Kairali's retail programme for chemists and shop owners: the Arogya Shala board, the WHO-GMP Kairali range, and product guidance for your counter.",
    siteName: "Arogya Shala",
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
        <ChatbaseLoader consentGated />
        <ConsentBanner privacyHref="/privacy" />
      </body>
    </html>
  );
}

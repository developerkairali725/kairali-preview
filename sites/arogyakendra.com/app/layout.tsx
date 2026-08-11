import type { Metadata } from "next";
import type { ReactNode } from "react";
import { asap, kurale, lato } from "@kairali/ui/fonts/kairali";
import "@kairali/ui/fonts/kairali.css";
import { buildMetadata, faviconIcons } from "@kairali/seo";
import { ConsentScripts, ConsentBanner } from "@kairali/consent";
import { Analytics } from "@kairali/analytics";
import "@kairali/ui/brand-tokens.css";
import "./globals.css";
import { ChatbaseLoader } from "@kairali/chat";
import siteConfig from "../site.config.json";

// Brand Manual ch.04: Kurale (display, weight 400 only) · Asap (body/UI) ·
// Lato (captions, overlines, numerals). Repository-local next/font assets
// remove both build-time and runtime Google Fonts requests.

// OG/Twitter ship WITHOUT an image for now: no real 1200×630 asset exists
// yet and fabricating one is banned. Spec lives in IMAGE_MANIFEST.md
// (slot og-image); pass `ogImage` here when the asset lands.
export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Arogya Kendra — Ayurvedic Care by the Kairali Group",
    description:
      "Arogya Kendra is the gateway to the Kairali Ayurvedic Group — health through ayurveda, a family tradition since 1908. Centres, hospital-retreat, products.",
    siteName: "Arogya Kendra",
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

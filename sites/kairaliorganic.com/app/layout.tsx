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

// Brand Manual ch.04 faces, self-hosted at build via next/font. The
// "Apothecary Ledger" direction (launches/kairaliorganic.com/
// DESIGN_DIRECTION.md) uses the MASTER heritage voice — Kurale display,
// Asap body, Lato captions/numerals. Kairali tokens ONLY (doctrine d);
// Quicksand is the KAIR site's voice and never appears here (D3 distinctness).
export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Kairali Organics — Chemical-Free Ayurvedic Formulations",
    description:
      "The Kairali Ayurvedic Group's Organics range — nine 100% chemical-free Ayurvedic formulations made from natural ingredients. Where to buy + enquiries.",
    siteName: "Kairali Organics",
    ogImage: "/og.jpg",
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

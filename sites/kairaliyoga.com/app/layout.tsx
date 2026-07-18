import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Kurale, Asap, Lato } from "next/font/google";
import { buildMetadata, faviconIcons } from "@kairali/seo";
import { ConsentScripts, ConsentBanner } from "@kairali/consent";
import { Analytics } from "@kairali/analytics";
import { ChatbaseLoader } from "@kairali/chat";
import "@kairali/ui/brand-tokens.css";
import "./globals.css";
import siteConfig from "../site.config.json";

// Brand Manual ch.04 faces; next/font self-hosts at build. latin-ext is
// REQUIRED for Asap + Lato: the macrons (Dhyāna, Dīpanam, Prāna, Sāmya) render
// in .path-hint (body/Asap) and .programme-iast (caption/Lato) — verified by
// walking the rendered DOM, not assumed.
// Kurale does NOT need it: the display face carries the ROMANIZED programme
// names (the Q-YOGA-IAST interim — Kurale's macron bug is precisely why), so
// its latin-ext file was preloaded weight that no glyph on the page used.
// Every preloaded font competes with the LCP paint on Lighthouse's slow-4G
// model — this site was the only fleet build shipping latin-ext at all, and
// the only one that could not clear the A5 perf budget (17 Jul).
const kurale = Kurale({
  weight: "400",
  subsets: ["latin"],
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
        <ChatbaseLoader />
        <ConsentBanner privacyHref="/privacy" />
      </body>
    </html>
  );
}

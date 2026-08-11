import type { Metadata } from "next";
import type { ReactNode } from "react";
import { asap, kurale, lato } from "@kairali/ui/fonts/kairali";
import "@kairali/ui/fonts/kairali.css";
import { buildMetadata, faviconIcons } from "@kairali/seo";
// Network counts are COMPUTED from the verified centres roster — never typed
// (canonical: KAC site figures, ruled 17 Jul 2026; PROJECT_CONTEXT §12).
import { COUNTRIES_PHRASE } from "@kairali/facts";
import { ConsentScripts, ConsentBanner } from "@kairali/consent";
import { Analytics } from "@kairali/analytics";
import "@kairali/ui/brand-tokens.css";
import "./globals.css";
import { ChatbaseLoader } from "@kairali/chat";
import siteConfig from "../site.config.json";

// Brand Manual ch.04: Kurale (display, weight 400 only) · Asap (body/UI) ·
// Lato (captions, overlines, numerals). Repository-local next/font assets
// remove both build-time and runtime Google Fonts requests.

// First Factory site with a REAL OG image: /og.jpg is a 1200×630 derivative
// of the Healing Village footbridge photograph (IMAGE_MANIFEST.md).
export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Kairali Ayurvedic Group — A Family Tradition Since 1908",
    description:
      `Kairali Ayurvedic Group: NABH-accredited hospital, WHO-GMP medicines, centres in ${COUNTRIES_PHRASE}, training, Villa Raag. A family tradition since 1908.`,
    siteName: "Kairali Ayurvedic Group",
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
        {/* No privacyHref yet: /privacy doesn't exist — Ship Gate A12 gap
            stays visible until the entity privacy page ships */}
        <ConsentBanner privacyHref="/privacy" />
      </body>
    </html>
  );
}

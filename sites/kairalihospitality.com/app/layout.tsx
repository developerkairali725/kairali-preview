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

// Brand Manual ch.04 faces; next/font self-hosts at build. Kairali tokens
// ONLY — raag-tokens.css is deliberately NOT imported (design brief MUST NOT:
// the umbrella is a Kairali surface; Raag's own look lives on villaraag.com).
// Repository-local full-glyph assets keep "Svatá Kateřina" / "VYSOČINA" in
// the brand faces without any build-time or runtime Google Fonts request.

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Kairali Hospitality — The Group’s Properties, Goa to Europe",
    description:
      "The Kairali group’s hospitality umbrella — Villa Raag in Goa, the Healing Village hospital in Palakkad, Ayurveda in the Czech Republic, and consultancy.",
    siteName: "Kairali Hospitality",
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

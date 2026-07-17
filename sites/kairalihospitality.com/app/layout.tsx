import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Kurale, Asap, Lato } from "next/font/google";
import { buildMetadata, faviconIcons } from "@kairali/seo";
import { ConsentScripts, ConsentBanner } from "@kairali/consent";
import { Analytics } from "@kairali/analytics";
import "@kairali/ui/brand-tokens.css";
import "./globals.css";
import siteConfig from "../site.config.json";

// Brand Manual ch.04 faces; next/font self-hosts at build. Kairali tokens
// ONLY — raag-tokens.css is deliberately NOT imported (design brief MUST NOT:
// the umbrella is a Kairali surface; Raag's own look lives on villaraag.com).
// latin-ext included: "Svatá Kateřina" / "VYSOČINA" must render in the brand
// faces, not a fallback serif (č/ř/á are latin-ext codepoints).
const kurale = Kurale({ weight: "400", subsets: ["latin", "latin-ext"], display: "swap", variable: "--font-kurale" });
const asap = Asap({ weight: ["400", "600", "700"], subsets: ["latin", "latin-ext"], display: "swap", variable: "--font-asap" });
const lato = Lato({ weight: ["300", "400", "700"], subsets: ["latin", "latin-ext"], display: "swap", variable: "--font-lato" });

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Kairali Hospitality — The Group’s Properties, Goa to Europe",
    description:
      "The Kairali group’s hospitality umbrella — Villa Raag in Goa, the Healing Village hospital in Palakkad, a European joint venture, and consultancy.",
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
        <ConsentBanner privacyHref="/privacy" />
      </body>
    </html>
  );
}

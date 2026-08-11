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
import { SiteHeader, SiteFooter, StickyBar } from "./_components/chrome";
import siteConfig from "../site.config.json";

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Ayurveda Equipment Manufacturer & Exporter — Kairali",
    description:
      "Pathi massage beds, Shirodhara stands, teak steam boxes and brass urlis — made in Kairali's own facility for hospitals, resorts and spas. Quote-first.",
    siteName: "Kairali Equipment",
    // ogImage deliberately omitted: no real 1200×630 asset exists yet
    // (@kairali/seo: "OMIT until a real asset exists — never fabricate").
  }) as Metadata),
  // Strategy §2 homepage keywords (primary → secondary) — complete page metadata.
  keywords: [
    "ayurveda equipment manufacturer",
    "ayurvedic spa equipment",
    "Kairali equipment",
    "panchakarma equipment India",
  ],
  icons: faviconIcons(),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${kurale.variable} ${asap.variable} ${lato.variable}`}>
      <head>
        {/* Consent Mode v2 default-DENIED first, before any loader */}
        <ConsentScripts />
        <Analytics />
      </head>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <StickyBar />
        {/* Floating stack cap of three: consent banner + chat bubble + sticky bar
            (DESIGN_DOCTRINE §1.4); chat yields while the banner is open.
            consentGated: the third-party embed loads only after the banner is
            ANSWERED (D-20260718-05 consent-gating) — keeps the banner's
            "Nothing is stored until you choose." literally true. */}
        <ChatbaseLoader consentGated />
        <ConsentBanner privacyHref="/privacy" />
      </body>
    </html>
  );
}

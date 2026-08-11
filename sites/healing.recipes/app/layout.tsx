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
import { SiteHeader, SiteFooter } from "./_components/chrome";
import siteConfig from "../site.config.json";

// Brand Manual ch.04: Kurale (display, weight 400 only) · Asap (body/UI) ·
// Lato (captions, overlines, bibliographic lines). Repository-local next/font
// assets remove both build-time and runtime Google Fonts requests.

// OG image: Harmony cover centred on brand ivory, 1200×630 (IMAGE_MANIFEST.md).
export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Healing Recipes — The Books of Gita Ramesh",
    description:
      "The four books of Gita Ramesh — Ayurvedic Herbal Massage, The Ayurvedic Cookbook, the Gourmand-winning Wellness Cookbook, and Harmony (2026).",
    siteName: "Healing Recipes",
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
        <SiteHeader />
        {children}
        <SiteFooter />
        <ChatbaseLoader />
        <ConsentBanner privacyHref="/privacy" />
      </body>
    </html>
  );
}

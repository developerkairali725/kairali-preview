import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Montserrat, Allura } from "next/font/google";
import { buildMetadata, faviconIcons } from "@kairali/seo";
import { ConsentScripts, ConsentBanner } from "@kairali/consent";
import { Analytics } from "@kairali/analytics";
import "@kairali/ui/blush-tokens.css";
import "./globals.css";
import siteConfig from "../site.config.json";

// A6 gate: buildMetadata THROWS on >60ch titles / >155ch descriptions, so a
// non-conforming page fails `pnpm build` instead of shipping.
// OG image: 1200×630 derived from the hero capture (IMAGE_MANIFEST.md —
// IG-FULLRES-SOURCED interim, swaps with the shoot set).
export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Bridal & SFX Makeup Artist in Delhi | Blush Lounge by Sneha",
    description:
      "Soft glamour, precise drama — bridal, cocktail & editorial makeup by Sneha Chowdhary, Delhi & worldwide. Cinema Makeup School LA. WhatsApp to book.",
    siteName: "Blush Lounge — Makeup by Sneha",
    ogImage: "/og.jpg",
  }) as Metadata),
  icons: faviconIcons(),
};

// "Champagne Editorial" type system (signed design direction):
// Fraunces (editorial display serif — her press-feature register, NOT the
// AI-generic Playfair) · Montserrat (wordmark-caps continuity, UI/body) ·
// Allura (the logo monogram's script lineage — HARD CAP one accent per page).
// next/font self-hosts at build — no runtime Google Fonts CDN
// (docs/ENGINEERING_STANDARDS.md).
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-fraunces",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-montserrat",
});
const allura = Allura({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-allura",
});

// NO ChatbaseLoader on this site — theblushlounge.com is chat-bubble-EXEMPT
// by owner ruling D-BL-BUBBLE-EXEMPT (18 Jul 2026): Sneha's own WhatsApp
// (+91 88269 21110, D-BL-WHATSAPP) is the chat surface. The exemption is
// encoded LOUDLY in scripts/chat-bubble-lint.mjs CHAT_EXEMPT — never a
// silent skip. Personal brand: no Kairali entity claims anywhere.

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${montserrat.variable} ${allura.variable}`}>
      <head>
        {/* Order is law: consent defaults (denied) BEFORE any tag loader */}
        <ConsentScripts />
        <Analytics />
      </head>
      <body>
        {children}
        {/* privacyHref deliberately OMITTED for the golden page: the fleet's
            shared legal pages name Kairali Ayurvedic Group as controller,
            which would be a Kairali entity claim on Sneha's personal brand.
            Her own privacy/terms pages are a flagged FULL-BUILD gap
            (Ship Gate A12) — the banner shows no link until they exist. */}
        <ConsentBanner />
      </body>
    </html>
  );
}

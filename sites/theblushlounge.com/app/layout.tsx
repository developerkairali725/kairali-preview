import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
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
  icons: {
    ...faviconIcons(),
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-16.png", type: "image/png", sizes: "16x16" },
      { url: "/icons/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.png", type: "image/png", sizes: "64x64" },
      { url: "/icons/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/icons/icon-180.png", type: "image/png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
};

// "Champagne Editorial" type system (signed design direction):
// Fraunces (editorial display serif — her press-feature register, NOT the
// AI-generic Playfair) · Montserrat (wordmark-caps continuity, UI/body) ·
// Allura (the logo monogram's script lineage — HARD CAP one accent per page).
// The approved families are committed as official Google Fonts WOFF2 files so
// both local and CI builds are independent of remote font services. Provenance,
// checksums and OFL notices live beside the files in app/fonts/.
const fraunces = localFont({
  src: [
    {
      path: "./fonts/fraunces-variable-latin.woff2",
      style: "normal",
      weight: "100 900",
    },
    {
      path: "./fonts/fraunces-italic-variable-latin.woff2",
      style: "italic",
      weight: "100 900",
    },
  ],
  display: "swap",
  variable: "--font-fraunces",
});
const montserrat = localFont({
  src: "./fonts/montserrat-variable-latin.woff2",
  weight: "400 600",
  style: "normal",
  display: "swap",
  variable: "--font-montserrat",
});
const allura = localFont({
  src: "./fonts/allura-400-latin.woff2",
  weight: "400",
  style: "normal",
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
        {/* privacyHref deliberately omitted: the fleet's
            shared legal pages name Kairali Ayurvedic Group as controller,
            which would be a Kairali entity claim on Sneha's personal brand.
            Sneha's controller/privacy decision remains a named launch-record
            gap, so the banner must not link to a fabricated policy. */}
        <ConsentBanner />
      </body>
    </html>
  );
}

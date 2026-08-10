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

// Brand Manual ch.04 faces; next/font self-hosts at build.
const kurale = Kurale({ weight: "400", subsets: ["latin"], display: "swap", variable: "--font-kurale" });
const asap = Asap({ weight: ["400", "600", "700"], subsets: ["latin"], display: "swap", variable: "--font-asap" });
const lato = Lato({ weight: ["300", "400", "700"], subsets: ["latin"], display: "swap", variable: "--font-lato" });

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Arogya Shala — Kairali Branding for Ayurvedic Counters",
    description:
      "Kairali's retail programme for chemists and shop owners: the Arogya Shala board, the WHO-GMP Kairali range, and product guidance for your counter.",
    siteName: "Arogya Shala",
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
        <ChatbaseLoader consentGated />
        <ConsentBanner privacyHref="/privacy" />
      </body>
    </html>
  );
}

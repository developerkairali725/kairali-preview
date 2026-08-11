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
import { SiteHeader, SiteFooter } from "./_components/chrome";
import siteConfig from "../site.config.json";

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Private Label Ayurvedic Products Manufacturer | Kairali",
    description:
      "Private label, third-party and loan-licence manufacturing of Ayurvedic products — formulation to dispatch from KAPPL's WHO-GMP Pollachi facility.",
    siteName: "Bulk Ayurveda Products — a KAPPL manufacturing desk",
    ogImage: "/og.jpg",
  }) as Metadata),
  icons: faviconIcons(),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${kurale.variable} ${asap.variable} ${lato.variable}`}>
      <head>
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

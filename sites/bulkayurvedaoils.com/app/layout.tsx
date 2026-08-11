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
    title: "Bulk Ayurvedic Oils — WHO-GMP Manufacturer Supply | Kairali",
    description:
      "Manufacturer-direct bulk classical thailams, proprietary oils and therapy powders for spas, panchakarma centres, clinics and distributors. Quoted direct.",
    siteName: "Bulk Ayurveda Oils — a KAPPL supply desk",
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

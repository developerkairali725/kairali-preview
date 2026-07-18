import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Kurale, Asap, Lato } from "next/font/google";
import { buildMetadata, faviconIcons } from "@kairali/seo";
import { ConsentScripts, ConsentBanner } from "@kairali/consent";
import { Analytics } from "@kairali/analytics";
import "@kairali/ui/brand-tokens.css";
import "./globals.css";
import { ChatbaseLoader } from "@kairali/chat";
import { SiteHeader, SiteFooter } from "./_components/chrome";
import siteConfig from "../site.config.json";

const kurale = Kurale({ weight: "400", subsets: ["latin"], display: "swap", variable: "--font-kurale" });
const asap = Asap({ weight: ["400", "600", "700"], subsets: ["latin"], display: "swap", variable: "--font-asap" });
const lato = Lato({ weight: ["300", "400", "700"], subsets: ["latin"], display: "swap", variable: "--font-lato" });

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

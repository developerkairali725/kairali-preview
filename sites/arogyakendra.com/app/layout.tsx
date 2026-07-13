import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Kurale, Asap, Lato } from "next/font/google";
import "@kairali/ui/brand-tokens.css";
import "./globals.css";
import ChatbaseLoader from "./chatbase-loader";

// Brand Manual ch.04: Kurale (display, weight 400 only) · Asap (body/UI) ·
// Lato (captions, overlines, numerals). next/font self-hosts at build —
// no runtime Google Fonts CDN (docs/ENGINEERING_STANDARDS.md).
const kurale = Kurale({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-kurale",
});
const asap = Asap({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-asap",
});
const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lato",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://arogyakendra.com"),
  title: "Arogya Kendra — Ayurvedic Care by the Kairali Group",
  description:
    "Arogya Kendra is the gateway to the Kairali Ayurvedic Group — health through ayurveda since 1908. Find our centres, hospital-retreat, products, and more.",
  alternates: { canonical: "https://arogyakendra.com" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${kurale.variable} ${asap.variable} ${lato.variable}`}>
      <body>
        {children}
        <ChatbaseLoader />
      </body>
    </html>
  );
}

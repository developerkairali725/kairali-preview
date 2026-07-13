import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@kairali/ui/brand-tokens.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://arogyakendra.com"),
  title: "Arogya Kendra — Ayurvedic Care by the Kairali Group",
  description:
    "Arogya Kendra is part of the Kairali Ayurvedic Group — health through ayurveda since 1908. Find our treatment centres, products, training, and franchise network.",
  alternates: { canonical: "https://arogyakendra.com" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

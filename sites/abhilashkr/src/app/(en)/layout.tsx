import type { Metadata } from "next";
import "../globals.css";
import { SITE_URL } from "@/lib/config";
import { alternatesFor } from "@/lib/i18n";
import { SiteShell } from "@/components/site/site-shell";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/icons/icon-180.png", sizes: "180x180", type: "image/png" }],
  },
  title: "Abhilash Kalathil Ramesh | Executive Director",
  description: "Abhilash Kalathil Ramesh: Executive Director of Kairali Ayurvedic Group, AYUSHEXCIL founding board member, and angel investor.",
  alternates: alternatesFor("home"),
  openGraph: {
    title: "Abhilash Kalathil Ramesh | Executive Director",
    description: "Executive Director of Kairali Ayurvedic Group, AYUSHEXCIL founding board member, and angel investor.",
    url: SITE_URL,
    siteName: "Abhilash K. Ramesh",
    images: [
      {
        url: `${SITE_URL}/api/og?title=Abhilash%20Kalathil%20Ramesh&subtitle=Executive%20Director%2C%20Kairali%20Ayurvedic%20Group&section=Entity%20Verification%20Ledger`,
        width: 1200,
        height: 630,
        alt: "Abhilash Kalathil Ramesh — Executive Director, Kairali Ayurvedic Group",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhilash Kalathil Ramesh | Executive Director",
    description: "Executive Director of Kairali Ayurvedic Group, AYUSHEXCIL founding board member, and angel investor.",
    images: [`${SITE_URL}/api/og?title=Abhilash%20Kalathil%20Ramesh&subtitle=Executive%20Director%2C%20Kairali%20Ayurvedic%20Group&section=Entity%20Verification%20Ledger`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SiteShell locale="en">{children}</SiteShell>
  );
}

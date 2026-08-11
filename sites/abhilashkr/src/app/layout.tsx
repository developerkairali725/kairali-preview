import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/config";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/site/theme-provider";

const instrumentSerif = localFont({
  src: [
    { path: "../../../../packages/ui/fonts/assets/instrument-serif-400.woff2", weight: "400", style: "normal" },
    { path: "../../../../packages/ui/fonts/assets/instrument-serif-400-italic.woff2", weight: "400", style: "italic" },
  ],
  display: "swap",
  variable: "--font-display",
});

const instrumentSans = localFont({
  src: "../../../../packages/ui/fonts/assets/instrument-sans-variable.woff2",
  weight: "400 700",
  style: "normal",
  display: "swap",
  variable: "--font-sans",
});

const ibmPlexMono = localFont({
  src: [
    { path: "../../../../packages/ui/fonts/assets/ibm-plex-mono-300.woff2", weight: "300", style: "normal" },
    { path: "../../../../packages/ui/fonts/assets/ibm-plex-mono-400.woff2", weight: "400", style: "normal" },
    { path: "../../../../packages/ui/fonts/assets/ibm-plex-mono-500.woff2", weight: "500", style: "normal" },
    { path: "../../../../packages/ui/fonts/assets/ibm-plex-mono-600.woff2", weight: "600", style: "normal" },
    { path: "../../../../packages/ui/fonts/assets/ibm-plex-mono-700.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Abhilash Kalathil Ramesh | Executive Director, Kairali Ayurvedic Group",
  description: "Portfolio of Abhilash Kalathil Ramesh, Executive Director of Kairali Ayurvedic Group, AYUSHEXCIL Founding Member, and Angel Investor.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Abhilash Kalathil Ramesh | Executive Director, Kairali Ayurvedic Group",
    description: "Portfolio of Abhilash Kalathil Ramesh, Executive Director of Kairali Ayurvedic Group, AYUSHEXCIL Founding Member, and Angel Investor.",
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
    title: "Abhilash Kalathil Ramesh | Executive Director, Kairali Ayurvedic Group",
    description: "Portfolio of Abhilash Kalathil Ramesh, Executive Director of Kairali Ayurvedic Group, AYUSHEXCIL Founding Member, and Angel Investor.",
    images: [`${SITE_URL}/api/og?title=Abhilash%20Kalathil%20Ramesh&subtitle=Executive%20Director%2C%20Kairali%20Ayurvedic%20Group&section=Entity%20Verification%20Ledger`],
  },
};

import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { getPersonSchema } from "@/lib/schema";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaData = getPersonSchema();
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        "scroll-smooth",
        instrumentSerif.variable,
        instrumentSans.variable,
        ibmPlexMono.variable
      )}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        {/* Self-referential hreflang — add de/fr/ja alternates when locale content ships */}
        {/* TODO(i18n): priority languages are German and French (DACH/France audiences), then optionally Japanese (Yokohama/Beppu). These ship as real translated routes with human review, later. */}
        <link rel="alternate" hrefLang="en" href={`${SITE_URL}/`} />
        <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}/`} />
        <link rel="alternate" type="application/rss+xml" title="Abhilash K. Ramesh — Essays" href="/feed.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ThemeProvider>
          <TooltipProvider>
            <Header />
            <main className="flex-grow flex flex-col">
              {children}
            </main>
            <Footer />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

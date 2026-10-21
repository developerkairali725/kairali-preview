import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Enhance from "@/components/Enhance";
import { JsonLd } from "@/components/Bits";
import Analytics from "@/components/Analytics";
import { ConsentBanner, ConsentScripts } from "@kairali/consent";
import { ChatbaseLoader } from "@kairali/chat";
import { ASSET_ORIGIN, IS_PRODUCTION, MEASUREMENT, PHONE, SITE_NAME, SITE_URL, SOCIAL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon-32.png", sizes: "32x32", type: "image/png" }], apple: "/apple-touch-icon.png" },
  robots: IS_PRODUCTION ? undefined : { index: false, follow: false },
  formatDetection: { telephone: false },
  verification: MEASUREMENT.googleSiteVerification ? { google: MEASUREMENT.googleSiteVerification } : undefined,
};
// Serialized browser metadata requires a literal; matches the Premium v4 charcoal token (no green in the UI). brand-allow: rogue-hex
export const viewport: Viewport = { themeColor: "#1A1915", width: "device-width", initialScale: 1 }; // brand-allow: rogue-hex

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ConsentScripts />
        <link rel="preload" href="/fonts/cormorant-garamond-latin-300-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/cormorant-garamond-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/source-sans-3-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Header />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
        <Enhance />
        <Analytics enabled={IS_PRODUCTION} ga4={MEASUREMENT.ga4} gtm={MEASUREMENT.gtm} clarity={MEASUREMENT.clarity} />
        <ChatbaseLoader consentGated />
        <ConsentBanner privacyHref="/privacy-policy" />
        <JsonLd data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: `${SITE_URL}/`,
              logo: { "@type": "ImageObject", url: `${ASSET_ORIGIN}/brand/kairali-logo.png`, width: 600, height: 529 },
              foundingDate: "1908", email: "info@kairali.com", telephone: PHONE.label,
              address: { "@type": "PostalAddress", streetAddress: "D - 130, Block D, Ambedkar Colony, Mehrauli", addressLocality: "New Delhi", postalCode: "110030", addressCountry: "IN" },
              sameAs: SOCIAL.map((s) => s.href) },
            { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: SITE_NAME, publisher: { "@id": `${SITE_URL}/#organization` }, inLanguage: "en" },
          ],
        }} />
      </body>
    </html>
  );
}

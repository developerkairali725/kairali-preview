import type { Metadata } from "next";
import { notFound } from "next/navigation";

import "../globals.css";
import { SiteShell } from "@/components/site/site-shell";
import { isLocalizedLocale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/config";

export const dynamicParams = false;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/icons/icon-180.png", sizes: "180x180", type: "image/png" }],
  },
};

export function generateStaticParams() {
  return [{ locale: "de" }, { locale: "fr" }];
}

export default async function LocalizedLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocalizedLocale(locale)) notFound();

  return <SiteShell locale={locale}>{children}</SiteShell>;
}

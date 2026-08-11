import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LocalizedPage } from "@/components/site/localized-page";
import { isLocalizedLocale, localizedMetadata } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocalizedLocale(locale)) return {};
  return localizedMetadata(locale, "home");
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocalizedLocale(locale)) notFound();

  return <LocalizedPage locale={locale} pageKey="home" />;
}

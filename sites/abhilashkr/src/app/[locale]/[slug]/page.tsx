import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LocalizedPage } from "@/components/site/localized-page";
import {
  isLocalizedLocale,
  localizedKeyForSlug,
  localizedMetadata,
  localizedSlugs,
  type LocalizedLocale,
} from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  if (!isLocalizedLocale(params.locale)) return [];
  return localizedSlugs(params.locale).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocalizedLocale(locale)) return {};
  const pageKey = localizedKeyForSlug(locale, slug);
  return pageKey ? localizedMetadata(locale, pageKey) : {};
}

export default async function LocalizedRoutePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocalizedLocale(locale)) notFound();
  const pageKey = localizedKeyForSlug(locale, slug);
  if (!pageKey) notFound();

  return <LocalizedPage locale={locale as LocalizedLocale} pageKey={pageKey} />;
}

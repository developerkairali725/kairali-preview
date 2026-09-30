/**
 * Locale lane (25 Sep 2026): the shared implementation behind every
 * app/(l10n)/<prefix>/ directory. Each locale directory is its own root layout
 * (so <html lang dir> is right in the SERVER HTML, not patched by the client)
 * and one optional catch-all page that resolves the locale URL — including the
 * legacy German/French URLs served in place — to its English route through the
 * reviewed table (l10n/routes.json). dynamicParams=false in the page files: a
 * locale path that is not in the table is a 404, never an English fallback.
 */
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { SiteDocument } from "./site-document";
import { DesignView } from "./design-view";
import { routeMetadata } from "./metadata";
import { routes } from "./registry";
import { LOCALE_INFO, enPathFor, localeData, localeSegments, type LocaleCode } from "./l10n";
import { NativeLocalePage, isNativeRoute } from "./native-pages";

const BY_PATH = new Map(routes.map((r) => [r.path, r]));

export function LocaleDocument({ locale, children }: { locale: LocaleCode; children: ReactNode }) {
  const info = LOCALE_INFO[locale];
  const ui = localeData(locale)?.ui ?? {};
  // The UI dictionary the boot/runtime scripts read (consent notice, clock,
  // switcher). JSON escaped for an inline <script>.
  const l10nScript = `window.__AHV_LOCALE=${JSON.stringify(locale)};window.__AHV_T=${JSON.stringify(ui).replace(/</g, "\\u003c")};`;
  return (
    <SiteDocument lang={info.htmlLang} dir={info.dir} designBase={`/ahv/l10n/${info.prefix}/design/`} l10nScript={l10nScript}>
      {children}
    </SiteDocument>
  );
}

export function localeStaticParams(locale: LocaleCode): Array<{ slug: string[] }> {
  return localeSegments(locale).map((slug) => ({ slug }));
}

function resolve(locale: LocaleCode, slug: string[] | undefined) {
  const en = enPathFor(locale, slug);
  return en ? BY_PATH.get(en) ?? null : null;
}

export async function localeMetadata(locale: LocaleCode, params: Promise<{ slug?: string[] }>): Promise<Metadata> {
  const { slug } = await params;
  const route = resolve(locale, slug);
  if (!route) return { title: "Not found", robots: { index: false, follow: false } };
  return routeMetadata(route, locale);
}

export async function LocalePage({ locale, params, searchParams }: { locale: LocaleCode; params: Promise<{ slug?: string[] }>; searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const { slug } = await params;
  const route = resolve(locale, slug);
  if (!route) notFound();
  if (isNativeRoute(route.path)) return <NativeLocalePage route={route} locale={locale} searchParams={route.path === "/search/" ? searchParams : undefined} />;
  return <DesignView route={route} locale={locale} />;
}

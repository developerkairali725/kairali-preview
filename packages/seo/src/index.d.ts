// Hand-maintained declarations for src/index.js (plain-ESM house style).
// Keep in sync with the JSDoc there.

import type { SiteConfig } from "@kairali/i18n";

export const LIMITS: { title: number; description: number };
export const OG_IMAGE: { width: number; height: number };

export interface FaviconIcons {
  icon: Array<{ url: string; type: string; sizes?: string }>;
}

/** Standard Factory favicon set (SVG primary + PNG fallback). Opt in per layout. */
export function faviconIcons(): FaviconIcons;

export function siteUrl(config: SiteConfig): string;

export interface PageMeta {
  title: string;
  description: string;
  path?: string;
  locale?: string;
  siteName?: string;
  ogImage?: string;
  index?: boolean;
  ogType?: "website" | "article";
}

/** Returns a Next.js Metadata-shaped object; throws on A6 violations. */
export function buildMetadata(config: SiteConfig, page: PageMeta): Record<string, unknown>;

export function buildRobots(
  config: SiteConfig,
  opts?: { disallow?: string[] },
): {
  rules: Array<{ userAgent: string; allow: string; disallow?: string[] }>;
  sitemap: string;
};

export interface SitemapPage {
  path: string;
  lastModified?: Date | string;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}

export function buildSitemap(
  config: SiteConfig,
  pages: SitemapPage[],
): Array<Record<string, unknown>>;

export interface LlmsTxtDoc {
  name: string;
  summary: string;
  facts?: string[];
  sections?: Array<{
    title: string;
    links: Array<{ title: string; url: string; note?: string }>;
  }>;
}

export function buildLlmsTxt(config: SiteConfig, doc: LlmsTxtDoc): string;

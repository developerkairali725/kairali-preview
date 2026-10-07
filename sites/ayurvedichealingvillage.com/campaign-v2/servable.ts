// Which campaigns a request may render, in render-safe form. No next/* imports, so node --test can load it
// (route.ts adds the request guard on top).
import { CAMPAIGNS } from "./campaigns/index.ts";
import type { CampaignConfig } from "./kit/types.ts";
import { resolvePlaceholders } from "./kit/resolve.ts";

/** /lp-v2 previews exist on staging and local builds only; AHV_STAGING=0 is the production build. Pure. */
export function previewsServed(env: Record<string, string | undefined> = typeof process !== "undefined" ? process.env : {}): boolean {
  return env.AHV_STAGING !== "0";
}

/**
 * The servable campaign for a slug, with every pending() in a string slot resolved to visible "[id]" text
 * (kit/resolve.ts), or undefined for an unknown slug or _template. Used by loadRoute and generateMetadata.
 */
export function servableCampaign(slug: string): CampaignConfig | undefined {
  if (!previewsServed()) return undefined;
  const c = Object.hasOwn(CAMPAIGNS, slug) && slug !== "_template" ? CAMPAIGNS[slug] : undefined;
  return c ? resolvePlaceholders(c) : undefined;
}

/** <head> metadata for a campaign page. Variant URLs are always noindex. */
export function campaignMetadata(c: CampaignConfig | undefined): { title?: string; description?: string; robots: { index: false; follow: false } } {
  const robots = { index: false, follow: false } as const;
  if (!c) return { robots };
  return { title: c.seo.title || "Kairali", description: c.seo.description || "", robots };
}

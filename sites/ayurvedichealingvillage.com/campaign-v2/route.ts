import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { resolveRequest, countryCode } from "./request.ts";
import { VARIANTS, type CampaignConfig, type Variant } from "./kit/types.ts";
import { servableCampaign, previewsServed } from "./servable.ts";

/**
 * `country`: validated ISO code from x-lp-country (middleware), only for the lead row. Never shown or tracked.
 * `surface`: "production" only on the live ad routes (campaign-v2/production), which reuse the site's own
 * document, consent, measurement and chat; absent on /lp-v2 previews.
 */
export type LpRequest = ReturnType<typeof resolveRequest> & { country?: string; surface?: "production" };

/** Shared guard for /lp-v2/[slug]/[variant]: unknown slug, _template, or a variant outside A–D → 404.
 *  Previews are staging-only (build spec §12): a production build (AHV_STAGING=0) answers 404, so the kit's
 *  preview consent model and banner never serve on the public host. */
export async function loadRoute(params: Promise<{ slug: string; variant: string }>): Promise<{ campaign: CampaignConfig; variant: Variant; req: LpRequest }> {
  if (!previewsServed()) notFound();
  const { slug, variant } = await params;
  const V = variant.toUpperCase() as Variant;
  const campaign = servableCampaign(slug);
  if (!campaign || !VARIANTS.includes(V) || !campaign.variants.includes(V)) notFound();
  const h = await headers();
  const req: LpRequest = resolveRequest(
    { acceptLanguage: h.get("x-lp-accept-language"), country: h.get("x-lp-country") },
    campaign.locales.length ? campaign.locales : ["en"],
  );
  const country = countryCode(h.get("x-lp-country"));
  if (country) req.country = country;
  return { campaign, variant: V, req };
}

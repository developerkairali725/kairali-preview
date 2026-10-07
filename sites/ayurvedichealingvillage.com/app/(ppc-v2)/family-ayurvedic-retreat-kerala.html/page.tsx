import type { Metadata } from "next";
import ProductionPage from "../../../campaign-v2/production/ProductionPage";
import { productionCampaign } from "../../../campaign-v2/production/load.ts";
import { productionJsonLdScript, productionMetadata } from "../../../campaign-v2/production/metadata.ts";

// Live ad route, unchanged URL. Copy: campaign-v2/production/content/family-ayurvedic-retreat.json (content worker,
// verbatim). Replaces app/(campaign)/family-ayurvedic-retreat-kerala.html/page.tsx (its family form contract is kept:
// forms/schema.ts productionFamilyForm + forms/adapter.ts "ahv-production", form_variant r10-family-retreat).
const SLUG = "family-ayurvedic-retreat" as const;
const campaign = productionCampaign(SLUG);

export const metadata: Metadata = productionMetadata(SLUG, campaign);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: productionJsonLdScript(SLUG, campaign) }} />
      <ProductionPage c={campaign} />
    </>
  );
}

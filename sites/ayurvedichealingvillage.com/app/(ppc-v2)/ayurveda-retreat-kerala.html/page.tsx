import type { Metadata } from "next";
import ProductionPage from "../../../campaign-v2/production/ProductionPage";
import { productionCampaign } from "../../../campaign-v2/production/load.ts";
import { productionJsonLdScript, productionMetadata } from "../../../campaign-v2/production/metadata.ts";

// Live ad route /ayurveda-retreat-kerala.html, unchanged URL (replaces app/(campaign)/ayurveda-retreat-kerala.html/page.tsx). Copy: campaign-v2/production/pages/ayurveda-retreat.ts; route facts, variant and lead identity:
// campaign-v2/production/bindings.ts.
const SLUG = "ayurveda-retreat" as const;
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

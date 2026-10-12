import type { Metadata } from "next";
import ProductionPage from "../../../../campaign-v2/production/ProductionPage";
import { productionCampaign } from "../../../../campaign-v2/production/load.ts";
import { productionJsonLdScript, productionMetadata } from "../../../../campaign-v2/production/metadata.ts";

// Live ad route /lp/weight-loss/, unchanged URL (replaces app/(lp)/lp/weight-loss/page.tsx). Copy: campaign-v2/production/pages/lp-weight-management.ts; route facts, variant and lead identity:
// campaign-v2/production/bindings.ts.
const SLUG = "lp-weight-management" as const;
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

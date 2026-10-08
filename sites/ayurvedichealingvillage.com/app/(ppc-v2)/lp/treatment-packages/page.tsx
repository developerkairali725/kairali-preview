import type { Metadata } from "next";
import ProductionPage from "../../../../campaign-v2/production/ProductionPage";
import { productionCampaign } from "../../../../campaign-v2/production/load.ts";
import { productionJsonLdScript, productionMetadata } from "../../../../campaign-v2/production/metadata.ts";

// Live ad route /lp/treatment-packages/, unchanged URL (replaces app/(lp)/lp/treatment-packages/page.tsx). Copy: campaign-v2/production/pages/lp-treatment-packages.ts; route facts, variant and lead identity:
// campaign-v2/production/bindings.ts.
const SLUG = "lp-treatment-packages" as const;
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

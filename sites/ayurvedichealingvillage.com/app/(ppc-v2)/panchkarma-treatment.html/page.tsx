import type { Metadata } from "next";
import ProductionPage from "../../../campaign-v2/production/ProductionPage";
import { productionCampaign } from "../../../campaign-v2/production/load.ts";
import { productionJsonLdScript, productionMetadata } from "../../../campaign-v2/production/metadata.ts";

// Live ad route, unchanged URL. Copy: campaign-v2/production/content/panchakarma.json (content worker,
// verbatim). Replaces app/(campaign)/panchkarma-treatment.html/page.tsx (its form contract is kept:
// campaign-v2/forms/adapter.ts "ahv-production").
const SLUG = "panchakarma" as const;
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

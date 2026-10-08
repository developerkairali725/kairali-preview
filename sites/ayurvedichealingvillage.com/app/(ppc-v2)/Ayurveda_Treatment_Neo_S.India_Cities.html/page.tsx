import type { Metadata } from "next";
import ProductionPage from "../../../campaign-v2/production/ProductionPage";
import { productionCampaign } from "../../../campaign-v2/production/load.ts";
import { productionJsonLdScript, productionMetadata } from "../../../campaign-v2/production/metadata.ts";

// Live ad route /Ayurveda_Treatment_Neo_S.India_Cities.html, unchanged URL (replaces app/(campaign)/Ayurveda_Treatment_Neo_S.India_Cities.html/page.tsx). Copy: campaign-v2/production/pages/south-india-cities.ts; route facts, variant and lead identity:
// campaign-v2/production/bindings.ts.
const SLUG = "south-india-cities" as const;
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

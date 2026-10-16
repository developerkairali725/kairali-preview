import type { Metadata } from "next";
import ProductionPage from "../../../../campaign-v2/production/ProductionPage";
import { productionCampaign } from "../../../../campaign-v2/production/load.ts";
import { productionJsonLdScript, productionMetadata } from "../../../../campaign-v2/production/metadata.ts";
// Train J3 (AHV-WB.514.whatsapp-message): the German page-context WhatsApp prefill (production/whatsapp-prefill.ts).
import WhatsAppPrefill from "../../../../campaign-v2/production/WhatsAppPrefill";

// Live ad route /lp/behandlung-in-kerala/, unchanged URL (replaces app/(campaign-de)/lp/behandlung-in-kerala/page.tsx). Copy: campaign-v2/production/pages/lp-behandlung-kerala.ts; route facts, variant and lead identity:
// campaign-v2/production/bindings.ts.
const SLUG = "lp-behandlung-kerala" as const;
const campaign = productionCampaign(SLUG);

export const metadata: Metadata = productionMetadata(SLUG, campaign);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: productionJsonLdScript(SLUG, campaign) }} />
      <ProductionPage c={campaign} />
      <WhatsAppPrefill locale="de" />
    </>
  );
}

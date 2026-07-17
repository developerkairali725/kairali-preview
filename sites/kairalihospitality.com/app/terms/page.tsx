import type { Metadata } from "next";
import { TermsOfService } from "@kairali/legal";
import { buildMetadata } from "@kairali/seo";
import siteConfig from "../../site.config.json";

// Boilerplate legal page — noindex (not ranking content). Text is a shared
// DRAFT pending legal review (@kairali/legal). Closes Ship Gate A12.
// Per-page canonical + own description via buildMetadata (seo-aeo-geo it.1
// WARN-1); robots stays noindex,FOLLOW — overridden after the spread
// because buildMetadata couples follow to index.
export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Terms of Use — Kairali Hospitality",
    description:
      "Terms of use for kairalihospitality.com — the Kairali Ayurvedic Group's hospitality umbrella site.",
    path: "/terms",
    siteName: "Kairali Hospitality",
  }) as Metadata),
  robots: { index: false, follow: true },
};

export default function Page() {
  return <TermsOfService facts={{ domain: siteConfig.domain, entity: siteConfig.entity, siteName: "Kairali Hospitality" }} />;
}

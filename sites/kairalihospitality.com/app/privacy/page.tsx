import type { Metadata } from "next";
import { PrivacyPolicy } from "@kairali/legal";
import { buildMetadata } from "@kairali/seo";
import siteConfig from "../../site.config.json";

// Boilerplate legal page — noindex (not ranking content). Text is a shared
// DRAFT pending legal review (@kairali/legal). Closes Ship Gate A12.
// Routed through buildMetadata for a PER-PAGE canonical + own description
// (seo-aeo-geo it.1 WARN-1: inheriting the homepage canonical on a noindex
// route is a mixed signal). robots stays noindex,FOLLOW — buildMetadata's
// index flag would couple follow to index, so it is overridden after.
export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Privacy Policy — Kairali Hospitality",
    description:
      "How kairalihospitality.com handles personal data: enquiries by email or WhatsApp, consent-first analytics, and your choices.",
    path: "/privacy",
    siteName: "Kairali Hospitality",
  }) as Metadata),
  robots: { index: false, follow: true },
};

export default function Page() {
  return <PrivacyPolicy facts={{ domain: siteConfig.domain, entity: siteConfig.entity, siteName: "Kairali Hospitality" }} />;
}

import type { Metadata } from "next";
import { PrivacyPolicy } from "@kairali/legal";
import { buildMetadata } from "@kairali/seo";
import siteConfig from "../../site.config.json";

// Boilerplate legal page — noindex (not ranking content). Shared DRAFT text
// pending legal review (@kairali/legal). Grounds the consent banner's privacy
// link (Ship Gate A12) — not a designed page, so it rides the golden-page PR.
// Per-page canonical via buildMetadata; robots overridden to noindex,FOLLOW.
export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Privacy Policy — Kairali Organics",
    description:
      "How kairaliorganic.com handles personal data: enquiries by email or WhatsApp, consent-first analytics, and your choices.",
    path: "/privacy",
    siteName: "Kairali Organics",
  }) as Metadata),
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <PrivacyPolicy
      facts={{ domain: siteConfig.domain, entity: siteConfig.entity, siteName: "Kairali Organics" }}
    />
  );
}

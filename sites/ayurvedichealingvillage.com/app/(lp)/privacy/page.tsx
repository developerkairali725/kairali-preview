import type { Metadata } from "next";
import { PrivacyPolicy } from "@kairali/legal";
import { buildMetadata } from "@kairali/seo";
import siteConfig from "../../../site.config.json";

// Boilerplate legal page (@kairali/legal draft pending legal review) —
// noindex,follow. Required LP minimum: the consent checkbox and the consent
// banner both link here (LANDING_PAGE_DOCTRINE §9 Q8).
export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Privacy Policy — Kairali, The Ayurvedic Healing Village",
    description:
      "How ayurvedichealingvillage.com handles personal data: consultation enquiries, WhatsApp contact, consent-first analytics, and your choices.",
    path: "/privacy",
    siteName: "Kairali — The Ayurvedic Healing Village",
  }) as Metadata),
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <main className="container" style={{ padding: "48px 20px" }}>
      <PrivacyPolicy
        facts={{ domain: siteConfig.domain, entity: siteConfig.entity, siteName: "Kairali — The Ayurvedic Healing Village" }}
      />
    </main>
  );
}

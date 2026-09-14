import type { Metadata } from "next";
import { TermsOfService } from "@kairali/legal";
import { buildMetadata } from "@kairali/seo";
import siteConfig from "../../../site.config.json";

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Terms of Use — Kairali, The Ayurvedic Healing Village",
    description:
      "Terms of use for ayurvedichealingvillage.com — the website of Kairali's NABH-accredited Ayurvedic hospital in Palakkad, Kerala.",
    path: "/terms",
    siteName: "Kairali — The Ayurvedic Healing Village",
  }) as Metadata),
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <main className="container" style={{ padding: "48px 20px" }}>
      <TermsOfService
        facts={{ domain: siteConfig.domain, entity: siteConfig.entity, siteName: "Kairali — The Ayurvedic Healing Village" }}
      />
    </main>
  );
}

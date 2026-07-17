import type { Metadata } from "next";
import { TermsOfService } from "@kairali/legal";
import { buildMetadata } from "@kairali/seo";
import siteConfig from "../../site.config.json";

// Boilerplate legal page — noindex (not ranking content). Text is a shared
// DRAFT pending legal review (@kairali/legal). Closes Ship Gate A12.
// it.2 (SEO audit WARN): own canonical + description via buildMetadata —
// a noindex page must not canonicalise to the homepage. noindex,follow kept.
export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Terms of Use — Kairali Yoga",
    description:
      "The terms that govern use of kairaliyoga.com, the enquiry surface for Kairali's residential yoga programmes in Palakkad, Kerala.",
    path: "/terms",
  }) as Metadata),
  robots: { index: false, follow: true },
};

export default function Page() {
  return <TermsOfService facts={{ domain: siteConfig.domain, entity: siteConfig.entity, siteName: "Kairali Yoga" }} />;
}

import type { Metadata } from "next";
import { PrivacyPolicy } from "@kairali/legal";
import { buildMetadata } from "@kairali/seo";
import siteConfig from "../../site.config.json";

// Boilerplate legal page — noindex (not ranking content). Text is a shared
// DRAFT pending legal review (@kairali/legal). Closes Ship Gate A12.
// it.2 (SEO audit WARN): own canonical + description via buildMetadata —
// a noindex page must not canonicalise to the homepage. noindex,follow kept.
export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Privacy Policy — Kairali Yoga",
    description:
      "How kairaliyoga.com handles personal data: what is collected, why, and the rights you hold. Questions reach info@kairali.com.",
    path: "/privacy",
  }) as Metadata),
  robots: { index: false, follow: true },
};

export default function Page() {
  return <PrivacyPolicy facts={{ domain: siteConfig.domain, entity: siteConfig.entity, siteName: "Kairali Yoga" }} />;
}

import type { Metadata } from "next";
import { CookiePolicy } from "@kairali/legal";
import { buildMetadata } from "@kairali/seo";
import siteConfig from "../../site.config.json";

// Boilerplate legal page — noindex (not ranking content). Text is a shared
// DRAFT pending legal review (@kairali/legal). Closes Ship Gate A12.
// Per-page canonical + own description via buildMetadata (seo-aeo-geo it.1
// WARN-1); robots stays noindex,FOLLOW — overridden after the spread
// because buildMetadata couples follow to index.
export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Cookie Policy — Kairali Hospitality",
    description:
      "How kairalihospitality.com uses cookies: nothing is stored until you choose, and analytics load only after consent.",
    path: "/cookie-policy",
    siteName: "Kairali Hospitality",
  }) as Metadata),
  robots: { index: false, follow: true },
};

export default function Page() {
  return <CookiePolicy facts={{ domain: siteConfig.domain, entity: siteConfig.entity, siteName: "Kairali Hospitality" }} />;
}

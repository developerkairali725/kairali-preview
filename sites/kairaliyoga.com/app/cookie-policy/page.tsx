import type { Metadata } from "next";
import { CookiePolicy } from "@kairali/legal";
import { buildMetadata } from "@kairali/seo";
import siteConfig from "../../site.config.json";

// Boilerplate legal page — noindex (not ranking content). Text is a shared
// DRAFT pending legal review (@kairali/legal). Closes Ship Gate A12.
// it.2 (SEO audit WARN): own canonical + description via buildMetadata —
// a noindex page must not canonicalise to the homepage. noindex,follow kept.
export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Cookie Policy — Kairali Yoga",
    description:
      "How kairaliyoga.com uses cookies: consent-first analytics that stay off until you agree, and how to change your choice at any time.",
    path: "/cookie-policy",
  }) as Metadata),
  robots: { index: false, follow: true },
};

export default function Page() {
  return <CookiePolicy facts={{ domain: siteConfig.domain, entity: siteConfig.entity, siteName: "Kairali Yoga" }} />;
}

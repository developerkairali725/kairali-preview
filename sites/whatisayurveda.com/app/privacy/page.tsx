import type { Metadata } from "next";
import { PrivacyPolicy } from "@kairali/legal";
import siteConfig from "../../site.config.json";

// Boilerplate legal page — noindex (not ranking content). Text is a shared
// DRAFT pending legal review (@kairali/legal). Closes Ship Gate A12.
export const metadata: Metadata = { title: "Privacy Policy — What is Ayurveda", robots: { index: false, follow: true } };

export default function Page() {
  return <PrivacyPolicy facts={{ domain: siteConfig.domain, entity: siteConfig.entity, siteName: "What is Ayurveda" }} />;
}

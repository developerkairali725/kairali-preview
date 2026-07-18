import type { Metadata } from "next";
import { PrivacyPolicy } from "@kairali/legal";
import siteConfig from "../../site.config.json";

export const metadata: Metadata = { title: "Privacy Policy — Bulk Ayurveda Products", robots: { index: false, follow: true } };

export default function Page() {
  return <PrivacyPolicy facts={{ domain: siteConfig.domain, entity: siteConfig.entity, siteName: "Bulk Ayurveda Products" }} />;
}

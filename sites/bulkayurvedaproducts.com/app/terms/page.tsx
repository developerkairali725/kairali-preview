import type { Metadata } from "next";
import { TermsOfService } from "@kairali/legal";
import siteConfig from "../../site.config.json";

export const metadata: Metadata = { title: "Terms of Use — Bulk Ayurveda Products", robots: { index: false, follow: true } };

export default function Page() {
  return <TermsOfService facts={{ domain: siteConfig.domain, entity: siteConfig.entity, siteName: "Bulk Ayurveda Products" }} />;
}

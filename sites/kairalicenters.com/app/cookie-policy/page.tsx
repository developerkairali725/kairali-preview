import type { Metadata } from "next";
import { CookiePolicy } from "@kairali/legal";
import siteConfig from "../../site.config.json";

export const metadata: Metadata = { title: "Cookie Policy — Kairali Ayurvedic Centres", robots: { index: false, follow: true } };

export default function Page() {
  return <CookiePolicy facts={{ domain: siteConfig.domain, entity: siteConfig.entity, siteName: "Kairali Ayurvedic Centres" }} />;
}

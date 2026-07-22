import type { Metadata } from "next";
import { CookiePolicy } from "@kairali/legal";
import { buildMetadata } from "@kairali/seo";
import siteConfig from "../../site.config.json";

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Cookie Policy — Kairali, The Ayurvedic Healing Village",
    description:
      "Cookies used on ayurvedichealingvillage.com, what they do, and how consent works — analytics load only after you agree.",
    path: "/cookie-policy",
    siteName: "Kairali — The Ayurvedic Healing Village",
  }) as Metadata),
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <main className="container" style={{ padding: "48px 20px" }}>
      <CookiePolicy
        facts={{ domain: siteConfig.domain, entity: siteConfig.entity, siteName: "Kairali — The Ayurvedic Healing Village" }}
      />
    </main>
  );
}

// Contact — locked email only. NO phone ships until Abilash confirms one
// (Q-HR-PHONE: the legacy site's number is unverified; rule 6).
import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import siteConfig from "../../site.config.json";

const EMAIL = "info@kairali.com";

export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "Contact — Healing Recipes",
  description:
    "Contact the Kairali Ayurvedic Group about Gita Ramesh's books, press, events, and stockists.",
  path: "/contact",
  siteName: "Healing Recipes",
}) as Metadata;

export default function ContactPage() {
  return (
    <main className="prose-page">
      <div className="container">
        <p className="overline">Contact</p>
        <h1>Write to us</h1>
        <div className="contact-card">
          <p>
            For anything about the books — press, the Harmony launch, events,
            bulk orders, or stockists — one address reaches the right person at
            Kairali:
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href={`mailto:${EMAIL}`} data-cta="email_click">
              {EMAIL}
            </a>
          </div>
          <p className="biblio-line" style={{ marginTop: "16px" }}>
            Kairali Ayurvedic Group · New Delhi &amp; Palakkad, Kerala, India
          </p>
        </div>
      </div>
    </main>
  );
}

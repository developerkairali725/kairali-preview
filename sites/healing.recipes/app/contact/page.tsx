// Contact — locked email + the group IVR tel: CTA (D-HR-PHONE +
// D-20260720-29 GO: legacy +91-9999231117 dropped; the group line prints).
import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import siteConfig from "../../site.config.json";

const EMAIL = "info@kairali.com";
const IVR_TEL = "tel:+919555156156";

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
          <p>
            Prefer to talk?{" "}
            <a href={IVR_TEL} data-cta="call_click">Call +91 95551 56156</a>.
          </p>
          <p className="biblio-line" style={{ marginTop: "16px" }}>
            Kairali Ayurvedic Group · New Delhi &amp; Palakkad, Kerala, India
          </p>
        </div>
      </div>
    </main>
  );
}

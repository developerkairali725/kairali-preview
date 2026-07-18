// /contact — KEEP-AS-PAGE (protection map §2d); customer-information merges in.
// CONTENT LAW (HARD GATE 6): info@kairali.com is the ONLY verified contact.
// The legacy phone (+91-9555156156) is NOT in LOCKED FACTS and is never
// printed; the legacy address fragment ("New Delhi - 110030") is incomplete /
// unverified, so NO postal address and NO map ship until the owner confirms
// one — the gaps are flagged in QUESTIONS.md, not papered over.
import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import { graph, breadcrumbList, serializeJsonLd } from "@kairali/schema";
import siteConfig from "../../site.config.json";
import { SITE_URL } from "../_lib/catalog";
import { PageHead } from "../_components/page-chrome";
import { EMAIL, SOCIALS } from "../_components/chrome";

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Contact — Kairali Equipment",
    description:
      "Reach the Kairali equipment sales team: info@kairali.com for quotes and specifications, or WhatsApp for chat-first enquiries. Quote-first, B2B.",
    path: "/contact",
    siteName: "Kairali Equipment",
  }) as Metadata),
  keywords: ["Kairali equipment contact", "ayurveda equipment enquiry"],
};

const jsonLd = graph(
  breadcrumbList({
    id: `${SITE_URL}/contact#breadcrumb`,
    items: [
      { name: "Home", url: SITE_URL },
      { name: "Contact", url: `${SITE_URL}/contact` },
    ],
  }),
);

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main>
        <PageHead
          overline="Contact"
          title="Reach the sales team"
          lede="Every enquiry lands with the sales team at info@kairali.com — specifications, dimensions and quotes come back from there."
          trail={[{ name: "Contact" }]}
          ctaLabel="Request a Quote"
          ctaHref="/request-a-quote"
        />
        <section className="section container">
          <div className="terms-grid">
            <div className="terms-card">
              <h3>Email</h3>
              <p>
                <a href={`mailto:${EMAIL}`} data-cta="email-click">{EMAIL}</a> —
                the group&rsquo;s public contact for quotes, specifications and
                trade enquiries.
              </p>
            </div>
            <div className="terms-card">
              <h3>WhatsApp</h3>
              <p>
                The WhatsApp channel lives where the design keeps it: the button
                on the <a href="/">homepage</a> hero, and the bar at the bottom
                of the screen on mobile. The pre-filled message tells us you are
                writing about equipment.
              </p>
            </div>
            <div className="terms-card">
              <h3>Quote request</h3>
              <p>
                The structured form on{" "}
                <a href="/request-a-quote">Request a quote</a> is the fastest
                route — it carries category, project type and scale straight to
                the sales team.
              </p>
            </div>
            <div className="terms-card">
              <h3>Follow the group</h3>
              <p>
                {SOCIALS.map((s, i) => (
                  <span key={s.label}>
                    {i > 0 ? " · " : ""}
                    <a href={s.href} rel="noopener">{s.label}</a>
                  </span>
                ))}
              </p>
            </div>
          </div>
          <p className="pdp-note" style={{ maxWidth: 720 }}>
            A phone line and a postal address for the equipment division will be
            published once verified — the numbers on the legacy site are not in
            the group&rsquo;s verified record, and this site prints nothing it
            cannot stand behind.
          </p>
        </section>
      </main>
    </>
  );
}

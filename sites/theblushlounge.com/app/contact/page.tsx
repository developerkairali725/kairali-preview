/**
 * /contact — WhatsApp-first contact lane (signed STRATEGY §4 booking model:
 * premium-bridal pattern, NO instant-calendar).
 * Service-area Organization schema. FACT LAW: email makeoverbysneha@gmail.com
 * and the 10:00–22:00 hours carry CONFIRM-before-launch flags (BRIEF locked
 * facts) — both stay OFF this page until confirmed. The residential address
 * stays private; the confirmed service-area model prints. The enquiry form stays off
 * production until its datastore and
 * site-specific privacy terms are approved (A12 gap, loud in the launch
 * checklist); this prevents a form that cannot safely retain or route leads.
 */
import { buildMetadata } from "@kairali/seo";
import { graph, serializeJsonLd } from "@kairali/schema";
import siteConfig from "../../site.config.json";
import { PageHeader, SiteFooter, WHATSAPP_DISPLAY, waUrl, IG_URL, IG_SCHOOL_URL } from "../_components/chrome";
import {
  OG_IMAGE_ALT,
  SITE_NAME,
  blushOrganization,
  snehaPerson,
} from "../_lib/structured-data";

export const metadata = buildMetadata(siteConfig, {
  title: "Book Bridal Makeup in Delhi — Contact Blush Lounge by Sneha",
  description:
    "WhatsApp Sneha on +91 88269 21110 for bridal, occasion and destination makeup. Client-venue service across Delhi NCR; appointments only.",
  path: "/contact",
  siteName: SITE_NAME,
  ogImage: "/og.jpg",
  ogImageAlt: OG_IMAGE_ALT,
});

const jsonLd = graph(
  snehaPerson(),
  blushOrganization(),
);

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <PageHeader current="/contact" />

      <section className="section pagehero">
        <p className="eyebrow">Contact</p>
        <h1 className="display">
          Start the <em>conversation</em>.
        </h1>
        <p className="section-lede">
          One message is all it takes — your date, your city, your occasion.
          WhatsApp reaches me fastest.
        </p>
      </section>

      <section className="section contact">
        <div className="contact__lanes contact__lanes--single">
          <div className="lane">
            <h2>WhatsApp — the fast lane</h2>
            <p>
              Your message lands with me directly. Season dates go early —
              write the moment you have yours.
            </p>
            <a className="btn btn--solid" href={waUrl("Hi Sneha, enquiring for my occasion on my date.")} data-cta="whatsapp_click" rel="noopener">
              WhatsApp Sneha · {WHATSAPP_DISPLAY}
            </a>
            <ul className="lane__meta">
              <li>
                <b>Service area</b> Delhi, New Delhi, Gurugram, Faridabad,
                Noida, Ghaziabad &amp; Greater Noida
              </li>
              <li>
                <b>Appointments</b> Client-venue service; no walk-in studio.
                Home trials only when arranged directly with Sneha.
              </li>
              <li>
                <b>Instagram</b>{" "}
                <a href={IG_URL} data-cta="ig_profile_click" rel="noopener">
                  @blushlounge_sneha
                </a>
              </li>
              <li>
                <b>The school</b>{" "}
                <a href={IG_SCHOOL_URL} data-cta="ig_profile_click" rel="noopener">
                  @blushschoolofbeauty
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}

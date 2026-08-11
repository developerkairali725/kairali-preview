/**
 * /contact — WhatsApp-first contact lane (signed STRATEGY §4 booking model:
 * premium-bridal pattern, NO instant-calendar).
 * BeautySalon LocalBusiness schema. FACT LAW: email makeoverbysneha@gmail.com
 * and the 10:00–22:00 hours carry CONFIRM-before-launch flags (BRIEF locked
 * facts) — both stay OFF this page until confirmed; WhatsApp + the Shivalik
 * address are owner-ruled/mined facts and print. The enquiry form stays off
 * production until its datastore and
 * site-specific privacy terms are approved (A12 gap, loud in the launch
 * checklist); this prevents a form that cannot safely retain or route leads.
 */
import { buildMetadata } from "@kairali/seo";
import { localBusiness, person, graph, serializeJsonLd } from "@kairali/schema";
import siteConfig from "../../site.config.json";
import { PageHeader, SiteFooter, WHATSAPP_DISPLAY, waUrl, IG_URL, IG_SCHOOL_URL } from "../_components/chrome";

const SITE_URL = `https://${siteConfig.domain}`;

export const metadata = buildMetadata(siteConfig, {
  title: "Book Bridal Makeup in Delhi — Contact Blush Lounge by Sneha",
  description:
    "WhatsApp Sneha on +91 88269 21110 for bridal, occasion and destination makeup enquiries. Blush Lounge, Shivalik, New Delhi — Delhi & worldwide.",
  path: "/contact",
  siteName: "Blush Lounge — Makeup by Sneha",
  ogImage: "/og.jpg",
});

const jsonLd = graph(
  person({ id: `${SITE_URL}/#sneha`, name: "Sneha Chowdhary", jobTitle: "Beauty, Bridal & SFX Makeup Artist", url: SITE_URL, sameAs: [IG_URL] }),
  localBusiness({
    id: `${SITE_URL}/#studio`,
    type: "BeautySalon",
    name: "Blush Lounge — Makeup by Sneha",
    url: SITE_URL,
    telephone: "+91 88269 21110",
    address: { addressLocality: "Shivalik, New Delhi", addressRegion: "Delhi", addressCountry: "IN" },
  }),
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
                <b>Studio</b> Shivalik, New Delhi · Delhi &amp; worldwide
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

/**
 * /services — ONE page, anchored sections (the signed STRATEGY kills the old
 * duplicate-content problem: five 2018 pages shared one boilerplate block).
 * Every section speaks in HER voice with its OWN copy; price-on-enquiry per
 * section (NO numeric prices anywhere — HARD GATE 6, no trusted source).
 * The booking-mechanics section (#booking) answers beauty B18: mystery is
 * never vagueness — the process is stated from the mined legacy facts
 * (consultation → trial → function; on-site; airbrush/HD; international
 * products; nail technician on request).
 */
import { buildMetadata } from "@kairali/seo";
import { graph, serializeJsonLd, service } from "@kairali/schema";
import Image from "next/image";
import siteConfig from "../../site.config.json";
import { PageHeader, SiteFooter, WHATSAPP_DISPLAY, waUrl } from "../_components/chrome";
import {
  OG_IMAGE_ALT,
  SERVICE_AREAS,
  SITE_NAME,
  SITE_URL,
  SNEHA_ID,
  snehaPerson,
} from "../_lib/structured-data";

export const metadata = buildMetadata(siteConfig, {
  title: "Bridal & Occasion Makeup Services in Delhi | Blush Lounge",
  description:
    "Bridal, engagement, cocktail, party, editorial-SFX and grooming services by Sneha Chowdhary — airbrush or HD, at your venue. Dates and quotes on enquiry.",
  path: "/services",
  siteName: SITE_NAME,
  ogImage: "/og.jpg",
  ogImageAlt: OG_IMAGE_ALT,
});

const jsonLd = graph(
  snehaPerson(),
  service({
    id: `${SITE_URL}/services#makeup-artistry`,
    name: "Makeup artistry by Sneha Chowdhary",
    description:
      "Bridal, engagement, cocktail, party, editorial, SFX and grooming services provided at client venues, with destination work by enquiry.",
    url: `${SITE_URL}/services`,
    providerId: SNEHA_ID,
    serviceType: "Bridal, occasion, editorial and SFX makeup artistry",
    areaServed: SERVICE_AREAS,
  }),
);

const services = [
  {
    id: "bridal",
    name: "Bridal",
    lede: "Your wedding face is the one photograph that never stops being looked at — I treat it that way.",
    body: [
      "We start one-on-one: your outfit, your jewellery, your venue's light, and what YOU mean when you say natural. Then the trial — an honest working session where I study your skin, test the base (airbrush or HD, whichever your skin argues for) and build the look with you watching.",
      "On the day I arrive where you're getting ready, with international-grade products and time built in for the moments that always run late. The look is made to hold from the first ritual to the last dance — and to still look like you in every frame between.",
    ],
    prefill: "Hi Sneha, enquiring for bridal makeup on my date.",
  },
  {
    id: "engagement-cocktail",
    name: "Engagement & Cocktail",
    lede: "The nights around the wedding deserve their own language — softer, dewier, a little more daring.",
    body: [
      "Engagements and cocktails photograph differently from the wedding itself: evening light, sequins, movement. I keep the skin dewy and luminous, sculpt the eyes for low light, and stop before the look turns heavy. Soft glamour with just the right amount of drama — your words back to you.",
    ],
    prefill: "Hi Sneha, enquiring for engagement or cocktail makeup on my date.",
  },
  {
    id: "party",
    name: "Party & Occasion",
    lede: "Receptions, festivals, anniversaries — polished looks that last the evening and feel like you.",
    body: [
      "Fresh skin, precise definition and a finish that survives a warm Delhi evening. Tell me the occasion and the outfit; I'll tell you what the look needs and how long we'll want you in the chair.",
    ],
    prefill: "Hi Sneha, enquiring for party or occasion makeup on my date.",
  },
  {
    id: "editorial-sfx",
    name: "Editorial & SFX",
    lede: "Cinema Makeup School–trained work for shoots, campaigns and the covers in between.",
    body: [
      "Editorial faces, fantasy and special effects — built for the camera, the brief and the light you're shooting in. For shoots and campaigns, share the concept and the shot list; I'll come back with the approach and what it needs.",
    ],
    prefill: "Hi Sneha, enquiring for an editorial or SFX project.",
  },
  {
    id: "grooming-men",
    name: "Grooming for Men",
    lede: "Clean, camera-ready grooming for grooms and events — precise, natural, never obvious.",
    body: [
      "Grooms photograph in every frame too. Skin evened, shine controlled, nothing that reads as makeup — just the best version of how you already look.",
    ],
    prefill: "Hi Sneha, enquiring for groom or men's grooming on my date.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <PageHeader current="/services" />

      <section className="section pagehero services-page-hero">
        <div className="services-page-hero__copy">
          <p className="eyebrow">Services</p>
          <h1 className="display">
            Every occasion has a <em>face</em>. Let&rsquo;s design yours.
          </h1>
          <p className="section-lede">
            Bridal to editorial, one standard: luminous skin, precise structure,
            and a look that&rsquo;s unmistakably you. Your enquiry goes straight
            to Sneha — dates and quotes on enquiry.
          </p>
        </div>

        <div className="services-page-hero__gallery" aria-label="Selected makeup looks by Sneha Chowdhary">
          <figure className="services-page-hero__look services-page-hero__look--feature">
            <Image
              src="/images/portfolio-bridal.jpg"
              alt="Red bridal look with luminous skin and softly defined eyes by Sneha Chowdhary"
              fill
              priority
              fetchPriority="high"
              quality={68}
              sizes="(max-width: 900px) 62vw, 34vw"
            />
            <figcaption>Bridal</figcaption>
          </figure>
          <figure className="services-page-hero__look services-page-hero__look--occasion">
            <Image
              src="/images/portfolio-fresh-glam.jpg"
              alt="Fresh occasion makeup with dewy skin and precise definition by Sneha Chowdhary"
              fill
              loading="eager"
              quality={65}
              sizes="(max-width: 900px) 38vw, 18vw"
            />
            <figcaption>Occasion</figcaption>
          </figure>
          <figure className="services-page-hero__look services-page-hero__look--editorial">
            <Image
              src="/images/portfolio-sculpted-glam.jpg"
              alt="Sculpted camera-ready glamour by Sneha Chowdhary"
              fill
              loading="lazy"
              quality={65}
              sizes="(max-width: 900px) 38vw, 18vw"
            />
            <figcaption>Editorial</figcaption>
          </figure>
        </div>
      </section>

      {services.map((s, i) => (
        <div key={s.id} className={i % 2 === 1 ? "services" : undefined}>
          <section className="section svc" id={s.id}>
            <div className="svc__head">
              <p className="eyebrow">{s.name}</p>
              <h2 className="display">{s.lede}</h2>
            </div>
            <div className="svc__body">
              {s.body.map((p) => (
                <p key={p.slice(0, 24)} className="approach__body">
                  {p}
                </p>
              ))}
              <div className="ctas">
                <a className="btn btn--solid" href={waUrl(s.prefill)} data-cta="whatsapp_click" rel="noopener">
                  Price on enquiry · WhatsApp
                </a>
              </div>
            </div>
          </section>
        </div>
      ))}

      {/* ---------- how bookings work (beauty B18: mystery ≠ vagueness) ---- */}
      <div className="academy">
        <section className="section" id="booking">
          <div>
            <p className="eyebrow">How bookings work</p>
            <h2 className="display">Simple, stated, no surprises.</h2>
            <ol className="steps">
              <li>
                <b>One message.</b> Your date, your city, your occasion — on
                WhatsApp or through the contact page. You&rsquo;ll get what&rsquo;s
                possible and what it costs, from Sneha directly.
              </li>
              <li>
                <b>The trial.</b> For bridal work: a one-on-one session where
                the look is designed on your face — base tested (airbrush or
                HD), skin assessed, every detail of outfit and jewellery
                considered.
              </li>
              <li>
                <b>Your day.</b> The kit travels to you — home, hotel or venue,
                Delhi or a destination. International-grade products; a
                schedule built around your functions, not the other way round.
              </li>
            </ol>
            <p className="approach__body">
              Dates are confirmed on booking, season slots go early, and
              quotes are shared in the conversation — no rate card on a page,
              because no two occasions need the same things.
            </p>
          </div>
        </section>
      </div>

      <section className="close-cta">
        <div className="script-accent" aria-hidden="true">
          your date, your look
        </div>
        <h2 className="display">
          Tell me your <em>occasion</em>.
        </h2>
        <p>
          One conversation to plan everything — from the trial to the final
          touch-up. Dates and quotes on enquiry.
        </p>
        <div className="ctas">
          <a className="btn btn--solid" href={waUrl("Hi Sneha, enquiring for my occasion on my date.")} data-cta="whatsapp_click" rel="noopener">
            WhatsApp Sneha · {WHATSAPP_DISPLAY}
          </a>
          <a className="btn btn--line" href="/contact" data-cta="enquiry_open">
            Send an enquiry
          </a>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}

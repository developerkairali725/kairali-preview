/**
 * /academy — Blush School of Beauty (signed STRATEGY sitemap). The education
 * arm is both revenue and authority; enquiry funnel ONLY (no checkout — BRIEF
 * out-of-scope). Offer names are HER OWN mined vocabulary (IG bio: "Pro
 * Certification @blushschoolofbeauty"; highlights: ONLINE CLASSES · PRO
 * Course). No dates, durations, fees or seat counts are stated anywhere —
 * none exist in a trusted source (HARD GATE 6): the conversation carries them.
 * Course schema per STRATEGY §4.
 */
import Image from "next/image";
import { buildMetadata } from "@kairali/seo";
import { course, graph, organization, serializeJsonLd } from "@kairali/schema";
import siteConfig from "../../site.config.json";
import { PageHeader, SiteFooter, waUrl, IG_SCHOOL_URL } from "../_components/chrome";
import {
  OG_IMAGE_ALT,
  SCHOOL_ID,
  SITE_NAME,
  SITE_URL,
  snehaPerson,
} from "../_lib/structured-data";

export const metadata = buildMetadata(siteConfig, {
  title: "Blush School of Beauty — Makeup Courses by Sneha Chowdhary",
  description:
    "Online bridal masterclasses, the PRO certification course and self-makeup classes — learn Sneha Chowdhary's approach from Delhi to wherever you are.",
  path: "/academy",
  siteName: SITE_NAME,
  ogImage: "/og.jpg",
  ogImageAlt: OG_IMAGE_ALT,
});

const jsonLd = graph(
  snehaPerson(),
  organization({
    id: SCHOOL_ID,
    name: "Blush School of Beauty",
    url: `${SITE_URL}/academy`,
    sameAs: [IG_SCHOOL_URL],
  }),
  course({
    id: `${SITE_URL}/academy#pro-course`,
    name: "Blush School of Beauty — PRO Course",
    description: "Sneha Chowdhary's professional makeup course: her complete approach to skin, structure and signature looks, taught online.",
    url: `${SITE_URL}/academy`,
    providerId: SCHOOL_ID,
    courseMode: "online",
    inLanguage: "en",
  }),
);

const offers = [
  {
    name: "Online bridal masterclasses",
    copy: "One-day, single-subject deep dives — my complete approach to a signature bridal look, live and online. Watch the process, ask while I work, leave with the method.",
    prefill: "Hi Sneha, I'd like to know about the next online bridal masterclass.",
  },
  {
    name: "PRO course",
    copy: "The full professional programme — my Pro Certification track: skin theory, base architecture, eye structure, and the discipline of doing it clean under real timelines. For artists building a career, taught online from Delhi to wherever you are.",
    prefill: "Hi Sneha, I'd like to know about the PRO course.",
  },
  {
    name: "Self-makeup classes",
    copy: "Not an artist — just your own face, done properly. Small, practical sessions on the skin you actually have and the occasions you actually attend.",
    prefill: "Hi Sneha, I'd like to know about self-makeup classes.",
  },
];

export default function AcademyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <PageHeader current="/academy" />

      <section className="section pagehero">
        <p className="eyebrow">Blush School of Beauty</p>
        <h1 className="display">
          Learn the craft behind the <em>calm</em>.
        </h1>
        <p className="section-lede">
          The same approach I use on my brides, taught the way I wish someone
          had taught me. Two arms, one standard — Blush Lounge artistry and
          Blush School classes, from Delhi to wherever you are.
        </p>
      </section>

      <section className="section academy-media">
        <figure style={{ margin: 0 }}>
          <Image
            src="/images/academy-pro-course.jpg"
            alt="Inside the Blush School of Beauty — Sneha Chowdhary teaching the Online Pro Course"
            width={1100}
            height={1375}
            sizes="(max-width: 900px) 100vw, 46vw"
            priority
          />
        </figure>
        <figure style={{ margin: 0 }}>
          <Image
            src="/images/academy-masterclass.jpg"
            alt="Bridal masterclass look — Blush School of Beauty, taught by Sneha Chowdhary"
            width={1100}
            height={1375}
            sizes="(max-width: 900px) 100vw, 46vw"
            loading="lazy"
          />
        </figure>
      </section>

      <div className="academy">
        <section className="section" id="classes">
          <div style={{ maxWidth: 760 }}>
            <p className="eyebrow">What you can learn</p>
            <h2 className="display">Three ways in.</h2>
            <div className="offers">
              {offers.map((o) => (
                <div className="offer" key={o.name}>
                  <h3>{o.name}</h3>
                  <p>{o.copy}</p>
                  <a className="btn btn--ivory" href={waUrl(o.prefill)} data-cta="academy_enquiry" rel="noopener">
                    Enquire about this
                  </a>
                </div>
              ))}
            </div>
            <p className="approach__body" style={{ marginTop: 28 }}>
              Schedules, formats and fees are shared on enquiry — classes are
              announced on{" "}
              <a className="academy__link" href={IG_SCHOOL_URL} data-cta="ig_profile_click" rel="noopener">
                @blushschoolofbeauty
              </a>
              , and every enquiry is answered personally.
            </p>
          </div>
        </section>
      </div>

      <section className="close-cta">
        <div className="script-accent" aria-hidden="true">
          learn it properly
        </div>
        <h2 className="display">
          Your seat is one <em>message</em> away.
        </h2>
        <p>
          Tell me where you are in your journey — beginner, working artist, or
          just your own face — and I&rsquo;ll tell you which class fits.
        </p>
        <div className="ctas">
          <a className="btn btn--solid" href={waUrl("Hi Sneha, I'd like to join a Blush School of Beauty class.")} data-cta="academy_enquiry" rel="noopener">
            WhatsApp the school
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

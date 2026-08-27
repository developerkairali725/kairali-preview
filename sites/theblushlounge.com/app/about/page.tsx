/**
 * /about — Sneha's story (signed STRATEGY sitemap): Chandini Singh training →
 * Scandinavian Makeup Academy → Cinema Makeup School LA → MAC Bridal · press
 * features · destination list · Person schema (the AEO entity answer —
 * STRATEGY §3 counters the listicle SERP with the entity, not a listicle).
 * Every biographical fact is mined (legacy about page + IG bio capture) or
 * owner-locked (BRIEF facts table). Destination cities render as an editorial
 * list — no map graphic exists to source and none is invented.
 */
import Image from "next/image";
import { buildMetadata } from "@kairali/seo";
import { graph, serializeJsonLd } from "@kairali/schema";
import siteConfig from "../../site.config.json";
import { PageHeader, SiteFooter, WHATSAPP_DISPLAY, waUrl } from "../_components/chrome";
import { OG_IMAGE_ALT, SITE_NAME, snehaPerson } from "../_lib/structured-data";

export const metadata = buildMetadata(siteConfig, {
  title: "About Sneha Chowdhary — Bridal & SFX Makeup Artist, Delhi",
  description:
    "Cinema Makeup School LA certified, MAC Bridal collaborator, featured by Femina and Grazia — the story behind Blush Lounge, Delhi to destination weddings.",
  path: "/about",
  siteName: SITE_NAME,
  ogImage: "/og.jpg",
  ogImageAlt: OG_IMAGE_ALT,
});

const jsonLd = graph(snehaPerson());

const path = [
  {
    stage: "The foundation",
    copy: "I started the way serious artists do — as a student. Courses with Chandini Singh, then the Scandinavian Makeup Academy: colour theory, skin-tone management, the unglamorous discipline underneath every glamorous face.",
  },
  {
    stage: "Cinema Makeup School, Los Angeles",
    copy: "LA rewired what I thought makeup could do — editorial, fantasy, stage and special effects at film-industry standard. It's why my bridal work photographs the way it does: the camera was always the client.",
  },
  {
    stage: "MAC Bridal · Femina · Grazia",
    copy: "Collaborating on MAC Bridal and being featured by Femina and Grazia put my work in the rooms I'd grown up reading about — and taught me the press-shoot pace that wedding mornings secretly run on.",
  },
  {
    stage: "Blush Lounge & Blush School of Beauty",
    copy: "Today Blush Lounge is my artistry practice — Delhi first, the world when the wedding travels — and Blush School of Beauty is where I teach it: online masterclasses, a PRO course, and self-makeup classes.",
  },
];

const cities = ["Delhi", "Bali", "Budapest", "London", "Bodrum", "Hong Kong", "Cannes"];

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <PageHeader current="/about" />

      <section className="section pagehero">
        <p className="eyebrow">About Sneha</p>
        <h1 className="display">
          The face was always my <em>canvas</em>.
        </h1>
        <p className="section-lede">
          I&rsquo;m Sneha Chowdhary — beauty, bridal and SFX artist. Blush
          Lounge is what happens when a lifelong obsession with faces meets
          film-school discipline and years of wedding mornings.
        </p>
      </section>

      <section className="section approach about-intro">
        <div className="approach__media">
          <Image
            src="/images/about-sneha.jpg"
            alt="Sneha Chowdhary — founder of Blush Lounge and Blush School of Beauty"
            width={800}
            height={800}
            sizes="(max-width: 900px) 100vw, 40vw"
            priority
          />
        </div>
        <div>
          <p className="approach__quote">
            &ldquo;My goal is simple: that you look like the very best version
            of yourself — not like someone else&rsquo;s idea of a bride.&rdquo;
          </p>
          <p className="approach__body">
            Every look I build starts with who you already are. I study the
            skin before I touch it, design at the trial, and stop before the
            look stops being you. That restraint is the whole craft.
          </p>
        </div>
      </section>

      <div className="services">
        <section className="section" id="path">
          <div className="section__head">
            <p className="eyebrow">The path</p>
            <h2 className="display">
              Trained, tested, <em>travelled</em>.
            </h2>
          </div>
          <div className="path">
            {path.map((p) => (
              <div className="path__step" key={p.stage}>
                <h3>{p.stage}</h3>
                <p>{p.copy}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="section" id="destinations">
        <div className="section__head">
          <p className="eyebrow">Where the work has taken me</p>
          <h2 className="display">
            Wherever the wedding <em>is</em>.
          </h2>
        </div>
        <p className="cities" aria-label="Cities Sneha has worked in">
          {cities.map((c, i) => (
            <span key={c}>
              {c}
              {i < cities.length - 1 ? <span className="cities__dot"> · </span> : null}
            </span>
          ))}
        </p>
        <p className="approach__body">
          Base: Delhi NCR. If your wedding travels, so does the kit —
          destination dates are planned early, so write the moment you have
          yours.
        </p>
      </section>

      <section className="close-cta">
        <div className="script-accent" aria-hidden="true">
          let&rsquo;s meet properly
        </div>
        <h2 className="display">
          Your date deserves a <em>face</em> plan.
        </h2>
        <p>
          Tell me your date and your city — I&rsquo;ll come back with
          what&rsquo;s possible and what it needs.
        </p>
        <div className="ctas">
          <a className="btn btn--solid" href={waUrl("Hi Sneha — I read your story and I'd like to enquire for my date.")} data-cta="whatsapp_click" rel="noopener">
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

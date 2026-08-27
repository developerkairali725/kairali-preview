import Image from "next/image";
import { buildMetadata } from "@kairali/seo";
import { article, breadcrumbList, graph, serializeJsonLd } from "@kairali/schema";
import siteConfig from "../../../site.config.json";
import { Breadcrumbs } from "../../_components/breadcrumbs";
import { PageHeader, SiteFooter, WHATSAPP_DISPLAY, waUrl } from "../../_components/chrome";
import {
  OG_IMAGE_ALT,
  BUSINESS_ID,
  SITE_NAME,
  SITE_URL,
  SNEHA_ID,
  snehaPerson,
} from "../../_lib/structured-data";
const ARTICLE_PATH = "/journal/makeup-colour-correction-guide";
const ARTICLE_URL = `${SITE_URL}${ARTICLE_PATH}`;
const TITLE = "A Simple Guide to Makeup Colour Correction";

export const metadata = buildMetadata(siteConfig, {
  title: "Makeup Colour Correction Guide | Blush Lounge",
  description:
    "Learn how peach, orange, green and lavender correctors work, when to use them, and why less product gives bridal makeup a cleaner finish.",
  path: ARTICLE_PATH,
  siteName: SITE_NAME,
  ogImage: "/og.jpg",
  ogImageAlt: OG_IMAGE_ALT,
  ogType: "article",
});

const jsonLd = graph(
  snehaPerson(),
  article({
    id: `${ARTICLE_URL}#article`,
    headline: TITLE,
    url: ARTICLE_URL,
    authorId: SNEHA_ID,
    publisherId: BUSINESS_ID,
    datePublished: "2026-08-11",
    dateModified: "2026-08-11",
    image: `${SITE_URL}/images/portfolio-soft-precision.jpg`,
    inLanguage: "en-IN",
  }),
  breadcrumbList({
    id: `${ARTICLE_URL}#breadcrumb`,
    items: [
      { name: "Home", url: SITE_URL },
      { name: "Journal", url: `${SITE_URL}/journal` },
      { name: TITLE, url: ARTICLE_URL },
    ],
  }),
);

export default function ColourCorrectionGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <PageHeader current="/journal" />

      <main>
        <article className="article-shell">
          <header className="section article-head">
            <Breadcrumbs
              items={[
                { href: "/", label: "Home" },
                { href: "/journal", label: "Journal" },
                { label: "Colour correction" },
              ]}
            />
            <p className="eyebrow">Makeup technique</p>
            <h1 className="display">{TITLE}</h1>
            <p className="article-deck">
              Corrector is not an extra layer of coverage. Used precisely, it
              lets the foundation do less — which is why the finished skin can look cleaner, lighter and more like you.
            </p>
            <div className="article-byline">
              <span>By Sneha Chowdhary</span>
              <time dateTime="2026-08-11">Updated 11 August 2026</time>
              <span>7 minute read</span>
            </div>
          </header>

          <figure className="article-image">
            <Image
              src="/images/portfolio-soft-precision.jpg"
              alt="A softly corrected, camera-ready makeup finish by Sneha Chowdhary"
              width={506}
              height={900}
              sizes="(max-width: 900px) 100vw, 720px"
              priority
            />
            <figcaption>Correction should disappear into the finished skin, not sit above it.</figcaption>
          </figure>

          <div className="article-body">
            <p className="article-origin">
              This is a fully rewritten 2026 edition of Blush Lounge&rsquo;s original May 2018 colour-correction note.
            </p>

            <h2>First: correct colour, then decide how much coverage you need</h2>
            <p>
              Foundation can even the complexion, but it is not always the best tool for cancelling a strong patch of colour.
              If blue-grey under-eyes, visible redness or deeper pigmentation are covered only with foundation and concealer,
              the instinct is often to add more. That can make the base thicker while the unwanted tone still shows through.
            </p>
            <p>
              Colour correction works differently. A small amount of an opposing tone visually neutralises the area before
              foundation. Once the colour is quieter, the complexion product has a simpler job. The aim is not a painted,
              perfectly uniform face. The aim is balanced skin that still has dimension.
            </p>

            <aside className="article-callout">
              <strong>The short version</strong>
              <p>
                Put corrector only where the competing colour exists, blend its edges, and stop before the corrector itself becomes visible.
              </p>
            </aside>

            <h2>What the main corrector colours do</h2>

            <h3>Peach and orange</h3>
            <p>
              Peach-to-orange tones help soften the appearance of blue, purple and grey-brown areas. A soft peach can suit
              lighter complexions; richer peach, apricot or orange often works better as skin depth increases. Under the eyes,
              around the mouth or over a concentrated dark patch, the exact depth matters more than the colour name on the tube.
            </p>

            <h3>Green</h3>
            <p>
              Green can visually reduce surface redness. It should be used in the smallest possible amount and only on the red area.
              A green wash across the whole face can turn the complexion flat or grey. Corrector changes how colour looks; it does
              not treat the cause of redness or irritation.
            </p>

            <h3>Lavender</h3>
            <p>
              Lavender can lift a yellow or sallow cast and bring back a little brightness. It is usually more useful as a sheer,
              targeted veil than as an opaque spot corrector. On many complexions it is unnecessary, so this is one to judge in
              real light rather than add by habit.
            </p>

            <h3>Yellow</h3>
            <p>
              Yellow can soften purple or blue tones and can be useful around subtle under-eye shadowing. Because yellow is already
              present in many foundations and concealers, the extra step is only helpful when it creates a visible improvement.
            </p>

            <h2>How I keep correction invisible</h2>
            <ol>
              <li>
                <strong>Prepare the skin.</strong> Corrector catches on dry texture. I begin with suitable hydration and allow skincare to settle.
              </li>
              <li>
                <strong>Read the colour in daylight.</strong> Warm dressing-room bulbs can make blue and red tones look very different.
              </li>
              <li>
                <strong>Use a pin-point amount.</strong> I place product only over the discolouration, then soften the edge without spreading it everywhere.
              </li>
              <li>
                <strong>Layer complexion product lightly.</strong> Pressing, rather than rubbing, helps keep the correction in the right place.
              </li>
              <li>
                <strong>Check the camera.</strong> Bridal and editorial makeup must work in person, in daylight, under venue light and with flash.
              </li>
            </ol>

            <p>
              There is no automatic need to use every colour, or any colour at all. Some skin needs a touch of peach under one eye;
              some needs nothing beyond a well-matched concealer. The best correction is the one nobody can identify afterwards.
            </p>

            <h2>Three common mistakes</h2>
            <ul>
              <li>
                <strong>Using a corrector that is too pale.</strong> It can turn a deeper area ashy instead of neutralising it.
              </li>
              <li>
                <strong>Applying it everywhere.</strong> Correction is placement work. Covering unaffected skin adds texture without adding value.
              </li>
              <li>
                <strong>Trying to hide texture with colour.</strong> Corrector can balance tone, but it cannot erase skin texture — and a beautiful base does not need to.
              </li>
            </ul>

            <h2>For a bridal trial, bring the real conditions with you</h2>
            <p>
              A useful trial is not simply a preview of a finished look. It is where we see how your skin behaves, whether HD or
              airbrush is the better route, how much correction is actually needed, and how the finish responds to your outfit,
              jewellery and photography. If you have reference photographs, bring examples of what you like and what you do not.
              Both are equally helpful.
            </p>
            <p>
              Also tell your artist about any known sensitivities and stop using a product if it causes discomfort. Makeup advice
              is not medical treatment; active or persistent skin concerns belong with a qualified healthcare professional.
            </p>

            <div className="article-links" aria-label="Related pages">
              <a href="/services#bridal">Explore bridal makeup services</a>
              <a href="/portfolio">See recent makeup work</a>
              <a href="/contact">Plan a trial or destination booking</a>
            </div>
          </div>
        </article>

        <section className="close-cta">
          <div className="script-accent" aria-hidden="true">your skin, thoughtfully read</div>
          <h2 className="display">Planning your <em>trial</em>?</h2>
          <p>Share your date, city and occasion with Sneha. Every quote and recommendation is tailored to the actual brief.</p>
          <div className="ctas">
            <a
              className="btn btn--solid"
              href={waUrl("Hi Sneha, I would like to plan a bridal makeup trial for my date.")}
              data-cta="whatsapp_click"
              rel="noopener"
            >
              WhatsApp Sneha · {WHATSAPP_DISPLAY}
            </a>
            <a className="btn btn--line" href="/services#bridal">Bridal services</a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

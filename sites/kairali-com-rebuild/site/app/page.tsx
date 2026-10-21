import Link from "next/link";
import type { Metadata } from "next";
import { getPage, photos, extra } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { HOME_H1, SUB_BRANDS } from "@/lib/site";
import { Photograph } from "@/components/Bits";
import { ArrowGlyph, Hairline, LeafSpray, Mandala, Num, Orn } from "@/components/Ornament";
import Prose from "@/components/Prose";

// Home: every block of the live home copy is rendered (source: kairali.com home capture, 29 Sep 2026),
// composed in the Premium v3 home sequence and re-skinned to Premium v4 (owner approval, 19 Oct 2026).
// Section order, copy, headings, links and image selection are unchanged. H1 per owner decision Q3.
export const metadata: Metadata = buildMetadata({
  route: "/",
  title: "Kairali Ayurvedic Group | Health through Ayurveda since 1908",
  description: "Kairali Ayurvedic Group: four generations of Ayurveda since 1908. The Ayurvedic Healing Village in Palakkad, Villa Raag in Goa, products and training.",
  image: "/og/ahv-grounds-pond.jpg",
});

const strip = (html: string, re: RegExp) => html.replace(re, "");
const imgs = (html: string) => [...html.matchAll(/<img[^>]*>/g)].map((m) => m[0]);
const linkText = (html: string) =>
  [...html.matchAll(/<p><a href="[^"]+">([^<]+(?:<br\/?>[^<]+)?)<\/a><\/p>/g)].map((m) => m[1].replace(/<br\/?>/g, " ").replace(/\s+/g, " ").trim()).find((t) => !/^read more$/i.test(t)) || "";
/** Renders the H1 string unchanged, with the word "Ayurveda" set in gold italic (presentation only). */
const heroTitle = (t: string) => t.split(/(Ayurveda)/).map((part, i) => (part === "Ayurveda" ? <em key={i}>{part}</em> : part));
/** Italic accent on the closing words of the Villa Raag heading (presentation only; text unchanged). */
const raagTitle = (t: string) => { const i = t.indexOf("the Arabian Sea"); return i < 0 ? t : <>{t.slice(0, i)}<em>{t.slice(i)}</em></>; };

export default function Home() {
  const home = getPage("/")!;
  const ph = photos();
  const s = home.sections;
  const [group, hvText, hvMosaic, prodText, prodMosaic, centreText, centreMosaic, trainText, trainMosaic] = s;
  const ev = extra<{ recognitions: { title: string; url: string; published: string }[] }>("events.json");
  const locations = getPage("/locations.aspx")!;
  const cities = [...locations.sections.map((x) => x.html).join(" ").matchAll(/<h2 id="[^"]*">([^<]+)<\/h2>|<h2>([^<]+)<\/h2>/g)].map((m) => (m[1] || m[2]).trim()).filter((c, i, a) => c && c !== "Others" && a.indexOf(c) === i);
  const bodyOf = (html: string) => strip(strip(html, /<h2>[^<]*<\/h2>/), /<p><a href="[^"]+">Read more\s*<\/a><\/p>/);
  const fmt = (d: string) => new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  return (
    <>
      <link rel="preload" as="image" type="image/webp" href="/media/photo/ahv-grounds-pond-480.webp" media="(max-width: 479px)" fetchPriority="high" />
      <link rel="preload" as="image" type="image/webp" href="/media/photo/ahv-grounds-pond-1600.webp" media="(min-width: 768px)" fetchPriority="high" />
      <section className="home-hero opener" aria-labelledby="page-title">
        <div className="opener-media">
          <picture className="hero-media">
            <source media="(max-width: 479px)" srcSet="/media/photo/ahv-grounds-pond-480.webp" />
            <img
              src="/media/photo/ahv-grounds-pond-1600.webp"
              srcSet="/media/photo/ahv-grounds-pond-640.webp 640w, /media/photo/ahv-grounds-pond-1024.webp 1024w, /media/photo/ahv-grounds-pond-1600.webp 1600w, /media/photo/ahv-grounds-pond-2200.webp 2200w"
              sizes="100vw"
              width="2200"
              height="1467"
              alt="Lawns and a lily pond at Kairali – The Ayurvedic Healing Village, Palakkad"
              loading="eager"
              decoding="sync"
              fetchPriority="high"
            />
          </picture>
        </div>
        <Mandala />
        <span className="hero-rule" aria-hidden="true" />
        <div className="opener-panel"><div className="container">
          <div className="opener-card">
            <p className="overline on-dark"><span>Established 1908</span> · <span>Four generations</span></p>
            <h1 id="page-title">{heroTitle(HOME_H1)}</h1>
            <p className="lede">A family tradition bringing authentic Ayurveda to doctor-led care, restorative stays, trusted products and professional learning.</p>
            <div className="actions"><Link className="btn" href="/ayurveda" data-cta="explore-ayurveda">Discover Ayurveda</Link><Link className="btn ghost-dark" href="/hospitality">Explore Kairali stays</Link></div>
          </div>
        </div></div>
        <div className="hero-scroll" aria-hidden="true"><span>Scroll</span><span /></div>
      </section>

      <section className="heritage-strip tex dark" aria-label="Kairali at a glance">
        <Hairline />
        <div className="container heritage-grid">
          <div><strong>1908</strong><span>A family tradition begins</span></div>
          <div><strong>4</strong><span>Generations of Ayurveda</span></div>
          <div><strong>Palakkad</strong><span>Home of the Healing Village</span></div>
          <div><strong>One group</strong><span>Care, stays, products &amp; learning</span></div>
        </div>
        <Hairline />
      </section>

      <section className="section home-pathways tex" aria-labelledby="pathways-title">
        <Num n="01" />
        <LeafSpray />
        <div className="container">
          <header className="section-intro">
            <span className="overline">Begin your journey</span>
            <h2 id="pathways-title">Experience Kairali in the way that suits you</h2>
            <Orn narrow />
            <p>Explore the group through four clear paths, each grounded in Kairali&apos;s Ayurvedic heritage.</p>
          </header>
          <div className="pathway-grid">
            <Link className="pathway-card" href="/ayurvedic-healing-village">
              <span className="pathway-photo"><Photograph k="ahv-treatment-room" p={ph["ahv-treatment-room"]} sizes="(min-width: 900px) 25vw, 50vw" /></span>
              <span className="pathway-copy"><small>Doctor-led Ayurveda</small><strong>Healing &amp; wellbeing</strong><span>Explore the Ayurvedic Healing Village</span></span>
            </Link>
            <Link className="pathway-card" href="/hospitality">
              <span className="pathway-photo"><Photograph k="raag-facade" p={ph["raag-facade"]} sizes="(min-width: 900px) 25vw, 50vw" /></span>
              <span className="pathway-copy"><small>Kairali stays</small><strong>Retreats &amp; hospitality</strong><span>Find a restorative Kairali experience</span></span>
            </Link>
            <Link className="pathway-card" href="/ayurvedic-products">
              <span className="pathway-photo contain"><Photograph k="products-still" p={ph["products-still"]} sizes="(min-width: 900px) 25vw, 50vw" /></span>
              <span className="pathway-copy"><small>Ayurvedic products</small><strong>Everyday rituals</strong><span>Discover products and dedicated stores</span></span>
            </Link>
            <Link className="pathway-card" href="/training">
              <span className="pathway-photo"><Photograph k="ahv-veranda" p={ph["ahv-veranda"]} sizes="(min-width: 900px) 25vw, 50vw" /></span>
              <span className="pathway-copy"><small>Knowledge &amp; practice</small><strong>Learn Ayurveda</strong><span>Explore training and education</span></span>
            </Link>
          </div>
        </div>
      </section>

      {/* Group introduction — founders' wall in black and white, offset frame, charcoal plaque */}
      <section className="section home-group tex grain" aria-labelledby="group-title">
        <Num n="02" />
        <div className="container split">
          <figure className="s-media reveal founders-figure">
            <div className="frame bw shadow-xl founders-frame"><Photograph k="ahv-founders-wall" p={ph["ahv-founders-wall"]} sizes="(min-width: 900px) 45vw, 90vw" /></div>
            <div className="founders-plaque"><span className="year" aria-hidden="true">1908</span><figcaption>Founders’ portraits in the reception lounge, The Ayurvedic Healing Village, Palakkad.</figcaption></div>
          </figure>
          <div className="s-text stack reveal" style={{ gap: 26 }}>
            <span className="overline">Kairali Group</span>
            <h2 id="group-title">{linkText(group.html) || "Kairali: Spreading Ayurveda since 1908"}</h2>
            <Prose className="dropcap wide" html={bodyOf(group.html).replace(/<p><a href="\/kairali-group-profile.aspx">Kairali: Spreading Ayurveda<br\/?>\s*since 1908<\/a><\/p>/, "").replace(/<img[^>]*history-of-kairali[^>]*>/, "").replace(/<div class="gallery">.*?<\/div>/s, "")} />
            <div className="gallery-pair grid two">
              <div className="photo"><Photograph k="ahv-colonnade" p={ph["ahv-colonnade"]} sizes="(min-width: 900px) 22vw, 50vw" /></div>
              <div className="photo"><Photograph k="ahv-consultation" p={ph["ahv-consultation"]} sizes="(min-width: 900px) 22vw, 50vw" /></div>
            </div>
            <Link className="text-link" href="/kairali-group-profile">Group profile</Link>
          </div>
        </div>
      </section>

      {/* The Ayurvedic Healing Village — half-bleed charcoal section, 3-image strip inside the text column */}
      <section className="healing-feature tex dark" aria-labelledby="hv-title">
        <div className="healing-feature-grid">
          <div className="healing-feature-media reveal"><Photograph k="ahv-footbridge" p={ph["ahv-footbridge"]} sizes="(min-width: 961px) 50vw, 100vw" /></div>
          <div className="healing-feature-copy reveal on-dark">
            <Num n="03" light />
            <Mandala />
            <span className="overline on-dark">The Ayurvedic Healing Village · Doctor-led Ayurvedic care</span>
            <h2 id="hv-title">{linkText(hvMosaic.html)}</h2>
            <Prose html={bodyOf(hvText.html)} />
            <Link className="text-link" href="/ayurvedic-healing-village">The Ayurvedic Healing Village</Link>
            <div className="healing-gallery" aria-label="Healing Village photographs">
              <div className="photo"><Photograph k="ahv-reception" p={ph["ahv-reception"]} sizes="(min-width: 961px) 14vw, 33vw" /></div>
              <div className="photo"><Photograph k="ahv-cottages" p={ph["ahv-cottages"]} sizes="(min-width: 961px) 14vw, 33vw" /></div>
              <div className="photo"><Photograph k="ahv-treatment-room" p={ph["ahv-treatment-room"]} sizes="(min-width: 961px) 14vw, 33vw" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* Villa Raag — owned and operated */}
      <section className="section home-raag tex" aria-labelledby="raag-title">
        <Num n="04" />
        <div className="container split rev">
          <div className="s-media raag-media">
            <div className="frame shadow-xl reveal"><Photograph k="raag-facade" p={ph["raag-facade"]} sizes="(min-width: 900px) 30vw, 60vw" /></div>
            <div className="photo second reveal"><Photograph k="raag-rooftop" p={ph["raag-rooftop"]} sizes="(min-width: 900px) 20vw, 40vw" /></div>
          </div>
          <div className="s-text stack reveal" style={{ gap: 24 }}>
            <span className="overline">Villa Raag · Agonda, South Goa</span>
            <h2 id="raag-title">{raagTitle("Villa Raag – Where Luxury Meets the Arabian Sea")}</h2>
            <p className="lede">Discover South Goa&apos;s most exclusive beachfront sanctuary, where contemporary elegance harmonizes with coastal tranquility.</p>
            <p className="meta">Coastal leisure · Kairali-owned and operated</p>
            <Link className="text-link" href="/villa-raag">Villa Raag</Link>
          </div>
        </div>
      </section>

      {/* Products — framed still life + white packshot tiles (packaging never cut off: contained on white) */}
      <section className="section products-band tex grain" aria-labelledby="prod-title" style={{ paddingTop: 0 }}>
        <div className="container"><Orn /></div>
        <Num n="05" />
        <div className="container products-grid">
          <div className="pg-media">
            <div className="pg-mosaic reveal">{imgs(prodMosaic.html).map((i, k) => <div className="tile-img" key={k} dangerouslySetInnerHTML={{ __html: i }} />)}</div>
            <figure className="pg-still reveal">
              <div className="frame shadow-xl"><Photograph k="products-still" p={ph["products-still"]} sizes="(min-width: 900px) 30vw, 70vw" /></div>
              <figcaption>Kairali Ayurvedic products, oils and herbal infusions.</figcaption>
            </figure>
          </div>
          <div className="pg-text reveal">
            <span className="overline">Ayurvedic products</span>
            <h2 id="prod-title">{linkText(prodMosaic.html)}</h2>
            <Prose html={bodyOf(prodText.html)} />
            <Link className="text-link" href="/ayurvedic-products">Ayurvedic Products</Link>
          </div>
        </div>
      </section>

      {/* Treatment centres — locations in a charcoal gold-ruled panel, 2×2 photo grid */}
      <section className="section home-centres tex" aria-labelledby="centre-title">
        <Num n="06" />
        <LeafSpray flip />
        <div className="container centres-grid">
          <div className="centres-text reveal">
            <span className="overline">Treatment centres</span>
            <h2 id="centre-title">{linkText(centreMosaic.html)}</h2>
            <Prose html={bodyOf(centreText.html)} />
            <div className="city-list tex dark" aria-label="Cities listed on the Locations page">
              <span className="city-title">Locations</span>
              {cities.map((c) => <div className="loc" key={c}><span>{c}</span></div>)}
              <Link className="text-link on-dark" href="/locations">Locations</Link>
            </div>
          </div>
          <div className="centre-gallery reveal">
            <div className="photo shadow-md"><Photograph k="centre-reception" p={ph["centre-reception"]} sizes="(min-width: 900px) 26vw, 50vw" /></div>
            <div className="photo shadow-md"><Photograph k="ahv-consultation" p={ph["ahv-consultation"]} sizes="(min-width: 900px) 26vw, 50vw" /></div>
            <div className="photo shadow-md"><Photograph k="ahv-treatment-room" p={ph["ahv-treatment-room"]} sizes="(min-width: 900px) 26vw, 50vw" /></div>
            <div className="photo shadow-md"><Photograph k="centre-emblem" p={ph["centre-emblem"]} sizes="(min-width: 900px) 26vw, 50vw" /></div>
          </div>
        </div>
      </section>

      {/* Training */}
      <section className="section home-training tex" aria-labelledby="train-title">
        <Num n="07" />
        <div className="container split">
          <div className="s-media training-gallery">
            <div className="photo shadow-md reveal"><Photograph k="ahv-kati-vasti" p={ph["ahv-kati-vasti"]} sizes="(min-width: 900px) 25vw, 50vw" /></div>
            <div className="photo shadow-md reveal"><Photograph k="ahv-treatment-room" p={ph["ahv-treatment-room"]} sizes="(min-width: 900px) 25vw, 50vw" /></div>
            <div className="frame shadow-xl reveal"><Photograph k="ahv-veranda" p={ph["ahv-veranda"]} sizes="(min-width: 900px) 50vw, 100vw" /></div>
          </div>
          <div className="s-text stack reveal" style={{ gap: 24 }}>
            <span className="overline">Ayurveda training</span>
            <h2 id="train-title">{linkText(trainMosaic.html)}</h2>
            <Prose html={bodyOf(trainText.html)} />
            <Link className="text-link" href="/training">Training</Link>
          </div>
        </div>
      </section>

      {/* Family of brands (Q8) */}
      <section className="section home-family tex grain" aria-labelledby="family-title">
        <Mandala className="bronze" full={false} />
        <div className="container">
          <div className="stack" style={{ gap: 16 }}>
            <span className="overline">One family, dedicated websites</span>
            <h2 id="family-title">The Kairali family</h2>
          </div>
          <div className="brand-row">
            {SUB_BRANDS.map((b) => (
              <a key={b.key} className="brand-tile" href={b.url} rel="noopener" target="_blank">
                <img src={b.logo} alt="" width={70} height={56} />
                <strong>{b.name}</strong>
                <span className="rule" aria-hidden="true" />
                <span className="meta">{b.line}</span>
                <span className="url">{b.url.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "")} ↗<span className="sr-only"> (opens in a new tab)</span></span>
              </a>))}
          </div>
        </div>
      </section>

      {/* Recognition (dated, attributed) — editorial index */}
      <section className="section home-recognition tex" aria-labelledby="rec-title">
        <Num n="08" />
        <div className="container recognition-grid">
          <div className="stack" style={{ gap: 18 }}>
            <span className="overline">Recognition</span>
            <h2 id="rec-title">Recently reported</h2>
            <Link className="text-link" href="/kairali-group-awards">Awards &amp; accreditations</Link>
          </div>
          <ul className="news-list">
            {ev.recognitions.slice(0, 3).map((r) => (
              <li key={r.url}>
                <a href={r.url} rel="noopener" className="news">
                  <span className="d"><time dateTime={r.published}>{fmt(r.published)}</time></span>
                  <span className="t">{r.title}</span>
                  <ArrowGlyph />
                </a>
              </li>))}
          </ul>
        </div>
      </section>

      {/* Partnership close — charcoal band with a photographic wash */}
      <section className="band-dark tex dark" aria-labelledby="partner-title">
        <div className="wash" aria-hidden="true"><Photograph k="ahv-colonnade" p={{ ...ph["ahv-colonnade"], alt: "" }} sizes="100vw" /></div>
        <Hairline />
        <div className="container split">
          <div className="s-media stack" style={{ gap: 22 }}><span className="overline on-dark">Partnerships &amp; investment</span><h2 id="partner-title">A partner is one whom you can <em>trust</em> and depend on</h2></div>
          <div className="s-text">
            <p className="lede">Kairali Ayurvedic Group along with its expertise has maintained its legacy in the hospitality sector.</p>
            <div className="actions"><Link className="btn" href="/partnerships-and-investment">Partner with Kairali</Link><Link className="btn ghost-dark" href="/get-in-touch">Get in touch</Link></div>
          </div>
        </div>
      </section>
    </>
  );
}

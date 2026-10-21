import Link from "next/link";
import type { Metadata } from "next";
import { getPage, photos, extra } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { HOME_H1, SUB_BRANDS } from "@/lib/site";
import { Photograph } from "@/components/Bits";
import { Canopy, Divider } from "@/components/Motif";
import Prose from "@/components/Prose";

// Home: every block of the live home copy is rendered (source: kairali.com home capture, 29 Sep 2026),
// composed in the Premium v3 home sequence. H1 per owner decision Q3.
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

export default function Home() {
  const home = getPage("/")!;
  const ph = photos();
  const s = home.sections;
  const [group, hvText, hvMosaic, prodText, prodMosaic, centreText, centreMosaic, trainText, trainMosaic] = s;
  const ev = extra<{ recognitions: { title: string; url: string; published: string }[] }>("events.json");
  const locations = getPage("/locations.aspx")!;
  const cities = [...locations.sections.map((x) => x.html).join(" ").matchAll(/<h2 id="[^"]*">([^<]+)<\/h2>|<h2>([^<]+)<\/h2>/g)].map((m) => (m[1] || m[2]).trim()).filter((c, i, a) => c && c !== "Others" && a.indexOf(c) === i);
  const bodyOf = (html: string) => strip(strip(html, /<h2>[^<]*<\/h2>/), /<p><a href="[^"]+">Read more\s*<\/a><\/p>/);

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
              decoding="auto"
              fetchPriority="high"
            />
          </picture>
        </div>
        <div className="opener-panel"><div className="container">
          <div className="opener-card">
            <p className="hero-kicker"><span>Established 1908</span><span>Four generations</span></p>
            <span className="overline accent">Kairali Ayurvedic Group</span>
            <h1 id="page-title">{HOME_H1}</h1>
            <p className="lede">A family tradition bringing authentic Ayurveda to doctor-led care, restorative stays, trusted products and professional learning.</p>
            <div className="actions"><Link className="btn" href="/ayurveda" data-cta="explore-ayurveda">Discover Ayurveda</Link><Link className="btn secondary" href="/hospitality">Explore Kairali stays</Link></div>
          </div>
        </div></div>
      </section>

      <section className="heritage-strip" aria-label="Kairali at a glance">
        <div className="container heritage-grid">
          <div><strong>1908</strong><span>A family tradition begins</span></div>
          <div><strong>4</strong><span>Generations of Ayurveda</span></div>
          <div><strong>Palakkad</strong><span>Home of the Healing Village</span></div>
          <div><strong>One group</strong><span>Care, stays, products &amp; learning</span></div>
        </div>
      </section>

      <section className="section home-pathways" aria-labelledby="pathways-title">
        <div className="container stack" style={{ gap: 32 }}>
          <header className="section-intro">
            <span className="overline">Begin your journey</span>
            <h2 id="pathways-title">Experience Kairali in the way that suits you</h2>
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

      {/* Group introduction */}
      <section className="section surface-paper" aria-labelledby="group-title" style={{ overflow: "hidden" }}>
        <Canopy style={{ right: -120, top: 40, width: 620 }} />
        <div className="container rel split">
          <figure className="s-media reveal">
            <div className="photo" style={{ aspectRatio: "4 / 5" }}><Photograph k="ahv-founders-wall" p={ph["ahv-founders-wall"]} sizes="(min-width: 900px) 45vw, 50vw" /></div>
            <figcaption>Founders’ portraits in the reception lounge, The Ayurvedic Healing Village, Palakkad.</figcaption>
          </figure>
          <div className="s-text stack reveal" style={{ gap: 18 }}>
            <span className="overline">Kairali Group</span>
            <h2 id="group-title">{linkText(group.html) || "Kairali: Spreading Ayurveda since 1908"}</h2>
            <Prose html={bodyOf(group.html).replace(/<p><a href="\/kairali-group-profile.aspx">Kairali: Spreading Ayurveda<br\/?>\s*since 1908<\/a><\/p>/, "").replace(/<img[^>]*history-of-kairali[^>]*>/, "").replace(/<div class="gallery">.*?<\/div>/s, "")} />
            <div className="gallery-pair grid two">
              <div className="photo"><Photograph k="ahv-colonnade" p={ph["ahv-colonnade"]} sizes="(min-width: 900px) 22vw, 50vw" /></div>
              <div className="photo"><Photograph k="ahv-consultation" p={ph["ahv-consultation"]} sizes="(min-width: 900px) 22vw, 50vw" /></div>
            </div>
            <Link className="text-link" href="/kairali-group-profile">Group profile</Link>
          </div>
        </div>
      </section>
      <div className="surface-ivory"><div className="container"><Divider /></div></div>

      {/* The Ayurvedic Healing Village */}
      <section className="section healing-feature surface-ivory" aria-labelledby="hv-title">
        <div className="container healing-feature-grid">
          <div className="photo healing-feature-media reveal"><Photograph k="ahv-footbridge" p={ph["ahv-footbridge"]} sizes="(min-width: 900px) 58vw, 100vw" /></div>
          <div className="pillar-card healing-feature-copy reveal">
            <span className="overline">The Ayurvedic Healing Village · Doctor-led Ayurvedic care</span>
            <h2 id="hv-title">{linkText(hvMosaic.html)}</h2>
            <Prose html={bodyOf(hvText.html)} />
            <Link className="text-link" href="/ayurvedic-healing-village">The Ayurvedic Healing Village</Link>
          </div>
        </div>
      </section>
      <section className="section tight healing-gallery-section" aria-label="Healing Village photographs"><div className="container healing-gallery">
        <div className="photo healing-gallery-main reveal"><Photograph k="ahv-reception" p={ph["ahv-reception"]} sizes="(min-width: 900px) 64vw, 100vw" /></div>
        <div className="photo reveal"><Photograph k="ahv-cottages" p={ph["ahv-cottages"]} sizes="(min-width: 900px) 32vw, 100vw" /></div>
        <div className="photo reveal"><Photograph k="ahv-treatment-room" p={ph["ahv-treatment-room"]} sizes="(min-width: 900px) 32vw, 100vw" /></div>
      </div></section>

      {/* Villa Raag — owned and operated */}
      <section className="section" aria-labelledby="raag-title">
        <div className="container split rev">
          <div className="s-media grid two" style={{ alignItems: "end" }}>
            <div className="photo reveal" style={{ aspectRatio: "4 / 5" }}><Photograph k="raag-facade" p={ph["raag-facade"]} sizes="(min-width: 900px) 25vw, 50vw" /></div>
            <div className="photo reveal" style={{ aspectRatio: "3 / 4" }}><Photograph k="raag-rooftop" p={ph["raag-rooftop"]} sizes="(min-width: 900px) 20vw, 50vw" /></div>
          </div>
          <div className="s-text stack reveal">
            <span className="overline">Villa Raag · Agonda, South Goa</span>
            <h2 id="raag-title">Villa Raag – Where Luxury Meets the Arabian Sea</h2>
            <p>Discover South Goa&apos;s most exclusive beachfront sanctuary, where contemporary elegance harmonizes with coastal tranquility.</p>
            <p className="meta">Coastal leisure · Kairali-owned and operated</p>
            <Link className="text-link" href="/villa-raag">Villa Raag</Link>
          </div>
        </div>
      </section>

      {/* Products — compact editorial band (owner feedback 29 Sep 2026) */}
      <section className="products-band surface-ivory" aria-labelledby="prod-title">
        <div className="container products-grid">
          <header className="pg-head"><span className="overline">Ayurvedic products</span>
            <h2 id="prod-title">{linkText(prodMosaic.html)}</h2></header>
          <div className="pg-text reveal"><Prose html={bodyOf(prodText.html)} /><Link className="text-link" href="/ayurvedic-products">Ayurvedic Products</Link></div>
          <figure className="pg-still reveal">
            <Photograph k="products-still" p={ph["products-still"]} sizes="(min-width: 900px) 22vw, 70vw" />
            <figcaption>Kairali Ayurvedic products, oils and herbal infusions.</figcaption>
          </figure>
          <div className="pg-mosaic reveal">{imgs(prodMosaic.html).map((i, k) => <div className="tile-img" key={k} dangerouslySetInnerHTML={{ __html: i }} />)}</div>
        </div>
      </section>

      {/* Treatment centres */}
      <section className="section surface-weave" aria-labelledby="centre-title">
        <div className="container split" style={{ alignItems: "start" }}>
          <div className="s-media stack reveal">
            <span className="overline">Treatment centres</span>
            <h2 id="centre-title">{linkText(centreMosaic.html)}</h2>
            <Prose html={bodyOf(centreText.html)} />
            <Link className="text-link" href="/locations">Locations</Link>
          </div>
          <div className="s-text col-7-13 stack reveal">
            <div className="city-list" aria-label="Cities listed on the Locations page">{cities.map((c) => <div key={c}><span>{c}</span></div>)}</div>
            <div className="editorial-gallery centre-gallery">
              <div className="photo"><Photograph k="centre-reception" p={ph["centre-reception"]} sizes="(min-width: 900px) 26vw, 100vw" /></div>
              <div className="photo"><Photograph k="ahv-consultation" p={ph["ahv-consultation"]} sizes="(min-width: 900px) 26vw, 100vw" /></div>
              <div className="photo"><Photograph k="ahv-treatment-room" p={ph["ahv-treatment-room"]} sizes="(min-width: 900px) 26vw, 100vw" /></div>
              <div className="photo"><Photograph k="centre-emblem" p={ph["centre-emblem"]} sizes="(min-width: 900px) 26vw, 100vw" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* Training */}
      <section className="section" aria-labelledby="train-title">
        <div className="container split">
          <div className="s-media editorial-gallery training-gallery">
            <div className="photo reveal"><Photograph k="ahv-kati-vasti" p={ph["ahv-kati-vasti"]} sizes="(min-width: 900px) 25vw, 100vw" /></div>
            <div className="photo reveal"><Photograph k="ahv-treatment-room" p={ph["ahv-treatment-room"]} sizes="(min-width: 900px) 25vw, 100vw" /></div>
            <div className="photo reveal"><Photograph k="ahv-veranda" p={ph["ahv-veranda"]} sizes="(min-width: 900px) 25vw, 100vw" /></div>
          </div>
          <div className="s-text stack reveal">
            <span className="overline">Ayurveda training</span>
            <h2 id="train-title">{linkText(trainMosaic.html)}</h2>
            <Prose html={bodyOf(trainText.html)} />
            <Link className="text-link" href="/training">Training</Link>
          </div>
        </div>
      </section>

      {/* Family of brands (Q8) */}
      <section className="section tight surface-ivory" aria-labelledby="family-title">
        <div className="container stack" style={{ gap: 24 }}>
          <span className="overline">One family, dedicated websites</span>
          <h2 id="family-title">The Kairali family</h2>
          <div className="brand-row">
            {SUB_BRANDS.map((b) => (
              <a key={b.key} className="brand-tile" href={b.url} rel="noopener" target="_blank">
                <img src={b.logo} alt="" width={90} height={72} />
                <strong>{b.name}</strong><span className="meta" style={{ fontSize: 14 }}>{b.line}</span>
                <span style={{ color: "var(--forest)", fontWeight: 500 }}>{b.url.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "")} ↗<span className="sr-only"> (opens in a new tab)</span></span>
              </a>))}
          </div>
        </div>
      </section>

      {/* Recognition (dated, attributed) */}
      <section className="section tight" aria-labelledby="rec-title">
        <div className="container stack" style={{ gap: 20 }}>
          <span className="overline">Recognition</span>
          <h2 id="rec-title">Recently reported</h2>
          <ul className="listing" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {ev.recognitions.slice(0, 3).map((r) => (
              <li className="listing-item" key={r.url} style={{ gridTemplateColumns: "160px 1fr" }}>
                <span className="meta"><time dateTime={r.published}>{new Date(r.published + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</time></span>
                <a href={r.url} rel="noopener" style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem" }}>{r.title}</a>
              </li>))}
          </ul>
          <Link className="text-link" href="/kairali-group-awards">Awards &amp; accreditations</Link>
        </div>
      </section>

      {/* Partnership close */}
      <section className="section surface-forest" aria-labelledby="partner-title" style={{ overflow: "hidden" }}>
        <Canopy style={{ left: -140, bottom: -120, width: 760 }} />
        <div className="container rel split">
          <div className="s-media stack"><span className="overline on-dark">Partnerships &amp; investment</span><h2 id="partner-title">A partner is one whom you can trust and depend on</h2></div>
          <div className="s-text stack">
            <p>Kairali Ayurvedic Group along with its expertise has maintained its legacy in the hospitality sector.</p>
            <div className="actions"><Link className="btn on-dark" href="/partnerships-and-investment">Partner with Kairali</Link><Link className="btn ghost-dark" href="/get-in-touch">Get in touch</Link></div>
          </div>
        </div>
      </section>
    </>
  );
}

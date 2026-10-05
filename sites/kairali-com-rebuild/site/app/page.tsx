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
      <section className="home-hero opener" aria-labelledby="page-title">
        <div className="opener-media"><Photograph k="ahv-grounds-pond" p={ph["ahv-grounds-pond"]} sizes="(max-width: 767px) 50vw, 100vw" priority /></div>
        <div className="opener-panel"><div className="container">
          <div className="opener-card">
            <span className="overline accent">Purely Ayurvedic</span>
            <h1 id="page-title">{HOME_H1}</h1>
            <p className="lede"><strong><em>Ayur</em></strong> means <strong>Life</strong> &amp; <strong><em>Veda</em></strong> means <strong>Science</strong>. <strong><em>Ayurveda</em></strong> – Science of life.</p>
            <div className="actions"><Link className="btn" href="/ayurveda.aspx" data-cta="explore-ayurveda">Explore Ayurveda</Link><Link className="btn secondary" href="/hospitality.aspx">Plan your Kairali experience</Link></div>
          </div>
        </div></div>
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
            <div className="gallery-pair grid two">{imgs(group.html).filter((i) => !i.includes("history-of-kairali")).map((i, k) => <div className="photo" key={k} style={{ aspectRatio: "4 / 3" }} dangerouslySetInnerHTML={{ __html: i }} />)}</div>
            <Link className="text-link" href="/kairali-group-profile.aspx">Group profile</Link>
          </div>
        </div>
      </section>
      <div className="surface-ivory"><div className="container"><Divider /></div></div>

      {/* The Ayurvedic Healing Village */}
      <section className="story-full" aria-labelledby="hv-title">
        <div className="opener-media"><Photograph k="ahv-footbridge" p={ph["ahv-footbridge"]} sizes="(max-width: 899px) 50vw, 100vw" /></div>
        <div className="pillar-wrap"><div className="container" style={{ display: "flex", justifyContent: "flex-end" }}>
          <div className="pillar-card reveal">
            <span className="overline">The Ayurvedic Healing Village · Doctor-led Ayurvedic care</span>
            <h2 id="hv-title">{linkText(hvMosaic.html)}</h2>
            <Prose html={bodyOf(hvText.html)} />
            <Link className="text-link" href="/ayurvedic-healing-village.aspx">The Ayurvedic Healing Village</Link>
          </div>
        </div></div>
      </section>
      <section className="section tight" aria-label="Healing Village photographs"><div className="container grid three">
        {imgs(hvMosaic.html).map((i, k) => <div className="photo reveal" key={k} style={{ aspectRatio: "4 / 3" }} dangerouslySetInnerHTML={{ __html: i }} />)}
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
            <Link className="text-link" href="/villa-raag.aspx">Villa Raag</Link>
          </div>
        </div>
      </section>

      {/* Products — compact editorial band (owner feedback 29 Sep 2026) */}
      <section className="products-band surface-ivory" aria-labelledby="prod-title">
        <div className="container products-grid">
          <header className="pg-head"><span className="overline">Ayurvedic products</span>
            <h2 id="prod-title">{linkText(prodMosaic.html)}</h2></header>
          <div className="pg-text reveal"><Prose html={bodyOf(prodText.html)} /><Link className="text-link" href="/ayurvedic-products.aspx">Ayurvedic Products</Link></div>
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
            <Link className="text-link" href="/locations.aspx">Locations</Link>
          </div>
          <div className="s-text col-7-13 stack reveal">
            <div className="city-list" aria-label="Cities listed on the Locations page">{cities.map((c) => <div key={c}><span>{c}</span></div>)}</div>
            <div className="grid three">{imgs(centreMosaic.html).map((i, k) => <div className="photo" key={k} style={{ aspectRatio: "1" }} dangerouslySetInnerHTML={{ __html: i }} />)}</div>
          </div>
        </div>
      </section>

      {/* Training */}
      <section className="section" aria-labelledby="train-title">
        <div className="container split">
          <div className="s-media grid two">{imgs(trainMosaic.html).map((i, k) => <div className="photo reveal" key={k} style={{ aspectRatio: "1", marginTop: k % 2 ? 64 : 0 }} dangerouslySetInnerHTML={{ __html: i }} />)}</div>
          <div className="s-text stack reveal">
            <span className="overline">Ayurveda training</span>
            <h2 id="train-title">{linkText(trainMosaic.html)}</h2>
            <Prose html={bodyOf(trainText.html)} />
            <Link className="text-link" href="/training.aspx">Training</Link>
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
          <Link className="text-link" href="/kairali-group-awards.aspx">Awards &amp; accreditations</Link>
        </div>
      </section>

      {/* Partnership close */}
      <section className="section surface-forest" aria-labelledby="partner-title" style={{ overflow: "hidden" }}>
        <Canopy style={{ left: -140, bottom: -120, width: 760 }} />
        <div className="container rel split">
          <div className="s-media stack"><span className="overline on-dark">Partnerships &amp; investment</span><h2 id="partner-title">A partner is one whom you can trust and depend on</h2></div>
          <div className="s-text stack">
            <p>Kairali Ayurvedic Group along with its expertise has maintained its legacy in the hospitality sector.</p>
            <div className="actions"><Link className="btn on-dark" href="/partnerships-and-investment.aspx">Partner with Kairali</Link><Link className="btn ghost-dark" href="/get-in-touch.aspx">Get in touch</Link></div>
          </div>
        </div>
      </section>
    </>
  );
}

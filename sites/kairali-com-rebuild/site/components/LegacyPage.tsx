import Link from "next/link";
import { awardsIndex, breadcrumbs, excerpt, extra, familyPhotoKey, navGroupFor, pageHeading, photos, withAnchors, type Page } from "@/lib/content";
import { NAV, PHONE, SUB_BRANDS } from "@/lib/site";
import { applicationSchema, CONSULTATION, CONTACT, GENERAL_ENQUIRY, NEWSLETTER, SVATA_ENQUIRY } from "@/lib/forms";
import { Breadcrumbs, JsonLd, Photograph, SubNav } from "./Bits";
import { Canopy, Divider } from "./Motif";
import Prose, { videoFacade } from "./Prose";
import Form from "./Form";
import { documentHubLink } from "@/lib/document-links";
import DownloadCentre from "./DownloadCentre";
import SearchPage from "./SearchPage";
import { AwardsBrowser, BrandPillars, Certifications, LatestAwards, NewsBrowser, awardIdFor } from "./Lists";
import { ASSET_ORIGIN, SITE_URL } from "@/lib/site";

type Ev = { title: string; url: string; published: string; start: string; end: string; place: string; summary: string; status: string };
const fmt = (d: string) => new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

const PHOTO_OPENER = new Set(["B", "C", "D", "E", "F", "K"]);
const RAIL_FAMILIES = new Set(["C", "D", "E", "F", "G", "K", "B"]);
const OWNER_LABEL: Record<string, string> = {
  "/villa-raag.aspx": "Villa Raag · Kairali-owned and operated",
  "/svata-katerina-prague-czech-republic.aspx": "Svata Katerina · Current partner resort",
  "/ayurvedic-healing-village.aspx": "The Ayurvedic Healing Village · Doctor-led Ayurvedic care",
};
const SUBBRAND_FOR: Record<string, string> = {
  "/ayurvedic-healing-village.aspx": "ktahv", "/hospitality.aspx": "ktahv", "/villa-raag.aspx": "raag", "/ayurvedic-products.aspx": "products",
  "/ayurvedic-medicine.aspx": "products", "/patented-ayurvedic-remedies.aspx": "products", "/skin-care-and-body-products.aspx": "products",
  "/treatment-centres.aspx": "centres", "/ayurveda-treatment-centres.aspx": "centres", "/locations.aspx": "centres",
};

export default function LegacyPage({ page, applyId }: { page: Page; applyId?: string }) {
  const route = page.route;
  const base = route.split("?")[0];
  const heading = pageHeading(page);
  const fam = page.family || "M";
  const group = navGroupFor(route);
  const photoKey = familyPhotoKey(page);
  const ph = photos()[photoKey];
  const photoOpener = PHOTO_OPENER.has(fam) && !["/svata-katerina-prague-czech-republic.aspx", "/enquiry-form.aspx", "/contact-us.aspx", "/get-in-touch.aspx"].includes(base) && !page.template?.startsWith("K2 Collaboration");
  const crumbs = breadcrumbs(route, heading);
  const overline = OWNER_LABEL[base] || group?.label || (base.startsWith("/detail.aspx") ? "Awards & accreditations" : "Kairali Ayurvedic Group");

  // Sections: form bodies are rebuilt as components, so their source label text is not repeated as prose.
  const used = new Set<string>();
  const isProfile = base === "/kairali-group-profile.aspx";
  const secs = page.sections
    .filter((s) => !s.form)
    .filter((s) => !(isProfile && (s.cls.includes("ourbrands") || s.cls.includes("awardaccreditation"))))
    .map((s) => withAnchors(s.html, used));
  const heads = secs.flatMap((s) => s.heads).filter((h) => h.level === 2);
  const isForm = ["/contact-us.aspx", "/enquiry-form.aspx", "/onlineconsultation.aspx", "/apply-now.aspx", "/svata-katerina-prague-czech-republic.aspx", "/ayurveda-newsletter.aspx"].includes(base);
  if (isProfile) { heads.unshift({ id: "pillars", text: "Our brands", level: 2 }); heads.push({ id: "profile-awards", text: "Awards & accreditations", level: 2 }); }
  const withRail = RAIL_FAMILIES.has(fam) && !isForm && heads.length >= 2 && base !== "/kairali-group-awards.aspx" && !base.startsWith("/detail.aspx");
  const sub = SUBBRAND_FOR[base] ? SUB_BRANDS.find((b) => b.key === SUBBRAND_FOR[base]) : undefined;

  const opener = photoOpener && ph ? (
    <section className="opener photo" aria-labelledby="page-title">
      <div className="opener-media"><Photograph k={photoKey} p={ph} priority /></div>
      <div className="opener-panel"><div className="container">
        <div className="opener-card">
          <span className="overline accent">{overline}</span>
          <h1 id="page-title">{heading}</h1>
          {page.banner?.tagline && !page.banner.subtitle.some((x) => x.replace(/<[^>]+>/g, "").trim() === page.banner!.tagline) && <p className="lede" style={{ fontFamily: "var(--font-display)", color: "var(--forest)" }}>{page.banner.tagline}</p>}
          {page.banner?.subtitle.map((s, i) => <p key={i} className="lede" dangerouslySetInnerHTML={{ __html: s }} />)}
          {page.banner?.actions && page.banner.actions.length > 0 && <OpenerActions actions={page.banner.actions} />}
        </div>
      </div></div>
    </section>
  ) : (
    <section className="opener plain" aria-labelledby="page-title">
      <Canopy style={{ right: -120, top: 10, width: 520 }} />
      <div className="container"><div className="opener-inner">
        <span className="overline accent">{overline}</span>
        <h1 id="page-title">{heading}</h1>
        {page.banner?.tagline && !page.banner.subtitle.some((x) => x.replace(/<[^>]+>/g, "").trim() === page.banner!.tagline) && <p className="lede" style={{ fontFamily: "var(--font-display)", color: "var(--forest)" }}>{page.banner.tagline}</p>}
        {page.banner?.subtitle.map((s, i) => <p key={i} className="lede" dangerouslySetInnerHTML={{ __html: s }} />)}
          {page.banner?.actions && page.banner.actions.length > 0 && <OpenerActions actions={page.banner.actions} />}
      </div></div>
    </section>
  );

  const awardId = base.startsWith("/detail.aspx") ? awardIdFor(route) : undefined;
  const body = (
    <>
      {awardId && <p style={{ marginBottom: 24 }}><Link className="text-link back-link" href={`/kairali-group-awards.aspx#${awardId}`}>Back to awards &amp; accreditations</Link></p>}
      {isProfile && <div style={{ marginBottom: 56 }}><BrandPillars /></div>}
      {page.banner?.rest && <Prose html={page.banner.rest} />}
      {secs.map((s, i) => (
        <div key={i}>
          {i > 0 && <div style={{ margin: "48px 0" }}><Divider /></div>}
          <Prose html={s.html} className={withRail ? "" : "wide-soft"} />
        </div>
      ))}
      {isProfile && (
        <div id="profile-awards" style={{ marginTop: 56 }} className="stack">
          <LatestAwards />
          <p><Link className="btn secondary" href="/kairali-group-awards.aspx">Browse all awards and certifications</Link></p>
        </div>)}
    </>
  );

  return (
    <>
      {opener}
      {page.banner?.sublinks && <SubNav links={page.banner.sublinks} current={base} />}
      <div className="container" style={{ paddingTop: 24 }}><Breadcrumbs items={crumbs} /></div>

      {base === "/download-centre.aspx" ? <DownloadCentre page={page} /> :
       base === "/search-results.aspx" ? <SearchPage /> : (
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          {sub && <SubBrandCallout b={sub} />}
          {base === "/kairali-group-awards.aspx" && <Certifications />}
          {base === "/villa-raag.aspx" && <p className="badge" style={{ marginBottom: 24 }}>Kairali-owned and operated</p>}
          {base === "/svata-katerina-prague-czech-republic.aspx" && <p className="notice" style={{ marginBottom: 32 }}>Svata Katerina is a current partner resort of Kairali. Contact the resort directly to confirm current programmes and availability.</p>}
          {["/careers.aspx", "/current-openings.aspx", "/apply-now.aspx"].includes(base) && <p className="notice" style={{ marginBottom: 32 }}>These are previously published vacancy records. Current availability is awaiting HR confirmation; applications are inactive in this preview.</p>}
          {base === "/virtual-tour.aspx" && <ComingSoon />}
          {base === "/kairali-group-awards.aspx" ? <AwardsBrowser /> : base === "/kairali-news.aspx" ? <><article className="stack prose-cap" style={{ gap: 0, maxWidth: 880, marginBottom: 40 }}>{body}</article><NewsBrowser /></> : isForm ? <FormLayout page={page} body={body} applyId={applyId} /> :
            withRail ? (
              <div className="article with-rail">
                <details className="toc-mobile">
                  <summary>On this page <span className="sr-only">({heads.length} sections)</span></summary>
                  <nav aria-label="On this page (sections)"><ol>{heads.map((h) => <li key={h.id}><a href={`#${h.id}`}>{h.text}</a></li>)}</ol></nav>
                </details>
                <article className={`stack${isProfile ? " profile-article" : ""}`} style={{ gap: 0 }}>{body}</article>
                <aside className="rail" aria-label="On this page">
                  <div className="rail-inner">
                    <nav className="toc" aria-labelledby="toc-title"><p className="toc-title" id="toc-title">On this page</p>
                      {heads.map((h) => <a key={h.id} href={`#${h.id}`}>{h.text}</a>)}</nav>
                    <div className="card forest stack">
                      <h2 style={{ fontSize: "1.5rem" }}>Speak to a Kairali physician</h2>
                      <p style={{ fontSize: 15 }}>Ask about treatments, programmes and products. The online consultation is free.</p>
                      <Link className="btn on-dark" href="/onlineconsultation.aspx">Free online consultation</Link>
                      <a className="btn ghost-dark" href={PHONE.href}>Call {PHONE.label}</a>
                    </div>
                  </div>
                </aside>
              </div>
            ) : <article className="stack prose-cap" style={{ gap: 0, maxWidth: fam === "H" || fam === "I" || base === "/kairali-group-profile.aspx" ? "none" : 880 }}>{body}</article>}

          {page.videoItems && page.videoItems.length > 0 && <VideoGrid items={page.videoItems} />}
          {base === "/kairali-group-awards.aspx" && <AwardsRecent />}
          {base === "/our-partners.aspx" && <Events />}
          {base.startsWith("/detail.aspx") && <AwardNav route={route} />}
          {base === "/contact-us.aspx" && <MapLink />}
          {group && fam === "B" && <ExploreTiles groupLabel={group.label} current={base} />}
        </div>
      </section>)}

      {!isForm && base !== "/download-centre.aspx" && base !== "/search-results.aspx" && <ClosingBand />}
      {base.startsWith("/detail.aspx") && (
        <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: heading.slice(0, 110), url: SITE_URL + route,
          image: page.images[0] ? ASSET_ORIGIN + page.images[0].src : undefined, publisher: { "@id": `${SITE_URL}/#organization` }, author: { "@id": `${SITE_URL}/#organization` },
          mainEntityOfPage: SITE_URL + route }} />)}
    </>
  );
}

function OpenerActions({ actions }: { actions: { label: string; href: string }[] }) {
  return (
    <div className="actions">
      {actions.map((a, i) => a.href.startsWith("/download/")
        ? <a key={a.href} className="btn secondary" href={documentHubLink(a.href)}>{a.label}<span className="sr-only"> (maintained document library)</span></a>
        : a.href.startsWith("http")
          ? <a key={a.href} className={`btn${i ? " secondary" : ""}`} href={a.href} rel="noopener" target="_blank">{a.label} ↗<span className="sr-only"> (opens in a new tab)</span></a>
          : <Link key={a.href} className={`btn${i ? " secondary" : ""}`} href={a.href}>{a.label}</Link>)}
      {actions.some((a) => a.href.startsWith("/download/")) && <p className="meta" style={{ flexBasis: "100%" }}>Choose a current PDF in the maintained document library. Earlier direct URLs remain available; see the <Link href="/download-centre.aspx">Download Centre</Link> for current editions.</p>}
    </div>
  );
}

function SubBrandCallout({ b }: { b: (typeof SUB_BRANDS)[number] }) {
  return (
    <div className="card" style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap", marginBottom: 48 }}>
      <img src={b.logo} alt={`${b.name} logo`} style={{ height: 64, width: "auto" }} width={90} height={64} />
      <div className="stack" style={{ gap: 4, flex: "1 1 280px" }}>
        <strong>{b.name}</strong>
        <span className="meta" style={{ fontSize: 15 }}>{b.line} Full details, booking and shopping are on the dedicated website.</span>
      </div>
      <a className="btn secondary" href={b.url} rel="noopener" target="_blank">{b.cta} ↗<span className="sr-only"> (opens in a new tab)</span></a>
    </div>
  );
}

function ComingSoon() {
  return (
    <div className="card stack" style={{ marginBottom: 40, maxWidth: 720 }}>
      <span className="badge info">Coming soon</span>
      <h2>A virtual tour of Kairali is on its way</h2>
      <p>The virtual tour is being prepared. Meanwhile, explore the photo and video libraries.</p>
      <div className="actions"><Link className="btn" href="/photo-library.aspx">Photo library</Link><Link className="btn secondary" href="/video-library.aspx">Video library</Link></div>
    </div>
  );
}

function FormLayout({ page, body, applyId }: { page: Page; body: React.ReactNode; applyId?: string }) {
  const base = page.route.split("?")[0];
  let schema, preset: Record<string, string | string[]> = {};
  if (base === "/contact-us.aspx") schema = CONTACT;
  else if (base === "/enquiry-form.aspx") schema = GENERAL_ENQUIRY;
  else if (base === "/onlineconsultation.aspx") schema = CONSULTATION;
  else if (base === "/svata-katerina-prague-czech-republic.aspx") schema = SVATA_ENQUIRY;
  else if (base === "/ayurveda-newsletter.aspx") schema = NEWSLETTER;
  else { const a = applicationSchema(applyId); schema = a; preset = a.preset; }
  const job = preset.post as string | undefined;
  const narrow = base === "/svata-katerina-prague-czech-republic.aspx" || base === "/ayurveda-newsletter.aspx";
  return (
    <div className="split form-split" style={{ alignItems: "start" }}>
      <div className={narrow ? "stack col-wide" : "stack col-narrow"}>
        {job && <div className="card stack"><span className="overline">Applying for</span><h2 style={{ fontSize: "1.6rem" }}>{job}</h2><p className="meta">Job reference code {preset.jobRef as string}</p><Link className="text-link" href="/current-openings.aspx">View current openings</Link></div>}
        {body}
        <div className="card contact-routes">
          <span className="overline">Other ways to reach us</span>
          <p>Call <a href={PHONE.href}>{PHONE.label}</a> or email <a href="mailto:info@kairali.com">info@kairali.com</a>.</p>
          <p className="meta" style={{ fontSize: 14 }}>Corporate Office: Kairali Ayurvedic Group, D - 130, Block D, Ambedkar Colony, Mehrauli, New Delhi - 110030.</p>
          {base !== "/onlineconsultation.aspx" && <Link className="text-link" href="/onlineconsultation.aspx">Free online consultation with a physician</Link>}
          {base !== "/locations.aspx" && <Link className="text-link" href="/locations.aspx">Centre locations</Link>}
        </div>
      </div>
      <div className={narrow ? "col-side" : "col-main"}>
        <div className="card" style={{ padding: "clamp(20px, 3vw, 36px)" }} id="form">
          <h2 style={{ marginBottom: 16 }}>{schema.title}</h2>
          <Form schema={schema} preset={preset} compact={narrow} />
        </div>
      </div>
    </div>
  );
}

function VideoGrid({ items }: { items: { id: string; title: string; caption: string }[] }) {
  const st = extra<{ checked: string; videos: Record<string, { ok: boolean; title?: string; author?: string; status?: number }> }>("videos-status.json");
  return (
    <section aria-labelledby="films" style={{ marginTop: 56 }}>
      <h2 id="films" style={{ marginBottom: 24 }}>Films</h2>
      <p className="meta" style={{ marginBottom: 20 }}>Videos play from YouTube only after you choose to play them.</p>
      <div className="grid three">
        {items.map((v) => {
          const info = st.videos[v.id];
          const title = info?.title || v.title || "Kairali film";
          return info && !info.ok ? (
            <figure key={v.id}>
              <div className="video" style={{ display: "grid", placeItems: "center", background: "var(--ivory)", border: "1px solid var(--line)" }}>
                <p className="meta" style={{ padding: 20, textAlign: "center" }}>This film is currently unavailable on YouTube.</p>
              </div>
              <figcaption>YouTube video {v.id} · unavailable when checked {fmt(st.checked)}</figcaption>
            </figure>
          ) : (
            <figure key={v.id}>
              <div dangerouslySetInnerHTML={{ __html: videoFacade(v.id, title) }} />
              <figcaption>{title}{info?.author ? ` · ${info.author} on YouTube` : ""}</figcaption>
            </figure>);
        })}
      </div>
    </section>
  );
}

function Accreditations() {
  const a = extra<{ verifiedOn: string; current: { name: string; issuer: string; holder: string; scope: string; number: string; validFrom: string; validTo: string; image: string; w: number; h: number }[] }>("accreditations.json");
  return (
    <section aria-labelledby="accr" className="stack" style={{ gap: 20, marginBottom: 56 }}>
      <span className="overline">Current accreditation</span>
      <h2 id="accr">Certificates in force</h2>
      <p className="meta" style={{ fontSize: 15 }}>Checked against the certificates themselves on {fmt(a.verifiedOn)}. The awards listed below are dated historical records.</p>
      <div className="grid two">
        {a.current.map((c) => (
          <article key={c.number} className="card" style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 20, alignItems: "start" }}>
            <a href={c.image} aria-label={`View certificate: ${c.name}`}><img src={c.image} width={c.w} height={c.h} alt={`${c.name} certificate, ${c.number}`} loading="lazy" style={{ border: "1px solid var(--line)" }} /></a>
            <div className="stack" style={{ gap: 6 }}>
              <h3 style={{ fontSize: "1.25rem" }}>{c.name}</h3>
              <p className="meta">{c.issuer}</p>
              <p style={{ fontSize: 15 }}>{c.holder}</p>
              <p style={{ fontSize: 15 }}>{c.scope}</p>
              <p className="meta">Certificate {c.number} · valid <time dateTime={c.validFrom}>{fmt(c.validFrom)}</time> – <time dateTime={c.validTo}>{fmt(c.validTo)}</time></p>
            </div>
          </article>))}
      </div>
    </section>
  );
}

function AwardsGrid() {
  const idx = awardsIndex();
  return (
    <section aria-labelledby="records" className="stack" style={{ gap: 24 }}>
      <span className="overline">Awards &amp; accreditations</span>
      <h2 id="records">Awards and recognition records</h2>
      <p className="meta" style={{ fontSize: 15 }}>As published on kairali.com. Each record keeps its original date and wording; historical awards do not imply current accreditation.</p>
      <div className="grid three">
        {idx.map((a) => (
          <article key={a.href} className="card stack" style={{ gap: 12, padding: 18 }}>
            {a.image && <Link href={a.href} tabIndex={-1} aria-hidden="true" className="photo" style={{ aspectRatio: "4 / 3", display: "block", background: "#fff" }}>
              <img src={a.image.src} width={a.image.w} height={a.image.h} alt="" loading="lazy" decoding="async" style={{ objectFit: "contain" }} /></Link>}
            <h3 style={{ fontSize: "1.2rem" }}><Link href={a.href}>{a.title}</Link></h3>
            <p style={{ fontSize: 15 }}>{a.teaser}</p>
          </article>))}
      </div>
    </section>
  );
}

function AwardsRecent() {
  const ev = extra<{ recognitions: { title: string; url: string; published: string; summary: string }[] }>("events.json");
  return (
    <section aria-labelledby="recent" className="section tight" style={{ marginTop: 32, borderTop: "1px solid var(--line)" }}>
      <span className="overline">Reported on WhyAyurveda</span>
      <h2 id="recent" style={{ margin: "12px 0 8px" }}>Recent recognitions</h2>
      <p className="meta" style={{ marginBottom: 24 }}>Published on whyayurveda.org, Kairali’s knowledge and news site. Dates are publication dates.</p>
      <div className="listing">
        {ev.recognitions.map((r) => (
          <div className="listing-item" key={r.url} style={{ gridTemplateColumns: "160px 1fr" }}>
            <p className="meta"><time dateTime={r.published}>{fmt(r.published)}</time></p>
            <div className="stack" style={{ gap: 8 }}><h3 style={{ fontSize: "1.3rem" }}><a href={r.url} rel="noopener">{r.title}</a></h3><p style={{ fontSize: 16 }}>{r.summary}</p></div>
          </div>))}
      </div>
    </section>
  );
}

function Events() {
  const ev = extra<{ today: string; events: Ev[] }>("events.json");
  const upcoming = ev.events.filter((e) => e.status === "upcoming");
  const past = ev.events.filter((e) => e.status === "past");
  return (
    <section aria-labelledby="events" className="section tight" style={{ marginTop: 32, borderTop: "1px solid var(--line)" }}>
      <span className="overline">Events</span>
      <h2 id="events" style={{ margin: "12px 0 8px" }}>Kairali events</h2>
      <p className="meta" style={{ marginBottom: 24 }}>From whyayurveda.org. Checked {fmt(ev.today)}.</p>
      <h3 style={{ marginBottom: 12 }}>Upcoming</h3>
      {upcoming.length ? null : <p style={{ marginBottom: 32 }}>No upcoming events are announced at the moment.</p>}
      <h3 style={{ margin: "16px 0 12px" }}>Past events</h3>
      <div className="listing">
        {past.map((e) => (
          <article className="listing-item" key={e.url} style={{ gridTemplateColumns: "180px 1fr" }}>
            <p className="meta">
              {e.start ? <><time dateTime={e.start}>{fmt(e.start)}</time> – <time dateTime={e.end}>{fmt(e.end)}</time></> : <>Published <time dateTime={e.published}>{fmt(e.published)}</time></>}
              <br /><span className="badge past" style={{ marginTop: 8 }}>Past event</span>
            </p>
            <div className="stack" style={{ gap: 8 }}>
              <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 400, color: "var(--forest)", fontSize: "1.3rem" }}><a href={e.url} rel="noopener">{e.title}</a></h4>
              {e.place && <p className="meta">{e.place}</p>}
              <p style={{ fontSize: 16 }}>{e.summary}</p>
            </div>
          </article>))}
      </div>
      {past.filter((e) => e.start).map((e) => (
        <JsonLd key={e.url} data={{ "@context": "https://schema.org", "@type": "Event", name: e.title, startDate: e.start, endDate: e.end,
          eventStatus: "https://schema.org/EventScheduled", eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: { "@type": "Place", name: "Kairali – The Ayurvedic Healing Village", address: { "@type": "PostalAddress", addressLocality: "Palakkad", addressRegion: "Kerala", addressCountry: "IN" } },
          organizer: { "@id": `${SITE_URL}/#organization` }, url: e.url }} />))}
    </section>
  );
}

function AwardNav({ route }: { route: string }) {
  const idx = awardsIndex();
  const i = idx.findIndex((a) => a.href === route || decodeURIComponent(a.href) === decodeURIComponent(route));
  const prev = i > 0 ? idx[i - 1] : undefined; const next = i >= 0 && i < idx.length - 1 ? idx[i + 1] : undefined;
  return (
    <nav aria-label="More awards" className="split" style={{ marginTop: 56, paddingTop: 32, borderTop: "1px solid var(--line)" }}>
      <div className="s-media stack" style={{ gap: 6 }}>{prev && <><span className="meta">Previous in the awards list</span><Link href={prev.href}>{prev.title}</Link></>}</div>
      <div className="s-text stack" style={{ gap: 6 }}>{next && <><span className="meta">Next in the awards list</span><Link href={next.href}>{next.title}</Link></>}
        <Link className="text-link" href="/kairali-group-awards.aspx">All awards &amp; accreditations</Link></div>
    </nav>
  );
}

function MapLink() {
  const q = encodeURIComponent("Kairali Ayurvedic Group, D-130, Block D, Ambedkar Colony, Mehrauli, New Delhi 110030");
  return (
    <div className="card stack" style={{ marginTop: 48, maxWidth: 720 }}>
      <h2 style={{ fontSize: "1.5rem" }}>Find the corporate office</h2>
      <p>D - 130, Block D, Ambedkar Colony, Mehrauli, New Delhi - 110030.</p>
      <a className="btn secondary" href={`https://www.google.com/maps/search/?api=1&query=${q}`} rel="noopener" target="_blank">Open in Google Maps ↗<span className="sr-only"> (opens in a new tab)</span></a>
    </div>
  );
}

function ExploreTiles({ groupLabel, current }: { groupLabel: string; current: string }) {
  const g = NAV.find((x) => x.label === groupLabel);
  if (!g) return null;
  const links = g.links.filter((l) => l.href !== current && !l.external && l.href !== "/");
  return (
    <section aria-labelledby="explore" style={{ marginTop: 72 }}>
      <span className="overline">{g.label}</span>
      <h2 id="explore" style={{ margin: "12px 0 24px" }}>Continue exploring</h2>
      <div className="grid three">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="card tile" style={{ padding: 22 }}>
            <h3 style={{ fontSize: "1.3rem" }}>{l.label}</h3><span className="text-link" aria-hidden="true">Read more</span>
          </Link>))}
      </div>
    </section>
  );
}

function ClosingBand() {
  return (
    <section className="section surface-forest" aria-labelledby="close-title" style={{ overflow: "hidden" }}>
      <Canopy style={{ right: -160, bottom: -140, width: 620 }} />
      <div className="container rel split">
        <div className="s-media stack">
          <span className="overline on-dark">Since 1908</span>
          <h2 id="close-title">Health through Ayurveda, four generations on.</h2>
        </div>
        <div className="s-text stack">
          <p>Contact our care team about treatments and programmes, or tell us what you are looking for.</p>
          <div className="actions"><Link className="btn on-dark" href="/onlineconsultation.aspx">Free online consultation</Link><Link className="btn ghost-dark" href="/enquiry-form.aspx">Enquire now</Link></div>
        </div>
      </div>
    </section>
  );
}

export { excerpt };

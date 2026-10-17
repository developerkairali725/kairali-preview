import Link from "next/link";
import { extra, photos } from "@/lib/content";
import { SUB_BRANDS } from "@/lib/site";
import Browse, { type BrowseItem } from "./Browse";
import { Photograph } from "./Bits";
import { cleanRoute } from "@/lib/routes";

type Rec = { id: string; title: string; summary: string; href: string | null; image: { src: string; w: number; h: number; alt?: string } | null;
  year: number | null; dateBasis: string; dateText?: string | null; type: string; entity: string; validity: string | null;
  holder?: string; validFrom?: string; validTo?: string; number?: string };
type AwardsData = { checked: string; records: Rec[]; certificates: Rec[] };
const fmt = (d: string) => new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export const awardsData = () => extra<AwardsData>("awards-browse.json");

/** Award id for a detail route (used for "Back to awards" links that land on the record). */
export function awardIdFor(route: string): string | undefined {
  return awardsData().records.find((r) => r.href === route || decodeURIComponent(r.href ?? "") === decodeURIComponent(route))?.id;
}

function toItem(r: Rec): BrowseItem {
  return {
    id: r.id, title: r.title, href: r.href, summary: r.summary, year: r.year, date: r.year ? `${r.year}-00-00` : null,
    dateLabel: r.year ? String(r.year) : "Date not stated",
    facets: { type: r.type, entity: r.entity }, image: r.image,
  };
}
const newestFirst = (a: Rec, b: Rec) => (b.year ?? -1) - (a.year ?? -1) || 0;

export function AwardsBrowser({ compact = false }: { compact?: boolean }) {
  const d = awardsData();
  const recs = d.records.filter((r) => r.type !== "Certification").sort(newestFirst);
  const items = recs.map(toItem);
  return (
    <section aria-labelledby="awards-browse" className="stack" style={{ gap: 20 }}>
      <span className="overline">Awards and recognition</span>
      <h2 id="awards-browse">Awards, honours and listings</h2>
      <p className="meta" style={{ fontSize: 15 }}>
        {recs.length} records as published on kairali.com, newest first. Years are shown only where the record itself states one; the others are marked “Date not stated”. Historical awards do not imply current accreditation.
      </p>
      <Browse items={items} idPrefix="aw" label="Awards" pageSize={compact ? 6 : 12}
        facets={[{ key: "type", label: "Type" }, { key: "entity", label: "Recipient" }]} />
    </section>
  );
}

export function Certifications() {
  const d = awardsData();
  const certRecs = d.records.filter((r) => r.type === "Certification").sort(newestFirst);
  const groups: { key: string; title: string; note: string; items: Rec[] }[] = [
    { key: "current", title: "Current — verified", note: `Checked against the certificates themselves on ${fmt(d.checked)}.`, items: d.certificates.filter((c) => c.validity === "current") },
    { key: "historical", title: "Historical — validity ended", note: "Verified from the certificate; shown for the record only.", items: d.certificates.filter((c) => c.validity === "historical") },
    { key: "unknown", title: "Validity not stated", note: "Certification records published on kairali.com. The record gives no validity period, so current status is not claimed.", items: certRecs },
  ];
  return (
    <section aria-labelledby="certs" className="stack" style={{ gap: 20, marginBottom: 64 }}>
      <span className="overline">Certifications and registrations</span>
      <h2 id="certs">Certifications by validity</h2>
      <nav aria-label="Certification groups" className="facet">
        {groups.map((g) => <a key={g.key} className="chip-link" href={`#certs-${g.key}`}>{g.title} ({g.items.length})</a>)}
      </nav>
      {groups.map((g) => (
        <section key={g.key} aria-labelledby={`certs-${g.key}`} className="stack" style={{ gap: 12 }}>
          <h3 id={`certs-${g.key}`}>{g.title}</h3>
          <p className="meta" style={{ fontSize: 15 }}>{g.note}</p>
          <ul className="cert-list">
            {g.items.map((c) => (
              <li key={c.id} id={c.id} className="cert-item">
                {c.image && <a href={c.href ? cleanRoute(c.href) : c.image.src} className="browse-thumb" aria-label={`View ${c.title}`}><img src={c.image.src} width={c.image.w} height={c.image.h} alt="" loading="lazy" /></a>}
                <div className="stack" style={{ gap: 4 }}>
                  <p className="meta">{c.entity}{c.year ? ` · ${c.year}` : " · Date not stated"}</p>
                  <h4 className="browse-title">{c.href && !c.href.startsWith("/media/") ? <Link href={cleanRoute(c.href)}>{c.title}</Link> : c.title}</h4>
                  {c.holder && <p style={{ fontSize: 15 }}>{c.holder}</p>}
                  <p style={{ fontSize: 15 }}>{c.summary}</p>
                  {c.validFrom && <p className="meta">{c.number ? `No. ${c.number} · ` : ""}Valid <time dateTime={c.validFrom}>{fmt(c.validFrom)}</time> – <time dateTime={c.validTo}>{fmt(c.validTo!)}</time></p>}
                  <span className={`badge${g.key === "current" ? "" : g.key === "historical" ? " past" : " info"}`}>{g.key === "current" ? "Current" : g.key === "historical" ? "Validity ended" : "Validity not stated"}</span>
                </div>
              </li>))}
          </ul>
        </section>))}
    </section>
  );
}

export function NewsBrowser() {
  const n = extra<{ source: string; checked: string; items: { id: string; title: string; date: string; year: number; url: string; categories: string[]; summary: string }[] }>("news.json");
  const items: BrowseItem[] = [...n.items].sort((a, b) => b.date.localeCompare(a.date)).map((x) => ({
    id: x.id, title: x.title, href: x.url, external: true, summary: x.summary, year: x.year, date: x.date,
    dateLabel: fmt(x.date), facets: { topic: x.categories[0] },
  }));
  const since = new Date(new Date(n.checked + "T00:00:00Z").getTime() - 365 * 864e5).toISOString().slice(0, 10);
  return (
    <section aria-labelledby="news-browse" className="stack" style={{ gap: 20 }}>
      <span className="overline">Kairali news</span>
      <h2 id="news-browse">News from the Kairali group</h2>
      <p className="meta" style={{ fontSize: 15 }}>
        Company news, awards, events and CSR stories published on whyayurveda.org, newest first. Dates are publication dates; list checked {fmt(n.checked)}. Each story opens on whyayurveda.org.
      </p>
      <Browse items={items} idPrefix="nw" label="News" pageSize={12} recentSince={since} withImages={false} facets={[{ key: "topic", label: "Topic" }]} />
    </section>
  );
}

// ---------------------------------------------------------------- Group Profile brand overview
// Source "Our Brands" block carried two responsive copies of the same four pillars (mobile carousel +
// desktop circular leaf diagram). They are rendered once here, with the source list items verbatim.
const PILLARS = [
  { title: "Ayurvedic Centre", photo: "centre-emblem", items: ["Ayurveda Spa", "Treatment Centers", "Ayurveda Franchise"],
    links: [["Treatment centres", "/treatment-centres.aspx"], ["Ayurveda treatment centres", "/ayurveda-treatment-centres.aspx"], ["Ayurveda spa franchise", "/ayurveda-spa-franchise.aspx"]], brand: "centres" },
  { title: "Ayurvedic Products", photo: "products-still", items: ["Ayurvedic Proprietary Organics", "Ayurvedic Herbal Tea", "Kair - by Kairali", "Ayurvedic Proprietary Medicines", "Ayurvedic Classical Medicines", "Spa Equipment", "Books"],
    links: [["Ayurvedic products", "/ayurvedic-products.aspx"], ["Ayurvedic medicine", "/ayurvedic-medicine.aspx"], ["Spa equipment", "/ayurvedic-spa-equipment.aspx"]], brand: "products" },
  { title: "Training Programs", photo: "ahv-treatment-room", items: ["Yoga Instructors", "Ayurveda Therapists", "Ayurveda Doctors"],
    links: [["Training", "/training.aspx"], ["Yoga teacher training", "/yoga-teacher-training.aspx"], ["Ayurveda college", "/ayurveda-college.aspx"]], brand: null },
  { title: "Hospitality", photo: "ahv-footbridge", items: ["Hospitality Consultancy", "The Ayurvedic Healing Village", "Yoga Retreats", "Chef Retreat"],
    links: [["Hotel & spa management", "/hotel-and-spa-management.aspx"], ["The Ayurvedic Healing Village", "/ayurvedic-healing-village.aspx"], ["Yoga Ayurveda retreats", "/yoga-ayurveda-retreats.aspx"], ["Villa Raag (Kairali-owned and operated)", "/villa-raag.aspx"]], brand: "ktahv" },
] as const;

export function BrandPillars() {
  const ph = photos();
  return (
    <section aria-labelledby="pillars" className="stack" style={{ gap: 24 }}>
      <span className="overline">Our brands</span>
      <h2 id="pillars">Four businesses, one family</h2>
      <div className="pillar-grid">
        {PILLARS.map((p) => {
          const b = p.brand ? SUB_BRANDS.find((s) => s.key === p.brand) : undefined;
          return (
            <article key={p.title} className="pillar" aria-labelledby={`pl-${p.photo}`}>
              <div className="pillar-photo"><Photograph k={p.photo} p={ph[p.photo]} sizes="(min-width: 900px) 25vw, 50vw" /></div>
              <div className="stack" style={{ gap: 10, padding: 20 }}>
                <h3 id={`pl-${p.photo}`}>{p.title}</h3>
                <ul className="pillar-items">{p.items.map((i) => <li key={i}>{i}</li>)}</ul>
                <ul className="pillar-links">{p.links.map(([l, h]) => <li key={h}><Link className="text-link" href={cleanRoute(h)}>{l}</Link></li>)}</ul>
                {b && <a className="meta" href={b.url} rel="noopener" target="_blank">{b.url.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "")} ↗<span className="sr-only"> (opens in a new tab)</span></a>}
              </div>
            </article>);
        })}
      </div>
    </section>
  );
}

/** Small latest selection for the Group Profile; the full collection lives on the awards page. */
export function LatestAwards({ count = 6 }: { count?: number }) {
  const recs = awardsData().records.filter((r) => r.type !== "Certification" && r.year !== null).sort(newestFirst).slice(0, count);
  return (
    <section aria-labelledby="latest-awards" className="stack" style={{ gap: 16 }}>
      <span className="overline">Awards and accreditations</span>
      <h2 id="latest-awards">Latest recognition</h2>
      <p className="meta" style={{ fontSize: 15 }}>The {count} most recent dated records. The full collection of {awardsData().records.length} records and the current certificates are on the awards page.</p>
      <ul className="latest-awards">
        {recs.map((r) => (
          <li key={r.id}>
            {r.image ? <span className="browse-thumb" aria-hidden="true"><img src={r.image.src} width={r.image.w} height={r.image.h} alt="" loading="lazy" /></span> : <span />}
            <span className="stack" style={{ gap: 4 }}><span className="meta">{r.year} · {r.type}</span><a href={cleanRoute(r.href!)} className="browse-title" style={{ fontSize: "1.1rem" }}>{r.title}</a></span>
          </li>))}
      </ul>
    </section>
  );
}

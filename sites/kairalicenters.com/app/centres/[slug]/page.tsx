// Per-centre location page. NAP + hours + map + enquiry, with MedicalClinic +
// PostalAddress + BreadcrumbList JSON-LD for local search. All facts come from
// lib/centres.ts (verbatim from the live site — never invented).
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { graph, medicalClinic, kairaliOrganization, breadcrumbList, serializeJsonLd } from "@kairali/schema";
import { buildMetadata } from "@kairali/seo";
import { CENTRES, centreBySlug } from "../../lib/centres";
import { EMAIL, WHATSAPP_URL } from "../../_components/chrome";
import siteConfig from "../../../site.config.json";

const SITE = "https://kairalicenters.com";

export function generateStaticParams() {
  return CENTRES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const c = centreBySlug(slug);
  if (!c) return {};
  const place = `${c.city}${c.region ? `, ${c.region}` : ""}`;
  return buildMetadata(siteConfig, {
    title: `Kairali Ayurvedic Centre, ${c.city} — Visit Us`.slice(0, 60),
    description: `Kairali Ayurvedic Centre in ${place}, ${c.country}. Address, timings and how to book a consultation. Classical Ayurvedic care from physicians since 1908.`.slice(0, 155),
    siteName: "Kairali Ayurvedic Centres",
    ogImage: "/og.jpg",
    path: `/centres/${c.slug}`,
  }) as Metadata;
}

export default async function CentrePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const c = centreBySlug(slug);
  if (!c) notFound();

  const place = `${c.city}${c.region ? `, ${c.region}` : ""}`;
  const mapQuery = encodeURIComponent(`${c.name}, ${c.address}`);
  const jsonLd = graph(
    kairaliOrganization({ id: `${SITE}/#organization`, url: SITE }),
    medicalClinic({
      id: `${SITE}/centres/${c.slug}#clinic`,
      name: `${c.name} — ${c.city}`,
      url: `${SITE}/centres/${c.slug}`,
      email: c.email,
      telephone: c.phones[0],
      medicalSpecialty: "https://schema.org/PublicHealth",
      parentId: `${SITE}/#organization`,
      address: {
        streetAddress: c.address,
        addressLocality: c.city,
        ...(c.region ? { addressRegion: c.region } : {}),
        addressCountry: c.country,
      },
    }),
    breadcrumbList({
      id: `${SITE}/centres/${c.slug}#breadcrumb`,
      items: [
        { name: "Home", url: SITE },
        { name: `${c.city} Centre`, url: `${SITE}/centres/${c.slug}` },
      ],
    }),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />

      <nav className="breadcrumbs container" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">All centres</Link></li>
          <li><span>{c.city}</span></li>
        </ol>
      </nav>

      <article className="article">
        <div className="container reading">
          <div className="loc-head">
            <p className="overline">{c.country}{c.partner ? " · Partner centre" : ""}</p>
            <h1>Kairali Ayurvedic Centre, {c.city}</h1>
            <p className="article-lede">{c.name} in {place}. Classical Ayurvedic treatment from the Kairali Ayurvedic Group — physicians since 1908.</p>
          </div>

          <dl className="loc-facts">
            <div className="loc-fact">
              <dt>Address</dt>
              <dd>{c.address}<br />
                <a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} data-cta="map_click" rel="noopener" target="_blank">Open in Maps &rarr;</a>
              </dd>
            </div>
            <div className="loc-fact">
              <dt>Phone</dt>
              <dd>{c.phones.map((p, i) => (
                <span key={p}>{i > 0 ? ", " : ""}<a href={`tel:${p.replace(/[^\d+]/g, "")}`} data-cta="call_click">{p}</a></span>
              ))}</dd>
            </div>
            {c.hours ? (
              <div className="loc-fact"><dt>Timings</dt><dd>{c.hours}</dd></div>
            ) : null}
            {c.email ? (
              <div className="loc-fact"><dt>Email</dt><dd><a href={`mailto:${c.email}`} data-cta="email_click">{c.email}</a></dd></div>
            ) : null}
          </dl>

          {c.note ? <p className="loc-note">{c.note}</p> : null}

          <div className="capsule" style={{ marginTop: 28 }}>
            To book a consultation at our {c.city} centre, call the number above
            or message us on WhatsApp. For general enquiries across all Kairali
            centres, write to <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
          </div>

          <div className="cta-row" style={{ marginTop: 20 }}>
            <a className="btn btn-primary" href={WHATSAPP_URL} data-cta="whatsapp_click">Book on WhatsApp</a>
            <a className="btn btn-secondary" href={`tel:${c.phones[0].replace(/[^\d+]/g, "")}`} data-cta="call_click">Call the centre</a>
          </div>

          <p style={{ marginTop: 32 }}><Link href="/#india">&larr; See all Kairali centres</Link></p>
        </div>
      </article>

      <div className="sticky-cta" aria-label="Contact">
        <a className="btn btn-primary" href={WHATSAPP_URL} data-cta="whatsapp_click">Book on WhatsApp</a>
      </div>
    </>
  );
}

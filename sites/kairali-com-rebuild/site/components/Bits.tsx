import Link from "next/link";
import type { Crumb, Photo } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { cleanRoute } from "@/lib/routes";

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          {items.map((c, i) => (
            <li key={c.href + i}>{i === items.length - 1 ? <span aria-current="page">{c.name}</span> : <Link href={c.href}>{c.name}</Link>}</li>
          ))}
        </ol>
      </nav>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: SITE_URL + (c.href === "/" ? "/" : c.href) })),
      }} />
    </>
  );
}

/** Responsive selected company photograph. `priority` marks the LCP image. */
export function Photograph({ k, p, sizes = "100vw", priority = false, className = "" }: { k: string; p: Photo; sizes?: string; priority?: boolean; className?: string }) {
  const largest = p.sizes[p.sizes.length - 1];
  const h = Math.round(largest / p.ratio);
  return (
    <img className={className} src={`/media/photo/${k}-${p.sizes.includes(1600) ? 1600 : largest}.webp`}
      srcSet={p.sizes.map((w) => `/media/photo/${k}-${w}.webp ${w}w`).join(", ")} sizes={sizes}
      width={largest} height={h} alt={p.alt} loading={priority ? "eager" : "lazy"} decoding={priority ? "auto" : "async"}
      fetchPriority={priority ? "high" : "low"} />
  );
}

export function SubNav({ links, current }: { links: { label: string; href: string | null; current: boolean }[]; current: string }) {
  if (!links.length) return null;
  return (
    <nav className="subnav" aria-label="In this section">
      <div className="container">
        <ul>
          {links.map((l) => (
            <li key={l.label}>{l.current || !l.href || l.href === current
              ? <span aria-current="page">{l.label}</span>
              : <Link href={cleanRoute(l.href)}>{l.label}</Link>}</li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

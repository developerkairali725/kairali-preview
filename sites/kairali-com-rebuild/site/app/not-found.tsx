import Link from "next/link";
import type { Metadata } from "next";
import { Canopy } from "@/components/Motif";

export const metadata: Metadata = { title: { absolute: "Page not found | Kairali Ayurvedic Group" }, robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <section className="opener plain" aria-labelledby="nf-title" style={{ minHeight: "60vh" }}>
      <Canopy style={{ right: -120, top: 10, width: 520 }} />
      <div className="container"><div className="opener-inner">
        <span className="overline accent">Error 404</span>
        <h1 id="nf-title">We could not find that page.</h1>
        <p className="lede">The address may be mistyped, or the page may have moved. Search the site or start from one of these sections.</p>
        <form action="/search-results.aspx" className="search-box" role="search" style={{ maxWidth: 640 }}>
          <label htmlFor="nf-q" className="sr-only">Search kairali.com</label>
          <input id="nf-q" name="q" type="search" placeholder="Search kairali.com" />
          <button className="btn" type="submit">Search</button>
        </form>
        <div className="actions"><Link className="btn secondary" href="/">Home</Link><Link className="btn secondary" href="/ayurveda">Ayurveda</Link><Link className="btn secondary" href="/sitemap">Site map</Link><Link className="btn secondary" href="/contact-us">Contact us</Link></div>
      </div></div>
    </section>
  );
}

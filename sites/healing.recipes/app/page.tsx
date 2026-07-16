// healing.recipes — the books of Gita Ramesh (entity: group · register ED).
// Every fact on this page traces to docs/site-briefs/healing-recipes-books.md
// (two-source rule). The launch band is a PLACEHOLDER by ruling: event details
// do not exist yet (Abilash, 16 Jul 2026 18:15 IST) — no date, venue, or any
// specific beyond "July 2026" may be added until he supplies them.

import {
  graph,
  kairaliOrganization,
  webSite,
  breadcrumbList,
  person,
  book,
  serializeJsonLd,
} from "@kairali/schema";
import booksData from "../content/books.json";

const SITE = "https://healing.recipes";
const EMAIL = "info@kairali.com";
const AUTHOR_ID = `${SITE}/#gita-ramesh`;

const jsonLd = graph(
  kairaliOrganization({
    id: `${SITE}/#organization`,
    url: SITE,
  }),
  webSite({
    id: `${SITE}/#website`,
    name: "Healing Recipes",
    url: SITE,
    publisherId: `${SITE}/#organization`,
    inLanguage: "en",
  }),
  person({
    id: AUTHOR_ID,
    name: booksData.author.name,
    jobTitle: booksData.author.jobTitle,
    url: `${SITE}/author`,
    sameAs: booksData.author.sameAs,
    affiliationId: `${SITE}/#organization`,
  }),
  ...booksData.books.map((b) =>
    book({
      id: `${SITE}/books/${b.slug}#book`,
      name: b.title,
      alternateName: b.subtitle ? `${b.title}: ${b.subtitle}` : undefined,
      url: `${SITE}/books/${b.slug}`,
      image: `${SITE}${b.cover}`,
      authorId: AUTHOR_ID,
      isbn: b.isbn13,
      numberOfPages: b.pages,
      datePublished: b.datePublished,
      publisherName: b.publisher,
      inLanguage: "en",
      award: b.award,
      offers: b.buy.map((o) => ({ url: o.url, sellerName: o.label })),
    }),
  ),
  breadcrumbList({
    id: `${SITE}/#breadcrumb`,
    items: [{ name: "Home", url: SITE }],
  }),
);

const harmony = booksData.books.find((b) => b.slug === "harmony")!;
const wellness = booksData.books.find(
  (b) => b.slug === "the-ayurvedic-wellness-cookbook",
)!;

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <main>
        {/* ---------- Hero: a hardback title page ---------- */}
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <p className="overline">The Books of Gita Ramesh</p>
              <h1>Recipes that carry a lineage.</h1>
              <p className="lede">
                Four books by Gita Ramesh — co-founder and Joint Managing
                Director of the Kairali Ayurvedic Group, from a family
                practising Ayurveda since 1908 — including the cookbook named
                Best in the World at the Gourmand World Cookbook Awards 2023.
              </p>
              <div className="cta-row">
                <a className="btn btn-primary" href="/books/harmony" data-cta="hero_harmony">
                  Get Harmony — the new book
                </a>
                <a className="btn btn-secondary" href="#shelf" data-cta="hero_shelf">
                  Meet all four books
                </a>
              </div>
            </div>
            <figure className="hero-cover">
              <span className="new-tag">New · 2026</span>
              <img
                src={harmony.cover}
                alt={harmony.coverAlt}
                width={harmony.coverWidth}
                height={harmony.coverHeight}
                fetchPriority="high"
              />
              <figcaption className="biblio-line">
                Harmony: Essential Ayurveda for All · Roli Books · March 2026
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ---------- THE SHELF (signature) ---------- */}
        <section className="shelf" id="shelf" aria-labelledby="shelf-heading">
          <div className="container">
            <p className="overline">2000 — 2026 · All Published by Roli Books</p>
            {/* Rolling-number law (DECISIONS 16 Jul): the year count is
                computed from the 2000 origin at build, never typed. */}
            <h2 id="shelf-heading">
              One shelf, {new Date().getFullYear() - 2000} years of kitchen wisdom
            </h2>
            <p className="shelf-intro">
              Each book stands on the last: massage first, then the everyday
              cookbook, the award-winning wellness kitchen, and now the whole
              practice of living by Ayurveda.
            </p>
            <div className="shelf-row">
              {booksData.books.map((b) => (
                <a
                  key={b.slug}
                  className={`shelf-book${b.orientation === "landscape" ? " is-landscape" : ""}`}
                  href={`/books/${b.slug}`}
                  data-cta={`shelf_book_${b.slug}`}
                >
                  <span className="cover-slot">
                    <img
                      src={b.cover}
                      alt={b.coverAlt}
                      width={b.coverWidth}
                      height={b.coverHeight}
                      loading="lazy"
                    />
                  </span>
                  <span className="book-title">
                    {b.title}
                    {b.subtitle ? `: ${b.subtitle}` : ""}
                  </span>
                  <span className="biblio-line">
                    {b.shelfYear}
                    {b.shelfYearNote ? ` (${b.shelfYearNote})` : ""} · {b.publisher}
                    {b.pages ? ` · ${b.pages} pp` : ""}
                  </span>
                  {b.award ? <span className="award-line">{b.award}</span> : null}
                  {b.isNew ? <span className="award-line">New — out now</span> : null}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Featured: Harmony ---------- */}
        <section className="section" aria-labelledby="featured-heading">
          <div className="container section-grid">
            <figure className="section-photo">
              <img
                src="/covers/harmony-mockup.jpg"
                alt="The hardback edition of Harmony: Essential Ayurveda for All, photographed by Roli Books"
                width={900}
                height={1322}
                loading="lazy"
              />
              <figcaption className="biblio-line">
                The Roli Books hardback, March 2026.
              </figcaption>
            </figure>
            <div>
              <p className="overline">The New Book</p>
              <h2 id="featured-heading">Harmony: Essential Ayurveda for All</h2>
              <p>
                Food, yoga, mental wellness and home remedies — the cover says
                it in four words. Across 280 pages, Gita Ramesh reads the three
                doshas as personal blueprints for daily life, with recipes
                composed for specific imbalances and practices to restore
                balance.
              </p>
              <p>
                Out now in India; international edition since 14 July 2026, US
                trade edition 28 July 2026.
              </p>
              <div className="cta-row">
                <a className="btn btn-primary" href="/books/harmony" data-cta="featured_harmony">
                  See the book &amp; where to buy
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Award band ---------- */}
        <section className="band-award" aria-labelledby="award-heading">
          <div className="container">
            <p className="overline" id="award-heading">
              Gourmand World Cookbook Awards · Umeå, Sweden · 2023
            </p>
            <p className="award-quote">Best in the World.</p>
            <p>
              <em>The Ayurvedic Wellness Cookbook</em> took the world title in
              2023 —{" "}
              <a href={wellness.pressLinks![0].url} rel="noopener">
                as reported by The Hindu
              </a>
              .
            </p>
          </div>
        </section>

        {/* ---------- Author strip ---------- */}
        <section className="section author-strip" aria-labelledby="author-heading">
          <div className="container">
            <div className="author-card" style={{ marginTop: "80px" }}>
              <p className="overline">The Author</p>
              <h2 id="author-heading">Gita Ramesh</h2>
              <p>
                Co-founder and Joint Managing Director of the Kairali Ayurvedic
                Group, Gita Ramesh opened the first Kairali Ayurvedic Centre in
                New Delhi in 1989 and Kairali — The Ayurvedic Healing Village,
                Palakkad, in 1999. Her books put the group&rsquo;s kitchen
                philosophy in writing: food chosen for one&rsquo;s constitution,
                cooked simply, eaten with attention.
              </p>
              <a className="back-link" href="/author" data-cta="author_more">
                More about the author &rarr;
              </a>
            </div>
          </div>
        </section>

        {/* ---------- Launch band — PLACEHOLDER (do not add specifics) ---------- */}
        <section className="band-launch" aria-labelledby="launch-heading">
          <div className="container">
            <div className="launch-card">
              <p className="overline">Save the Date</p>
              <h2 id="launch-heading">Harmony — the official launch, July 2026</h2>
              <p>
                Details of the launch event will be announced here. For press
                and event enquiries, write to{" "}
                <a href={`mailto:${EMAIL}`} data-cta="email_click">
                  {EMAIL}
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

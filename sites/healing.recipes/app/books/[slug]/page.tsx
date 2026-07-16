// Book-plate page — one per verified book (content/books.json). Static params
// only: an unknown slug is a 404, never a fabricated page.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  graph,
  breadcrumbList,
  person,
  book,
  serializeJsonLd,
} from "@kairali/schema";
import { buildMetadata, LIMITS } from "@kairali/seo";
import siteConfig from "../../../site.config.json";
import booksData from "../../../content/books.json";

const SITE = "https://healing.recipes";
const AUTHOR_ID = `${SITE}/#gita-ramesh`;

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return booksData.books.map((b) => ({ slug: b.slug }));
}

export const dynamicParams = false;

function getBook(slug: string) {
  return booksData.books.find((b) => b.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const b = getBook(slug);
  if (!b) return {};
  // Through the packages/seo gate: buildMetadata THROWS on over-limit
  // title/description and sets canonical + og/twitter consistently.
  return buildMetadata(siteConfig, {
    title: `${b.title} — Gita Ramesh`.slice(0, LIMITS.title),
    description: b.blurb.slice(0, LIMITS.description),
    path: `/books/${b.slug}`,
    siteName: "Healing Recipes",
    ogType: "book",
    ogImage: b.cover,
  }) as Metadata;
}

export default async function BookPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const b = getBook(slug);
  if (!b) notFound();

  const jsonLd = graph(
    person({
      id: AUTHOR_ID,
      name: booksData.author.name,
      jobTitle: booksData.author.jobTitle,
      url: `${SITE}/author`,
      sameAs: booksData.author.sameAs,
    }),
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
    breadcrumbList({
      id: `${SITE}/books/${b.slug}#breadcrumb`,
      items: [
        { name: "Home", url: SITE },
        { name: "Books", url: `${SITE}/#shelf` },
        { name: b.title, url: `${SITE}/books/${b.slug}` },
      ],
    }),
  );

  return (
    <main className="plate">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <div className="container">
        <a className="back-link" href="/#shelf">
          &larr; All four books
        </a>
        <div className="plate-grid" style={{ marginTop: "24px" }}>
          <figure className="plate-cover">
            <img
              src={b.cover}
              alt={b.coverAlt}
              width={b.coverWidth}
              height={b.coverHeight}
              fetchPriority="high"
            />
          </figure>
          <div>
            <p className="overline">
              {b.shelfYear}
              {b.shelfYearNote ? ` · ${b.shelfYearNote}` : ""} · {b.publisher}
            </p>
            <h1>{b.title}</h1>
            {b.subtitle ? <p className="subtitle">{b.subtitle}</p> : null}
            {b.award ? <span className="award-banner">{b.award}</span> : null}

            {/* Buy sits ABOVE the fold on the conversion page (design-qa) */}
            <p className="overline" style={{ marginTop: "24px" }}>
              Where to buy
            </p>
            <div className="buy-row" style={{ margin: "0 0 8px" }}>
              {b.buy.map((o) => (
                <a
                  key={o.url}
                  className="btn btn-secondary"
                  href={o.url}
                  rel="noopener"
                  data-cta="buy_click"
                >
                  {o.label}
                </a>
              ))}
            </div>
            <p className="biblio-line buy-note">
              Links open the bookseller&rsquo;s own page; availability and
              pricing are theirs.
            </p>

            {b.about.map((para) => (
              <p key={para.slice(0, 24)} style={{ marginTop: "1em" }}>
                {para}
              </p>
            ))}

            <dl className="biblio-table">
              <div>
                <dt>Author</dt>
                <dd>Gita Ramesh</dd>
              </div>
              <div>
                <dt>Publisher</dt>
                <dd>{b.publisher}</dd>
              </div>
              <div>
                <dt>Published</dt>
                <dd>
                  {b.shelfYear}
                  {b.shelfYearNote ? ` (${b.shelfYearNote})` : ""}
                </dd>
              </div>
              {b.pages ? (
                <div>
                  <dt>Pages</dt>
                  <dd>{b.pages}</dd>
                </div>
              ) : null}
              <div>
                <dt>Format</dt>
                <dd>{b.format}</dd>
              </div>
              <div>
                <dt>ISBN-13</dt>
                <dd>{b.isbn13}</dd>
              </div>
            </dl>

            {b.pressLinks?.length ? (
              <>
                <p className="overline" style={{ marginTop: "28px" }}>
                  In the press
                </p>
                <ul className="press-list">
                  {b.pressLinks.map((pl) => (
                    <li key={pl.url}>
                      <a href={pl.url} rel="noopener">
                        {pl.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}

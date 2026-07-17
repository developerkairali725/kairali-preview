// The author page. Facts: docs/site-briefs/healing-recipes-books.md (author
// identity, two-source verified) + locked dates (Centre 1989; KTAHV 1999 —
// DECISIONS #53). Style law: she is "Gita Ramesh" or "Mrs. Ramesh", NEVER
// "Dr." — no medical credential is published anywhere (physician-roster
// finding, 15 Jul). No photograph ships until a real one is supplied.
import type { Metadata } from "next";
import {
  graph,
  person,
  breadcrumbList,
  serializeJsonLd,
} from "@kairali/schema";
import { buildMetadata } from "@kairali/seo";
import siteConfig from "../../site.config.json";
import booksData from "../../content/books.json";

const SITE = "https://healing.recipes";

// Through the packages/seo gate (throws on over-limit lengths).
export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "Gita Ramesh — Author & Co-Founder, Kairali Ayurvedic Group",
  description:
    "Gita Ramesh co-founded the Kairali Ayurvedic Group and wrote four books on Ayurvedic cooking, including the Gourmand-winning Wellness Cookbook.",
  path: "/author",
  siteName: "Healing Recipes",
}) as Metadata;

const jsonLd = graph(
  person({
    id: `${SITE}/#gita-ramesh`,
    name: booksData.author.name,
    jobTitle: booksData.author.jobTitle,
    url: `${SITE}/author`,
    sameAs: booksData.author.sameAs,
  }),
  breadcrumbList({
    id: `${SITE}/author#breadcrumb`,
    items: [
      { name: "Home", url: SITE },
      { name: "The Author", url: `${SITE}/author` },
    ],
  }),
);

export default function AuthorPage() {
  return (
    <main className="prose-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <div className="container">
        <p className="overline">The Author</p>
        <h1>Gita Ramesh</h1>
        <div className="prose">
          <p className="biblio-line">
            Co-Founder &amp; Joint Managing Director, Kairali Ayurvedic Group ·
            Author of four books · Gourmand World Cookbook Award 2023
          </p>
          <p>
            Gita Ramesh co-founded the Kairali Ayurvedic Group with
            K.&nbsp;V.&nbsp;Ramesh, opening the first Kairali Ayurvedic Centre
            in South Delhi in 1989 and Kairali — The Ayurvedic Healing Village
            in Palakkad, Kerala, on 14 February 1999. The group she helps lead
            today spans an NABH-accredited Ayurvedic hospital,
            WHO-GMP-certified medicine manufacturing, treatment centres in
            India and overseas, and comes from a family practising Ayurveda
            since 1908, when Dr.&nbsp;Sankunny Vaidiar opened his first clinic
            in Palakkad.
          </p>
          <p>
            Her four books, all published by Roli Books, move from therapy to
            table to daily life: <em>Ayurvedic Herbal Massage</em> (2000)
            documents the oil-massage tradition Kairali is built on;{" "}
            <em>The Ayurvedic Cookbook</em> brings constitution-based
            vegetarian cooking to the home kitchen;{" "}
            <em>The Ayurvedic Wellness Cookbook</em> (2022) was named Best in
            the World at the Gourmand World Cookbook Awards 2023; and{" "}
            <em>Harmony: Essential Ayurveda for All</em> (2026) widens the lens
            to food, yoga, mental wellness and home practice.
          </p>
          <p>
            The kitchen philosophy across all four is the same: food chosen for
            one&rsquo;s constitution, cooked simply, eaten with attention.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href="/#shelf" data-cta="author_shelf">
              See the four books
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

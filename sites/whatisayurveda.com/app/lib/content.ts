// Content loader + types for whatisayurveda.com. Page content lives as
// per-page JSON in ../content/, generated + claims-verified by the content
// pipeline (see docs/group-inputs/whatisayurveda-niche-brief.md §2-3).

import fs from "node:fs";
import path from "node:path";

export type Citation = { n: number; text: string; url?: string };
export type Section = { h2: string; capsule: string; body: string };
export type Faq = { q: string; a: string };
export type Crumb = { name: string; url: string };

export type Page = {
  slug: string;
  title: string;
  metaDescription: string;
  h1?: string;
  breadcrumb?: Crumb[];
  answerCapsule: string;
  sections: Section[];
  faqs?: Faq[];
  citations?: Citation[];
  routesTo?: string[];
  clinical: boolean;
  register_ok: "ok" | "review";

  /**
   * REAL physician sign-off only (Abilash ruling, 15 Jul 2026 — tiered honesty).
   * ISO YYYY-MM-DD, set ONLY when a physician has genuinely reviewed THIS page.
   * Its absence is honest and expected; a page without it renders NO reviewer
   * byline and emits NO `lastReviewed`/Physician JSON-LD. Never set this to a
   * build date — that fabricates a medical review under a named credential.
   */
  reviewedOn?: string;
  /** Roster key from app/lib/medical-review.ts. Defaults to the panel head. */
  reviewedBy?: string;

  /** Real publication/update dates. Omitted rather than fabricated. */
  publishedOn?: string;
  updatedOn?: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content");

/** All content pages, excluding the manifest. */
export function allPages(): Page[] {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".json") && !f.startsWith("_"));
  return files
    .map((f) => JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), "utf8")) as Page)
    .filter((p) => p && p.slug)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

/** Look up one page by its route slug (with or without leading slash). */
export function pageBySlug(slug: string): Page | undefined {
  const norm = "/" + slug.replace(/^\/+/, "");
  return allPages().find((p) => p.slug === norm);
}

/**
 * LIVE REVIEW COVERAGE — a verifiable number instead of a promise.
 *
 * Why this exists: an external audit judged the /about policy as "promises
 * without proof" and warned that naming a physician panel who had reviewed
 * nothing reads as BORROWED AUTHORITY to a sceptic. The honest answer is not to
 * hide the panel — it is to publish the real count and let the reader check it
 * against the badges on the pages themselves. Computed at build time from the
 * content, so it can never drift from the truth or be talked up in copy.
 */
export function reviewCoverage(): { reviewed: number; total: number; sentence: string } {
  const health = allPages().filter((p) => p.clinical);
  const total = health.length;
  const reviewed = health.filter((p) => p.reviewedOn).length;
  const sentence =
    reviewed === 0
      ? `As of today, **none of our ${total} health pages has been reviewed by one of our physicians yet** — so none of them carries a reviewer's name. You will see that stated at the top of each one. We would rather you knew.`
      : `As of today, **${reviewed} of our ${total} health pages** have been read and approved by one of our physicians, and each of those carries that doctor's name and the date. The remaining ${total - reviewed} say plainly that they have not.`;
  return { reviewed, total, sentence };
}

/** Slug → route segments for Next's generateStaticParams. */
export function allSlugParams(): { slug: string[] }[] {
  return allPages()
    .filter((p) => p.slug !== "/what-is-ayurveda") // pillar has its own route
    .map((p) => ({ slug: p.slug.replace(/^\/+/, "").split("/") }));
}

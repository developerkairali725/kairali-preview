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

/** Slug → route segments for Next's generateStaticParams. */
export function allSlugParams(): { slug: string[] }[] {
  return allPages()
    .filter((p) => p.slug !== "/what-is-ayurveda") // pillar has its own route
    .map((p) => ({ slug: p.slug.replace(/^\/+/, "").split("/") }));
}

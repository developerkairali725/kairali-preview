/**
 * AHV English candidate — per-route head metadata.
 *
 * Every fact here is READ from the approved package: the route's own dataset
 * record where it has one, otherwise its view's helmet. Nothing is composed,
 * improved or invented (HARD GATE 6) — including the source's own duplicate
 * and mismatched titles, which are preserved and reported, not fixed.
 *
 * DELIBERATELY NOT EMITTED: canonical and robots.
 * The approved design writes both itself once the runtime boots — the helmet
 * for a view-owned route, applyHead() for a dataset-bound one. Emitting them
 * here as well put TWO <link rel="canonical"> and TWO <meta name="robots"> in
 * every head, which the independent 320px review flagged on all 25 routes it
 * checked. The design's single canonical is the approved one, and the staging
 * noindex is enforced three ways that do not duplicate a tag:
 *   · X-Robots-Tag response header (next.config.ts) — JS cannot overwrite it
 *   · robots.txt Disallow: /
 *   · the served payload's own robots values, rewritten to noindex at import,
 *     plus the boot script's head guard for anything a renderer re-adds.
 */
import type { Metadata } from "next";
import type { CandidateRoute } from "./registry";

export function routeMetadata(route: CandidateRoute): Metadata {
  const m = route.metadata;
  const meta: Metadata = {
    title: m.title ?? "Kairali — The Ayurvedic Healing Village",
  };
  if (m.description) meta.description = m.description;

  const ogTitle = m.ogTitle ?? m.title;
  const ogDescription = m.ogDescription ?? m.description;
  if (ogTitle || ogDescription || m.ogImage) {
    meta.openGraph = {
      ...(ogTitle ? { title: ogTitle } : {}),
      ...(ogDescription ? { description: ogDescription } : {}),
      ...(m.ogImage ? { images: [m.ogImage] } : {}),
      ...(m.canonical ? { url: m.canonical } : {}),
      type: m.ogType === "article" ? "article" : "website",
      siteName: "Kairali – The Ayurvedic Healing Village",
      locale: "en_US",
    };
  }
  return meta;
}

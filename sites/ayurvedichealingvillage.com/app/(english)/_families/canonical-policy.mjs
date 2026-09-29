/**
 * AHV English lane — which canonical the SERVER writes into the raw HTML (SEO-D22 / D-10, 29 Sep 2026).
 *
 * Before: only 13 routes whose renderer writes no canonical after mounting (english-candidate/canonical-server-routes.json)
 * plus alias routes emitted one server-side, so 238 of 254 English routes shipped raw HTML with NO canonical. Crawlers
 * and answer engines that do not run JavaScript saw none; only the hydrated page carried it.
 *
 * Now: every route whose manifest declares a canonical on the locked origin emits it server-side. This is the SAME
 * value the design writes at runtime — the route's manifest canonical is read from that route's own view helmet or
 * dataset record, and test/seo-d22.test.mjs pins that every literal view canonical and every dataset-record canonical
 * equals it, so raw and hydrated HTML can never name two different canonicals. After hydration boot.ts's
 * governedWins() keeps exactly one <link rel="canonical"> (the design's governed node when it writes one), the same
 * mechanism the alias routes have relied on since 28 Sep. A route with no manifest canonical emits none (unchanged:
 * no canonical is invented here — HARD GATE 6).
 */
export const SITE_ORIGIN = "https://ayurvedichealingvillage.com";

/** @param {{ metadata?: { canonical?: string | null } } | null | undefined} route @returns {string | null} */
export function serverCanonical(route) {
  const c = route && route.metadata ? route.metadata.canonical : null;
  if (!c || typeof c !== "string") return null;
  let u;
  try { u = new URL(c); } catch { return null; }
  return u.origin === SITE_ORIGIN ? c : null;
}

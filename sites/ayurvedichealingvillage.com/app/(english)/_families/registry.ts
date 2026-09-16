/**
 * AHV English candidate — route registry.
 *
 * Single source of truth for the 252 approved English routes, generated from
 * the read-only design package by tools/import-english-candidate.mjs. Every
 * route page in this lane reads the registry; none of them hard-codes a path,
 * a view or a title.
 *
 * Families: the 252 routes are served by 136 reusable views (a Desktop/Mobile
 * pair per design) plus 21 datasets. A "family" here is one view pair and the
 * dataset it resolves records from — the same unit the approved package uses.
 * A route binds to a family; it does not own a template of its own.
 */
import manifest from "../../../english-candidate/route-manifest.json";

export interface RouteMetadata {
  title: string | null;
  description: string | null;
  canonical: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  ogType: string | null;
}

export interface CandidateRoute {
  /** Source path exactly as the approved package declares it, e.g. "/about-us/". */
  path: string;
  /** URL segments Next.js routes on, e.g. ["about-us"]. Empty for the homepage. */
  segments: string[];
  /** Payload id of the wide view (>= BREAKPOINT px). */
  desktopView: string | null;
  /** Payload id of the narrow view (< BREAKPOINT px). */
  mobileView: string | null;
  /** Package-relative dataset this route resolves its record from, if any. */
  dataset: string | null;
  /** Where the head facts came from — the dataset record or the view helmet. */
  metadataSource: "dataset" | "view-helmet";
  metadata: RouteMetadata;
  /**
   * Set by english-candidate/route-overrides.json when the route canonicalises
   * to another approved route: it still serves its page, but is left out of
   * the sitemap.
   */
  sitemapExclude?: boolean;
}

/**
 * Narrow/wide switch point, in CSS px. Matches the approved package preview,
 * which serves the Mobile view below 700 and the Desktop view at or above it.
 */
export const BREAKPOINT = 700;

export const CANDIDATE_TASK_ID = manifest.taskId;
export const CANDIDATE_SOURCE = manifest.source;

/** Routes deferred by the owner and deliberately NOT served (they 404). */
export const DEFERRED_ROUTES: readonly string[] = manifest.deferred;

export const routes = manifest.routes as CandidateRoute[];

const bySegments = new Map<string, CandidateRoute>(
  routes.map((r) => [r.segments.join("/"), r]),
);

/** The homepage route ("/"), which has no segments. */
export function homeRoute(): CandidateRoute {
  const home = bySegments.get("");
  if (!home) throw new Error("english-candidate: no route for '/' in the manifest");
  return home;
}

/** Every route except the homepage — the catch-all segment set. */
export function subRoutes(): CandidateRoute[] {
  return routes.filter((r) => r.segments.length > 0);
}

/** Resolve URL segments to a route. Unknown segments return undefined -> 404. */
export function findRoute(segments: string[] | undefined): CandidateRoute | undefined {
  return bySegments.get((segments ?? []).join("/"));
}

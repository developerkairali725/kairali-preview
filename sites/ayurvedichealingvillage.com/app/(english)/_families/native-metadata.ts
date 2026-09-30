import type { Metadata } from "next";
import { findRoute } from "./registry";
import { routeMetadata } from "./metadata";

/**
 * The four English native pages (/sightseeing/, /video-gallery/, /read-feedback/, /givefeedback/) declared their
 * head by hand: approved title, description and canonical, but no robots policy, no og:locale and no hreflang
 * cluster — so each of their 12 localized equivalents pointed back at an English page that did not point to them
 * (staging SEO pass 28 Sep 2026: 48 reciprocity failures, all from these four). Their approved title, description
 * and canonical stay exactly as written; robots, Open Graph locale/alternates and the language cluster come from
 * the same routeMetadata() every other English route uses.
 */
export function nativeEnglishMetadata(path: string, view: Metadata): Metadata {
  const route = findRoute(path.split("/").filter(Boolean));
  if (!route) return view;
  const base = routeMetadata(route, "en");
  const viewAlt = view.alternates && typeof view.alternates === "object" ? view.alternates : {};
  const canonical = "canonical" in viewAlt && viewAlt.canonical ? viewAlt.canonical : base.alternates?.canonical;
  const title = view.title ?? base.title;
  const description = view.description ?? base.description;
  return {
    ...base,
    title,
    ...(description ? { description } : {}),
    alternates: { ...(base.alternates ?? {}), ...(canonical ? { canonical } : {}) },
    ...(base.openGraph
      ? { openGraph: { ...base.openGraph, ...(typeof title === "string" ? { title } : {}), ...(description ? { description } : {}) } }
      : {}),
    // twitter:* would otherwise fall back to the manifest's ogTitle/ogDescription, not the approved head (lane D-08)
    ...(base.twitter
      ? { twitter: { ...base.twitter, ...(typeof title === "string" ? { title } : {}), ...(description ? { description } : {}) } }
      : {}),
  };
}

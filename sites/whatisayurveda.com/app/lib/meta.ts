import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import siteConfig from "../../site.config.json";
import type { Page } from "./content";

/** Clamp to a word boundary at or under `max` chars (buildMetadata gate is a
 *  hard throw; AI-authored copy is separately quality-checked, so we keep the
 *  build green for the preview rather than fail on one long field). */
function clamp(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const at = cut.lastIndexOf(" ");
  return (at > max * 0.6 ? cut.slice(0, at) : cut).replace(/[\s,;:–-]+$/, "");
}

export function pageMetadata(page: Page): Metadata {
  return buildMetadata(siteConfig, {
    title: clamp(page.title, 60),
    description: clamp(page.metaDescription, 155),
    siteName: "What is Ayurveda",
    ogImage: "/og.jpg",
    path: page.slug,
  }) as Metadata;
}

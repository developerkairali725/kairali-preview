// The pillar page — its own route so it can carry the canonical /what-is-ayurveda.
import { notFound } from "next/navigation";
import { Article } from "../_components/article";
import { pageBySlug } from "../lib/content";
import { pageMetadata } from "../lib/meta";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  const page = pageBySlug("what-is-ayurveda");
  return page ? pageMetadata(page) : {};
}

export default function PillarPage() {
  const page = pageBySlug("what-is-ayurveda");
  if (!page) notFound();
  return <Article page={page} />;
}

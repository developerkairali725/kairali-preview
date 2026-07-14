// Catch-all route for every content spoke/hub except the pillar (which has its
// own /what-is-ayurveda route) and the home page. Statically generated from
// the content JSON at build time.
import { notFound } from "next/navigation";
import { Article } from "../_components/article";
import { allSlugParams, pageBySlug } from "../lib/content";
import { pageMetadata } from "../lib/meta";
import type { Metadata } from "next";

export function generateStaticParams() {
  return allSlugParams();
}

export async function generateMetadata(props: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const page = pageBySlug(slug.join("/"));
  return page ? pageMetadata(page) : {};
}

export default async function SpokePage(props: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await props.params;
  const page = pageBySlug(slug.join("/"));
  if (!page) notFound();
  return <Article page={page} />;
}

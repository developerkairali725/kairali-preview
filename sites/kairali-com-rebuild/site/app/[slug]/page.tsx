import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LegacyPage from "@/components/LegacyPage";
import { getPage, plainSlugs, type Page } from "@/lib/content";
import { buildMetadata, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

// The site search is a new utility page at the legacy search URL (live: JS-only AJAX results).
const SEARCH: Page = {
  route: "/search-results.aspx", origin: "rebuilt", sourceUrl: "https://www.kairali.com/search-results.aspx", sourceSha256: "", family: "M", template: "Search",
  mapTitle: "Search", group: null, ownerFact: "", title: "Search | Kairali Ayurvedic Group", description: "Search every page of kairali.com: Ayurveda, treatments, stays, products, training, awards and more.",
  keywords: "", sourceH1: "Search", banner: { tagline: "", h1: "Search kairali.com", subtitle: [], sublinks: [], rest: "" }, hero: null, sections: [], images: [],
  videos: [], docs: [], links: [], text: "", words: 0,
};

export function generateStaticParams() {
  return [...plainSlugs(), "search-results.aspx"].map((slug) => ({ slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "search-results.aspx") return buildMetadata({ route: SEARCH.route, title: SEARCH.title, description: SEARCH.description, noindex: true });
  const p = getPage("/" + decodeURIComponent(slug));
  if (!p) return {};
  return pageMetadata(p);
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  if (slug === "search-results.aspx") return <LegacyPage page={SEARCH} />;
  const p = getPage("/" + decodeURIComponent(slug));
  if (!p) notFound();
  return <LegacyPage page={p} />;
}

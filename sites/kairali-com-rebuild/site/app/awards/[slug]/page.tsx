import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LegacyPage from "@/components/LegacyPage";
import { awardRoutes, getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { awardSlug, cleanRoute } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() { return awardRoutes().map((a) => ({ slug: awardSlug(a.value) })); }
type Params = { params: Promise<{ slug: string }> };
const find = (slug: string) => awardRoutes().find((a) => awardSlug(a.value) === slug);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const a = find((await params).slug);
  const p = a && getPage(a.route);
  return p ? pageMetadata(p, { route: cleanRoute(p.route) }) : {};
}
export default async function Page({ params }: Params) {
  const a = find((await params).slug);
  const p = a && getPage(a.route);
  if (!p) notFound();
  return <LegacyPage page={p} />;
}


// Internal target for /detail.aspx?page=<value> (rewritten by proxy.ts; direct access returns 404).
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LegacyPage from "@/components/LegacyPage";
import { awardRoutes, getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() { return awardRoutes().map((a) => ({ key: a.key })); }
type Params = { params: Promise<{ key: string }> };
const find = (key: string) => awardRoutes().find((a) => a.key === key);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const a = find((await params).key);
  const p = a && getPage(a.route);
  return p ? pageMetadata(p) : {};
}
export default async function Page({ params }: Params) {
  const a = find((await params).key);
  const p = a && getPage(a.route);
  if (!p) notFound();
  return <LegacyPage page={p} />;
}

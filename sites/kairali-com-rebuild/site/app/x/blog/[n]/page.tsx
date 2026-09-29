// Internal target for /kairali-blog.aspx?page=<n> (rewritten by proxy.ts). Page 1 canonicalises to the base URL.
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LegacyPage from "@/components/LegacyPage";
import { getPage, pages } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(pages()).filter((r) => r.startsWith("/kairali-blog.aspx?page=")).map((r) => ({ n: r.split("=")[1] }));
}
type Params = { params: Promise<{ n: string }> };
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { n } = await params;
  const p = getPage(`/kairali-blog.aspx?page=${n}`);
  if (!p) return {};
  return n === "1" ? pageMetadata(getPage("/kairali-blog.aspx")!, { route: p.route, canonical: "https://www.kairali.com/kairali-blog.aspx" })
    : pageMetadata(p, { title: "Kairali Blog – Page 2 | Kairali Ayurvedic Group", description: "Kairali Ayurvedic Group blog archive, page 2: earlier articles and event reports from Kairali." });
}
export default async function Page({ params }: Params) {
  const { n } = await params;
  const p = getPage(`/kairali-blog.aspx?page=${n}`);
  if (!p) notFound();
  return <LegacyPage page={p} />;
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LegacyPage from "@/components/LegacyPage";
import { getPage, pages } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(pages()).filter((r) => r.startsWith("/kairali-blog.aspx?page=") && !r.endsWith("=1")).map((r) => ({ n: r.split("=")[1] }));
}
type Params = { params: Promise<{ n: string }> };
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { n } = await params;
  const p = getPage(`/kairali-blog.aspx?page=${n}`);
  return p ? pageMetadata(p, { route: `/kairali-blog/page/${n}`, title: `Kairali Blog – Page ${n} | Kairali Ayurvedic Group` }) : {};
}
export default async function Page({ params }: Params) {
  const { n } = await params;
  const p = getPage(`/kairali-blog.aspx?page=${n}`);
  if (!p) notFound();
  return <LegacyPage page={p} />;
}

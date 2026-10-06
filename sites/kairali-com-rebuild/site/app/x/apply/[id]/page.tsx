// Internal target for /apply-now.aspx?id=<n> (rewritten by proxy.ts). Each known id pre-selects its opening.
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LegacyPage from "@/components/LegacyPage";
import { applyIds, getPage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() { return applyIds().map((id) => ({ id })); }
type Params = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const p = getPage(`/apply-now.aspx?id=${id}`);
  if (!p) return {};
  return buildMetadata({ route: p.route, title: `Careers interest reference ${id} | Kairali Ayurvedic Group`,
    description: `Legacy career enquiry reference ${id} is inactive. Kairali welcomes general expressions of interest; vacancy status is pending HR confirmation.`, image: "/og/ahv-cottages.jpg" });
}
export default async function Page({ params }: Params) {
  const { id } = await params;
  const p = getPage(`/apply-now.aspx?id=${id}`);
  if (!p) notFound();
  return <LegacyPage page={p} applyId={id} />;
}

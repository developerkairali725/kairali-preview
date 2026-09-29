// Internal target for /apply-now.aspx?id=<n> (rewritten by proxy.ts). Each known id pre-selects its opening.
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LegacyPage from "@/components/LegacyPage";
import { applyIds, getPage, pageHeading } from "@/lib/content";
import { buildMetadata, descriptionFor } from "@/lib/seo";
import opts from "@/content/form-options.json";

export const dynamicParams = false;
export function generateStaticParams() { return applyIds().map((id) => ({ id })); }
type Params = { params: Promise<{ id: string }> };
const job = (id: string) => (opts.jobs as Record<string, { post: string; ref: string }>)[id];

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const p = getPage(`/apply-now.aspx?id=${id}`);
  if (!p) return {};
  const j = job(id);
  return buildMetadata({ route: p.route, title: `Apply Now: ${j?.post ?? pageHeading(p)} | Kairali Ayurvedic Group`,
    description: j ? `Apply for the ${j.post} opening (job reference ${j.ref}) at Kairali Ayurvedic Group.` : descriptionFor(p).description, image: "/og/ahv-cottages.jpg" });
}
export default async function Page({ params }: Params) {
  const { id } = await params;
  const p = getPage(`/apply-now.aspx?id=${id}`);
  if (!p) notFound();
  return <LegacyPage page={p} applyId={id} />;
}

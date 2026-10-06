import retainedOriginalRoutes from "../../../campaign-v110/retained-original-routes.json";
import campaignRoutes from "../../../campaign-v110/routes.json";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DesignView } from "../_families/design-view";
import { StaticDesignView } from "../_families/static-design-view";
import { routeMetadata } from "../_families/metadata";
import { findRoute, subRoutes } from "../_families/registry";

/**
 * Every approved English route except "/" — one real, direct-path page each.
 *
 * `dynamicParams = false` is the whole 404 policy: the only paths this lane
 * answers are the 252 the approved package declares. Anything else — including
 * the deferred /ru/ tree and /treatment-in-kerala-russian.html — gets a 404
 * rather than a nearest-match English page.
 *
 * Static routes elsewhere in the app (the /lp/ lane, /privacy, /terms) keep
 * priority over this catch-all: Next.js resolves a matching static segment
 * before a dynamic one.
 */
export const dynamicParams = false;

export function generateStaticParams(): Array<{ slug: string[] }> {
  // Native pages must not also be emitted by this catch-all: duplicate static
  // output can overwrite them during production builds despite route priority.
  const nativePages = new Set(["/read-feedback/", "/givefeedback/", "/sightseeing/", "/video-gallery/", "/weight-loss-programme/", "/digestive-wellness-gut-health-yoga-therapy/"]);
  return subRoutes().filter((r) => !nativePages.has(r.path) && (!campaignRoutes.includes(r.path) || retainedOriginalRoutes.includes(r.path))).map((r) => ({ slug: r.segments }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const route = findRoute(slug);
  if (!route) return { title: "Not found", robots: { index: false, follow: false } };
  return routeMetadata(route);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const route = findRoute(slug);
  if (!route) notFound();
  if (route.path === "/contact-us/" || route.path === "/panchakarma-therapy/") return <StaticDesignView route={route} />;
  return <DesignView route={route} />;
}

import type { Metadata } from "next";
import { StaticDesignView } from "./_families/static-design-view";
import { routeMetadata } from "./_families/metadata";
import { homeRoute } from "./_families/registry";

/**
 * "/" — the approved AHV English homepage.
 *
 * Its wide view is the owner-approved "Home Hi-Fi v4"; the narrow view is
 * "Home Mobile". Both come from the design package unchanged.
 */
export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  return routeMetadata(homeRoute());
}

export default function Page() {
  return <StaticDesignView route={homeRoute()} />;
}

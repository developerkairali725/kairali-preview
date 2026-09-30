import type { CandidateRoute } from "./registry";
import overrides from "../../../english-candidate/route-overrides.json";

const internalRoutes = new Set([
  "/search/", "/search-results/", "/ppc-thanks/", "/emailsubscriber/",
  "/cart/", "/checkout/", "/my-account/", "/test-page/", "/test-page-2/", "/testing/", "/gift-test/",
  "/contact-us-old/", "/enquiry-form-old/", "/how-to-reach-old/", "/online-consultation-old/", "/postulez-maintenant/",
  "/contact-us/thank-you/", "/onlinebookingthankyou/", "/onlineconsultation-thanks/", "/thanks/", "/thanks-old/", "/thank-you/", "/thankyou/"
]);
// Canonical consolidation is distinct from noindex. Keep the recorded owner
// overrides; imported staging robots values are not the production policy.
export function routeRobots(route: Pick<CandidateRoute, "path" | "sitemapExclude">, staging = process.env.AHV_STAGING !== "0"): string {
  if (staging) return "noindex, nofollow";
  const explicit = (overrides.robotsOverrides as Record<string, string>)[route.path];
  if (explicit) return explicit;
  return internalRoutes.has(route.path) || route.path.startsWith("/lp/") ? "noindex, follow" : "index, follow";
}

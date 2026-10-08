import { routeRobots } from "../app/(english)/_families/robots-policy";
import { routes, DEFERRED_ROUTES } from "../app/(english)/_families/registry";
import { galleryImageUrls } from "../app/(english)/_families/schema";
import { TARGET_CODES, alternates, localizedPath, ORIGIN } from "../app/(english)/_families/l10n";
import redirects from "../english-candidate/redirect-map.json";
import localeRoutes from "../l10n/routes.json";
import tree from "../english-candidate/site-tree.json";
import ledger from "../english-candidate/catalogue-route-ledger.json";
import yogaRates from "../english-candidate/final-rates/yoga.json";
import campaignRoutes from "../campaign-v110/routes.json";
import { buildCategorySitemap, categoryForPath, type SitemapCategory } from "./sitemap";

export { ORIGIN };
export const IS_STAGING = process.env.AHV_STAGING !== "0";
const categories = {
  ledger: new Map(ledger.rows.map((row) => [row.path, row.sitemapCategory])),
  tree: { ...tree.unlisted, ...tree.index },
  campaigns: new Set(campaignRoutes),
  yoga: new Set(yogaRates.groups.flatMap((group) => group.programmes.map((programme) => new URL(programme.url).pathname))),
};
// Campaign pages have their own approved registry and layouts. Every native
// campaign URL is self-canonical; the source contract test checks their actual
// page/content metadata. Existing main-registry canonical exclusions win.
const registered = new Set(routes.map((route) => route.path));
const inventory = [...routes, ...campaignRoutes.filter((path) => !registered.has(path)).map((path) => ({ path }))];

export function categorySitemap(category: SitemapCategory) {
  return buildCategorySitemap(category, {
    origin: ORIGIN,
    staging: IS_STAGING,
    routes: inventory,
    // Removing a route or locale alias from XML follows the actual redirect
    // map, never a proposed disposition in the review ledger.
    redirects: { ...localeRoutes.redirects, ...redirects.redirects },
    deferred: DEFERRED_ROUTES,
    routeRobots,
    categoryForPath: (path) => categoryForPath(path, categories),
    localizedPaths: (path) => TARGET_CODES.map((code) => localizedPath(path, code)).filter((path): path is string => !!path),
    alternates,
    galleryImageUrls,
  });
}

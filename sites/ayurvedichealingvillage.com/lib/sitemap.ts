/** XML-D7: the approved category split, in the same release as route consolidation. */
export const SITEMAP_CATEGORIES = ["ayurveda", "yoga", "training", "campaigns", "knowledge", "archive", "site"] as const;
export type SitemapCategory = typeof SITEMAP_CATEGORIES[number];
export interface SitemapRoute {
  path: string;
  sitemapExclude?: boolean;
  metadata?: { canonical?: string | null };
}
export interface SitemapEntry {
  url: string;
  images?: string[];
  alternates?: { languages: Record<string, string> };
}
interface SitemapSource {
  origin: string;
  staging: boolean;
  routes: SitemapRoute[];
  redirects: Record<string, unknown>;
  deferred: readonly string[];
  routeRobots: (route: SitemapRoute, staging: boolean) => string;
  categoryForPath: (path: string) => SitemapCategory;
  localizedPaths: (path: string) => string[];
  alternates: (path: string) => Record<string, string>;
  galleryImageUrls: (path: string) => string[];
}

export function sitemapCategory(value: string): SitemapCategory | null {
  return SITEMAP_CATEGORIES.find((category) => value === `${category}.xml`) ?? null;
}

export function categoryForPath(path: string, options: {
  ledger: ReadonlyMap<string, string>;
  tree: Record<string, { section: string }>;
  campaigns: ReadonlySet<string>;
  yoga: ReadonlySet<string>;
}): SitemapCategory {
  // Reviewed placements beat inherited navigation (e.g. Panchakarma knowledge,
  // Air India partnership, yoga training and the two mixed programme finders).
  const reviewed = options.ledger.get(path);
  if (reviewed && SITEMAP_CATEGORIES.includes(reviewed as SitemapCategory)) return reviewed as SitemapCategory;
  if (options.campaigns.has(path)) return "campaigns";
  if (options.yoga.has(path)) return "yoga";
  const section = options.tree[path]?.section;
  if (section === "programmes") return "ayurveda";
  if (section === "training" || section === "knowledge") return section;
  if (section === "campaigns" || section === "offers") return "campaigns";
  if (section === "news") return "archive";
  return "site";
}

export function buildCategorySitemap(category: SitemapCategory, source: SitemapSource): SitemapEntry[] {
  if (source.staging) return [];
  const redirected = new Set(Object.keys(source.redirects));
  const deferred = new Set(source.deferred);
  const seen = new Set<string>();
  const entries: SitemapEntry[] = [];
  for (const route of source.routes) {
    if (seen.has(route.path)) continue;
    seen.add(route.path);
    if (route.sitemapExclude || redirected.has(route.path) || deferred.has(route.path)
      || !source.routeRobots(route, false).startsWith("index")
      || source.categoryForPath(route.path) !== category) continue;
    // The sitemap must never advertise a served alias as a canonical page.
    if (route.metadata?.canonical && route.metadata.canonical !== source.origin + route.path) continue;
    // Deferred applies to the English registry only: its historical /ru/
    // entry is now also the released Russian homepage, supplied by l10n.
    const paths = [route.path, ...source.localizedPaths(route.path)]
      .filter((path, index, all) => all.indexOf(path) === index && !redirected.has(path));
    const urls = new Set(paths.map((path) => source.origin + path));
    const languages = Object.fromEntries(Object.entries(source.alternates(route.path)).filter(([, url]) => urls.has(url)));
    const images = source.galleryImageUrls(route.path);
    if (images.length > 1000) throw new Error(`Sitemap image limit exceeded: ${route.path}`);
    for (const path of paths) entries.push({
      url: source.origin + path,
      ...(images.length ? { images } : {}),
      ...(Object.keys(languages).length > 2 ? { alternates: { languages } } : {}),
    });
  }
  return entries;
}

function xml(value: string): string {
  return value.replace(/[<>&"']/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[character]!);
}

export function sitemapIndexXml(origin: string, staging: boolean): string {
  const children = staging ? [] : SITEMAP_CATEGORIES.map((category) =>
    `<sitemap><loc>${xml(`${origin}/sitemaps/${category}.xml`)}</loc></sitemap>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${children.join("\n")}\n</sitemapindex>\n`;
}

export function sitemapXml(entries: SitemapEntry[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${entries.map((entry) => [
    "<url>", `<loc>${xml(entry.url)}</loc>`,
    ...Object.entries(entry.alternates?.languages ?? {}).map(([language, url]) => `<xhtml:link rel="alternate" hreflang="${xml(language)}" href="${xml(url)}"/>`),
    ...(entry.images ?? []).map((url) => `<image:image><image:loc>${xml(url)}</image:loc></image:image>`),
    "</url>",
  ].join("\n")).join("\n")}\n</urlset>\n`;
}

export function sitemapResponse(body: string, staging: boolean): Response {
  return new Response(body, { headers: {
    "Content-Type": "application/xml; charset=utf-8",
    ...(staging ? { "X-Robots-Tag": "noindex, nofollow" } : {}),
  } });
}

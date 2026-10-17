/** Public URL policy for the rebuild.
 *
 * Content is still keyed by its captured ASP.NET URL, but visitors and search
 * engines only see extensionless URLs. The proxy keeps every old URL working
 * as a one-hop permanent redirect.
 */
export function awardSlug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function cleanRoute(route: string): string {
  if (!route || !route.startsWith("/") || route.startsWith("//")) return route;
  const hashAt = route.indexOf("#");
  const hash = hashAt >= 0 ? route.slice(hashAt) : "";
  const withoutHash = hashAt >= 0 ? route.slice(0, hashAt) : route;
  const [pathname, rawQuery = ""] = withoutHash.split("?", 2);
  const lower = pathname.toLowerCase();

  // The legacy award endpoint treated every byte after `page=` as the value,
  // including an unescaped ampersand in one historical slug.
  if (lower === "/detail.aspx" && rawQuery.toLowerCase().startsWith("page=")) {
    const rawValue = rawQuery.slice(5);
    let value = rawValue;
    try { value = decodeURIComponent(rawValue.replace(/\+/g, " ")); } catch { /* keep the captured value */ }
    return `/awards/${awardSlug(value)}${hash}`;
  }

  const params = new URLSearchParams(rawQuery);

  if (lower === "/default.aspx") return "/" + hash;
  if (lower === "/search-results.aspx") {
    const query = params.toString();
    return `/search${query ? `?${query}` : ""}${hash}`;
  }
  if (lower === "/apply-now.aspx" && params.has("id")) {
    return `/careers/apply/${encodeURIComponent(params.get("id") || "")}${hash}`;
  }
  if (lower === "/kairali-blog.aspx" && params.has("page")) {
    const page = params.get("page");
    return page === "1" ? `/kairali-blog${hash}` : `/kairali-blog/page/${encodeURIComponent(page || "")}${hash}`;
  }

  const cleanPath = pathname.replace(/\.aspx$/i, "");
  const query = params.toString();
  return `${cleanPath}${query ? `?${query}` : ""}${hash}`;
}


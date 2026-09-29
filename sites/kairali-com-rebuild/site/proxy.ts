import { NextResponse, type NextRequest } from "next/server";
import table from "./content/route-table.json";

// Legacy URL behaviour for the ASP.NET site (docs/ROUTING.md):
//  - /detail.aspx?page=<value>   byte-exact value (incl. trailing "." and "&") -> award record; unknown -> 404
//  - /apply-now.aspx?id=<n>      known id -> opening pre-selected; unknown id -> generic form (as live)
//  - /kairali-blog.aspx?page=<n> pages 1-2 exist; others -> 404 (live page 3 was an empty shell)
//  - IIS ignored letter case: case variants 301 once to the canonical spelling
//  - /default.aspx -> / and Namaste Dwaar -> /our-partner-resorts.aspx (owner Q2), one hop
//  - /x/* are internal rewrite targets and never served directly
type Table = { plain: Record<string, string>; docs: Record<string, string>; awards: Record<string, string>; apply: string[]; blog: string[]; redirects: Record<string, string> };
const T = table as Table;
const NOT_FOUND = "/x/not-found";
const INTERNAL = "x-kairali-internal-rewrite";
function rewrite(req: NextRequest, pathname: string, status?: number) {
  const headers = new Headers(req.headers);
  headers.set(INTERNAL, "1");
  return NextResponse.rewrite(internal(req, pathname), { status, request: { headers } });
}
// Rewrites must stay internal: build them from nextUrl (same origin as the running server).
function internal(req: NextRequest, pathname: string) {
  const u = req.nextUrl.clone();
  u.pathname = pathname;
  u.search = "";
  return u;
}

export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;
  const lower = path.toLowerCase();
  const rawQuery = new URL(req.url).search.slice(1); // undecoded, keeps "&" inside legacy values

  if (lower.startsWith("/x/")) {
    if (req.headers.get(INTERNAL) === "1") return NextResponse.next(); // our own rewrite re-entering the proxy
    return notFound(req);
  }

  const target = T.redirects[lower];
  if (target) { const r = req.nextUrl.clone(); r.pathname = target; r.search = ""; return NextResponse.redirect(r, 301); }

  if (lower === "/detail.aspx") {
    if (path !== "/detail.aspx") return redirectKeepQuery(req, "/detail.aspx");
    if (!rawQuery.toLowerCase().startsWith("page=")) return notFound(req);
    let value = safeDecode(rawQuery.slice(5));
    let key = T.awards[value];
    if (!key && value.endsWith("=")) key = T.awards[value.slice(0, -1)]; // sitemap variant "…-wellness-congress="
    if (!key) {
      const ci = Object.keys(T.awards).find((v) => v.toLowerCase() === value.toLowerCase());
      if (ci) { const r = req.nextUrl.clone(); r.search = `?page=${encodeLegacy(ci)}`; return NextResponse.redirect(r, 301); }
      return notFound(req);
    }
    return rewrite(req, `/x/award/${key}`);
  }

  if (lower === "/apply-now.aspx") {
    if (path !== "/apply-now.aspx") return redirectKeepQuery(req, "/apply-now.aspx");
    const id = url.searchParams.get("id");
    if (id && T.apply.includes(id)) return rewrite(req, `/x/apply/${id}`);
    return NextResponse.next();
  }

  if (lower === "/kairali-blog.aspx") {
    if (path !== "/kairali-blog.aspx") return redirectKeepQuery(req, "/kairali-blog.aspx");
    const n = url.searchParams.get("page");
    if (n === null) return NextResponse.next();
    if (T.blog.includes(n)) return rewrite(req, `/x/blog/${n}`);
    return notFound(req);
  }

  // Case-insensitive legacy pages and documents: one 301 to the canonical spelling.
  const canon = T.plain[lower] || T.docs[safeDecode(lower)];
  if (canon && canon !== path && canon !== safeDecode(path)) return redirectKeepQuery(req, canon);
  return NextResponse.next();
}

function notFound(req: NextRequest) {
  return rewrite(req, NOT_FOUND, 404);
}
function redirectKeepQuery(req: NextRequest, to: string) {
  const u = new URL(req.url);
  const r = req.nextUrl.clone();
  r.pathname = to;
  r.search = u.search;
  return NextResponse.redirect(r, 301);
}
function safeDecode(s: string) {
  try { return decodeURIComponent(s.replace(/\+/g, " ")); } catch { return s; }
}
function encodeLegacy(v: string) {
  return v.split("&").map(encodeURIComponent).join("&");
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|media/|fonts/|brand/|og/|favicon|apple-touch-icon|icon-512|search-index.json|sitemap.xml|robots.txt).*)"],
};

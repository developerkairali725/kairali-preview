import { NextResponse, type NextRequest } from "next/server";
import table from "./content/route-table.json";
import { awardSlug, cleanRoute } from "./lib/routes";

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

  const norm = lower.length > 1 && lower.endsWith("/") ? lower.slice(0, -1) : lower;
  const target = T.redirects[norm] || T.redirects[lower];
  if (target) {
    const publicTarget = cleanRoute(target);
    if (publicTarget !== path) {
      return redirectKeepQuery(req, publicTarget, true);
    }
  }

  if (lower === "/detail.aspx") {
    if (!rawQuery.toLowerCase().startsWith("page=")) return notFound(req);
    let value = safeDecode(rawQuery.slice(5));
    let key = T.awards[value];
    if (!key && value.endsWith("=")) key = T.awards[value.slice(0, -1)]; // sitemap variant "…-wellness-congress="
    if (!key) {
      const ci = Object.keys(T.awards).find((v) => v.toLowerCase() === value.toLowerCase());
      if (ci) { const r = req.nextUrl.clone(); r.pathname = `/awards/${awardSlug(ci)}`; r.search = ""; return NextResponse.redirect(r, 301); }
      return notFound(req);
    }
    const r = req.nextUrl.clone();
    r.pathname = `/awards/${awardSlug(value.endsWith("=") && !T.awards[value] ? value.slice(0, -1) : value)}`;
    r.search = "";
    return NextResponse.redirect(r, 301);
  }

  if (lower === "/apply-now.aspx") {
    const id = url.searchParams.get("id");
    const r = req.nextUrl.clone();
    r.pathname = id && T.apply.includes(id) ? `/careers/apply/${id}` : "/apply-now";
    r.search = "";
    return NextResponse.redirect(r, 301);
  }

  if (lower === "/kairali-blog.aspx") {
    const n = url.searchParams.get("page");
    if (n === null || n === "1") return redirectKeepQuery(req, "/kairali-blog", false);
    if (T.blog.includes(n)) return redirectKeepQuery(req, `/kairali-blog/page/${n}`, false);
    return notFound(req);
  }

  // Case-insensitive legacy pages and documents: one 301 to the canonical spelling.
  const docCanon = T.docs[safeDecode(lower)];
  if (docCanon && docCanon !== safeDecode(path)) return redirectKeepQuery(req, docCanon);
  const legacyCanon = T.plain[lower];
  if (legacyCanon && legacyCanon.toLowerCase().endsWith(".aspx")) return redirectKeepQuery(req, cleanRoute(legacyCanon));

  // IIS-style case folding also applies to the new extensionless public routes.
  const cleanCandidate = T.plain[`${lower}.aspx`];
  if (cleanCandidate) {
    const publicCanon = cleanRoute(cleanCandidate);
    if (path !== publicCanon) return redirectKeepQuery(req, publicCanon);
  }
  return NextResponse.next();
}

function notFound(req: NextRequest) {
  return rewrite(req, NOT_FOUND, 404);
}
function redirectKeepQuery(req: NextRequest, to: string, keepQuery = true) {
  const u = new URL(req.url);
  const r = req.nextUrl.clone();
  r.pathname = to;
  r.search = keepQuery ? u.search : "";
  return NextResponse.redirect(r, 301);
}
function safeDecode(s: string) {
  try { return decodeURIComponent(s.replace(/\+/g, " ")); } catch { return s; }
}
export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|media/|fonts/|brand/|og/|favicon|apple-touch-icon|icon-512|search-index.json|sitemap.xml|robots.txt).*)"],
};

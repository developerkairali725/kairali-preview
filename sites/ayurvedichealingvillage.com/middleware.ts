import { NextResponse, type NextRequest } from "next/server";

/**
 * 1) Legacy German/French URLs: a mixed-case /de/ or /fr/ path gets ONE 301 to its lowercase form.
 *    Legacy German/French URLs were linked with mixed case on the WordPress site
 *    (e.g. /de/Arthritis-Spondylitis/) and canonicalised to lowercase. The locale
 *    lane serves the lowercase URL, and custom redirects cannot express a
 *    case-only hop (their matching is case-insensitive, so they would loop).
 * 2) /lp-v2/*: forward the visitor's country (Cloudflare CF-IPCountry, else Vercel geo) and
 *    Accept-Language as request headers so the page can pick locale, currency and consent region.
 *    No redirect, no cookie, no tracking.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/lp-v2/")) {
    const headers = new Headers(req.headers);
    const country = req.headers.get("cf-ipcountry") || req.headers.get("x-vercel-ip-country") || "";
    headers.set("x-lp-country", country);
    headers.set("x-lp-accept-language", req.headers.get("accept-language") || "");
    return NextResponse.next({ request: { headers } });
  }
  if (pathname === pathname.toLowerCase()) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = pathname.toLowerCase();
  return NextResponse.redirect(url, 301);
}

export const config = { matcher: ["/de/:path*", "/fr/:path*", "/lp-v2/:path*"] };

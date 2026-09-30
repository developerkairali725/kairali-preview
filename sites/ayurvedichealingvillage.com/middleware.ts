import { NextResponse, type NextRequest } from "next/server";

/**
 * Legacy German/French URLs were linked with mixed case on the WordPress site
 * (e.g. /de/Arthritis-Spondylitis/) and canonicalised to lowercase. The locale
 * lane serves the lowercase URL, and custom redirects cannot express a
 * case-only hop (their matching is case-insensitive, so they would loop). This
 * does exactly one thing: a mixed-case /de/ or /fr/ path gets ONE 301 to its
 * lowercase form. Nothing else is inspected, rewritten or tracked.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === pathname.toLowerCase()) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = pathname.toLowerCase();
  return NextResponse.redirect(url, 301);
}

export const config = { matcher: ["/de/:path*", "/fr/:path*"] };

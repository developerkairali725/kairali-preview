import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const LEGACY_BLOG_TARGETS = new Map<string, string>([
  ["/blog", "/journal"],
  ["/blog/blushlounge-by-sneha", "/journal/makeup-colour-correction-guide"],
  ["/blog/bridal-makeup", "/services#bridal"],
  ["/blog/our-services", "/services"],
]);

function permanentRedirect(request: NextRequest, destination: string) {
  const url = new URL(destination, request.url);
  const [pathname, hash] = destination.split("#", 2);
  url.pathname = pathname;
  url.hash = hash ? `#${hash}` : "";
  url.search = request.nextUrl.search;
  return NextResponse.redirect(url, 308);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const normalizedPath = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const exactLegacyTarget = LEGACY_BLOG_TARGETS.get(normalizedPath);

  if (exactLegacyTarget) {
    return permanentRedirect(request, exactLegacyTarget);
  }

  // Unknown legacy WordPress routes have no trustworthy one-to-one content.
  // Keep them within the editorial section instead of falsely mapping them to
  // the homepage or a service they may not describe.
  if (normalizedPath.startsWith("/blog/")) {
    return permanentRedirect(request, "/journal");
  }

  // Preserve Next.js's normal no-trailing-slash policy for every non-legacy
  // page after opting out of the framework's earlier automatic hop.
  if (normalizedPath !== pathname) {
    return permanentRedirect(request, normalizedPath);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

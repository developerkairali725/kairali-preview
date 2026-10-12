import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { loadRoute } from "../../../../../campaign-v2/route.ts";
import { isRtl } from "../../../../../campaign-v2/kit/locale.ts";
import { LANG_COOKIE, localeOverride } from "../../../../../campaign-v2/sections/interactive/prefs.ts";
import Document from "../../../../../campaign-v2/sections/Document";
import "../../../../../campaign-v2/styles/base.css";

export const metadata = { robots: { index: false, follow: false } };

// Root layout for /lp-v2/[slug]/[variant]. Locale, dir and skin are per request, so <html>/<body> live here (in Document).
//
// A layout cannot see searchParams, so ?lang= cannot reach <html lang>. The locale switcher (Task 13b) therefore
// also sets the `lp-lang` cookie before reloading with ?lang=xx; this layout reads it: the cookie wins when it
// names a locale this campaign offers, else the Accept-Language result from loadRoute.
export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ slug: string; variant: string }> }) {
  const { campaign, variant, req } = await loadRoute(params);
  const fromCookie = localeOverride((await cookies()).get(LANG_COOKIE)?.value, campaign.locales);
  const locale = fromCookie ?? req.locale;
  const dir = fromCookie ? (isRtl(fromCookie) ? "rtl" : "ltr") : req.dir;
  return (
    <Document campaign={campaign} variant={variant} locale={locale} dir={dir} consentRequired={req.consentRequired}>
      {children}
    </Document>
  );
}

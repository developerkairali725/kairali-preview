import { cookies } from "next/headers";
import { loadRoute } from "../../../../../campaign-v2/route.ts";
import { servableCampaign, campaignMetadata } from "../../../../../campaign-v2/servable.ts";
import { isRtl } from "../../../../../campaign-v2/kit/locale.ts";
import type { SearchParams } from "../../../../../campaign-v2/forms/carry.ts";
import { LANG_COOKIE, localeOverride } from "../../../../../campaign-v2/sections/interactive/prefs.ts";
import LandingPage from "../../../../../campaign-v2/sections/LandingPage";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Same guard as the page (no _template); pending() is already "[id]" text.
  return campaignMetadata(servableCampaign(slug));
}

// Locale for the page content: ?lang=xx (the switcher reloads with it) > the lp-lang cookie > Accept-Language.
// Only locales this campaign lists count; anything else is ignored. The layout applies the cookie to <html lang dir>.
export default async function Page({ params, searchParams }:
  { params: Promise<{ slug: string; variant: string }>; searchParams: Promise<SearchParams> }) {
  const { campaign, variant, req } = await loadRoute(params);
  const sp = await searchParams;
  const langParam = Array.isArray(sp.lang) ? sp.lang[0] : sp.lang;
  const override = localeOverride(langParam, campaign.locales) ?? localeOverride((await cookies()).get(LANG_COOKIE)?.value, campaign.locales);
  const pageReq = override ? { ...req, locale: override, dir: (isRtl(override) ? "rtl" : "ltr") as "ltr" | "rtl" } : req;
  return <LandingPage campaign={campaign} variant={variant} req={pageReq} searchParams={sp} />;
}

/**
 * Native (non-design-runtime) pages in the locale lane: the same views the
 * English routes render (app/(english)/<page>/view.tsx), given a locale. Their
 * strings resolve through the accepted catalogue (server) or the client
 * dictionary provider (reviews / feedback client components).
 */
import type { CandidateRoute } from "./registry";
import { LOCALE_CODES, localeData, localizedPath, routeTable, type LocaleCode } from "./l10n";
import { L10nProvider } from "./l10n-client";
import { PageView as Sightseeing } from "../sightseeing/view";
import { PageView as VideoGallery } from "../video-gallery/view";
import { PageView as ReadFeedback } from "../read-feedback/view";
import { PageView as GiveFeedback } from "../givefeedback/view";
import { SearchView } from "../search/view";

const NATIVE = new Set(["/read-feedback/", "/givefeedback/", "/sightseeing/", "/video-gallery/", "/search/"]);
export function isNativeRoute(path: string): boolean {
  return NATIVE.has(path);
}
export function NativeLocalePage({ route, locale, searchParams }: { route: CandidateRoute; locale: LocaleCode; searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const paths = Object.fromEntries(Object.keys(routeTable()).map((p) => [p, localizedPath(p, locale) ?? p]));
  const value = { locale, dict: localeData(locale)?.native ?? {}, paths };
  const view =
    route.path === "/sightseeing/" ? <Sightseeing locale={locale} /> :
    route.path === "/video-gallery/" ? <VideoGallery locale={locale} /> :
    route.path === "/read-feedback/" ? <ReadFeedback locale={locale} /> :
    route.path === "/givefeedback/" ? <GiveFeedback locale={locale} /> :
    <SearchView locale={locale} searchParams={searchParams ?? Promise.resolve({})} />;
  void LOCALE_CODES;
  return <L10nProvider value={value}>{view}</L10nProvider>;
}

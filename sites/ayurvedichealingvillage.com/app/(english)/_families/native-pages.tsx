/**
 * Native (non-design-runtime) pages in the locale lane. Filled in by the
 * native-page localization step; until a page is wired it is NOT served in
 * that locale (404), rather than served in English under a locale URL.
 */
import { notFound } from "next/navigation";
import type { CandidateRoute } from "./registry";
import type { LocaleCode } from "./l10n";

const NATIVE = new Set(["/read-feedback/", "/givefeedback/", "/sightseeing/", "/video-gallery/", "/search/"]);
export function isNativeRoute(path: string): boolean {
  return NATIVE.has(path);
}
export function NativeLocalePage({ route, locale }: { route: CandidateRoute; locale: LocaleCode }): never {
  void route; void locale;
  notFound();
}

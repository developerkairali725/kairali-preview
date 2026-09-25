import { SearchView } from "./view";
export { metadata } from "./view";
export const dynamic = "force-dynamic";
/** English /search/; the view is shared with the locale lane (app/(english)/_families/native-pages.tsx). */
export default function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <SearchView searchParams={searchParams} />;
}

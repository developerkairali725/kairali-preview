import { PageView } from "./view";
export { metadata } from "./view";

/** English route; the localized view is shared with the locale lane (app/(english)/_families/native-pages.tsx). */
export default function Page() {
  return <PageView />;
}

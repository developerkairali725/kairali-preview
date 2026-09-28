import { PageView } from "./view";
import { metadata as viewMetadata } from "./view";
import { nativeEnglishMetadata } from "../_families/native-metadata";

export const metadata = nativeEnglishMetadata("/read-feedback/", viewMetadata);

/** English route; the localized view is shared with the locale lane (app/(english)/_families/native-pages.tsx). */
export default function Page() {
  return <PageView />;
}

import { LocalePage, localeMetadata, localeStaticParams } from "../../../(english)/_families/locale-route";

/** Every Français (fr) page; the reviewed route table decides which paths exist. */
export const dynamicParams = false;
export function generateStaticParams() {
  return localeStaticParams("fr");
}
export function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  return localeMetadata("fr", params);
}
export default function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <LocalePage locale="fr" params={params} />;
}

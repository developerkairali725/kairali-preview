import { LocalePage, localeMetadata, localeStaticParams } from "../../../(english)/_families/locale-route";

/** Every Русский (ru) page; the reviewed route table decides which paths exist. */
export const dynamicParams = false;
export function generateStaticParams() {
  return localeStaticParams("ru");
}
export function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  return localeMetadata("ru", params);
}
export default function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <LocalePage locale="ru" params={params} />;
}

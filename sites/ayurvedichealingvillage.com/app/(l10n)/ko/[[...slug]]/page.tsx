import { LocalePage, localeMetadata, localeStaticParams } from "../../../(english)/_families/locale-route";

/** Every 한국어 (ko) page; the reviewed route table decides which paths exist. */
export const dynamicParams = false;
export function generateStaticParams() {
  return localeStaticParams("ko");
}
export function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  return localeMetadata("ko", params);
}
export default function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <LocalePage locale="ko" params={params} />;
}

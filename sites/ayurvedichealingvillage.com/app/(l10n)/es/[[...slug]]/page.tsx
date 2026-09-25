import { LocalePage, localeMetadata, localeStaticParams } from "../../../(english)/_families/locale-route";

/** Every Español (es) page; the reviewed route table decides which paths exist. */
export const dynamicParams = false;
export function generateStaticParams() {
  return localeStaticParams("es");
}
export function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  return localeMetadata("es", params);
}
export default function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <LocalePage locale="es" params={params} />;
}

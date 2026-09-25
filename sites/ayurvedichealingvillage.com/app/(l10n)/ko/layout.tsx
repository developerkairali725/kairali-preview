import type { ReactNode } from "react";
import { faviconIcons } from "@kairali/seo";
import { LocaleDocument } from "../../(english)/_families/locale-route";

export const metadata = { icons: faviconIcons() };

/** 한국어 (ko) root layout — see app/(english)/_families/locale-route.tsx. */
export default function Layout({ children }: { children: ReactNode }) {
  return <LocaleDocument locale="ko">{children}</LocaleDocument>;
}

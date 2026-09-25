import type { ReactNode } from "react";
import { faviconIcons } from "@kairali/seo";
import { LocaleDocument } from "../../(english)/_families/locale-route";

export const metadata = { icons: faviconIcons() };

/** Português (pt) root layout — see app/(english)/_families/locale-route.tsx. */
export default function Layout({ children }: { children: ReactNode }) {
  return <LocaleDocument locale="pt">{children}</LocaleDocument>;
}

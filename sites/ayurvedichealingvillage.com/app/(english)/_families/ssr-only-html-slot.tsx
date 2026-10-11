"use client";

import { createElement } from "react";
import { readSsrOnlyHtml } from "./ssr-only-html.mjs";

type Attrs = Record<string, string | undefined>;

/**
 * Renders the server's markup into the HTML and an empty string on the client (ssr-only-html.mjs).
 * Hydration keeps the server DOM: React does not diff innerHTML, and suppressHydrationWarning covers
 * the development check. The element's props never change after hydration, so React never writes
 * the empty string into the page.
 */
export function SsrOnlyHtml({ as, slot, attrs }: { as: "div" | "script"; slot: string; attrs?: Attrs }) {
  const html = typeof window === "undefined" ? readSsrOnlyHtml(slot) : "";
  return createElement(as, { ...attrs, suppressHydrationWarning: true, dangerouslySetInnerHTML: { __html: html } });
}

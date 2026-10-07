import { Fragment, type ReactNode } from "react";
import type { RichText } from "../kit/types.ts";
import { richRuns } from "../kit/rich.ts";

/** A link as the live pages open it: an https URL in a new tab, a same-site path in place. */
export function PageA({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return /^https:\/\//.test(href)
    ? <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}</a>
    : <a className={className} href={href}>{children}</a>;
}

/** A RichText (kit/rich.ts) as React children: its text as written, each "[label](href)" as a link. */
export function Rich({ text }: { text: RichText }) {
  return <>{richRuns(text).map((r, i) => (r.type === "link" ? <PageA key={i} href={r.href}>{r.text}</PageA> : <Fragment key={i}>{r.text}</Fragment>))}</>;
}

/** Paragraphs of RichText. */
export function Paras({ list, className }: { list: readonly RichText[] | undefined; className: string }) {
  return <>{list?.map((t, i) => <p key={i} className={className}><Rich text={t} /></p>)}</>;
}

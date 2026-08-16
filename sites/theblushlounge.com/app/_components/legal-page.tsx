import type { ReactNode } from "react";
import { PageHeader, SiteFooter } from "./chrome";

export function LegalPage({
  eyebrow,
  title,
  summary,
  children,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHeader current="" />
      <main className="legal-page">
        <header className="section pagehero legal-page__hero">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display">{title}</h1>
          <p className="section-lede">{summary}</p>
        </header>
        <article className="section legal-copy">{children}</article>
      </main>
      <SiteFooter />
    </>
  );
}

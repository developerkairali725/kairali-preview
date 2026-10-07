import { createElement } from "react";
import type { SectionProps } from "./LandingPage";
import { parseMarkdown, renderBlocks } from "./markdown.ts";

/**
 * The long-form guide for search, collapsed by default in one <details>.
 * Rendered from the safe Markdown subset in markdown.ts: headings, paragraphs and lists; no HTML passthrough.
 */
export default function LongForm({ c }: SectionProps) {
  const blocks = parseMarkdown(c.longForm);
  if (!blocks.length) return null;
  const title = `About ${c.programDefault} at Kairali — the full guide`;
  return (
    <section className="lp-sec lp-long" aria-label={title}>
      <details className="lp-long__box">
        <summary className="lp-long__sum">
          <span className="lp-long__title">{title}</span>
          <span className="lp-long__hint"><span className="lp-long__more">Read more</span><span className="lp-long__less">Close</span><span className="lp-plus" aria-hidden="true" /></span>
        </summary>
        <div className="lp-long__body">{renderBlocks(blocks, createElement)}</div>
      </details>
    </section>
  );
}

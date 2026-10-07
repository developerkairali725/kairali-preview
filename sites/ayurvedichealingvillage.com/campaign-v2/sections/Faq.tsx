import type { SectionProps } from "./LandingPage";
import { t } from "./text.ts";
import { SectionHead } from "./head";

/**
 * FAQ as native <details>, so it opens and closes with Tab + Enter/Space without JavaScript.
 * The first answer starts open, as on the desktop artboard. Pending answers show their [id] placeholder.
 * No FAQPage JSON-LD here: integrations/seo.ts (Task 16) builds all JSON-LD centrally.
 */
export default function Faq({ c, v }: SectionProps) {
  if (!c.faq.length) return null;
  return (
    <section className="lp-sec lp-faq" aria-labelledby="lp-faq-h">
      <SectionHead v={v} kicker="Before you decide" title="Questions patients ask." id="lp-faq-h" />
      <div className="lp-faq__list">
        {c.faq.map((f, i) => (
          <details key={f.q} className="lp-faq__item" open={i === 0}>
            <summary className="lp-faq__q"><span>{f.q}</span><span className="lp-plus" aria-hidden="true" /></summary>
            <p className="lp-faq__a">{t(f.a)}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

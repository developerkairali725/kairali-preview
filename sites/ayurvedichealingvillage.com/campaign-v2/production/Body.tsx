import { createElement, type ReactNode } from "react";
import Image from "next/image";
import type { BodyBlock, BodyInline, BodySection, CampaignConfig } from "../kit/types.ts";
import { parseMarkdown, renderBlocks } from "../sections/markdown.ts";
import { imageBox, inlinePieces, isExternal, isQuotedParagraph, renderUnits, type RenderUnit } from "./body-model.ts";

/**
 * The preserved source body of a live ad route (content/*.json sourceBodyIntro + sourceBody + sourceBodyClosing),
 * rendered through typed components: real programme, room and offer links, accessible tables, the original
 * YouTube links with their thumbnails, captioned photographs and attributed quotes. No HTML is parsed or
 * injected: every string is a React text child. Nothing is re-worded, re-ordered or dropped here; findings in the
 * copy are reported by the lint (kit/lint), not filtered by the renderer.
 *
 * Each source section keeps its old anchor id (`sourceSection`, e.g. section-1), which the site's measurement
 * runtime and the old page's programme-link diagnostics already know.
 */

function Runs({ runs }: { runs: readonly BodyInline[] }) {
  return (
    <>
      {inlinePieces(runs).map(({ run, spaceBefore }, i) => (
        <span key={i} className="lp-body__run">
          {spaceBefore ? " " : null}
          {run.type === "link" ? <BodyLink href={run.href}>{run.text}</BodyLink> : run.text}
        </span>
      ))}
    </>
  );
}

function BodyLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return isExternal(href)
    ? <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}</a>
    : <a className={className} href={href}>{children}</a>;
}

function Text({ b }: { b: Extract<BodyBlock, { type: "h2" | "h3" | "p" }> }) {
  return b.inline ? <Runs runs={b.inline} /> : <>{b.text}</>;
}

function Block({ b, headingId, attribution }: { b: BodyBlock; headingId?: string; attribution: boolean }) {
  switch (b.type) {
    case "h2": return <h2 id={headingId} className="lp-h2 lp-body__h2"><Text b={b} /></h2>;
    case "h3": return <h3 className={attribution ? "lp-body__h3 lp-body__h3--attribution" : "lp-body__h3"}><Text b={b} /></h3>;
    case "p": return <p className={isQuotedParagraph(b) ? "lp-body__p lp-body__p--quoted" : "lp-body__p"}><Text b={b} /></p>;
    case "quote":
      return (
        <figure className="lp-body__quote">
          <blockquote><p>{b.text}</p></blockquote>
          <figcaption>{b.attribution}</figcaption>
        </figure>
      );
    case "list": return <ul className="lp-body__ul">{b.items.map((x, i) => <li key={i}>{x}</li>)}</ul>;
    case "table":
      return (
        // Scrollable on phones: a named, focusable region so keyboard users can scroll it too.
        <div className="lp-body__table" role="region" aria-label={b.headers.join(", ")} tabIndex={0}>
          <table>
            <thead><tr>{b.headers.map((h, i) => <th key={i} scope="col">{h}</th>)}</tr></thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i}>{r.map((cell, j) => (j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell}</td>))}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "videoLink":
      return (
        <a className="lp-body__video" href={b.href} target="_blank" rel="noopener noreferrer">
          {b.thumbnail ? (
            <Image className="lp-body__video-img" src={b.thumbnail} alt="" width={480} height={360} sizes="(max-width: 767px) 100vw, 420px" loading="lazy" />
          ) : null}
          <span className="lp-body__video-label">{b.label} <span aria-hidden="true">↗</span></span>
        </a>
      );
    case "link": return <p className="lp-body__p"><BodyLink href={b.href}>{b.text}</BodyLink></p>;
    case "programme": case "image": return null; // grouped by renderUnits()
  }
}

function Unit({ u, headingId }: { u: RenderUnit; headingId?: string }) {
  if (u.kind === "programmes") {
    return (
      <ul className="lp-body__programmes">
        {u.items.map((p) => (
          <li key={p.href} className="lp-body__programme">
            <a href={p.href}>{p.label}</a>
            {p.sanskrit ? <span className="lp-body__sanskrit" lang="sa-Latn">{p.sanskrit}</span> : null}
          </li>
        ))}
      </ul>
    );
  }
  if (u.kind === "images") {
    return (
      <ul className="lp-body__gallery">
        {u.items.map((im) => {
          const box = imageBox(im);
          return (
            <li key={im.src}>
              <figure className="lp-body__figure">
                <a href={im.src} target="_blank" rel="noopener noreferrer" aria-label={`View full photograph: ${im.alt}`}>
                  <Image className="lp-body__img" src={im.src} alt={im.alt} width={box.width} height={box.height}
                    sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw" loading="lazy" />
                </a>
                {im.caption ? <figcaption>{im.caption}</figcaption> : null}
              </figure>
            </li>
          );
        })}
      </ul>
    );
  }
  return <Block b={u.block} headingId={headingId} attribution={u.attribution} />;
}

function SourceSection({ s }: { s: BodySection }) {
  const first = s.blocks[0];
  const headingId = first?.type === "h2" ? `${s.sourceSection}-h` : undefined;
  const units = renderUnits(s.blocks);
  return (
    <section id={s.sourceSection} className="lp-body__sec" {...(headingId ? { "aria-labelledby": headingId } : {})}>
      {units.map((u, i) => <Unit key={i} u={u} headingId={i === 0 ? headingId : undefined} />)}
    </section>
  );
}

export default function Body({ c }: { c: CampaignConfig }) {
  const body = c.body;
  if (!body) return null;
  const intro = parseMarkdown(body.intro.join("\n\n"));
  const closing = renderUnits(body.closing);
  return (
    <div className="lp-sec lp-body" data-source-body>
      {intro.length ? <section className="lp-body__sec lp-body__intro">{renderBlocks(intro, createElement, "lp-body__md")}</section> : null}
      {body.sections.map((s) => <SourceSection key={s.sourceSection} s={s} />)}
      {closing.length ? <section className="lp-body__sec lp-body__closing">{closing.map((u, i) => <Unit key={i} u={u} />)}</section> : null}
    </div>
  );
}

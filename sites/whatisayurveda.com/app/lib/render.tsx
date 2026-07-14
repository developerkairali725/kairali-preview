// Compact block-level Markdown renderer — zero deps, house-style (plain-ESM +
// JSDoc). Handles exactly the subset the content pipeline emits: paragraphs,
// ### h3, - / * bullets, 1. numbered lists, GFM | tables |, plus inline
// **bold**, *italic*, and [text](/slug) links. Not a general Markdown engine.

import { Fragment, type ReactNode } from "react";

/** Inline: **bold**, *italic*, [text](url). Split on the first-matching token. */
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) out.push(<strong key={key++}>{m[1]}</strong>);
    else if (m[2] !== undefined) out.push(<em key={key++}>{m[2]}</em>);
    else if (m[3] !== undefined && m[4] !== undefined) {
      const href = m[4];
      const external = /^https?:\/\//.test(href);
      out.push(
        <a key={key++} href={href} {...(external ? { rel: "nofollow noopener", target: "_blank" } : {})}>
          {m[3]}
        </a>,
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Table({ lines }: { lines: string[] }) {
  const cells = (row: string) =>
    row.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
  const header = cells(lines[0]);
  const bodyRows = lines.slice(2).map(cells); // lines[1] is the --- separator
  return (
    <table>
      <thead>
        <tr>{header.map((h, i) => <th key={i}>{inline(h)}</th>)}</tr>
      </thead>
      <tbody>
        {bodyRows.map((r, i) => (
          <tr key={i}>{r.map((c, j) => <td key={j}>{inline(c)}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}

/** Render a Markdown string to JSX blocks. */
export function Markdown({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        // table
        if (lines.length >= 2 && lines[0].trimStart().startsWith("|") && /^\s*\|?[\s:|-]+\|/.test(lines[1])) {
          return <Table key={i} lines={lines.map((l) => l.trim())} />;
        }
        // h3
        if (lines[0].startsWith("### ")) {
          return <h3 key={i}>{inline(lines[0].slice(4))}</h3>;
        }
        // unordered list
        if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*[-*]\s+/, ""))}</li>)}
            </ul>
          );
        }
        // ordered list
        if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
          return (
            <ol key={i}>
              {lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*\d+\.\s+/, ""))}</li>)}
            </ol>
          );
        }
        // paragraph (join wrapped lines)
        return <p key={i}>{inline(lines.join(" "))}</p>;
      })}
    </>
  );
}

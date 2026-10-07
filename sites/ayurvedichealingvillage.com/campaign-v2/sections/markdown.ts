/**
 * The safe Markdown subset used by LongForm. Blocks are separated by blank lines; within a block:
 *   "## Heading" → h2, "### Heading" → h3 (a heading is always one line)
 *   consecutive "- " lines → ul (one li per line)
 *   other consecutive lines → p (joined with a space)
 * There is no inline syntax and no HTML passthrough: every string ends up as a text child, which React escapes.
 */
export type MdBlock =
  | { type: "h2" | "h3" | "p"; text: string }
  | { type: "ul"; items: string[] };

export function parseMarkdown(src: string): MdBlock[] {
  const out: MdBlock[] = [];
  for (const raw of src.replace(/\r\n?/g, "\n").split(/\n\s*\n/)) {
    // Within a block, a heading line stands alone and consecutive "- " lines form one list.
    let para: string[] = [];
    let list: string[] = [];
    const flush = () => {
      if (para.length) out.push({ type: "p", text: para.join(" ") });
      if (list.length) out.push({ type: "ul", items: list });
      para = []; list = [];
    };
    for (const line of raw.split("\n").map((l) => l.trim()).filter(Boolean)) {
      if (line.startsWith("### ")) { flush(); out.push({ type: "h3", text: line.slice(4).trim() }); }
      else if (line.startsWith("## ")) { flush(); out.push({ type: "h2", text: line.slice(3).trim() }); }
      else if (line.startsWith("- ")) { if (para.length) flush(); list.push(line.slice(2).trim()); }
      else { if (list.length) flush(); para.push(line); }
    }
    flush();
  }
  return out;
}

// Structural type for React.createElement, so this file stays free of React imports (and testable under node --test).
type H<N> = (type: string, props: { key?: string | number; className?: string } | null, ...children: (string | N)[]) => N;

/** Renders blocks through `h` (React.createElement). Text is passed as children, never as HTML. */
export function renderBlocks<N>(blocks: MdBlock[], h: H<N>, className = "lp-md"): N[] {
  return blocks.map((b, i) =>
    b.type === "ul"
      ? h("ul", { key: i, className: `${className}__ul` }, ...b.items.map((item, j) => h("li", { key: j }, item)))
      : h(b.type, { key: i, className: `${className}__${b.type}` }, b.text),
  );
}

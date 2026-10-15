import { repairArticleContactHeading } from "./article-contact-heading.mjs";
// Train J batch 2 (15 Oct 2026): the reviewed article outline keeps each heading's LOOK.
//
// Every element a reviewed heading correction retags (article-contact-heading.mjs, and the refinements below) carries
// data-ahv-outline-from="<its source tag>". public/design/article-reader.css matches the family's heading and prose
// rules on that marker, so a retagged element keeps exactly the styling of its source tag at every width: only the
// document outline changes, never the page's appearance or copy. Unmarked elements are styled exactly as before.
//
// Outline refinements, applied AFTER the reviewed level corrections, on the same /sections/3/c/3/c/<n> source pointers:
//   AHV-N08.new-to-yoga.heading               the five numbered sub-items under "What to Expect" stay H3 under that H2.
//   AHV-N08.ayurveda-workshop.heading         the first article H2 repeats the H1 word for word: no longer a heading (P).
//   AHV-N08.yoga-retreats-for-everyone.heading the same duplicate H2 becomes a P; the article's sections become H2 and
//                                              the five numbered items H3 under "What You Can Expect".
const MARK = "data-ahv-outline-from";

/** Server snapshot, BEFORE articleContactHeadingHtml: mark the headings its reviewed rule will retag. */
export function articleOutlineSourcesHtml(html, route) {
  const rule = repairArticleContactHeading(null, route);
  if (!rule) return html;
  const [from, , pointers] = rule;
  return html.replace(new RegExp("<" + from + "\\b([^>]*)>", "g"), (whole, attrs) => {
    if (attrs.includes(MARK + "=")) return whole;
    const pointer = /\bdata-source-pointer="\/sections\/3\/c\/3\/c\/(\d+)"/.exec(attrs);
    return !pointers || (pointer && pointers.includes(Number(pointer[1]))) ? "<" + from + attrs + " " + MARK + '="' + from + '">' : whole;
  });
}

/** Server snapshot, AFTER articleContactHeadingHtml: the ordered refinements (marking what they retag). */
export function articleHeadingOutlineHtml(html, route) {
  const steps = repairArticleOutline(null, route);
  if (!steps) return html;
  let out = html;
  for (const [from, to, pointers] of steps) {
    out = out.replace(new RegExp("<" + from + "\\b([^>]*)>([\\s\\S]*?)<\\/" + from + ">", "g"), (whole, attrs, inner) => {
      const pointer = /\bdata-source-pointer="\/sections\/3\/c\/3\/c\/(\d+)"/.exec(attrs);
      if (!pointer || !pointers.includes(Number(pointer[1]))) return whole;
      const marked = attrs.includes(MARK + "=") ? attrs : attrs + " " + MARK + '="' + from + '"';
      return "<" + to + marked + ">" + inner + "</" + to + ">";
    });
  }
  return out;
}

// Self-contained: boot.ts serializes this in place of its former direct call, passing repairArticleContactHeading as
// `contactRepair`. On a live root it (1) marks the headings the reviewed level rule will retag, (2) runs that rule
// unchanged, then (3) applies the ordered refinements, marking what they retag. Without a root it returns the route's
// refinement steps: [current tag, corrected tag, reviewed /sections/3/c/3/c/<n> pointers].
export function repairArticleOutline(root, route, contactRepair) {
  const steps = {
    "/new-to-yoga/": [["h2", "h3", [16, 20, 24, 28, 32]]],
    "/ayurveda-workshop/": [["h2", "p", [0]]],
    "/yoga-retreats-for-everyone/": [["h2", "p", [0]], ["h3", "h2", [4, 8, 18]], ["h4", "h3", [20, 26, 30, 34, 38]], ["h4", "h2", [42, 46, 50]]],
  };
  const list = Object.prototype.hasOwnProperty.call(steps, route) ? steps[route] : null;
  if (!root) return list || undefined;
  const mark = "data-ahv-outline-from";
  const select = (tag, pointers) => pointers ? pointers.map(n => tag + '[data-source-pointer="/sections/3/c/3/c/' + n + '"]').join(",") : tag;
  const within = selector => { const nodes = Array.from(root.querySelectorAll(selector)); if (root.matches && root.matches(selector)) nodes.unshift(root); return nodes; };
  const rule = contactRepair ? contactRepair(null, route) : null;
  // Train N (15 Oct 2026): a marked node of the rule's source tag was already corrected and then refined back
  // (/new-to-yoga/ h3 -> h2 -> h3). Correcting it again on a later mutation delivery made the refinement retag it
  // back, and every replacement queued another delivery: the page's main thread never went idle. The correction
  // therefore runs only while an unmarked (never processed) target exists; the end state is unchanged.
  let pending = !rule;
  if (rule) for (const node of within(select(rule[0], rule[2]))) if (!node.hasAttribute(mark)) { node.setAttribute(mark, rule[0]); pending = true; }
  if (contactRepair && pending) contactRepair(root, route);
  if (!list) return;
  for (const step of list) {
    for (const old of within(select(step[0], step[2]))) {
      const replacement = old.ownerDocument.createElement(step[1]);
      for (const attr of old.attributes) replacement.setAttribute(attr.name, attr.value);
      if (!replacement.hasAttribute(mark)) replacement.setAttribute(mark, step[0]);
      while (old.firstChild) replacement.appendChild(old.firstChild);
      old.replaceWith(replacement);
    }
  }
}

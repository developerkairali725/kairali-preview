// Server-side layout pass over a Batch A page's staging markup, run before it is
// rendered. The converter flattened each section into a list of headings, text
// blocks and photo grids; this gives the sections the structure the original
// design had, so the CSS can lay them out without floats and nothing moves after
// the page loads. It only adds wrappers, classes and links — no word, image,
// video or order of reading changes.
//
//   - Photo + icon grid: a photo followed by its play/pause or badge icon
//     (split apart by the converter) → the icon sits on the photo again
//     (.dc-overlay / .dc-badge / .dc-play).
//   - Decoration: a section's only photo grid holds nothing but decorative
//     images (aria-hidden) → they become the section's background (.dc-decor).
//   - Split: a section with one photo → its text in one column and the photo in
//     the other, vertically centred (.dc-split > .dc-split-text + .dc-split-media).
//     Text before the photo's own heading stays full width above.
//   - Video link: a section holding only a "Watch the video" link sits under the
//     video it belongs to, and that video's thumbnail links to it too.

import { Element, Text, type DOMNode } from "html-react-parser";

type Kind = "photo" | "mark" | "decor";

const classes = (n: DOMNode) => (n instanceof Element ? (n.attribs.class ?? "").split(/\s+/).filter(Boolean) : []);
const hasClass = (n: DOMNode, c: string) => classes(n).includes(c);
const addClass = (el: Element, c: string) => {
  const have = (el.attribs.class ?? "").split(/\s+/);
  const add = c.split(/\s+/).filter((x) => x && !have.includes(x));
  if (add.length) el.attribs.class = [el.attribs.class, ...add].filter(Boolean).join(" ");
};
const elements = (el: Element) => el.children.filter((c): c is Element => c instanceof Element);

function find(nodes: DOMNode[], test: (el: Element) => boolean, out: Element[] = []): Element[] {
  for (const n of nodes) {
    if (!(n instanceof Element)) continue;
    if (test(n)) out.push(n);
    find(n.children as DOMNode[], test, out);
  }
  return out;
}

function textOf(n: DOMNode): string {
  if (n instanceof Text) return n.data;
  if (n instanceof Element) return n.children.map((c) => textOf(c as DOMNode)).join("");
  return "";
}

function relink(parent: Element) {
  const kids = parent.children;
  kids.forEach((c, i) => {
    c.parent = parent;
    c.prev = kids[i - 1] ?? null;
    c.next = kids[i + 1] ?? null;
  });
}

function wrap(name: string, attribs: Record<string, string>, kids: DOMNode[]): Element {
  const el = new Element(name, attribs, kids as Element["children"]);
  relink(el);
  return el;
}

function figureKind(fig: Element): { kind: Kind; play: boolean; wide: boolean } | null {
  const img = find([fig], (e) => e.name === "img")[0];
  if (!img) return null;
  const a = img.attribs;
  const w = Number(a.width), h = Number(a.height);
  return {
    kind: a["aria-hidden"] === "true" ? "decor" : a["data-dc-kind"] === "mark" ? "mark" : "photo",
    play: /play|pause/i.test(`${a.src ?? ""} ${a.alt ?? ""}`),
    wide: w >= 900 && h > 0 && w / h >= 2.5,
  };
}

const isHeading = (n: Element) => n.name === "h2" || hasClass(n, "campaign-eyebrow");
const BLOCKERS = ["campaign-faq", "campaign-more"];

function layoutSection(sec: Element): Element | null {
  // whitespace between blocks carries no layout; any other loose text → leave the section alone
  if (sec.children.some((c) => c instanceof Text && c.data.trim())) return null;
  sec.children = elements(sec);
  relink(sec);
  const kids = elements(sec);
  const grids = kids.filter((k) => hasClass(k, "campaign-photo-grid") && !hasClass(k, "dc-decor"));

  let playGrid: Element | null = null;
  for (const g of grids) {
    const figs = elements(g).filter((f) => f.name === "figure");
    const kinds = figs.map(figureKind);
    if (figs.length === 2 && kinds[0]?.kind === "photo" && kinds[1]?.kind === "mark") {
      addClass(g, "dc-overlay");
      addClass(figs[1], "dc-badge");
      if (kinds[1].play) {
        addClass(figs[1], "dc-play");
        playGrid = g;
      }
    }
  }

  if (grids.length === 1) {
    const kinds = elements(grids[0]).filter((f) => f.name === "figure").map(figureKind);
    if (kinds.length && kinds.every((k) => k?.kind === "decor")) {
      addClass(grids[0], "dc-decor");
      addClass(sec, "dc-has-decor");
      return playGrid;
    }
  }
  if (!grids.length) return playGrid;

  // split, per heading block: a block (an h2 with its eyebrow, or the section start)
  // holding exactly one photo becomes text + photo side by side
  const isGrid = (n: Element) => hasClass(n, "campaign-photo-grid") && !hasClass(n, "dc-decor");
  const starts = [0];
  for (let i = 1; i < kids.length; i++) {
    if (kids[i].name !== "h2") continue;
    let s = i;
    while (s > 0 && isHeading(kids[s - 1])) s--;
    // a photo just before the heading opens its block when the block before
    // would otherwise have no text of its own, or already has a photo
    if (s > 0 && isGrid(kids[s - 1])) {
      const prev = kids.slice(starts[starts.length - 1], s - 1);
      if (!prev.some((k) => !isGrid(k)) || prev.some(isGrid)) s--;
    }
    if (s > starts[starts.length - 1]) starts.push(s);
  }
  const groups: Element[][] = [];
  starts.forEach((s, i) => {
    const g = kids.slice(s, starts[i + 1] ?? kids.length);
    // a block with no photo reads on from the block before it
    if (groups.length && !g.some(isGrid) && groups[groups.length - 1].some(isGrid)) groups[groups.length - 1].push(...g);
    else groups.push(g);
  });
  const out: DOMNode[] = [];
  for (const g of groups) out.push(...splitGroup(g));
  sec.children = out as Element["children"];
  relink(sec);
  return playGrid;
}

const WIDE = ["dc-vts", "dc-feats", "dc-cards"];
function splitGroup(all: Element[]): DOMNode[] {
  // full-width blocks (testimonial rows, feature grids, cards) end the split and follow it
  let cut = all.findIndex((k) => WIDE.some((c) => hasClass(k, c)));
  // an empty photo grid is the source's own separator: the split ends there
  const firstPhoto = all.findIndex((k) => hasClass(k, "campaign-photo-grid") && !isEmptyGrid(k));
  const sep = all.findIndex((k, i) => i > firstPhoto && firstPhoto >= 0 && isEmptyGrid(k));
  if (sep > 0 && (cut < 0 || sep < cut)) cut = sep;
  // the wide block's own heading (and eyebrow) goes with it
  while (cut > 0 && (all[cut - 1].name === "h2" || all[cut - 1].name === "h3" || hasClass(all[cut - 1], "campaign-eyebrow"))) cut--;
  if (cut > 0) return [...splitGroup(all.slice(0, cut)), ...all.slice(cut)];
  if (cut === 0) return all;
  const group = all;
  const grids = group.filter((k) => hasClass(k, "campaign-photo-grid") && !hasClass(k, "dc-decor"));
  if (grids.length !== 1) return group;
  const grid = grids[0];
  const kinds = elements(grid).filter((f) => f.name === "figure").map(figureKind);
  const photos = kinds.filter((k) => k?.kind === "photo");
  if (!kinds.length || kinds.some((k) => !k) || photos.length !== 1 || photos[0]!.wide || kinds[0]!.kind !== "photo")
    return group;
  if (group.some((k) => BLOCKERS.some((c) => hasClass(k, c)) || k.name === "details" || k.name === "form")) return group;
  if (find(group, (e) => "data-slot" in e.attribs).length) return group;

  const gi = group.indexOf(grid);
  const after = group[gi + 1];
  const caption =
    after && hasClass(after, "campaign-copy-block") && !find([after], (e) => e.name === "ul").length &&
    textOf(after).trim().length > 0 && textOf(after).trim().length < 90
      ? after
      : null;
  const text = group.filter((k) => k !== grid && k !== caption);
  if (!text.length || text.every((t) => !textOf(t).trim())) return group;
  // a bare heading ("Video") beside a picture leaves a wide empty column: stack instead
  if (text.map((t) => textOf(t)).join(" ").replace(/\s+/g, " ").trim().length < 60) {
    addClass(grid, "dc-stack-media");
    return group;
  }

  const mediaFirst = gi < group.indexOf(text[0]);
  const media = wrap("div", { class: "dc-split-media" }, caption ? [grid, caption] : [grid]);
  const body = wrap("div", { class: "dc-split-text" }, text);
  return [wrap("div", { class: `dc-split${mediaFirst ? " dc-split--media-first" : ""}` }, mediaFirst ? [media, body] : [body, media])];
}

// Banners and text graphics (2.2+ times wider than tall) are never cut to the 3:2
// photo shape: .dc-graphic shows them whole; banners 900px+ wide also take the
// full width (.dc-wide on the grid).
function markGraphics(nodes: DOMNode[]) {
  for (const img of find(nodes, (e) => e.name === "img")) {
    const w = Number(img.attribs.width), h = Number(img.attribs.height);
    let p = img.parent;
    while (p instanceof Element && !hasClass(p, "campaign-photo-grid")) p = p.parent;
    if (!(p instanceof Element) || !(h > 0) || w / h < 2.2) continue;
    addClass(img, "dc-graphic");
    if (w >= 900) addClass(p, "dc-wide");
  }
}

// Small marks (icons, avatars, 160px or less) sat alone in big tan mats. They are
// marked .dc-icon (square ones also .dc-icon--round, shown as a small badge);
// a grid holding only icons is .dc-icons and takes just the room they need.
function markIcons(nodes: DOMNode[]) {
  for (const grid of find(nodes, (e) => hasClass(e, "campaign-photo-grid"))) {
    if (hasClass(grid, "dc-overlay") || hasClass(grid, "dc-decor")) continue;
    const figs = elements(grid).filter((f) => f.name === "figure");
    let icons = 0;
    for (const f of figs) {
      const img = find([f], (e) => e.name === "img")[0];
      if (!img) continue;
      const a = img.attribs;
      const w = Number(a.width), h = Number(a.height);
      if (a["data-dc-kind"] !== "mark" || a["aria-hidden"] === "true" || !(w <= 160 && h <= 160)) continue;
      addClass(f, "dc-icon");
      if (w < 12 || h < 12) addClass(f, "dc-rule");
      if (w >= 30 && w / h >= 0.7 && w / h <= 1.4 && !/play|pause/i.test(`${a.src} ${a.alt}`)) addClass(f, "dc-icon--round");
      icons++;
    }
    if (figs.length && icons === figs.length) addClass(grid, "dc-icons");
  }
}

// Photo units in a "Read details" block (villas, nearby places, guest stories):
// each photo starts a card holding the heading just before it and everything up
// to the next photo; the cards sit in a grid of as many columns as fit.
const isEmptyGrid = (n: Element) => hasClass(n, "campaign-photo-grid") && !find([n], (e) => e.name === "img").length;
function isUnitGrid(n: Element) {
  if (!hasClass(n, "campaign-photo-grid")) return false;
  return elements(n).some((f) => f.name === "figure" && figureKind(f)?.kind === "photo" && !hasClass(f, "dc-icon"));
}

// Runs of two or more photo units become card grids. A grid that is not a unit
// (logos, an empty grid) ends the run; the block's own title (h2 with its eyebrow)
// always stays above the cards.
function cardify(box: Element, articleOnly = false): boolean {
  const kids = elements(box);
  // in a section, only "photo, then its own h3 title" units count (press articles)
  const unitAt = (i: number) => isUnitGrid(kids[i]) && (!articleOnly || kids[i + 1]?.name === "h3");
  if (kids.some((k) => BLOCKERS.some((c) => hasClass(k, c)) || k.name === "details")) return false;
  const out: Element[] = [];
  let run: Element[][] = [];
  let made = false;
  const flush = () => {
    const ok = run.length >= 2 && run.every((u) => u.some((k) => !hasClass(k, "campaign-photo-grid") && textOf(k).trim()));
    if (ok) {
      for (const u of run) {
        // a title caught inside a card goes back above the cards
        const h = u.findIndex((k) => k.name === "h2");
        if (h >= 0) {
          const from = h > 0 && hasClass(u[h - 1], "campaign-eyebrow") ? h - 1 : h;
          out.push(...u.splice(from, h - from + 1));
        }
      }
      out.push(wrap("div", { class: "dc-cards" }, run.map((u) => wrap("div", { class: "dc-card" }, u))));
      made = true;
    } else for (const u of run) out.push(...u);
    run = [];
  };
  for (const [ki, k] of kids.entries()) {
    if (unitAt(ki)) {
      const prev = run.length ? run[run.length - 1] : out;
      const h3 = prev[prev.length - 1]?.name === "h3" ? prev.pop()! : null;
      run.push(h3 ? [h3, k] : [k]);
    } else if (run.length && hasClass(k, "campaign-photo-grid") && !hasClass(k, "dc-icons") && !isEmptyGrid(k)) {
      flush();
      out.push(k);
    } else if (run.length) run[run.length - 1].push(k);
    else out.push(k);
  }
  flush();
  if (!made) return false;
  box.children = out;
  relink(box);
  return true;
}

function layoutDetails(d: Element) {
  // loose text directly in the block would be lost when it is regrouped: leave it alone
  if (d.children.some((c) => c instanceof Text && c.data.trim())) return;
  const summary = elements(d).find((e) => e.name === "summary");
  const body = elements(d).filter((e) => e !== summary);
  if (!body.length) return;
  const box = wrap("div", { class: "dc-details-body" }, body);
  d.children = summary ? [summary, box] : [box];
  relink(d);
  markIcons([box]);
  // decorative pictures closing the block (flowers, stones) become its background
  const last = elements(box).at(-1);
  if (last && hasClass(last, "campaign-photo-grid") && elements(box).length > 1) {
    const kinds = elements(last).filter((f) => f.name === "figure").map(figureKind);
    if (kinds.length && kinds.every((k) => k?.kind === "decor")) {
      addClass(last, "dc-decor");
      addClass(box, "dc-has-decor");
    }
  }
  if (!cardify(box)) layoutSection(box);
  if (hasClass(box, "dc-has-decor")) addClass(d, "dc-has-decor");
}

// Article pages (the Karkidaka layout) wrap every block in its own div, so a set
// of award badges or doctor photos stacked one per line down the page. Runs of
// two or more figure-only blocks become one row (.dc-figrow); portraits get
// wider cells (.dc-figrow--people).
function figureRuns(nodes: DOMNode[]) {
  for (const art of find(nodes, (e) => e.name === "article")) {
    const isFig = (k: DOMNode) => {
      if (!(k instanceof Element) || k.name !== "div") return false;
      const inner = elements(k);
      return inner.length === 1 && inner[0].name === "figure" && !textOf(k).trim();
    };
    const blank = (k: DOMNode) => k instanceof Text && !k.data.trim();
    const kids = art.children as DOMNode[];
    const out: DOMNode[] = [];
    let changed = false;
    for (let i = 0; i < kids.length; ) {
      // a run: figure blocks, with only whitespace between them
      const run: Element[] = [];
      let j = i;
      while (j < kids.length && (isFig(kids[j]) || (blank(kids[j]) && run.length && kids.slice(j).some(isFig)))) {
        if (isFig(kids[j])) run.push(kids[j] as Element);
        j++;
        if (j < kids.length && !isFig(kids[j]) && !blank(kids[j])) break;
      }
      if (run.length >= 2) {
        const imgs = find(run, (e) => e.name === "img");
        const people = imgs.every((m) => m.attribs["data-dc-kind"] === "photo" && Number(m.attribs.height) >= Number(m.attribs.width));
        out.push(wrap("div", { class: `dc-figrow${people ? " dc-figrow--people" : ""}` }, run));
        changed = true;
        i = j;
      } else out.push(kids[i++]);
    }
    if (changed) {
      art.children = out as Element["children"];
      relink(art);
    }
  }
}

// Section types, decided once on the server so the stylesheet can use plain
// classes instead of long :has() chains the browser would re-check on every
// style change (that was most of the main-thread time on phones):
//   dc-pair      two or more photos, no FAQ, no bullet list: photos in the right column
//   dc-k         card section (three across), with dc-kc*/dc-kr* grid slots per item
//   dc-feature   heading + photo + h3 + text feature cards ("Are You Looking To ?")
//   dc-ring      "What results can you expect" ring
//   dc-faqphotos FAQ with photos
//   dc-package   package section (photos, list, amenities)
//   dc-videotest video testimonials
//   dc-empty     nothing but empty photo grids
function classify(sec: Element) {
  const kids = elements(sec);
  const PG = (k: Element) => hasClass(k, "campaign-photo-grid");
  const E = (k: Element) => hasClass(k, "campaign-eyebrow");
  const C = (k: Element) => hasClass(k, "campaign-copy-block");
  const pgs = kids.filter((k) => PG(k) && !isEmptyGrid(k));
  const has = (test: (e: Element) => boolean) => find(kids, test).length > 0;
  const ulIn = (k: Element) => find(k.children as DOMNode[], (e) => e.name === "ul").length > 0;
  const hasFaq = has((e) => hasClass(e, "campaign-faq"));
  const hasCopyUl = find(kids, (e) => hasClass(e, "campaign-copy-block")).some(ulIn);
  const firstPg = kids.findIndex(PG);
  const ulAfterPg = firstPg >= 0 && kids.slice(firstPg + 1).some((k) => C(k) && ulIn(k));
  const video = has((e) => e.name === "img" && /video/.test(e.attribs.src ?? ""));
  const img = (end: string) => has((e) => e.name === "img" && (e.attribs.src ?? "").endsWith(end));
  const add = (c: string) => addClass(sec, c);

  if (kids.every((k) => PG(k) && !k.children.length)) add("dc-empty");
  if (img("/box-1-img-1.webp") && img("/mid-image.webp")) add("dc-ring");
  if (img("/background-1.webp") && kids.some((k, i) => k.name === "h2" && kids[i + 1] && PG(kids[i + 1]) && kids[i + 2]?.name === "h3" && kids[i + 3] && C(kids[i + 3]))) add("dc-feature");
  if (kids.some((k) => hasClass(k, "campaign-faq")) && pgs.length >= 2) add("dc-faqphotos");
  if (!hasFaq && ulAfterPg && kids.some((k, i) => PG(k) && kids[i + 1] && E(kids[i + 1]))) add("dc-package");
  if (video && pgs.length >= 2) add("dc-videotest");

  const cards =
    !hasFaq && kids.filter((k) => k.name === "h2").length < 2 && !kids.some((k) => k.name === "h3") && !video && !ulAfterPg && pgs.length >= 3 &&
    (kids.some((k, i) => PG(k) && kids[i + 1] && E(kids[i + 1])) || !(firstPg > 0 && C(kids[firstPg - 1])));
  const leadCount = kids.slice(0, Math.max(firstPg, 0)).filter((k, i, a) => !(i === a.length - 1 && E(k))).length;
  if (cards && leadCount <= 4) {
    add("dc-k");
    const slot = (k: Element, col: number, row: number) => addClass(k, `dc-kc${col} dc-kr${row}`);
    const part = new Set<Element>();
    pgs.forEach((g, n) => {
      const i = kids.indexOf(g), col = (n % 3) + 1, r = 5 + 3 * Math.floor(n / 3);
      slot(g, col, r);
      part.add(g);
      const next = kids[i + 1], prev = kids[i - 1];
      const label = next && E(next) ? next : prev && E(prev) && !part.has(prev) ? prev : null;
      if (label) { slot(label, col, r + 1); addClass(label, "dc-k-label"); part.add(label); }
      const copy = next && C(next) ? next : next && E(next) && kids[i + 2] && C(kids[i + 2]) ? kids[i + 2] : null;
      if (copy) { slot(copy, col, r + 2); addClass(copy, "dc-k-copy"); part.add(copy); }
    });
    let lead = 0, tail = 0;
    kids.forEach((k, i) => {
      if (part.has(k)) return;
      if (i < firstPg) addClass(k, `dc-kr${++lead}`);
      else addClass(k, `dc-kr${40 + ++tail}`);
    });
  } else if (!hasFaq && !hasCopyUl && pgs.length >= 2) add("dc-pair");
}

// Pairs inside a container: [icon grid, label] → .dc-feat (icon beside its own
// label), runs of three or more → .dc-feats; [video grid, caption] runs of two or
// more → .dc-vt items in .dc-vts (two testimonials a row, text beside its video).
const isVideoGrid = (k: Element) =>
  hasClass(k, "campaign-photo-grid") && find([k], (e) => e.name === "img" && /video|youtube|ytimg/i.test(e.attribs.src ?? "")).length > 0;
const isLabel = (k: Element | undefined) => !!k && (hasClass(k, "campaign-copy-block") || hasClass(k, "campaign-eyebrow")) && !!textOf(k).trim();

function pairRuns(box: Element) {
  if (box.children.some((c) => c instanceof Text && c.data.trim())) return;
  const kids = elements(box);
  const out: Element[] = [];
  let changed = false;
  for (let i = 0; i < kids.length; ) {
    const kind = (k: Element) => (hasClass(k, "dc-icons") ? "icon" : isVideoGrid(k) ? "video" : null);
    const k0 = kind(kids[i]);
    if (k0 && isLabel(kids[i + 1])) {
      const pairs: Element[][] = [];
      let j = i;
      while (j < kids.length && kind(kids[j]) === k0 && isLabel(kids[j + 1])) {
        pairs.push([kids[j], kids[j + 1]]);
        j += 2;
      }
      const min = k0 === "icon" ? 3 : 2;
      if (pairs.length >= min) {
        const item = k0 === "icon" ? "dc-feat" : "dc-vt";
        out.push(wrap("div", { class: `${item}s` }, pairs.map((p) => wrap("div", { class: item }, p))));
        changed = true;
        i = j;
        continue;
      }
    }
    out.push(kids[i++]);
  }
  if (changed) {
    box.children = out;
    relink(box);
  }
}

export function layoutCampaign(nodes: DOMNode[]): DOMNode[] {
  // the hero photo is the largest thing on first screen: fetch it first, never lazily
  const hero = find(nodes, (e) => e.name === "img" && e.parent instanceof Element && hasClass(e.parent, "campaign-hero"))[0];
  if (hero) {
    hero.attribs.fetchpriority = "high";
    hero.attribs.loading = "eager";
    hero.attribs.decoding = "async";
  }
  figureRuns(nodes);
  markIcons(nodes);
  for (const box of find(nodes, (e) => (e.name === "section" && hasClass(e, "campaign-section")) || (e.name === "details" && hasClass(e, "campaign-more")))) pairRuns(box);
  markGraphics(nodes);
  let lastPlay: Element | null = null;
  for (const sec of find(nodes, (e) => e.name === "section" && hasClass(e, "campaign-section"))) {
    const kids = elements(sec);
    const video = kids.length === 1 && kids[0].name === "figure" && kids[0].attribs["data-source-embed"] === "youtube";
    if (video) {
      addClass(sec, "dc-video-link");
      const link = find(kids, (e) => e.name === "a" && /youtube\.com\/embed\//.test(e.attribs.href ?? ""))[0];
      // the video just above this link: its thumbnail opens the same video
      if (link && lastPlay?.parent instanceof Element) {
        const holder = lastPlay.parent;
        const i = holder.children.indexOf(lastPlay);
        const a = wrap(
          "a",
          { href: link.attribs.href, target: "_blank", rel: "noopener", class: "dc-play-link", "aria-label": textOf(link).trim() || "Watch the video" },
          [lastPlay],
        );
        holder.children.splice(i, 1, a);
        relink(holder);
      }
      lastPlay = null;
      continue;
    }
    if (elements(sec).some((k) => k.name === "h3")) cardify(sec, true);
    lastPlay = layoutSection(sec);
  }
  for (const d of find(nodes, (e) => e.name === "details" && hasClass(e, "campaign-more"))) layoutDetails(d);
  markIcons(nodes);
  for (const sec of find(nodes, (e) => e.name === "section" && hasClass(e, "campaign-section"))) classify(sec);
  return nodes;
}

// Serialise nodes back to HTML. DcPage sends sections that hold no React slot as
// plain HTML (dangerouslySetInnerHTML), so the browser does not have to hydrate
// every one of their elements — the same markup, far less work on phones.
const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const escText = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

export function toHtml(nodes: DOMNode[], raw = false): string {
  let out = "";
  for (const n of nodes) {
    if (n instanceof Text) out += raw ? n.data : escText(n.data);
    else if (n instanceof Element) {
      const attrs = Object.entries(n.attribs).map(([k, v]) => (v === "" ? ` ${k}` : ` ${k}="${escAttr(v)}"`)).join("");
      out += `<${n.name}${attrs}>`;
      if (!VOID.has(n.name)) out += toHtml(n.children as DOMNode[], n.name === "script" || n.name === "style") + `</${n.name}>`;
    }
  }
  return out;
}

export const hasSlot = (el: Element) => find([el], (e) => "data-slot" in e.attribs).length > 0;

// On-site links point at the environment being reviewed (relative paths).
export function localLinks(nodes: DOMNode[]) {
  for (const a of find(nodes, (e) => e.name === "a")) {
    const href = a.attribs.href || "";
    if (/^https:\/\/(?:www\.)?ayurvedichealingvillage\.com(?:\/|$)/i.test(href)) {
      const u = new URL(href);
      a.attribs.href = u.pathname + u.search + u.hash;
    }
  }
}

"use client";

// Behaviour for the interactive parts of the Batch A staging markup. The saved
// staging pages carry the controls (with their ARIA attributes) but not the
// scripts that drove them, so without this the buttons did nothing:
//   - tabs:        button[role=tab][aria-controls]        (programme tabs)
//   - disclosures: button[aria-expanded][aria-controls]   (itinerary, section rail)
//   - galleries:   "Previous image" / "Next image" around a swipeable track,
//                  with the "Image N of M" counter kept in step
//   - selectors:   "Previous/Next guest experience" over a list of stories
//   - read more:   long text shortened with a "Read more" button (added here)
//   - chevrons:    a sign on detail controls that have none
// One delegated click listener; nothing else is rendered.

import { useEffect } from "react";

const ROOT = "#ahv-design-root";

function setSign(btn: Element, open: boolean) {
  // "+" / "−" markers inside the button (staging's convention)
  for (const n of btn.querySelectorAll("span")) {
    const t = n.textContent?.trim();
    if (t === "+" || t === "−" || t === "-") n.textContent = open ? "−" : "+";
  }
  for (const n of btn.childNodes) {
    if (n.nodeType === 3) n.textContent = (n.textContent ?? "").replace(/^(\s*)[+−-](\s)/, `$1${open ? "−" : "+"}$2`);
  }
}

function selectTab(tab: HTMLElement) {
  const list = tab.closest('[role="tablist"]') ?? tab.parentElement;
  if (!list) return;
  for (const t of list.querySelectorAll<HTMLElement>('[role="tab"]')) {
    const on = t === tab;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    const panel = document.getElementById(t.getAttribute("aria-controls") ?? "");
    if (panel) panel.hidden = !on;
  }
}

function galleryParts(btn: HTMLElement) {
  let box: HTMLElement | null = btn.parentElement;
  let track: HTMLElement | null = null;
  while (box && !track) {
    track = [...box.querySelectorAll<HTMLElement>("*")].find((e) => /auto|scroll/.test(getComputedStyle(e).overflowX)) ?? null;
    if (!track) box = box.parentElement;
  }
  if (!track || !box) return null;
  const card = box.closest("li, article, section") ?? box.parentElement;
  const counter = card
    ? [...card.querySelectorAll<HTMLElement>("[aria-live]")].find((e) => /\d+\s+of\s+\d+/i.test(e.textContent ?? ""))
    : undefined;
  const prev = box.querySelector<HTMLElement>('[aria-label="Previous image"]');
  const next = box.querySelector<HTMLElement>('[aria-label="Next image"]');
  return { track, counter, prev, next };
}

function syncGallery(parts: NonNullable<ReturnType<typeof galleryParts>>) {
  const { track, counter, prev, next } = parts;
  const n = track.children.length;
  const i = Math.min(n - 1, Math.max(0, Math.round(track.scrollLeft / Math.max(1, track.clientWidth))));
  if (counter) counter.textContent = (counter.textContent ?? "").replace(/\d+(\s+of\s+)\d+/i, `${i + 1}$1${n}`);
  prev?.setAttribute("aria-disabled", String(i === 0));
  next?.setAttribute("aria-disabled", String(i === n - 1));
}

function stepStories(btn: HTMLElement, dir: 1 | -1) {
  const box = btn.parentElement?.parentElement;
  const list = box?.querySelector<HTMLElement>("ul, ol");
  if (!box || !list) return;
  const items = [...list.children] as HTMLElement[];
  let i = items.findIndex((li) => li.dataset.dcSelected === "true");
  if (i < 0) i = Math.max(0, items.findIndex((li) => /gold/.test(li.style.outline)));
  const j = Math.min(items.length - 1, Math.max(0, i + dir));
  items.forEach((li, k) => {
    li.dataset.dcSelected = String(k === j);
    li.style.outline = k === j ? "3px solid var(--gold)" : "1px solid transparent";
    if (k === j) li.setAttribute("aria-current", "true");
    else li.removeAttribute("aria-current");
  });
  items[j]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  const status = [...box.querySelectorAll<HTMLElement>("p")].find((p) => /\d+\s+of\s+\d+\s+selected/i.test(p.textContent ?? ""));
  if (status) status.textContent = (status.textContent ?? "").replace(/\d+(\s+of\s+)\d+/i, `${j + 1}$1${items.length}`);
}

// "Read more" for long text: a paragraph (or a block of paragraphs) taller than
// a few lines is shown shortened with a fade, and a button opens the rest. The
// words stay in the page (search engines and screen readers get all of them);
// only the visible height changes. Blocks already hidden (closed tabs) are
// measured when they are shown.
const SKIP = "form, header, footer, nav, details, button, a, [role=dialog], #ahv-cta-bar, #ahv-contact-controls, .dc-vt, .dc-feat";
const LABELS: Record<string, [string, string]> = {
  de: ["Weiterlesen", "Weniger anzeigen"], fr: ["Lire la suite", "Réduire"],
  es: ["Leer más", "Leer menos"], it: ["Leggi di più", "Mostra meno"],
  pt: ["Ler mais", "Ler menos"], nl: ["Meer lezen", "Minder tonen"],
  ru: ["Читать далее", "Свернуть"], hi: ["और पढ़ें", "कम दिखाएँ"],
  ar: ["اقرأ المزيد", "عرض أقل"], zh: ["展开阅读", "收起"],
  ja: ["続きを読む", "折りたたむ"], ko: ["더 읽기", "접기"],
};
let moreSeq = 0;

function labels(el: Element): [string, string] {
  const lang = (el.closest("[lang]")?.getAttribute("lang") ?? document.documentElement.lang ?? "en").slice(0, 2).toLowerCase();
  return LABELS[lang] ?? ["Read more", "Read less"];
}

function textBlocks(root: Element): HTMLElement[] {
  const seen = new Set<HTMLElement>();
  for (const p of root.querySelectorAll<HTMLElement>("p, blockquote")) {
    if (p.closest(SKIP) || p.closest("[data-dc-more]")) continue;
    const parent = p.parentElement;
    // several paragraphs together in one box read as one block
    const group =
      parent && parent !== root && parent.children.length >= 2 && [...parent.children].every((c) => c.tagName === "P")
        ? parent
        : p;
    seen.add(group);
  }
  return [...seen];
}

function addReadMore(root: Element) {
  const phone = window.innerWidth < 700;
  // read every block first, then change them all, so the page is laid out once
  const picks: { el: HTMLElement; h: number }[] = [];
  for (const el of textBlocks(root)) {
    if (el.dataset.dcMore !== undefined) continue;
    const box = el.getBoundingClientRect();
    if (!box.height) continue;
    const cs = getComputedStyle(el.tagName === "P" ? el : (el.firstElementChild ?? el));
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.6;
    // a block can ask for its own length (data-dc-more-lines), e.g. the
    // Panchakarma cards, shown two lines each so the row reads evenly
    const force = Number(el.dataset.dcMoreLines) || 0;
    // narrow columns are left whole: clipping them looks broken
    if (!force && box.width < 200) continue;
    const keep = force || (phone ? 7 : box.width < 560 ? 6 : 8);
    if (box.height / lh <= (force ? keep + 0.5 : keep + 1)) continue;
    // text set in newspaper columns would reflow unevenly when shortened
    if ([el, el.parentElement].some((e) => e && getComputedStyle(e).columnCount !== "auto")) continue;
    picks.push({ el, h: Math.round(keep * lh) });
  }
  for (const pick of picks) {
    let { el } = pick;
    const { h } = pick;
    // inside a grid or a row (cards, list grids) the button must stay inside the
    // block itself, or it becomes a separate cell beside the card
    const parentDisplay = el.parentElement ? getComputedStyle(el.parentElement).display : "block";
    if (el.tagName === "LI" || /flex|grid/.test(parentDisplay)) {
      el.dataset.dcMore = "";
      const inner = document.createElement("div");
      inner.append(...el.childNodes);
      el.append(inner);
      el = inner;
    }
    el.dataset.dcMore = "";
    el.id ||= `dc-more-${++moreSeq}`;
    el.classList.add("dc-more");
    el.style.setProperty("--dc-more-h", `${h}px`);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "dc-more-btn dc-chev";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", el.id);
    btn.dataset.dcMoreBtn = "";
    btn.textContent = labels(el)[0];
    el.after(btn);
  }
}

function toggleReadMore(btn: HTMLElement) {
  const el = document.getElementById(btn.getAttribute("aria-controls") ?? "");
  if (!el) return;
  const open = btn.getAttribute("aria-expanded") !== "true";
  btn.setAttribute("aria-expanded", String(open));
  el.classList.toggle("dc-more-open", open);
  btn.textContent = labels(el)[open ? 1 : 0];
  if (!open && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: "start", behavior: "smooth" });
}

// A control that opens more detail but shows no sign of it (a FAQ question, a
// "see the full process" summary) gets a chevron that turns when it is open.
function markDisclosures(root: Element) {
  for (const c of root.querySelectorAll<HTMLElement>("details > summary, button[aria-expanded][aria-controls]")) {
    if (c.classList.contains("dc-chev")) continue;
    const t = (c.textContent ?? "").trim();
    const signed =
      /^[+−-]|[+−-]$/.test(t) ||
      c.querySelector("svg, [class*=chev], [class*=arrow], [class*=icon]") ||
      [c, ...c.children].some((e) =>
        ["::before", "::after"].some((ps) => !["none", "normal", '""'].includes(getComputedStyle(e, ps).content)),
      );
    if (signed) continue;
    c.classList.add("dc-chev");
    if (/flex/.test(getComputedStyle(c).display)) c.classList.add("dc-chev-end");
  }
}

export default function DcWidgets() {
  useEffect(() => {
    const root = document.querySelector(ROOT);
    if (!root) return;

    const onClick = (ev: Event) => {
      const btn = (ev.target as Element).closest<HTMLElement>("button");
      if (!btn || !root.contains(btn) || btn.closest("form")) return;
      const label = btn.getAttribute("aria-label") ?? "";

      if (btn.hasAttribute("data-dc-more-btn")) {
        toggleReadMore(btn);
        return;
      }
      if (btn.getAttribute("role") === "tab" && btn.hasAttribute("aria-controls")) {
        selectTab(btn);
        addReadMore(root);
        return;
      }
      if (btn.hasAttribute("aria-expanded") && btn.hasAttribute("aria-controls")) {
        const open = btn.getAttribute("aria-expanded") !== "true";
        btn.setAttribute("aria-expanded", String(open));
        const target = document.getElementById(btn.getAttribute("aria-controls") ?? "");
        if (target) target.hidden = !open;
        setSign(btn, open);
        if (open) addReadMore(root);
        return;
      }
      if (label === "Previous image" || label === "Next image") {
        const parts = galleryParts(btn);
        if (!parts) return;
        const dir = label === "Next image" ? 1 : -1;
        parts.track.scrollBy({ left: dir * parts.track.clientWidth, behavior: "smooth" });
        window.setTimeout(() => syncGallery(parts), 450);
        return;
      }
      if (label === "Previous guest experience" || label === "Next guest experience") {
        stepStories(btn, label.startsWith("Next") ? 1 : -1);
      }
    };

    // arrow keys move between tabs, as the ARIA tabs pattern expects
    const onKey = (ev: KeyboardEvent) => {
      const tab = (ev.target as Element).closest<HTMLElement>('[role="tab"]');
      if (!tab || !root.contains(tab) || !["ArrowLeft", "ArrowRight"].includes(ev.key)) return;
      const tabs = [...(tab.closest('[role="tablist"]') ?? tab.parentElement!).querySelectorAll<HTMLElement>('[role="tab"]')];
      const k = (tabs.indexOf(tab) + (ev.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      tabs[k].focus();
      selectTab(tabs[k]);
      ev.preventDefault();
    };

    // swiping a gallery keeps its counter and arrows in step
    const tracks = new Map<HTMLElement, ReturnType<typeof galleryParts>>();
    for (const b of root.querySelectorAll<HTMLElement>('[aria-label="Next image"]')) {
      const parts = galleryParts(b);
      if (parts) tracks.set(parts.track, parts);
    }
    const onScroll = (ev: Event) => {
      const parts = tracks.get(ev.target as HTMLElement);
      if (parts) syncGallery(parts);
    };

    // measure once fonts and layout settle; again when the width changes (a
    // block that was hidden, or narrower, may now need it)
    let timer = 0;
    // each section is measured for "Read more" only as it comes near the screen,
    // so no work is spent on parts of the page nobody has scrolled to yet
    const near =
      typeof IntersectionObserver === "function"
        ? new IntersectionObserver(
            (entries) => {
              for (const e of entries) {
                if (!e.isIntersecting) continue;
                near?.unobserve(e.target);
                addReadMore(e.target);
              }
            },
            { rootMargin: "800px 0px" },
          )
        : null;
    const scan = () => {
      markDisclosures(root);
      const parts = root.querySelectorAll("section, article, [data-ahv-rail-col]");
      if (near && parts.length) for (const s of parts) near.observe(s);
      else addReadMore(root);
    };
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(scan, 300);
    };
    // after load, when the browser is idle, so it never delays the first paint or input
    const idle = (fn: () => void) =>
      typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(fn, { timeout: 2500 }) : setTimeout(fn, 1200);
    const start = () => document.fonts.ready.then(() => idle(scan));
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    window.addEventListener("resize", onResize);

    root.addEventListener("click", onClick);
    root.addEventListener("keydown", onKey as EventListener);
    for (const t of tracks.keys()) t.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      near?.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", start);
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKey as EventListener);
      for (const t of tracks.keys()) t.removeEventListener("scroll", onScroll);
    };
  }, []);
  return null;
}

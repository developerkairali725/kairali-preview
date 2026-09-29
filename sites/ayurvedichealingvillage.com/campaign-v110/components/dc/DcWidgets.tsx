"use client";

// Behaviour for the interactive parts of the Batch A staging markup. The saved
// staging pages carry the controls (with their ARIA attributes) but not the
// scripts that drove them, so without this the buttons did nothing:
//   - tabs:        button[role=tab][aria-controls]        (programme tabs)
//   - disclosures: button[aria-expanded][aria-controls]   (itinerary, section rail)
//   - galleries:   "Previous image" / "Next image" around a swipeable track,
//                  with the "Image N of M" counter kept in step
//   - selectors:   "Previous/Next guest experience" over a list of stories
// One delegated click listener; nothing is rendered.

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

export default function DcWidgets() {
  useEffect(() => {
    const root = document.querySelector(ROOT);
    if (!root) return;

    const onClick = (ev: Event) => {
      const btn = (ev.target as Element).closest<HTMLElement>("button");
      if (!btn || !root.contains(btn) || btn.closest("form")) return;
      const label = btn.getAttribute("aria-label") ?? "";

      if (btn.getAttribute("role") === "tab" && btn.hasAttribute("aria-controls")) {
        selectTab(btn);
        return;
      }
      if (btn.hasAttribute("aria-expanded") && btn.hasAttribute("aria-controls")) {
        const open = btn.getAttribute("aria-expanded") !== "true";
        btn.setAttribute("aria-expanded", String(open));
        const target = document.getElementById(btn.getAttribute("aria-controls") ?? "");
        if (target) target.hidden = !open;
        setSign(btn, open);
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

    root.addEventListener("click", onClick);
    root.addEventListener("keydown", onKey as EventListener);
    for (const t of tracks.keys()) t.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKey as EventListener);
      for (const t of tracks.keys()) t.removeEventListener("scroll", onScroll);
    };
  }, []);
  return null;
}

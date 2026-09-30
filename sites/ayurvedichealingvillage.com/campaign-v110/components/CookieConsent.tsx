"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Temporary cookie consent bar. On import into the main site, the main site's
// shared consent component REPLACES this file: remove <CookieConsent /> from
// PageShell and let the site-wide component handle consent.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useSyncExternalStore } from "react";
import { site } from "../lib/site";
import styles from "./CookieConsent.module.css";

const KEY = "ahv-cookie-consent";
type Choice = "all" | "essential";

const listeners = new Set<() => void>();

function read(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null; // storage blocked: show the bar, never crash
  }
}

function save(choice: Choice) {
  try {
    localStorage.setItem(KEY, choice);
  } catch {
    // storage blocked (private mode / strict settings): hide for this view only
  }
  dismissed = true;
  listeners.forEach((l) => l());
}

let dismissed = false;

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

// While the bar shows, --cookie-bar-h holds its height: body keeps that much
// bottom padding (app/globals.css), so no content is hidden behind the bar.
function trackHeight(bar: HTMLElement | null) {
  const root = document.documentElement.style;
  if (!bar) {
    root.setProperty("--cookie-bar-h", "0px");
    return;
  }
  const set = () => root.setProperty("--cookie-bar-h", `${bar.offsetHeight}px`);
  set();
  const ro = new ResizeObserver(set);
  ro.observe(bar);
  return () => {
    ro.disconnect();
    root.setProperty("--cookie-bar-h", "0px");
  };
}

export default function CookieConsent() {
  const show = useSyncExternalStore(
    subscribe,
    () => !dismissed && read() === null,
    () => false // server render: hidden, avoids a flash for returning visitors
  );

  const barRef = useCallback((bar: HTMLElement | null) => trackHeight(bar), []);

  if (!show) return null;

  return (
    <section ref={barRef} className={styles.bar} aria-label="Cookie consent">
      <p className={styles.text}>
        We use essential cookies to run this site and, with your permission,
        cookies that help us understand how it is used.{" "}
        <a href={site.legal.cookies}>Cookie policy</a>
      </p>
      <div className={styles.actions}>
        <button type="button" className="btn btn-primary" onClick={() => save("all")}>
          Accept cookies
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => save("essential")}>
          Only essential
        </button>
      </div>
    </section>
  );
}

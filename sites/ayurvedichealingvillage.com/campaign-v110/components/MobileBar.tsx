"use client";

import { useEffect, useState } from "react";
import { ENQUIRY_HREF, PRIMARY_CTA, contact } from "../lib/site";
import { PhoneIcon } from "./Icons";
import styles from "./MobileBar.module.css";

// CTA placement 5: sticky mobile bar — one primary button + a small call icon.
// Staging behaviour kept: the bar slides in once the hero button has scrolled
// out of view (staging toggled .lp-sticky.shown). Staging's aria-hidden on a
// bar with focusable links is removed.
export default function MobileBar({ ctaLabel = PRIMARY_CTA }: { ctaLabel?: string }) {
  const [shown, setShown] = useState(false);

  // Re-attach when a Batch A page swaps between its phone and desktop designs.
  const [epoch, setEpoch] = useState(0);
  useEffect(() => {
    const bump = () => setEpoch((n) => n + 1);
    window.addEventListener("ahv-variant-change", bump);
    return () => window.removeEventListener("ahv-variant-change", bump);
  }, []);

  useEffect(() => {
    const hero = document.getElementById("hero-cta");
    if (!hero || !("IntersectionObserver" in window)) {
      // No hero button to watch: show the bar straight away.
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(([e]) => setShown(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(hero);
    return () => io.disconnect();
  }, [epoch]);

  // Lets the footer and chat slot keep clear of the bar while it shows.
  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 900px)");
    const apply = () =>
      document.documentElement.style.setProperty("--mobile-bar-h", shown && narrow.matches ? "76px" : "0px");
    apply();
    narrow.addEventListener("change", apply);
    return () => narrow.removeEventListener("change", apply);
  }, [shown]);

  return (
    <nav
      className={`${styles.bar} ${shown ? styles.shown : ""} on-dark`}
      aria-label="Quick actions"
      inert={!shown}
    >
      <a className={styles.call} href={contact.phone.href}>
        <PhoneIcon />
        <span className="sr-only">Call {contact.phone.display}</span>
      </a>
      <a className={`btn btn-primary ${styles.cta}`} href={ENQUIRY_HREF}>
        {ctaLabel}
      </a>
    </nav>
  );
}

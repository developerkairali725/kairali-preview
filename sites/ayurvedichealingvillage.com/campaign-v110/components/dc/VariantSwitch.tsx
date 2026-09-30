"use client";

// Staging's Batch A pages are two approved designs, not one fluid layout:
// the phone design below 700px and the desktop design from 700px up
// (staging: cfg.breakpoint 700, `(max-width: 699px)` → mobileView).
// Only one design is in the DOM at a time, so ids, the h1 and the enquiry
// form are never duplicated. The server sends the phone design (most ad
// traffic is on phones); desktops switch on load.

import { useEffect, useSyncExternalStore } from "react";

const QUERY = "(min-width: 700px)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export default function VariantSwitch({
  mobile,
  desktop,
}: {
  mobile: React.ReactNode;
  desktop: React.ReactNode;
}) {
  const wide = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
  // Tell the sticky bar to re-find the hero button in the design now shown.
  useEffect(() => {
    window.dispatchEvent(new Event("ahv-variant-change"));
  }, [wide]);
  return <>{wide ? desktop : mobile}</>;
}

/** Preserve actual section targets after link localization; allow normal off-page navigation. */
export function repairPartnerSectionNavigation(logic) {
  const before = `        const raw = e.currentTarget.getAttribute('href') || '';
        // Off-site enrolment, policy routes, home, mailto and tel are recorded from source and blocked in review.
        if (raw.charAt(0) !== '#') { e.preventDefault(); return; }
        const el = document.getElementById(raw.slice(1));`;
  const after = `        if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const url = new URL(e.currentTarget.getAttribute('href') || '', location.href);
        if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
        const raw = url.hash;
        const el = document.getElementById(decodeURIComponent(raw.slice(1)));`;
  if (logic.includes(after)) return logic;
  if (!logic.includes(before)) throw new Error('Partner section handler boundary missing');
  return logic.replace(before, after);
}

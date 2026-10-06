/** Resolve only FAQ rail URLs at mount time; frozen translated payloads remain intact. */
export function repairFaqTopicTargets(logic, viewId) {
  if (!/^ahv-page-faqs-and-downloads-(desktop|mobile)$/.test(viewId || '')) return logic;
  const unsafe = "root.querySelector(a.getAttribute('href'))";
  if (!logic.includes(unsafe)) return logic;
  return logic.replace('    const esc =', `    // Links may already be normalized to same-page URLs by the shared runtime.
    // Resolve the fragment as an ID rather than passing a URL to a CSS selector.
    const railTarget = href => {
      try {
        const target = new URL(href, location.href);
        if (target.origin !== location.origin || target.pathname !== location.pathname || !target.hash) return null;
        const id = decodeURIComponent(target.hash.slice(1));
        return qa('[id]').find(el => el.id === id) || null;
      } catch (e) { return null; }
    };

    const esc =`)
    .replace(unsafe, "railTarget(a.getAttribute('href'))");
}

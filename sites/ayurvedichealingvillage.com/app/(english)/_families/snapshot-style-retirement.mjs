/** React installs this only after hydration; the runtime never removes React-owned nodes. */
export function observeSnapshotStyleRetirement(doc, assets, onRetire) {
  function retire() {
    if (doc.getElementById('ahv-design-root')?.getAttribute('data-ahv-snapshot-state') !== 'retired') return;
    const styles = new Set(Array.from(doc.head.querySelectorAll('style'), (el) => (el.textContent || '').trim()));
    const links = new Set(Array.from(doc.head.querySelectorAll('link[rel=stylesheet]'), (el) => el.getAttribute('href')));
    onRetire(assets.filter((asset) => asset.kind === 'link' ? links.has(asset.href) : styles.has(asset.css.trim())));
  }
  doc.addEventListener('ahv:snapshot-retired', retire);
  // Boot may finish before React loads. Reading its state closes that race without delaying first paint.
  retire();
  return () => doc.removeEventListener('ahv:snapshot-retired', retire);
}

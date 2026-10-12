/** Reuse the existing localized hero label when variant C hides its actions on phones.
 * The fourth bar button retains its existing styling, position and chat handler. */
export function installMobileAskLabel(doc: Document, Observer: typeof MutationObserver) {
  // No observer or writes on the other eighteen campaign layouts.
  if (!doc.querySelector('.lp-prod[data-variant="C"] .lp-hero__ask')) return () => {};
  const sync = () => {
    const hero = doc.querySelector('.lp-prod[data-variant="C"] .lp-hero__ask');
    const label = hero?.textContent?.trim();
    const chat = doc.querySelector('#ahv-cta-bar .ahv-contact-trigger');
    if (label && chat && chat.textContent !== label) chat.textContent = label;
  };
  const observer = new Observer(sync);
  observer.observe(doc.body, { childList: true, subtree: true });
  sync();
  return () => observer.disconnect();
}

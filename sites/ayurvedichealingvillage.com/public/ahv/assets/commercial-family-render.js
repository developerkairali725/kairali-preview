// AHV T06 commercial family — shared renderer for the six commercial source datasets.
// Reuses the approved collection block renderer (headings, paragraphs, lists, tables, cards, images, inline links)
// and adds only what these routes need. Prototype binding only: no commerce, provider, form or analytics call.
(function () {
  const A = 'https://ayurvedichealingvillage.com';

  function resolveRoute(propRoute) {
    let q = null;
    try { q = new URLSearchParams(location.search).get('route'); } catch (e) {}
    const want = q || propRoute || null;
    if (!want) return null;
    const D = window.AHV_COMMERCIAL_FAMILY;
    return D ? (D.routes.find(r => r.path === want) || null) : null;
  }

  function applyHead(R) {
    const P = window.AHV_COLLECTION_RENDER;
    // The head contract is identical in shape to the collection family's, so it is reused rather than duplicated.
    P.applyHead(R);
  }

  function commercialVals(R, state, api, guard) {
    const P = window.AHV_COLLECTION_RENDER;
    const navOpen = !!state.comNavOpen;
    return {
      hasCommercial: true, K: R,
      hasCrumbs: !!(R.crumbs && R.crumbs.length),
      crumbs: (R.crumbs || []).slice(0, -1).map(c => ({ label: c.label, url: A + c.path })),
      crumbLast: (R.crumbs && R.crumbs.length) ? R.crumbs[R.crumbs.length - 1].label : '',
      sections: R.components.map((c, ci) => ({
        key: 'k' + ci, component: c.component, ptr: c.ptr,
        isNav: c.component === 'category-controls',
        isSection: c.component !== 'category-controls',
        el: P.sourceBlocks(groupCards(c.blocks), 'k' + ci, guard)
      })),
      // The two captured source buttons are wp-block-navigation responsive open/close controls. They render as
      // exactly that — a navigation toggle. No search or filter capability is invented as source fact.
      hasNavToggle: !!R.catalogueControls,
      navExpanded: navOpen ? 'true' : 'false',
      navHidden: !navOpen,
      navDisplay: navOpen ? 'block' : 'none',
      navToggleLabel: navOpen ? 'Close the category navigation' : 'Open the category navigation',
      navToggleGlyph: navOpen ? '\u2212' : '+',
      toggleNav: () => api.toggleNav()
    };
  }

  // Consecutive source cards become one responsive grid in source order; everything else stays in flow.
  function groupCards(blocks) {
    const out = [];
    let run = null;
    (blocks || []).forEach(b => {
      if (b.kind === 'card') { if (!run) { run = { kind: 'cardgrid', cards: [] }; out.push(run); } run.cards.push(b); return; }
      run = null; out.push(b);
    });
    return out;
  }

  window.AHV_COMMERCIAL_RENDER = { resolveRoute, applyHead, commercialVals, A };
})();

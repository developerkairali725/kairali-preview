// AHV T04 reader population 25A — thin resolver for the 25 own-source reader routes.
// Reuses the approved collection block renderer wholesale (headings, paragraphs, lists, tables, cards, images,
// inline links, source action groups). No new rendering capability is introduced here.
(function () {
  const A = 'https://ayurvedichealingvillage.com';

  function resolveRoute(propRoute) {
    let q = null;
    try { q = new URLSearchParams(location.search).get('route'); } catch (e) {}
    const want = q || propRoute || null;
    if (!want) return null;
    const D = window.AHV_READER25A_FAMILY;
    return D ? (D.routes.find(r => r.path === want) || null) : null;
  }

  // The head contract is identical in shape to the collection family's, so it is reused rather than duplicated.
  function applyHead(R) { window.AHV_COLLECTION_RENDER.applyHead(R); }

  function readerVals(R, guard) {
    const P = window.AHV_COLLECTION_RENDER;
    return {
      hasReader25: true, X: R,
      hasCrumbs: !!(R.crumbs && R.crumbs.length),
      crumbs: (R.crumbs || []).slice(0, -1).map(c => ({ label: c.label, url: A + c.path })),
      crumbLast: (R.crumbs && R.crumbs.length) ? R.crumbs[R.crumbs.length - 1].label : '',
      // A source contextual-navigation component renders inside a labelled <nav>; everything else is a section.
      sections: R.components.map((c, ci) => ({
        key: 'x' + ci, component: c.component, ptr: c.ptr,
        isNav: /context|menu|navigation/i.test(c.component),
        isSection: !/context|menu|navigation/i.test(c.component),
        navLabel: R.h1 + ' — related pages',
        el: P.sourceBlocks(groupCards(c.blocks), 'x' + ci, guard)
      }))
    };
  }

  function groupCards(blocks) {
    const out = [];
    let run = null;
    (blocks || []).forEach(b => {
      if (b.kind === 'card') { if (!run) { run = { kind: 'cardgrid', cards: [] }; out.push(run); } run.cards.push(b); return; }
      run = null; out.push(b);
    });
    return out;
  }

  window.AHV_READER25A_RENDER = { resolveRoute, applyHead, readerVals, A };
})();

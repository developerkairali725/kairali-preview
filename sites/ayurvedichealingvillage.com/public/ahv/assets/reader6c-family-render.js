// AHV T04 reader population 6C — thin resolver for the 6 own-source reader routes.
// Reuses the approved collection block renderer wholesale, including its recursive nested-list rendering.
(function () {
  const A = 'https://ayurvedichealingvillage.com';
  function resolveRoute(propRoute) {
    let q = null;
    try { q = new URLSearchParams(location.search).get('route'); } catch (e) {}
    const want = q || propRoute || null;
    if (!want) return null;
    const D = window.AHV_READER6C_FAMILY;
    return D ? (D.routes.find(r => r.path === want) || null) : null;
  }
  function applyHead(R) { window.AHV_COLLECTION_RENDER.applyHead(R); }
  function groupCards(blocks) {
    const out = []; let run = null;
    (blocks || []).forEach(b => {
      if (b.kind === 'card') { if (!run) { run = { kind: 'cardgrid', cards: [] }; out.push(run); } run.cards.push(b); return; }
      run = null; out.push(b);
    });
    return out;
  }
  function readerVals(R, guard) {
    const P = window.AHV_COLLECTION_RENDER;
    return {
      hasReader6c: true, Z: R,
      hasCrumbs: !!(R.crumbs && R.crumbs.length),
      crumbs: (R.crumbs || []).slice(0, -1).map(c => ({ label: c.label, url: A + c.path })),
      crumbLast: (R.crumbs && R.crumbs.length) ? R.crumbs[R.crumbs.length - 1].label : '',
      sections: R.components.map((c, ci) => ({
        key: 'z' + ci, component: c.component, ptr: c.ptr,
        isNav: /context|menu|navigation/i.test(c.component),
        isSection: !/context|menu|navigation/i.test(c.component),
        navLabel: R.h1 + ' \u2014 related pages',
        el: P.sourceBlocks(groupCards(c.blocks), 'z' + ci, guard)
      }))
    };
  }
  window.AHV_READER6C_RENDER = { resolveRoute, applyHead, readerVals, A };
})();

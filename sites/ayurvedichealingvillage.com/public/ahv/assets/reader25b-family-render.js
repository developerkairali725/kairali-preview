// AHV T04 reader population 25B — thin resolver for the 25 own-source reader routes.
// Reuses the approved collection block renderer wholesale, including its recursive nested-list rendering.
// No rendering capability is introduced here.
(function () {
  const A = 'https://ayurvedichealingvillage.com';
  function resolveRoute(propRoute) {
    let q = null;
    try { q = new URLSearchParams(location.search).get('route'); } catch (e) {}
    const want = q || propRoute || null;
    if (!want) return null;
    const D = window.AHV_READER25B_FAMILY;
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
      hasReader25b: true, Y: R,
      hasCrumbs: !!(R.crumbs && R.crumbs.length),
      crumbs: (R.crumbs || []).slice(0, -1).map(c => ({ label: c.label, url: A + c.path })),
      crumbLast: (R.crumbs && R.crumbs.length) ? R.crumbs[R.crumbs.length - 1].label : '',
      // The owner-approved availability for a Coming Soon route, carried as a plain status line with no
      // registration affordance, date or form.
      hasAvailability: !!(R.ownerStatusOverride && R.ownerStatusOverride.approvedAvailability),
      availability: R.ownerStatusOverride ? R.ownerStatusOverride.approvedAvailability : '',
      sections: R.components.map((c, ci) => ({
        key: 'y' + ci, component: c.component, ptr: c.ptr,
        isNav: /context|menu|navigation/i.test(c.component),
        isSection: !/context|menu|navigation/i.test(c.component),
        navLabel: R.h1 + ' \u2014 related pages',
        el: P.sourceBlocks(groupCards(c.blocks), 'y' + ci, guard).map(el => {
          // Festival article sections follow the page H1; retain the renderer's exact visual styles.
          if (R.path !== '/festivals/' || c.component !== 'article' || !el) return el;
          const tag = el.type === 'h3' ? 'h2' : el.type === 'h4' ? 'h3' : null;
          return tag ? React.createElement(tag, { ...el.props, key: el.key }, el.props.children) : el;
        })
      }))
    };
  }
  window.AHV_READER25B_RENDER = { resolveRoute, applyHead, readerVals, A };
})();

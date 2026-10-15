// AHV training seven — thin resolver for the 7 remaining training/workshop routes.
// Binds onto the accepted reader view: the approved collection block renderer draws every block
// (headings, nested lists, source tables with rowspan/colspan and horizontal scroll, captions, images).
(function () {
  const A = 'https://ayurvedichealingvillage.com';
  function resolveRoute(propRoute) {
    let q = null;
    try { q = new URLSearchParams(location.search).get('route'); } catch (e) {}
    const want = q || propRoute || null;
    if (!want) return null;
    const D = window.AHV_TRAINING7_FAMILY;
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
  // A past event (AHV-M077.01) opens with the past-retreat eyebrow and its historical notice, styled exactly as the
  // reader view's hist9 #hist9-status / #hist9-notice.
  function pastEvent(R) {
    if (!R.statusLabel && !R.historicalNotice) return [];
    const e = React.createElement;
    return [{
      key: 't7-past', component: 'past-event-notice', ptr: undefined, isNav: false, isSection: true,
      navLabel: R.h1 + ' \u2014 related pages',
      el: [
        R.statusLabel ? e('p', { key: 't7-past-s', 'data-ahv-past-status': '', style: { margin: '8px 0 0', display: 'inline-flex', alignItems: 'center', minHeight: '40px', padding: '0 16px', border: '1px solid #5A4420', borderRadius: '4px', fontFamily: "'Mulish',sans-serif", fontWeight: 700, fontSize: '14.5px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#5A4420' } }, R.statusLabel) : null,
        R.historicalNotice ? e('p', { key: 't7-past-n', 'data-ahv-past-notice': '', role: 'note', style: { margin: '16px 0 0', padding: '14px 18px', background: '#F4F0E4', borderLeftWidth: '4px', borderLeftStyle: 'solid', borderLeftColor: '#5A4420', fontSize: '16.5px', lineHeight: 1.7, maxWidth: '78ch', textWrap: 'pretty', overflowWrap: 'anywhere' } }, R.historicalNotice) : null,
      ].filter(Boolean)
    }];
  }
  function readerVals(R, guard) {
    const P = window.AHV_COLLECTION_RENDER;
    return {
      hasReader6c: true, Z: R,
      hasCrumbs: !!(R.crumbs && R.crumbs.length),
      crumbs: (R.crumbs || []).slice(0, -1).map(c => ({ label: c.label, url: A + c.path })),
      crumbLast: (R.crumbs && R.crumbs.length) ? R.crumbs[R.crumbs.length - 1].label : '',
      sections: pastEvent(R).concat(R.components.map((c, ci) => ({
        key: 't7' + ci, component: c.component, ptr: c.ptr,
        isNav: false, isSection: true,
        navLabel: R.h1 + ' \u2014 related pages',
        el: P.sourceBlocks(groupCards(c.blocks), 't7' + ci, guard)
      })))
    };
  }
  window.AHV_TRAINING7_RENDER = { resolveRoute, applyHead, readerVals, A };
})();

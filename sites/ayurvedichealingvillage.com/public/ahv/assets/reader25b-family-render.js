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
  // AHV-M004.01: an article's in-page sections. A heading block with an `anchor` gets that id (clear of the sticky
  // header); an 'on-this-page' component lists those sections as same-page links, in the reader's list style. The
  // collection renderer makes every link absolute, so the same-page list is drawn here instead.
  function anchored(blocks, els) {
    return els.map((el, i) => {
      const a = blocks[i] && blocks[i].kind === 'heading' && blocks[i].anchor;
      return a && el && typeof el === 'object' && el.props ? React.cloneElement(el, { id: a, style: Object.assign({}, el.props.style, { scrollMarginTop: '96px' }) }) : el;
    });
  }
  function onThisPage(c, k) {
    const P = window.AHV_COLLECTION_RENDER, e = React.createElement;
    const head = P.sourceBlocks(c.blocks.filter(b => b.kind === 'heading'), k, () => {});
    const list = c.blocks.find(b => b.kind === 'list');
    return head.concat([e('ul', { key: k + '-toc', 'data-list-depth': '0', style: { margin: '0 0 16px', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '76ch', listStyleType: 'disc' } },
      ...(list ? list.items : []).map((it, j) => e('li', { key: k + '-toc-' + j, style: { fontSize: '17.5px', lineHeight: 1.75, textWrap: 'pretty' } },
        e('a', { href: '#' + it.anchor, style: { textUnderlineOffset: '2px', overflowWrap: 'anywhere' } }, it.text))))]);
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
        // The approved in-body 'contextual-resources' links (AHV-I04) are content, not the retired sidebar: a section.
        isNav: c.component !== 'contextual-resources' && /context|menu|navigation/i.test(c.component),
        isSection: c.component === 'contextual-resources' || !/context|menu|navigation/i.test(c.component),
        navLabel: R.h1 + ' \u2014 related pages',
        el: c.component === 'on-this-page' ? onThisPage(c, 'y' + ci) : anchored(groupCards(c.blocks), P.sourceBlocks(groupCards(c.blocks), 'y' + ci, guard).map(el => {
          // Festival article sections follow the page H1; retain the renderer's exact visual styles.
          if (R.path !== '/festivals/' || c.component !== 'article' || !el) return el;
          const tag = el.type === 'h3' ? 'h2' : el.type === 'h4' ? 'h3' : null;
          return tag ? React.createElement(tag, { ...el.props, key: el.key }, el.props.children) : el;
        }))
      }))
    };
  }
  window.AHV_READER25B_RENDER = { resolveRoute, applyHead, readerVals, A };
})();

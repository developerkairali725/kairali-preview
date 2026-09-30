// AHV T04 recovered undated Lakshya binding — thin resolver.
// Reuses the accepted historical view vocabulary and the shared collection block renderer. No new capability.
(function () {
  const A = 'https://ayurvedichealingvillage.com';
  function resolveRoute(propRoute) {
    let q = null;
    try { q = new URLSearchParams(location.search).get('route'); } catch (e) {}
    const want = q || propRoute || null;
    if (!want) return null;
    const D = window.AHV_LAKSHYA_RECOVERED;
    return D ? (D.routes.find(r => r.path === want) || null) : null;
  }
  function applyHead(R) { window.AHV_COLLECTION_RENDER.applyHead(R); }
  function histVals(R, guard) {
    const P = window.AHV_COLLECTION_RENDER;
    const imgEl = (i, k) => React.createElement('img', { key: k, src: i.file, alt: i.alt || '',
      width: i.width, height: i.height, loading: 'lazy', 'data-source-pointer': i.ptr,
      style: { display: 'block', width: '100%', maxWidth: i.width + 'px', height: 'auto', borderRadius: '4px' } });
    return {
      hasHist9: true, H: R,
      hasCrumbs: !!(R.crumbs && R.crumbs.length),
      crumbs: (R.crumbs || []).slice(0, -1).map(c => ({ label: c.label, url: A + c.path })),
      crumbLast: (R.crumbs && R.crumbs.length) ? R.crumbs[R.crumbs.length - 1].label : '',
      archiveUrl: A + R.archiveLink.href,
      heroEl: R.images.filter(i => i.isHero).map((i, k) => imgEl(i, 'hero' + k)),
      hasHeroImage: R.images.some(i => i.isHero),
      sections: R.components.map((c, ci) => ({
        key: 'z' + ci, component: c.component, ptr: c.ptr,
        el: P.sourceBlocks(c.blocks, 'z' + ci, guard)
      })),
      // The record's own labelled contextual navigation, kept GROUPED: the source Knowledge Center heading
      // and the five source group labels each with their own links, in source order and with source pointers.
      // The flat related-links list is not used for this route, so no label is dropped.
      hasRelated: false, relatedLinks: [],
      hasContextGroups: !!(R.contextNav && R.contextNav.groups.length),
      contextHeading: R.contextNav ? R.contextNav.heading : '',
      contextHeadingPtr: R.contextNav ? R.contextNav.headingPtr : '',
      contextGroups: (R.contextNav ? R.contextNav.groups : []).map((g, gi) => ({
        key: 'cg' + gi, title: g.title, ptr: g.ptr, labelId: 'lk-cg-' + gi,
        links: g.links.map((l, k) => ({ key: 'cg' + gi + '-' + k, label: l.label, ptr: l.ptr,
          sourceHref: l.href, url: /^https?:/i.test(l.href) ? l.href : (A + l.href) }))
      }))
    };
  }
  window.AHV_LAKSHYA_RENDER = { resolveRoute, applyHead, histVals, A };
})();

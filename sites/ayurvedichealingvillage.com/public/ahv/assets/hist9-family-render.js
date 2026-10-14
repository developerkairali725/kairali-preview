// AHV T04 historical retreat details (nine) — thin resolver.
// Reuses the approved collection block renderer wholesale. The only historical additions are the accepted
// Past Retreat status label, historical notice and archive link vocabulary already used by the seven
// accepted historical detail views.
(function () {
  const A = 'https://ayurvedichealingvillage.com';
  function resolveRoute(propRoute) {
    let q = null;
    try { q = new URLSearchParams(location.search).get('route'); } catch (e) {}
    const want = q || propRoute || null;
    if (!want) return null;
    const D = window.AHV_HIST9_FAMILY;
    return D ? (D.routes.find(r => r.path === want) || null) : null;
  }
  function applyHead(R) { window.AHV_COLLECTION_RENDER.applyHead(R); }
  function relatedGroups(links) {
    const groups = new Map();
    // Locale builds rewrite each href to the locale's own path (/ja/…, /de/translated-slug/), so the
    // English-path rules below would send every localized link to the fallback group. Group by the
    // English route the link stands for, read back from the locale's own route table, else the path
    // without its locale prefix (AHV-M082.02).
    const englishPath = (path) => {
      const local = window.AHV_LOCAL_PATHS;
      if (local) for (const en in local) if (local[en] === path) return en;
      const m = path.match(/^\/(?:hi|de|fr|es|it|pt|nl|ru|ar|zh|zh-Hans|ja|ko)(\/.*)$/);
      return m ? m[1] : path;
    };
    const labelFor = (href) => {
      const path = englishPath(new URL(href, A).pathname);
      if (/\/(?:vision-and-mission|social-cultural-environmental-commitment|awards-and-accreditations|accreditations)\//.test(path)) return 'About Kairali';
      if (/\/(?:kairali-hospitality|arogya-kendra|arogya-shala|kairali-ayurvedic-centre|ayurvedic-franchise|kairali-institute-of-ayurveda-and-panchakarma-therapy)\//.test(path)) return 'Kairali Group & education';
      if (/\/(?:new-to-|why-|live-to-|ayurveda-retreats-for-everyone|what-is-)/.test(path)) return 'Ayurveda & yoga knowledge';
      if (path === '/ayurvedic-resturant-and-cooking-at-healing-village/') return 'Food & cooking at Kairali';
      return 'Products & publications';
    };
    links.forEach((link) => {
      const label = labelFor(link.href);
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label).push({ label: link.label, url: /^https?:/i.test(link.href) ? link.href : A + link.href });
    });
    return Array.from(groups, ([label, links]) => ({ label, links }));
  }
  function histVals(R, guard) {
    const P = window.AHV_COLLECTION_RENDER;
    const byPlacement = (name) => R.images.filter(i => i.placement === name);
    const imgEl = (i, k) => React.createElement('img', { key: k, src: i.file, alt: i.alt || '',
      width: i.width, height: i.height, loading: 'lazy', 'data-source-url': i.sourceUrl,
      style: { display: 'block', width: '100%', maxWidth: i.width + 'px', height: 'auto', borderRadius: '4px' } });
    return {
      hasHist9: true, H: R,
      hasCrumbs: !!(R.crumbs && R.crumbs.length),
      crumbs: (R.crumbs || []).slice(0, -1).map(c => ({ label: c.label, url: A + c.path })),
      crumbLast: (R.crumbs && R.crumbs.length) ? R.crumbs[R.crumbs.length - 1].label : '',
      archiveUrl: A + R.archiveLink.href,
      // Hero keeps its approved presentation. Non-hero images are NOT collected here — they are inline
      // image blocks inside their own sections, placed after the retained source node the source pairs
      // them with, and rendered by the shared block renderer.
      heroEl: R.images.filter(i => i.isHero).map((i, k) => imgEl(i, 'hero' + k)),
      hasHeroImage: R.images.some(i => i.isHero),
      sections: R.components.map((c, ci) => ({
        key: 'h' + ci, component: c.component, ptr: c.ptr,
        el: P.sourceBlocks(c.blocks, 'h' + ci, guard)
      })),
      hasRelated: !!(R.relatedLinks && R.relatedLinks.length),
      relatedGroups: relatedGroups(R.relatedLinks || []),
      relatedLinks: (R.relatedLinks || []).map((l, k) => ({ key: 'rl' + k, label: l.label,
        url: /^https?:/i.test(l.href) ? l.href : (A + l.href) }))
    };
  }
  window.AHV_HIST9_RENDER = { resolveRoute, applyHead, histVals, A };
})();

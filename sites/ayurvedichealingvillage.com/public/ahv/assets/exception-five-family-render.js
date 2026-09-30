// AHV T04 exception-five source bindings — thin resolver.
// No new capability: the five datasets bind onto the existing reader/utility view and the shared collection
// block renderer. Private source notes, raw hrefs and gates are never rendered.
(function () {
  const A = 'https://ayurvedichealingvillage.com';
  function resolveRoute(propRoute) {
    let q = null;
    try { q = new URLSearchParams(location.search).get('route'); } catch (e) {}
    const want = q || propRoute || null;
    if (!want) return null;
    const D = window.AHV_EXCEPTION5_FAMILY;
    return D ? (D.routes.find(r => r.path === want) || null) : null;
  }
  function applyHead(R) { window.AHV_COLLECTION_RENDER.applyHead(R); }
  // The five routes need exactly the constructs the accepted utility view already supports: governed breadcrumb,
  // one page H1, ordered source sections and a neutral empty state. Values come from the shared utility mapper.
  function utilityVals(R, guard) { return window.AHV_UTILITY7_RENDER.utilityVals(R, guard); }
  window.AHV_EXCEPTION5_RENDER = { resolveRoute, applyHead, utilityVals, A };
})();

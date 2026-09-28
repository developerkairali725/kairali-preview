// AHV T04 utility / source-exception bindings — thin resolver.
// Reuses the shared collection block renderer. No new capability; private notes are never rendered.
(function () {
  const A = 'https://ayurvedichealingvillage.com';
  function resolveRoute(propRoute) {
    let q = null;
    try { q = new URLSearchParams(location.search).get('route'); } catch (e) {}
    const want = q || propRoute || null;
    if (!want) return null;
    const D = window.AHV_UTILITY7_FAMILY;
    return D ? (D.routes.find(r => r.path === want) || null) : null;
  }
  function applyHead(R) { window.AHV_COLLECTION_RENDER.applyHead(R); }
  function utilityVals(R, guard) {
    const P = window.AHV_COLLECTION_RENDER;
    const sf = R.searchForm || null;
    return {
      hasUtility: true, U: R,
      hasCrumbs: !!(R.crumbs && R.crumbs.length),
      crumbs: (R.crumbs || []).slice(0, -1).map(c => ({ label: c.label, url: A + c.path })),
      crumbLast: (R.crumbs && R.crumbs.length) ? R.crumbs[R.crumbs.length - 1].label : '',
      sections: R.components.map((c, ci) => ({
        key: 'u' + ci, component: c.component, ptr: c.ptr,
        el: P.sourceBlocks(c.blocks, 'u' + ci, guard)
      })),
      // Own captured search controls. Submission is guarded: no network call, no query reflection,
      // no fabricated result. The source GET action stays private in the dataset.
      hasSearch: !!sf,
      searchFields: sf ? sf.controls.filter(c => c.control !== 'button' && c.type !== 'submit').map((c, k) => ({
        key: 'sf' + k, id: 'u7-' + c.name, name: c.name, type: c.type || 'search',
        placeholder: c.placeholder || '', required: !!c.required,
        ariaRequired: c.required ? 'true' : 'false',
        label: c.label || 'Search', ptr: c.ptr })) : [],
      searchButtonLabel: sf ? ((sf.controls.find(c => c.control === 'button' || c.type === 'submit') || {}).actionLabel || 'Search') : '',
      // Concise neutral unavailable state. Implementation gates stay private in the dataset.
      searchNotice: (R.searchForm && R.searchForm.publicState) || 'To search the site, use the search icon at the top of the page.',
      searchGuard: (e) => { e.preventDefault(); },
      // Captured fixture controls render inert from their exact source definitions at their source pointers.
      hasFixtureControls: !!(R.fixtureControls && R.fixtureControls.items && R.fixtureControls.items.length),
      fixtureLabel: R.fixtureControls ? R.fixtureControls.accessibleLabel : '',
      hasNeutralState: !!R.neutralState,
      neutralHeading: R.neutralState ? R.neutralState.heading : '',
      neutralText: R.neutralState ? R.neutralState.text : '',
      fixtureFields: (R.fixtureControls ? R.fixtureControls.items : []).filter(c => c.control !== 'button').map((c, k) => ({
        key: 'fx' + k, id: c.id || ('fx-' + k), type: c.type || 'text',
        placeholder: c.placeholder || '', required: !!c.required,
        ariaRequired: c.required ? 'true' : 'false', ptr: c.ptr,
        label: c.label || (R.fixtureControls ? R.fixtureControls.accessibleLabel : 'Search') })),
      fixtureButtons: (R.fixtureControls ? R.fixtureControls.items : []).filter(c => c.control === 'button').map((c, k) => ({
        key: 'fb' + k, id: c.id || ('fb-' + k), label: c.label || 'Search', ptr: c.ptr })),
      fixtureNotice: 'To search the site, use the search icon at the top of the page.',
      fixtureGuard: (e) => { e.preventDefault(); }
    };
  }
  window.AHV_UTILITY7_RENDER = { resolveRoute, applyHead, utilityVals, A };
})();

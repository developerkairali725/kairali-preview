/** A bad site selector must fail, never silently produce a clean empty scan. */
export function selectSites(fleet, argv) {
  const selected = [];
  for (let i = 0; i < argv.length; i++) if (argv[i] === '--only') {
    const site = argv[++i];
    if (!site || !fleet.includes(site)) throw new Error(`Unknown selected site: ${site}`);
    selected.push(site);
  }
  return selected.length ? [...new Set(selected)] : fleet;
}

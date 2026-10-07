/** Dependencies used during a view's state initialization must execute before
 * the design runtime compiles that view. Next beforeInteractive can still be
 * pending while the independent inline bootstrap mounts the design runtime.
 */
export function orderedRuntimeScripts(view, cfg, hasLeadReceipt) {
  const entries = [{ src: cfg.previewSrc, view: view.file || '' }];
  if ((view.logic || '').includes('window.AHV_LEAD_RECEIPT') && !hasLeadReceipt) {
    entries.push({ src: '/design/lead-receipt.js' });
  }
  for (const src of view.scripts || []) entries.push({ src });
  entries.push({ src: cfg.supportSrc });
  return entries;
}

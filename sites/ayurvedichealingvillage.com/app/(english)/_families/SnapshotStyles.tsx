'use client';

import { useEffect, useState } from 'react';
import { observeSnapshotStyleRetirement } from './snapshot-style-retirement.mjs';

export type SnapshotStyleAsset =
  | { key: string; kind: 'style'; css: string; media?: string }
  | { key: string; kind: 'link'; href: string };

// react-dom compares dangerouslySetInnerHTML by object identity: a fresh {__html} on each render rewrote every kept
// <style> with the same text when the retirement re-rendered this list, so the browser re-parsed the snapshot's
// @font-face sheet into new, unloaded faces at the snapshot -> live swap. The swap frame then painted in the fallback
// face and re-wrapped twice (Sleep Restoration breadcrumb: two 0.193 layout shifts, Lighthouse mobile CLS 0.385).
// One stable object per asset keeps a kept style untouched.
const innerHtml = new WeakMap<SnapshotStyleAsset, { __html: string }>();
function stableHtml(asset: Extract<SnapshotStyleAsset, { kind: 'style' }>) {
  let html = innerHtml.get(asset);
  if (!html) innerHtml.set(asset, (html = { __html: asset.css }));
  return html;
}

/** First paint is server-rendered; React itself retires duplicate styles after this boundary hydrates. */
export function SnapshotStyles({ assets }: { assets: SnapshotStyleAsset[] }) {
  const [retiredAssets, setRetiredAssets] = useState<SnapshotStyleAsset[]>([]);
  useEffect(() => observeSnapshotStyleRetirement(document, assets, setRetiredAssets), [assets]);

  return <>{assets.filter((asset) => !retiredAssets.includes(asset)).map((asset) => asset.kind === 'link'
    ? <link key={asset.key} rel="stylesheet" href={asset.href} data-ahv-snapshot-style="" />
    : <style key={asset.key} media={asset.media} data-ahv-snapshot-style="" dangerouslySetInnerHTML={stableHtml(asset)} />
  )}</>;
}

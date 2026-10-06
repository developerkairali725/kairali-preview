'use client';

import { useEffect, useState } from 'react';
import { observeSnapshotStyleRetirement } from './snapshot-style-retirement.mjs';

export type SnapshotStyleAsset =
  | { key: string; kind: 'style'; css: string; media?: string }
  | { key: string; kind: 'link'; href: string };

/** First paint is server-rendered; React itself retires duplicate styles after this boundary hydrates. */
export function SnapshotStyles({ assets }: { assets: SnapshotStyleAsset[] }) {
  const [retiredAssets, setRetiredAssets] = useState<SnapshotStyleAsset[]>([]);
  useEffect(() => observeSnapshotStyleRetirement(document, assets, setRetiredAssets), [assets]);

  return <>{assets.filter((asset) => !retiredAssets.includes(asset)).map((asset) => asset.kind === 'link'
    ? <link key={asset.key} rel="stylesheet" href={asset.href} data-ahv-snapshot-style="" />
    : <style key={asset.key} media={asset.media} data-ahv-snapshot-style="" dangerouslySetInnerHTML={{ __html: asset.css }} />
  )}</>;
}

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { assertCapturePage } from './capture-page-guard.mjs';

export function validateCaptureBase(base) {
  let url;
  try { url = new URL(base); } catch { throw Error('Invalid capture base: explicit localhost HTTP(S) origin required'); }
  if (typeof base !== 'string' || !['http:', 'https:'].includes(url.protocol) ||
      !['127.0.0.1', 'localhost'].includes(url.hostname) || url.origin !== base) {
    throw Error('Invalid capture base: explicit localhost HTTP(S) origin required');
  }
  return base;
}

export function selectCaptureLocales(value, available) {
  const selected = value == null ? [...available] : value.split(',');
  if (!selected.length || new Set(selected).size !== selected.length || selected.some(loc => !available.includes(loc))) {
    throw Error('Capture locales must be a nonempty, unique subset of the configured translated locales');
  }
  return selected;
}

// Hold an entire locale through every child write and final hash readback.
// Never reclaim a stale lock automatically: an orphaned capture child may live.
function takeFileLocks(directory, labels, site) {
  fs.mkdirSync(directory, { recursive: true });
  const owned = [], token = crypto.randomUUID();
  const release = () => {
    for (const file of owned) {
      if (fs.existsSync(file) && JSON.parse(fs.readFileSync(file)).token === token) fs.unlinkSync(file);
    }
  };
  try {
    for (const locale of [...labels].sort()) {
      const file = path.join(directory, locale + '.json');
      let fd;
      try { fd = fs.openSync(file, 'wx'); }
      catch (error) {
        if (error.code === 'EEXIST') throw Error('Locale writer lock is held: ' + locale + '. Confirm the owner and all children stopped before manual recovery.');
        throw error;
      }
      owned.push(file);
      try { fs.writeFileSync(fd, JSON.stringify({ token, pid: process.pid, locale, site, startedAt: new Date().toISOString() })); }
      finally { fs.closeSync(fd); }
    }
    return release;
  } catch (error) { release(); throw error; }
}

export const takeLocaleLocks = (site, locales) => takeFileLocks(path.join(site, 'l10n/prerender/.capture-locks'), locales, site);
export const takeEvidenceLock = (directory) => takeFileLocks(directory, ['.capture-evidence-writer-lock'], directory);

export function verifyLocaleCaptureState({ site, locale, state, expected, fileHash, snapshotName }) {
  if (!state || JSON.stringify(state.routes) !== JSON.stringify(expected) ||
      state.completed.length !== expected.length || new Set(state.completed).size !== expected.length || state.completed.some(route => !expected.includes(route))) {
    throw Error('Incomplete or unexpected locale coverage: ' + locale);
  }
  const captured = new Map();
  for (const batch of state.batches) {
    if (!batch.snapshots.length || batch.snapshots.length > 25) throw Error('Invalid capture batch size');
    for (const row of batch.snapshots) {
      if (captured.has(row.route)) throw Error('Duplicate captured route: ' + locale + ' ' + row.route);
      captured.set(row.route, row);
    }
  }
  if (captured.size !== expected.length) throw Error('Unexpected snapshot receipt coverage: ' + locale);
  const index = JSON.parse(fs.readFileSync(path.join(site, 'l10n/prerender', locale, 'index.json')));
  for (const route of expected) {
    const capturedRow = captured.get(route), file = 'l10n/prerender/' + locale + '/' + snapshotName(route);
    if (!capturedRow || capturedRow.file !== file || capturedRow.sha256 !== fileHash(file)) throw Error('Snapshot changed after capture: ' + file);
    const rows = index.routes.filter(row => row.path === route);
    if (rows.length !== 1 || !rows[0].ok || !rows[0].liveRuntimeVerified) throw Error('Invalid capture index: ' + locale + ' ' + route);
    assertCapturePage(rows[0].liveContentProof, route);
    assertCapturePage(rows[0].contentProof, route);
  }
}

import { execFileSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

// Retry transport failures only. Missing releases, access errors and integrity
// failures remain hard failures; the caller verifies archive and member hashes.
export async function downloadReleaseAsset(spec, directory, {run=execFileSync, wait=delay}={}) {
  for (let attempt=0; attempt<3; attempt++) {
    try {
      run('gh', ['release','download',spec.tag,'--repo',spec.repository,'--pattern',spec.asset,'--dir',directory,'--clobber'], {encoding:'utf8',stdio:['ignore','pipe','pipe']});
      return;
    } catch (error) {
      const diagnostic=String(error.stderr||error.message||'');
      if (attempt===2 || !/HTTP (?:429|5\d\d)\b|connection reset|timed? out|TLS handshake timeout/i.test(diagnostic)) throw error;
      console.warn(`Asset download transport failure; retry ${attempt+1}/2.`);
      await wait(2000*(attempt+1));
    }
  }
}

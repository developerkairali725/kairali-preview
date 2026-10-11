// Serve the unchanged homepage boot once as a cacheable asset, instead of
// duplicating it in both the initial HTML and React's server payload.
import { writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { STATIC_BOOT } from '../app/(english)/_families/static-design-boot.mjs';
const hash = createHash('sha256').update(STATIC_BOOT).digest('hex');
const name = `static-design-boot-${hash.slice(0, 20)}.js`;
const directory = join(process.cwd(), 'public/design');
mkdirSync(directory, { recursive: true });
writeFileSync(join(directory, name), STATIC_BOOT);
writeFileSync(join(directory, 'static-design-boot.json'), JSON.stringify({ src: `/design/${name}`, sha256: hash }) + '\n');
console.log(`Homepage boot: ${Buffer.byteLength(STATIC_BOOT)} bytes, ${name}`);

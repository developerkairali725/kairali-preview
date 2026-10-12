import {productionCss} from "../scripts/build-production-css.mjs";
import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const site=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const expected={
  "../../campaign-v110/integration.css": "ab3cf7ddd7531ee958f4d9132d039b576cfe60338f34c54c68b57faf10e6f8e0",
  "../../public/design/campaign-bundle.css": "4c6fb0ba61d2687f6059e89ec627b1b48847e4029a487432ed0f013a59bfd336",
  "../styles/base.css": "e4ad7f370d9d7ac29c3987dc3b5e8a4db90cba65064e1da5e5a0d6504c85e940",
  "../sections/sections.css": "e0dba528a7476ad61aecbd070fdf8d87be2ae0f3a75c35294ced1ba469525b3b",
  "./production.css": "289084143a396ebad7b899252efc332e8f72bd96b733fe48ed06d918e7fb0bbe"
};
test('campaign first-paint bundle preserves exact approved stylesheet bytes and cascade order',()=>{
 const entry=fs.readFileSync(path.join(site,'campaign-v2/production/document.css'),'utf8');
 const imports=Object.keys(expected);
 assert.equal(entry,productionCss());
 assert.deepEqual([...entry.matchAll(/@import "([^"]+)";/g)].map(x=>x[1]),[imports[0],imports[1],'@kairali/ui/ahv-campaign-tokens.css']);
 for(const name of imports)assert.equal(createHash('sha256').update(fs.readFileSync(path.resolve(site,'campaign-v2/production',name))).digest('hex'),expected[name],name);
 // Menu-font subset repair changes only unicode-range partitions, never approved design declarations.
 const bundle=fs.readFileSync(path.join(site,'public/design/campaign-bundle.css'),'utf8');
 assert.equal(createHash('sha256').update(bundle.replace(/unicode-range:[^;}]*;?/g,'').replace(/[.][a-f0-9]{12}(?=[.](?:common|extra)[.]woff2)/g,'')).digest('hex'),'45fb2b76bb019b2b89feaa1dbb505742b021f1d4d613b3515b67efdf10885333');
 const doc=fs.readFileSync(path.join(site,'campaign-v2/production/Document.tsx'),'utf8');
 assert.match(doc,/import "\.\/document\.css"/);
 for(const name of imports)assert(!doc.includes('import "'+name+'";'));
});
test('Contact uses the existing font reveal mechanism without changing its timing or consent',()=>{
 const src=fs.readFileSync(path.join(site,'app/(english)/_families/static-design-view.tsx'),'utf8');
 assert.match(src,/const deferFonts = route\.path === "\/" \|\| route\.path === "\/panchakarma-therapy\/" \|\| route\.path === "\/contact-us\/";/);
 const boot=fs.readFileSync(path.join(site,'app/(english)/_families/static-design-boot.mjs'),'utf8');
 assert.match(boot,/if \(cfg\.deferFonts\)/);assert.match(boot,/}, 700\)/);
});

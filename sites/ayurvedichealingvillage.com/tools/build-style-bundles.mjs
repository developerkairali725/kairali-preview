// Preserve source order/rules while removing repeated blocking network requests.
import fs from 'node:fs';
import path from 'node:path';
const site = ['directions','article-reader','campaign','consistency','chrome','newsletter','film-player','search','section-nav','family-header'].map(name => `/design/${name}.css`);
const campaign = ['/design/chrome.css','/design/newsletter.css','/ahv/fonts/ahv-b6a82009abac.css'];
for (const [name, files] of [['site',site],['campaign',campaign]]) {
  const css = files.map(file => {
    const content = fs.readFileSync('public' + file,'utf8').replace(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/g, (full, quote, url) => {
      if (url.startsWith('/') || url.includes(':') || url.startsWith('#')) return full;
      return `url(${quote}${path.posix.join(path.posix.dirname(file),url)}${quote})`;
    });
    return `/* source: ${file} */\n${content}`;
  }).join('\n');
  fs.writeFileSync(`public/design/${name}-bundle.css`, css);
  console.log(`${name}: ${files.length} stylesheets -> one; ${Buffer.byteLength(css)} bytes before transport compression`);
}

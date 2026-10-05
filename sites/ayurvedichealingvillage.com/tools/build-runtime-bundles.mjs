// Keep script logic and names intact; remove whitespace and comments for transport.
import fs from 'node:fs';
import { createRequire } from 'node:module';
const { minify } = createRequire(import.meta.url)('next/dist/compiled/terser');
const names = ['chrome', 'search', 'consistency', 'family-header'];
const bases = ['public/design', ...fs.readdirSync('public/ahv/l10n').map(locale => `public/ahv/l10n/${locale}/design`)];
const files = bases.flatMap(base => names.map(name => `${base}/${name}.js`)).filter(file => fs.existsSync(file));
for (let start = 0; start < files.length; start += 25) {
  for (const file of files.slice(start, start + 25)) {
    const source = fs.readFileSync(file, 'utf8');
    const output = await minify(source, { compress: false, mangle: false, format: { comments: false } });
    if (!output.code) throw new Error(`Empty runtime output: ${file}`);
    fs.writeFileSync(file.replace(/\.js$/, '.min.js'), output.code);
  }
}
console.log(`Minified ${files.length} shared runtime scripts without logic transformations`);

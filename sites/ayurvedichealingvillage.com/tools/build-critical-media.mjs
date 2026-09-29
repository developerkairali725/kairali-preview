import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(process.cwd() + '/package.json');
const sharp = require(require.resolve('sharp', { paths: [require.resolve('next')] }));
for (const name of ['wx-hero', 'ktahv-abhyanga-oil-therapy-2025', 'AHV-Enquiry-Garden-Banner']) {
  const source = `public/ahv/assets/img/${name}.webp`;
  const dest = `public/ahv/assets/img/${name}-768.webp`;
  const original = fs.readFileSync(source);
  const output = await sharp(original).resize({ width: 768, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
  if (!fs.existsSync(dest) || !fs.readFileSync(dest).equals(output)) fs.writeFileSync(dest, output);
  if (!fs.readFileSync(source).equals(original)) throw Error('Original changed');
  console.log(`${name}: ${original.length} -> ${output.length} bytes; original retained`);
}

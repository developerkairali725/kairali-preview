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
// The German campaign hero is deliberately served at native dimensions.
// Preserve those dimensions and the original JPEG while using a smaller format.
{
  const source = 'public/campaign-v110/images/patient-villa-maharaja.jpg';
  const dest = 'public/campaign-v110/images/patient-villa-maharaja.webp';
  const original = fs.readFileSync(source);
  const output = await sharp(original).webp({ quality: 82 }).toBuffer();
  const before = await sharp(original).metadata(), after = await sharp(output).metadata();
  if (before.width !== after.width || before.height !== after.height) throw Error('Hero dimensions changed');
  if (!fs.existsSync(dest) || !fs.readFileSync(dest).equals(output)) fs.writeFileSync(dest, output);
  console.log(`German campaign hero: ${original.length} -> ${output.length} bytes; dimensions and original retained`);
}

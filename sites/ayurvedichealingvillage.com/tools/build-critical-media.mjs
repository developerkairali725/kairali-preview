import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(process.cwd() + '/package.json');
const sharp = require(require.resolve('sharp', { paths: [require.resolve('next')] }));
for (const { name, width, quality, suffix } of [
  { name: 'wx-hero', width: 544, quality: 74, suffix: '-544' },
  { name: 'ktahv-abhyanga-oil-therapy-2025', width: 544, quality: 82, suffix: '-544' },
  ...['ktahv-abhyanga-oil-therapy-2025', 'AHV-Enquiry-Garden-Banner', 'wx-welcome', 'kt-317', 'wx-yogahall', 'kt-106']
    .map((name) => ({ name, width: 768, quality: 82, suffix: '-768' })),
]) {
  const source = `public/ahv/assets/img/${name}.webp`;
  const dest = `public/ahv/assets/img/${name}${suffix}.webp`;
  const original = fs.readFileSync(source);
  const output = await sharp(original).resize({ width, withoutEnlargement: true }).webp({ quality }).toBuffer();
  if (!fs.existsSync(dest) || !fs.readFileSync(dest).equals(output)) fs.writeFileSync(dest, output);
  if (!fs.readFileSync(source).equals(original)) throw Error('Original changed');
  console.log(`${name}: ${original.length} -> ${output.length} bytes; original retained`);
}
// The German campaign hero is deliberately served at native dimensions.
// Preserve those dimensions and the original JPEG while using a smaller format.
{
  const source = 'public/campaign-v110/images/patient-villa-maharaja.jpg';
  const dest = 'public/campaign-v110/images/patient-villa-maharaja.avif';
  const original = fs.readFileSync(source);
  const output = await sharp(original).avif({ quality: 60 }).toBuffer();
  const before = await sharp(original).metadata(), after = await sharp(output).metadata();
  if (before.width !== after.width || before.height !== after.height) throw Error('Hero dimensions changed');
  if (!fs.existsSync(dest) || !fs.readFileSync(dest).equals(output)) fs.writeFileSync(dest, output);
  console.log(`German campaign hero: ${original.length} -> ${output.length} bytes; dimensions and original retained`);
}

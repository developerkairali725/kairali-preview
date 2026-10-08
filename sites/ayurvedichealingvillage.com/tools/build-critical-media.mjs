import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(process.cwd() + '/package.json');
const sharp = require(require.resolve('sharp', { paths: [require.resolve('next')] }));
// Two audited Weight Loss body images use the existing phone AVIF55 preset.
for (const name of ['weight-loss', 'weight-history']) {
  const source = `public/ahv/assets/img/${name}.webp`, dest = `public/ahv/assets/img/${name}-768.avif`;
  const original = fs.readFileSync(source), before = await sharp(original).metadata();
  const output = await sharp(original).resize({ width: 768, withoutEnlargement: true }).avif({ quality: 55 }).toBuffer();
  const after = await sharp(output).metadata();
  if (after.width !== Math.min(768, before.width) || Math.abs(after.width / after.height - before.width / before.height) > 0.005) throw Error('Weight Loss body image dimensions/aspect changed');
  if (!fs.existsSync(dest) || !fs.readFileSync(dest).equals(output)) fs.writeFileSync(dest, output);
  if (!fs.readFileSync(source).equals(original)) throw Error('Weight Loss body image original changed');
  console.log(`${name}: ${original.length} -> ${output.length} bytes; original retained`);
}
if (process.argv.includes('--weight-body-only')) process.exit(0);
// Two main-programme phone heroes use the established 768px / AVIF55 preset.
// This targeted mode never rewrites unrelated derivatives or original images.
for (const name of ['weightloss', 'digestive']) {
  const source = `public/ahv/assets/img/${name}.webp`, dest = `public/ahv/assets/img/${name}-768-hero.avif`;
  const original = fs.readFileSync(source), before = await sharp(original).metadata();
  const output = await sharp(original).resize({ width: 768, withoutEnlargement: true }).avif({ quality: 55 }).toBuffer();
  const after = await sharp(output).metadata();
  if (after.width !== Math.min(768, before.width) || Math.abs(after.width / after.height - before.width / before.height) > 0.005) throw Error('Programme hero dimensions/aspect changed');
  if (!fs.existsSync(dest) || !fs.readFileSync(dest).equals(output)) fs.writeFileSync(dest, output);
  if (!fs.readFileSync(source).equals(original)) throw Error('Programme hero original changed');
  console.log(`${name}: ${original.length} -> ${output.length} bytes; original retained`);
}
if (process.argv.includes('--programme-heroes-only')) process.exit(0);
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

// The villa gallery uses thumbnails while its expanded viewer keeps full originals.
const villaPhotos = [...new Set(fs.readFileSync('public/ahv/assets/our-villas-data.js','utf8').match(/\/ahv\/assets\/img\/AHV-OurVillas-(?:Hero|(?:Maharaja|Royal|Deluxe|Classic)-[0-9]+)\.webp/g))];
const variants = villaPhotos.flatMap(src => [384,768].map(width => ({src,width})));
for(let start=0;start<variants.length;start+=25){
 for(const {src,width} of variants.slice(start,start+25)){
  const source='public'+src, dest=source.replace(/\.webp$/, '-'+width+'.webp');
  const original=fs.readFileSync(source), output=await sharp(original).resize({width,withoutEnlargement:true}).webp({quality:74}).toBuffer();
  if(!fs.existsSync(dest)||!fs.readFileSync(dest).equals(output))fs.writeFileSync(dest,output);

  if(!fs.readFileSync(source).equals(original))throw Error('Villa original changed');
  console.log(src+': '+original.length+' -> '+output.length+' bytes at '+width+'px; original retained');
 }
}

// Photo Gallery display derivatives preserve approved originals and their dimensions/aspect ratio.
// Build in bounded batches so a clean checkout can reproduce these from the restored source package.
{
 const text=fs.readFileSync('public/ahv/assets/photo-collections-data.js','utf8');
 const data=JSON.parse(text.slice(text.indexOf('{'),text.lastIndexOf('}')+1));
 const route=data.routes.find(r=>r.path==='/photo-gallery/');
 const photos=[...new Set(route.chapters.flatMap(ch=>ch.images||[]).map(p=>p.src))];
 for(let start=0;start<photos.length;start+=25){
  for(const src of photos.slice(start,start+25)){
   if(!src.startsWith('/ahv/assets/img/')||src.includes('..')||!src.endsWith('.webp'))throw Error('Unexpected gallery source');
   const source='public'+src, dest=source.replace(/\.webp$/, '-768-display.webp');
   const original=fs.readFileSync(source);
   let output=await sharp(original).resize({width:768,withoutEnlargement:true}).webp({quality:74}).toBuffer();
   const previous=source.replace(/\.webp$/, '-768.webp');
   if(fs.existsSync(previous)&&fs.statSync(previous).size<output.length)output=fs.readFileSync(previous);
   if(!fs.existsSync(dest)||!fs.readFileSync(dest).equals(output))fs.writeFileSync(dest,output);
   if(!fs.readFileSync(source).equals(original))throw Error('Gallery original changed');
   console.log(src+': '+output.length+' bytes display derivative; original retained');
  }
 }
}

// Responsive derivative for the approved package hero; retain the exact original.
{
 const source='public/ahv/assets/img/owner-approved-20260928/ahv-img-002.webp';
 const dest=source.replace(/\.webp$/, '-768.webp');
 const original=fs.readFileSync(source), output=await sharp(original).resize({width:768,withoutEnlargement:true}).webp({quality:82}).toBuffer();
 if(!fs.existsSync(dest)||!fs.readFileSync(dest).equals(output))fs.writeFileSync(dest,output);
 if(!fs.readFileSync(source).equals(original))throw Error('Package original changed');
 console.log('Package hero: '+original.length+' -> '+output.length+' bytes; original retained');
}

// The phone homepage poster retains its dimensions with a smaller AVIF derivative.
{
 const source='public/ahv/assets/img/wx-hero.webp',dest='public/ahv/assets/img/wx-hero-544.avif';
 const original=fs.readFileSync(source),output=await sharp(original).resize({width:544,withoutEnlargement:true}).avif({quality:55}).toBuffer();
 if(!fs.existsSync(dest)||!fs.readFileSync(dest).equals(output))fs.writeFileSync(dest,output);
 if(!fs.readFileSync(source).equals(original))throw Error('Home original changed');
 console.log('Home poster AVIF: '+output.length+' bytes; WebP/original retained');
}

{
 const source='public/ahv/assets/img/AHV-Gallery-Landscape.webp',dest='public/ahv/assets/img/AHV-Gallery-Landscape-768-film.webp';
 const original=fs.readFileSync(source),output=await sharp(original).resize({width:768,withoutEnlargement:true}).webp({quality:74}).toBuffer();
 if(!fs.existsSync(dest)||!fs.readFileSync(dest).equals(output))fs.writeFileSync(dest,output);
 if(!fs.readFileSync(source).equals(original))throw Error('Video poster original changed');
 console.log('Video poster: '+original.length+' -> '+output.length+' bytes; original retained');
}

// First-screen villa hero derivative only; gallery thumbnails retain established WebP.
{
 const source='public/ahv/assets/img/AHV-OurVillas-Hero.webp',dest=source.replace(/\.webp$/, '-768-hero.avif');
 const original=fs.readFileSync(source),output=await sharp(original).resize({width:768,withoutEnlargement:true}).avif({quality:55}).toBuffer();
 if(!fs.existsSync(dest)||!fs.readFileSync(dest).equals(output))fs.writeFileSync(dest,output);
 if(!fs.readFileSync(source).equals(original))throw Error('Villa hero original changed');
 console.log('Villa hero AVIF: '+output.length+' bytes; original retained');
}

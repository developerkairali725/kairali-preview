// Rebuild the approved same-image derivative; preserve and validate an existing output.
import {createRequire} from 'node:module';import fs from 'node:fs';import crypto from 'node:crypto';
const require=createRequire(process.cwd()+'/package.json');const sharp=require(require.resolve('sharp',{paths:[require.resolve('next')]}));
const src='public/ahv/assets/img/ayurveda-training.webp',dest='public/ahv/assets/img/ayurveda-training-768.webp';
const before=fs.readFileSync(src),meta=await sharp(before).metadata();if(meta.width!==1920||meta.height!==1000||meta.format!=='webp')throw Error('Original changed; review dimensions first');
const expected=await sharp(before).resize({width:768,withoutEnlargement:true}).webp({quality:82}).toBuffer();
if(fs.existsSync(dest)){if(!fs.readFileSync(dest).equals(expected))throw Error('Existing derivative differs; review before replacing');}
else fs.writeFileSync(dest,expected);
const output=await sharp(dest).metadata();if(output.width!==768||output.height!==400)throw Error('Unexpected output dimensions');if(!fs.readFileSync(src).equals(before))throw Error('Original changed');
console.log(JSON.stringify({src,dest,width:output.width,height:output.height,originalBytes:before.length,variantBytes:fs.statSync(dest).size,originalSha256:crypto.createHash('sha256').update(before).digest('hex'),variantSha256:crypto.createHash('sha256').update(fs.readFileSync(dest)).digest('hex')},null,2));

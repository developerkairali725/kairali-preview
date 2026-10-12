import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {firstCriticalImage} from '../app/(english)/_families/critical-media.mjs';
import {imageLedFirstScreen} from '../app/(english)/_families/snapshot-styles.mjs';
const heroes={
  "/treatment-for-arthritis-and-spondylitis/": "/ahv/assets/img/ktahv-janu-vasti-2.webp",
  "/treatment-for-cervical-spondylosis/": "/ahv/assets/img/cervical-hero-greeva-pichu.webp",
  "/treatment-for-chronic-back-pain/": "/ahv/assets/img/chronic-back-hero-kati-vasti.webp",
  "/treatment-for-diabetes/": "/ahv/assets/img/ktahv-abhyanga-5.webp",
  "/treatment-for-facial-paralysis/": "/ahv/assets/img/facial-paralysis-hero-mukha-abhyanga.webp",
  "/treatment-for-nervous-disability/": "/ahv/assets/img/neurological-hero-shiro-abhyanga.webp",
  "/treatment-for-psoriasis/": "/ahv/assets/img/psoriasis-hero-back-udwarthanam.webp",
  "/treatment-for-sinusitis-and-migraine/": "/ahv/assets/img/sinus-migraine-hero-shirodhara-6.webp",
  "/treatment-for-slip-disc/": "/ahv/assets/img/ktahv-kati-vasti-2025-2.webp",
  "/treatment-for-spondylitis/": "/ahv/assets/img/spondylitis-hero-kati-greeva-vasti-1.webp",
  "/treatment-to-remove-stress-and-strain/": "/ahv/assets/img/stress-hero-thalapothichil-3.webp"
};
test('traced clinical background heroes retain exact-route image priority',()=>{for(const [route,hero] of Object.entries(heroes)){assert(fs.existsSync('public'+hero));assert.equal(imageLedFirstScreen(route),true);assert.equal(imageLedFirstScreen(route.slice(0,-1)),false);assert.equal(firstCriticalImage('<div style="background-image:url('+hero+')"></div>',route),hero);assert.equal(firstCriticalImage('<div></div>',route),null);assert.equal(firstCriticalImage(hero,'/online-consultation/'),null);}});

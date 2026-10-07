import test from 'node:test';
import assert from 'node:assert/strict';
import { initializeHomeHero } from '../app/(english)/_families/home-hero.mjs';
function fixture({ reduced = false, rejected = false, ready = 1, saveData = false } = {}) {
  function node(text = '') { return { textContent:text, attrs:{}, listeners:{}, dataset:{}, style:{setProperty(k,v){this[k]=v;}},setAttribute(k,v){this.attrs[k]=v;},getAttribute(k){return this.attrs[k]??null;},addEventListener(k,f){(this.listeners[k]??=[]).push(f);},emit(k,e={}){for(const f of this.listeners[k]??[])f(e);} }; }
  const buttons = [1,2,3,4].map(n=>node(`0${n} · Chapter`));
  const toggle=node('Pause background video');
  const video=Object.assign(node(),{paused:true,ended:false,error:null,currentTime:0,readyState:ready,plays:0,play(){this.plays++;if(rejected)return Promise.reject(new Error('NotAllowedError'));this.paused=false;this.emit('play');return Promise.resolve();},pause(){this.paused=true;this.emit('pause');}});
  video.closest=()=>({querySelector:()=>toggle,querySelectorAll:()=>[...buttons,toggle]});
  const host={querySelector:()=>video},document=Object.assign(node(),{hidden:false,readyState:"complete"}),motion=Object.assign(node(),{matches:reduced});
  const win={document,navigator:{connection:{saveData}},matchMedia:()=>motion,requestIdleCallback(fn){fn();}};
  initializeHomeHero(host,win);
  return {buttons,toggle,video,document,motion,host,win,active:()=>buttons.findIndex(b=>b.attrs['aria-current']==='true')};
}
test('muted inline autoplay starts independently of desktop template IDs',()=>{const x=fixture();assert.equal(x.video.plays,1);assert.equal(x.video.muted,true);assert.equal(x.video.playsInline,true);assert.equal(x.toggle.attrs['aria-label'],'Pause background video');});
test('all chapter clicks, including returning to zero, seek and move indicator',()=>{const x=fixture();for(const [i,t]of [0,8.067,15.767,22.834].entries()){x.buttons[i].emit('click');assert.equal(x.video.currentTime,t);assert.equal(x.active(),i);}x.buttons[0].emit('click');assert.equal(x.video.currentTime,0);assert.equal(x.active(),0);});
test('time updates and loop rollover move the chapter underline',()=>{const x=fixture();for(const [t,i]of [[9,1],[16,2],[24,3],[0.1,0]]){x.video.currentTime=t;x.video.emit('timeupdate');assert.equal(x.active(),i);}});
test('latest click wins while metadata loads',()=>{const x=fixture({ready:0});x.buttons[3].emit('click');x.buttons[1].emit('click');x.video.emit('timeupdate');assert.equal(x.active(),1);x.video.readyState=1;x.video.emit('loadedmetadata');assert.equal(x.video.currentTime,8.067);});
test('reduced motion keeps still image but allows manual playback',()=>{const x=fixture({reduced:true});assert.equal(x.video.plays,0);assert.equal(x.video.getAttribute('src'),null);assert.equal(x.toggle.attrs['aria-label'],'Play background video');x.buttons[2].emit('click');assert.equal(x.video.plays,1);assert.equal(x.active(),2);});
test('rejected autoplay leaves truthful Play label',async()=>{const x=fixture({rejected:true});await Promise.resolve();assert.equal(x.video.paused,true);assert.equal(x.toggle.attrs['aria-label'],'Play background video');});
test('pause/resume preserves time and user pause survives tab visibility',()=>{const x=fixture();x.video.currentTime=17;x.toggle.emit('click');assert.equal(x.video.paused,true);x.document.hidden=true;x.document.emit('visibilitychange');x.document.hidden=false;x.document.emit('visibilitychange');assert.equal(x.video.paused,true);x.toggle.emit('click');assert.equal(x.video.currentTime,17);assert.equal(x.video.paused,false);});
test('initialization is idempotent and live reduced-motion change pauses',()=>{const x=fixture();initializeHomeHero(x.host,x.win);assert.equal(x.video.plays,1);x.motion.emit('change',{matches:true});assert.equal(x.video.paused,true);});

// Translated homepages use the original view runtime, not the English static boot.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { deferHeroFilm } from '../app/(english)/_families/media-loading.mjs';
for (const name of ['home-hi-fi-v4','home-mobile']) {
  test(`${name}: locale runtime starts muted on mobile and respects reduced motion`,async()=>{
    const payload=JSON.parse(readFileSync(new URL(`../public/ahv/views/${name}.json`,import.meta.url)));
    for(const reduced of [false,true]) {
      class DCLogic{setState(value){this.state={...this.state,...value};}}
      const C=vm.runInNewContext(`${deferHeroFilm(payload.logic)}\nComponent`,{DCLogic,window:{matchMedia:()=>({matches:reduced}),requestIdleCallback:fn=>fn()},requestIdleCallback:fn=>fn(),document:{readyState:"complete"},navigator:{}});
      const c=new C();let plays=0;
      const video={getAttribute:()=>null,setAttribute(){},play(){plays++;return Promise.resolve();}};
      c._setHero(video);assert.equal(plays,reduced?0:1);assert.equal(video.muted,true);assert.ok(payload.template.includes('playsInline="{{ true }}"'));
    }
  });
}

test('Save-Data stays click-to-play without disabling chapter controls',()=>{const x=fixture({saveData:true});assert.equal(x.video.plays,0);x.buttons[1].emit('click');assert.equal(x.video.plays,1);assert.equal(x.active(),1);});

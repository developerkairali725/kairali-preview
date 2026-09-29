import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const photo = {src:'/photo.jpg',width:1978,height:1200};
for (const variant of ['desktop','mobile']) {
  for (const stem of ['ahv-template-photo-collections','ahv-page-about-us']) {
    test(`${stem} ${variant}: actual-size image can pan without changing image`, () => {
      const d=JSON.parse(fs.readFileSync(new URL(`../public/ahv/views/${stem}-${variant}.json`,import.meta.url)));
      const gallery=stem.includes('collections');
      class DCLogic { props={}; setState(s){this.state={...this.state,...(typeof s==='function'?s(this.state):s)};} }
      const ctx={DCLogic,React:{createElement:(type,props)=>({type,props})},window:{AHV_PHOTO_COLLECTIONS:{routes:[{path:'/property-gallery/',h1:'Gallery',crumbs:[{label:'Gallery'}],intro:{text:''},hero:photo,chapters:[]}]}},document:{}};
      const C=vm.runInNewContext(d.logic+'\nComponent',ctx);const c=new C();
      c.state={...c.state,i:0,zoom:true};
      const stage={scrollLeft:0,scrollTop:0,setPointerCapture(){}};
      c.panStart({pointerType:'mouse',button:0,clientX:300,clientY:300,currentTarget:stage,pointerId:1,preventDefault(){}});
      c.panMove({clientX:100,clientY:150,currentTarget:stage});
      assert.equal(stage.scrollLeft,200);assert.equal(stage.scrollTop,150);c.panEnd();assert.equal(c._pan,null);
      assert.match(d.template,/overflow:auto/);assert.match(d.template,/touch-action:pan-x pan-y pinch-zoom/);
      if(gallery){
        const v=c.renderVals();assert.equal(v.expandedEl.props.style.width,'1978px');assert.equal(v.expandedEl.props.style.flexShrink,0);assert.equal(v.expandedEl.props.style.maxWidth,'none');
        v.swipeStart({pointerType:'touch',clientX:300,clientY:0});v.swipeEnd({clientX:0,clientY:0});assert.equal(c.state.i,0);
        let prevented=false;v.dlgKey({key:'ArrowRight',preventDefault(){prevented=true;}});assert.equal(prevented,false);
        v.toggleZoom();assert.equal(c.state.zoom,false);assert.equal(c.renderVals().expandedEl.props.style.maxWidth,'min(1280px,100%)');
      }else{
        assert.match(d.logic,/width: cur.width \+ 'px', flexShrink: 0, margin: '0 auto'/);
        assert.match(d.template,/justify-content:flex-start;align-items:flex-start;overflow:auto/);
        assert.match(d.logic,/releaseLock\(\)/);assert.match(d.logic,/focus\(\{ preventScroll: true \}\)/);
      }
    });
  }
}

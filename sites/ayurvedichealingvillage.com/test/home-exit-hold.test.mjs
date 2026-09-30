import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const defaultViews = join(dirname(fileURLToPath(import.meta.url)), '../public/ahv/views');
const views = process.env.AHV_TEST_VIEWS_DIR || defaultViews;

for (const filename of ['home-hi-fi-v4.json', 'home-mobile.json']) {
  test(`${filename}: held exit offer never opens automatically`, () => {
    const payload = JSON.parse(readFileSync(join(views, filename), 'utf8'));
    const documentEvents = [];
    const timers = [];
    const windowStub = {
      innerWidth: 390,
      scrollY: 0,
      addEventListener() {},
      removeEventListener() {},
      matchMedia() { return { matches: true }; },
    };
    const documentStub = {
      addEventListener(name) { documentEvents.push(name); },
      removeEventListener() {},
      querySelectorAll() { return []; },
    };
    class DCLogic {
      setState(update) {
        const value = typeof update === 'function' ? update(this.state) : update;
        this.state = { ...this.state, ...value };
      }
    }
    const Component = vm.runInNewContext(`${payload.logic}\nComponent`, {
      DCLogic,
      window: windowStub,
      document: documentStub,
      localStorage: { getItem() { return null; }, setItem() {} },
      setTimeout(fn, ms) { timers.push(ms); return 1; },
      clearTimeout() {},
      setInterval() { return 1; },
      clearInterval() {},
      IntersectionObserver: class { observe() {} unobserve() {} },
    });
    const component = new Component();
    component.props = {};
    component.componentDidMount();
    assert.equal(documentEvents.includes('mouseout'), false, 'no exit-intent mouse trigger');
    assert.equal(timers.includes(45000), false, 'no mobile delayed trigger');
    assert.equal(component.renderVals().showExit, false, 'normal visitor cannot see held offer');

    component.props.previewExitPopup = true;
    assert.equal(component.renderVals().showExit, true, 'explicit design preview can inspect offer');
    component.renderVals().closeExit();
    assert.equal(component.renderVals().showExit, false, 'preview close works');

    const popup = payload.template.slice(payload.template.indexOf('<sc-if value="{{ showExit }}"'));
    assert.equal(component.renderVals().pop.cta, 'Claim Your Offer Now!');
    assert.doesNotMatch(popup, /<input\b/i, 'mock labels have no collection fields; do not activate without approved form');
  });
}

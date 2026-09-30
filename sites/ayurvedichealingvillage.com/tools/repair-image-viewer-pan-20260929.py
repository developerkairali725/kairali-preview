"""Repair both exported viewer variants; run after an upstream view re-export."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MARKER = '// AHV viewer pan repair 20260929'
METHODS = '''  // AHV viewer pan repair 20260929
  panStart(e) {
    if (!this.state.zoom || e.pointerType !== 'mouse' || e.button !== 0) return;
    e.preventDefault();
    const el = e.currentTarget;
    this._pan = { x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop };
    el.setPointerCapture(e.pointerId);
  }
  panMove(e) {
    if (!this._pan) return;
    e.currentTarget.scrollLeft = this._pan.left + this._pan.x - e.clientX;
    e.currentTarget.scrollTop = this._pan.top + this._pan.y - e.clientY;
  }
  panEnd() { this._pan = null; }
'''
for stem in ['ahv-template-photo-collections', 'ahv-page-about-us']:
    for variant in ['desktop', 'mobile']:
        path = ROOT / f'public/ahv/views/{stem}-{variant}.json'
        d = json.loads(path.read_text())
        if MARKER in d['logic']:
            continue
        t, s = d['template'], d['logic']
        s = s.replace('  renderVals() {', METHODS + '  renderVals() {')
        handlers = ' onPointerDown="{{ panStart }}" onPointerMove="{{ panMove }}" onPointerUp="{{ panEnd }}" onPointerCancel="{{ panEnd }}"'
        panvals = 'panStart: (e) => this.panStart(e), panMove: (e) => this.panMove(e), panEnd: () => this.panEnd(), '
        if stem == 'ahv-page-about-us':
            t = t.replace('id="doc-stage"', 'id="doc-stage" tabindex="0" aria-label="Document image. Scroll or drag to pan at actual size"' + handlers)
            t = t.replace('display:flex;justify-content:center;align-items:flex-start;overflow:auto;', 'display:flex;justify-content:flex-start;align-items:flex-start;overflow:auto;touch-action:pan-x pan-y pinch-zoom;overscroll-behavior:contain;')
            s = s.replace("width: cur.width + 'px', maxWidth:", "width: cur.width + 'px', flexShrink: 0, margin: '0 auto', maxWidth:")
            s = s.replace("display: 'block', width: 'auto', height: 'auto', maxWidth: '100%'", "display: 'block', margin: '0 auto', flexShrink: 0, width: 'auto', height: 'auto', maxWidth: '100%'")
            s = s.replace('      close: () => this.closeViewer(),', '      ' + panvals + 'close: () => this.closeViewer(),')
            s = s.replace("        if (e.key === 'ArrowLeft')", "        if (this.state.zoom && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) return;\n        if (e.key === 'ArrowLeft')")
        else:
            s = s.replace('state = { i: null, playing: {} };', 'state = { i: null, playing: {}, zoom: false };')
            s = s.replace('this.setState({ i });', 'this.setState({ i, zoom: false });')
            s = s.replace('this.setState({ i: null });', 'this.setState({ i: null, zoom: false });')
            s = s.replace('i: (s.i + d + n) % n }', 'i: (s.i + d + n) % n, zoom: false }')
            t = t.replace('[data-gallery-stage]{touch-action:pan-y pinch-zoom;', '[data-gallery-stage]{touch-action:pan-x pan-y pinch-zoom;overscroll-behavior:contain;')
            t = t.replace('data-gallery-stage="1" onPointerDown="{{ swipeStart }}" onPointerUp="{{ swipeEnd }}" style="flex:1;width:100%;min-height:0;display:flex;align-items:center;justify-content:center"', 'data-gallery-stage="1" tabindex="0" aria-label="Photo. Scroll or drag to pan at actual size" onPointerDown="{{ swipeStart }}" onPointerMove="{{ panMove }}" onPointerUp="{{ swipeEnd }}" onPointerCancel="{{ panEnd }}" style="flex:1;width:100%;min-height:0;overflow:auto;display:flex;align-items:flex-start;justify-content:flex-start"')
            button = '<button type="button" id="gallery-zoom" aria-pressed="{{ zoomPressed }}" onClick="{{ toggleZoom }}" style="flex:none;min-height:44px;padding:8px 18px;border:1px solid rgba(247,244,234,.5);border-radius:4px;background:transparent;color:#F7F4EA;font-weight:700">{{ zoomLabel }}</button>\n'
            t = t.replace('  <div data-gallery-stage=', '  ' + button + '  <div data-gallery-stage=')
            s = s.replace("style: { display: 'block', width: 'auto', height: 'auto', maxWidth: 'min(1280px,100%)'", "style: this.state.zoom ? { display: 'block', flexShrink: 0, margin: '0 auto', width: cur.width + 'px', height: 'auto', maxWidth: 'none', background: '#000' } : { display: 'block', flexShrink: 0, margin: 'auto', width: 'auto', height: 'auto', maxWidth: 'min(1280px,100%)'")
            s = s.replace('      close: () => this.close(),', "      zoomLabel: this.state.zoom ? 'Fit to screen' : 'Actual size', zoomPressed: this.state.zoom ? 'true' : 'false', toggleZoom: () => this.setState(s => ({ zoom: !s.zoom })),\n      " + panvals + 'close: () => this.close(),')
            s = s.replace('swipeStart: (e) => { this._sx', 'swipeStart: (e) => { if (this.state.zoom) { this.panStart(e); return; } this._sx')
            s = s.replace('swipeEnd: (e) => {\n', 'swipeEnd: (e) => {\n        if (this.state.zoom) { this.panEnd(); this._sx = null; return; }\n')
            s = s.replace("        if (e.key === 'ArrowLeft')", "        if (this.state.zoom && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) return;\n        if (e.key === 'ArrowLeft')")
        d['template'], d['logic'] = t, s
        path.write_text(json.dumps(d, ensure_ascii=False, separators=(',', ':')) + '\n')
        print(path.name)

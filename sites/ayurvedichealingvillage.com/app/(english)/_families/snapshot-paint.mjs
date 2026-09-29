/**
 * The phone snapshot's first paint (lane PERF2, 29 Sep 2026).
 *
 * boot.ts injects these as `(${fn.toString()})(...)` expressions, like media-loading.mjs: every function is
 * SELF-CONTAINED and contains no backslash (the BOOT_SCRIPT template literal would eat it).
 */

/**
 * Calls `done` once the phone snapshot has painted, so the runtime chain (the family data scripts,
 * support.js and the runtime it loads) is requested after the first paint rather than in competition
 * with it. The snapshot IS the phone's first paint; the runtime only replaces it with the same page, so
 * nothing the reader sees waits for this — what moves is script work that did not show anything.
 * Measured (local Lighthouse, /festivals/ phone): 440 KB of family data scripts were requested ~20 ms
 * before the first paint.
 *
 * Immediate (no wait) when `active` is false (no snapshot, or a desktop viewport, which paints nothing
 * until the live view), when the page is hidden (a background tab reports no paint), or when the paint
 * timing API is missing. Otherwise it waits for the first-contentful-paint entry, then one task, and
 * never longer than `maxWait` ms in total.
 */
export function whenSnapshotPainted(win, active, done, maxWait) {
  var called = false;
  function go() { if (!called) { called = true; done(); } }
  var doc = win.document;
  if (!active || !win.PerformanceObserver || (doc && doc.visibilityState === "hidden")) { go(); return; }
  var po = null;
  try {
    po = new win.PerformanceObserver(function (list) {
      var entries = list.getEntries();
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].name === "first-contentful-paint") { if (po) po.disconnect(); win.setTimeout(go, 0); return; }
      }
    });
    po.observe({ type: "paint", buffered: true });
  } catch (e) { go(); return; }
  win.setTimeout(function () { if (po) po.disconnect(); go(); }, Number(maxWait) || 3000);
  if (doc && doc.addEventListener) doc.addEventListener("visibilitychange", function () { if (doc.visibilityState === "hidden") go(); });
}

/**
 * Far-below-the-fold snapshot content skips rendering until the reader scrolls near it.
 *
 * Measured (local Lighthouse, /our-villas/ phone): 13 loading="lazy" villa photos (~1.6 MB) two to four
 * screens down were requested in the snapshot's first layout, before its first paint — the lab browser's
 * lazy-load distance is ~3000 px when the connection type is unknown — and competed with the fonts, the
 * styles and the runtime for the first second. `content-visibility: auto` defers the layout, paint and
 * lazy images of an element until it nears the viewport. It is applied to the "frontier": the outermost
 * boxes that start more than `screens` screen-heights down (a box that straddles that line is descended
 * into, so one tall section holding a whole gallery is split at its children). Each keeps its measured
 * height (contain-intrinsic-block-size), so nothing moves and the scroll length is unchanged; content
 * stays in the DOM, the accessibility tree and find-in-page.
 *
 * Phone width only (the desktop never paints the snapshot), scripted documents only (this runs from
 * boot, so a no-JS reader's page is untouched), and only on the snapshot: it leaves with the snapshot
 * when the live view takes over. Returns the number of boxes marked.
 */
export function deferFarSnapshotContent(win, nodes, breakpoint, screens) {
  if (!nodes || !nodes.length) return 0;
  if (!win.CSS || !win.CSS.supports || !win.CSS.supports("content-visibility", "auto")) return 0;
  if (!win.matchMedia || !win.matchMedia("(max-width: " + (Number(breakpoint) - 1) + "px)").matches) return 0;
  var fold = win.innerHeight || 0;
  if (!fold) return 0;
  var line = fold * (Number(screens) || 1.5);
  var BLOCKISH = { block: 1, flex: 1, grid: 1, "list-item": 1, "flow-root": 1, table: 1 };
  var marks = [];
  var budget = 4000; // elements visited: a pathological tree costs a bounded amount of boot time
  function walk(el) {
    for (var c = el.firstElementChild; c && budget > 0; c = c.nextElementSibling) {
      budget--;
      var r = c.getBoundingClientRect();
      if (r.height <= 0 && r.width <= 0) continue;
      if (r.top >= line) {
        var cs = win.getComputedStyle(c);
        if (BLOCKISH[cs.display] && cs.position !== "fixed" && cs.position !== "sticky") marks.push([c, Math.ceil(r.height)]);
      } else if (r.bottom > line) {
        walk(c);
      }
    }
  }
  for (var i = 0; i < nodes.length; i++) walk(nodes[i]);
  // All measured above (one layout); written here.
  for (var m = 0; m < marks.length; m++) {
    var s = marks[m][0];
    s.style.setProperty("content-visibility", "auto");
    // block axis only: the width stays whatever the layout gives it
    s.style.setProperty("contain-intrinsic-block-size", "auto " + marks[m][1] + "px");
    s.setAttribute("data-ahv-deferred", "");
  }
  return marks.length;
}

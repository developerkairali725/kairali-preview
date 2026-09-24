/* AHV site search — ONE engine, ONE index, three surfaces (D-20260922-32, Option A;
 * docs/research/2026-09-23-ahv-search-brainstorm.md §3.1 / §6). This file carries:
 *
 *   1. window.AHVSearch — the engine. Loads /ahv/search-index.json lazily (once), and
 *      scores a typed query against programmes / questions / pages with the governed
 *      classes the 1 Sep matcher defined (URGENT_MEDICAL_HELP, CONSULT_FIRST,
 *      NOT_TREATED, MULTIPLE_POSSIBLE_MATCHES). Matching: approved misspellings first,
 *      exact / prefix (≥3) / Damerau-Levenshtein (≤1 for 5–7 chars, ≤2 for ≥8),
 *      trigram fallback, field boosts vocabulary 10 > name/H1/question 9 > keywords
 *      (pages 7, FAQ 5) > alias 6 > whoFor 4 > topic 3 > description 2 > body 1.
 *      Numbers are facets ("14 days", "2 weeks" → minimumNights), never fuzzy text.
 *      The programme finder and the FAQ filter call createEngine() with a scope; the
 *      overlay below uses scope "site". Runs in node too (tests/search-acceptance.mjs).
 *
 *   2. The overlay. The shared header renders an inert dialog ("Search unavailable",
 *      AHV Chrome Header.dc.html:78–91 — the package component is never edited). Like
 *      chrome.js does for the footer, this script takes the control over at runtime: it
 *      intercepts the header's search button (aria-controls="ahv-search-dialog"), the
 *      drawer's "⌕ Search" row and the homepage trigger, and opens its own dialog under
 *      the same id — results INSIDE the dialog, grouped Programmes / Questions / Pages,
 *      one-line answer per programme, six big empty-state buttons, a permanent fallback
 *      row (WhatsApp +91 92898 38797 · free online consultation · +91 9555 156 156),
 *      keyboard + Esc, reduced motion, no spinner, lazy index. 45+ rules: 18px/56px
 *      input, ≥64px rows, nothing disappears on blur.
 *
 * Locked facts only (CLAUDE.md): WhatsApp +91 92898 38797, hospital line +91 9555 156 156,
 * /online-consultation/. Prices and durations come from the index (the dated tariff
 * snapshot) — never typed here; an expired price prints "Request a quote". */
(function (root) {
  "use strict";
  var INDEX_URL = "/ahv/search-index.json";
  var WA_HREF = "https://wa.me/919289838797";
  var TEL_HREF = "tel:+919555156156";
  var CONSULT_HREF = "/online-consultation/";

  /* ------------------------------------------------------------------ text */
  function norm(s) {
    return String(s == null ? "" : s).toLowerCase()
      .replace(/ß/g, "ss").normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[’'`´]/g, "").replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
  }
  function fold(s) { return norm(s).replace(/ue/g, "u").replace(/oe/g, "o").replace(/ae/g, "a"); }
  function pad(s) { return " " + s + " "; }
  function hasPhrase(q, phrase) { return pad(q).indexOf(pad(phrase)) >= 0; }
  function dl(a, b, max) {
    var la = a.length, lb = b.length;
    if (Math.abs(la - lb) > max) return max + 1;
    var d = [], i, j, cost;
    for (i = 0; i <= la; i++) { d[i] = [i]; }
    for (j = 0; j <= lb; j++) { d[0][j] = j; }
    for (i = 1; i <= la; i++) {
      for (j = 1; j <= lb; j++) {
        cost = a[i - 1] === b[j - 1] ? 0 : 1;
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
    return d[la][lb];
  }
  function trigrams(w) { var s = "  " + w + " ", out = {}, i; for (i = 0; i < s.length - 2; i++) out[s.substr(i, 3)] = 1; return out; }
  function jaccard(a, b) { var inter = 0, uni = 0, k; for (k in a) { uni++; if (b[k]) inter++; } for (k in b) if (!a[k]) uni++; return uni ? inter / uni : 0; }
  var NUMWORDS = { one: 1, a: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, fourteen: 14, fifteen: 15, twenty: 20, twentyone: 21, twenty1: 21, thirty: 30 };
  function fmtNum(n, cur) {
    var s = String(n);
    if (cur === "INR") { var last3 = s.slice(-3), rest = s.slice(0, -3); return "₹" + (rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," : "") + last3; }
    return (cur === "USD" ? "$" : "€") + s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  function fmt(tpl, vars) { return String(tpl).replace(/\{(\w+)\}/g, function (m, k) { return vars[k] == null ? m : vars[k]; }); }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  /* ------------------------------------------------------------ engine */
  function createEngine(index, opts) {
    opts = opts || {};
    var V = index.vocabulary;
    var CLS = index.classes;
    var FILLER = toSet(V.filler), WEAK = toSet(V.weak);
    var MISSPELL = V.misspell || {};
    var vocabWords = {}; // every single word that appears in a vocabulary phrase/word — the "join" and correction targets
    function toSet(a) { var s = {}; (a || []).forEach(function (w) { s[fold(w)] = 1; }); return s; }

    function field(boost, phrases, weakOk) {
      var words = {}, ph = [], pw = {};
      (phrases || []).forEach(function (p) {
        var f = fold(p); if (!f) return;
        if (f.indexOf(" ") < 0) { words[f] = 1; return; }
        ph.push(f);
        f.split(" ").forEach(function (w) { if (w.length > 1 && !FILLER[w]) pw[w] = 1; });
      });
      return { boost: boost, words: words, phrases: ph, phraseWords: pw, weakOk: !!weakOk, wordList: Object.keys(words), pwList: Object.keys(pw) };
    }
    function labelTokens(s) { return fold(s).split(" ").filter(function (w) { return w && !FILLER[w]; }); }

    var docs = [];
    (index.programmes || []).forEach(function (p) {
      var f = [field(10, p.terms), field(9, [p.name]), field(6, (p.aliases || []).concat(p.sanskrit ? [p.sanskrit] : [])), field(4, p.whoFor)];
      f[0].wordList.forEach(function (w) { vocabWords[w] = 1; }); f[0].pwList.forEach(function (w) { vocabWords[w] = 1; });
      f[1].wordList.forEach(function (w) { vocabWords[w] = 1; }); f[1].pwList.forEach(function (w) { vocabWords[w] = 1; });
      f[2].wordList.forEach(function (w) { vocabWords[w] = 1; });
      docs.push({ kind: "programme", key: p.route, label: p.name, labelT: labelTokens(p.name), fields: f, data: p });
    });
    (index.faqs || []).forEach(function (q) {
      var f = [field(9, [q.q], true), field(5, q.kw, true), field(3, [q.topic], true), field(1, [q.a], true)];
      f[0].wordList.forEach(function (w) { vocabWords[w] = 1; }); f[0].pwList.forEach(function (w) { vocabWords[w] = 1; });
      f[1].wordList.forEach(function (w) { vocabWords[w] = 1; }); f[1].pwList.forEach(function (w) { vocabWords[w] = 1; });
      docs.push({ kind: "question", key: q.id, label: q.q, labelT: labelTokens(q.q), fields: f, data: q });
    });
    (index.pages || []).forEach(function (p) {
      var f = [field(9, [p.label], true), field(7, p.kw, true), field(2, [p.desc], true)];
      f[0].wordList.forEach(function (w) { vocabWords[w] = 1; }); f[0].pwList.forEach(function (w) { vocabWords[w] = 1; });
      f[1].wordList.forEach(function (w) { vocabWords[w] = 1; }); f[1].pwList.forEach(function (w) { vocabWords[w] = 1; });
      docs.push({ kind: "page", key: p.route, label: p.label, labelT: labelTokens(p.label), fields: f, data: p });
    });
    var byKey = {}; docs.forEach(function (d) { byKey[d.key] = d; });
    var intents = (index.intents || []).map(function (i) { return { words: i.words.map(fold), target: i.target, sort: i.sort || null }; });
    var generic = (V.generic || []).map(function (g) { return { term: fold(g.term), routes: g.routes, len: fold(g.term).split(" ").length }; });

    /* ---- tokenising: filler out, misspellings mapped, number words + durations lifted out as a facet, adjacent tokens joined */
    function tokenise(raw) {
      var q = fold(String(raw || "").slice(0, 120)).replace(/\btwenty (one|two|three|four|five|six|seven|eight|nine)\b/g, function (_, unit) { return String(20 + NUMWORDS[unit]); });
      var parts = q.split(" ").filter(Boolean);
      var nights = null, i, out = [], corrections = [];
      for (i = 0; i < parts.length; i++) {
        var w = parts[i], n = /^\d+$/.test(w) ? parseInt(w, 10) : (NUMWORDS[w] != null ? NUMWORDS[w] : null);
        var unit = parts[i + 1];
        if (n != null && unit && /^(day|days|night|nights|week|weeks|tage|nachte|jours|nuits|semaines|wochen)$/.test(unit)) {
          nights = /^(week|weeks|wochen|semaines)$/.test(unit) ? n * 7 : n; i++; continue;
        }
        if (/^(fortnight|fortnights)$/.test(w)) { nights = 14; continue; }
        // Bare numbers are exact identifiers (e.g. suite numbers), never fuzzy text.
        if (FILLER[w]) continue;
        if (MISSPELL[w]) { var to = fold(MISSPELL[w]); corrections.push({ from: w, to: to, how: "misspell" }); to.split(" ").forEach(function (x) { out.push(x); }); continue; }
        out.push(w);
      }
      // token join: "pancha karma" → "panchakarma" when the joined form is a vocabulary word
      var joined = [];
      for (i = 0; i < out.length; i++) {
        if (i + 1 < out.length && !vocabWords[out[i]] && vocabWords[out[i] + out[i + 1]]) { joined.push(out[i] + out[i + 1]); corrections.push({ from: out[i] + " " + out[i + 1], to: out[i] + out[i + 1], how: "join" }); i++; }
        else joined.push(out[i]);
      }
      return { q: q, tokens: joined, nights: nights, corrections: corrections, corrected: joined.join(" ") };
    }

    /* ---- one token against one field: {factor, word, corrected} or null */
    function matchWord(tok, f, weak) {
      if (weak && !f.weakOk) return null;
      var best = null, i, w, list = f.wordList, tol, d;
      if (f.words[tok]) return { factor: 1, word: tok };
      if (f.phraseWords[tok]) best = { factor: 0.5, word: tok };
      if (/^\d+$/.test(tok)) return best;
      if (tok.length >= 3) {
        for (i = 0; i < list.length; i++) { w = list[i]; if (w.length > tok.length && w.indexOf(tok) === 0) { if (!best || best.factor < 0.9) best = { factor: 0.9, word: w }; break; } }
        if (!best || best.factor < 0.45) { list = f.pwList; for (i = 0; i < list.length; i++) { w = list[i]; if (w.length > tok.length && w.indexOf(tok) === 0) { if (!best || best.factor < 0.45) best = { factor: 0.45, word: w }; break; } } }
      }
      if ((!best || best.factor < 0.75) && tok.length >= 5 && !vocabWords[tok]) {
        tol = tok.length >= 8 ? 2 : 1;
        list = f.wordList;
        for (i = 0; i < list.length; i++) {
          w = list[i]; if (w.length < 4 || Math.abs(w.length - tok.length) > tol) continue;
          d = dl(tok, w, tol);
          if (d <= tol && (w[0] === tok[0] || d === 1)) { var fac = d === 1 ? 0.75 : 0.55; if (!best || best.factor < fac) best = { factor: fac, word: w, corrected: true, d: d }; if (d === 1) break; }
        }
      }
      return best;
    }
    function matchTrigram(tok, f) {
      if (tok.length < 6 || /^\d+$/.test(tok)) return null;
      var tg = trigrams(tok), best = null, i, list = f.wordList.concat(f.pwList), j;
      for (i = 0; i < list.length; i++) { j = jaccard(tg, trigrams(list[i])); if (j >= 0.45 && (!best || j > best.j)) best = { factor: 0.5, word: list[i], corrected: true, j: j }; }
      return best;
    }

    function scoreDoc(d, T, qJoined, qRaw, faqFactor) {
      var tokens = T.tokens, covered = {}, covStrong = {}, sum = 0, hits = {}, corr = {}, strong = false, exact = 0, i, k, f, m;
      // phrases first (the specific case beats the generic one)
      for (k = 0; k < d.fields.length; k++) {
        f = d.fields[k];
        for (i = 0; i < f.phrases.length; i++) {
          if (hasPhrase(qJoined, f.phrases[i]) || hasPhrase(qRaw, f.phrases[i])) {
            var pt = f.phrases[i].split(" "), c = 0;
            pt.forEach(function (w) { if (!covered[w] && (tokens.indexOf(w) >= 0 || hasPhrase(qRaw, w))) { covered[w] = f.boost; if (f.boost >= 5) covStrong[w] = 1; c++; hits[w] = 1; } });
            sum += f.boost * Math.max(c, 1);
            if (f.boost >= 10) strong = true;
            if (f.boost >= 5) exact = Math.max(exact, f.phrases[i] === qRaw ? 2 : f.phrases[i] === qJoined ? 1 : 0);
          }
        }
      }
      for (i = 0; i < tokens.length; i++) {
        var tok = tokens[i]; if (covered[tok]) continue;
        var weak = !!WEAK[tok], best = null;
        for (k = 0; k < d.fields.length; k++) {
          f = d.fields[k];
          m = matchWord(tok, f, weak);
          if (m) { var s = f.boost * m.factor * (weak ? 0.5 : 1); if (!best || s > best.s) best = { s: s, m: m, f: f }; }
        }
        if (best) { sum += best.s; covered[tok] = best.s; if (best.f.boost >= 5 && best.m.factor >= 0.55) covStrong[tok] = 1; hits[best.m.word] = 1; if (best.m.corrected) corr[tok] = best.m.word; if (best.f.boost >= 10 && best.m.factor === 1) strong = true; }
      }
      var nonWeak = tokens.filter(function (t) { return !WEAK[t]; });
      var denom = nonWeak.length || tokens.length || 1;
      var cov = 0, covS = 0; (nonWeak.length ? nonWeak : tokens).forEach(function (t) { if (covered[t]) cov++; if (covStrong[t]) covS++; });
      if (!sum) return null;
      var score = sum * (0.5 + 0.5 * cov / denom);
      var full = covS === denom;
      if (full && d.labelT.length && d.labelT.some(function (w) { return hits[w]; }) && d.labelT.every(function (w) { return hits[w] || covered[w] || WEAK[w]; })) score += 2;
      if (d.kind === "question") score *= faqFactor;
      if (!tokens.length) exact = 0;
      return { doc: d, score: score, full: full, strong: strong, exact: exact, hits: hits, corr: corr, cov: cov };
    }

    function query(raw, o) {
      o = o || {};
      var scope = o.scope || "site";
      var T = tokenise(raw);
      var qRaw = T.q, qJoined = T.corrected;
      var out = { typed: String(raw || "").trim(), q: qRaw, tokens: T.tokens, nights: T.nights, cls: CLS.NONE, urgent: false, declined: null, consult: null,
        total: 0, shown: 0, counts: { programmes: 0, questions: 0, pages: 0 }, programmes: [], questions: [], pages: [], caveats: [], corrections: T.corrections.slice(), corrected: null, didYouMean: [], handoff: null, sort: null, generic: null, order: [] };
      if (!qRaw && !T.nights) return out;

      // safety phrases: exact/normalised only, never fuzzy
      var decl = firstPhrase(qRaw, V.decline) || firstPhrase(qJoined, V.decline);
      if (decl) { out.cls = CLS.DECLINE; out.declined = decl; }
      var acute = firstPhrase(qRaw, V.rehabExempt) ? null : firstPhrase(qRaw, V.urgent);
      if (acute) out.urgent = acute;
      var consult = firstPhrase(qRaw, V.consult) || firstPhrase(qJoined, V.consult);

      var faqFactor = scope === "faq" ? 1 : 0.8;
      var scored = [], i, r;
      for (i = 0; i < docs.length; i++) {
        var d = docs[i];
        if (scope === "programmes" && d.kind !== "programme" && d.kind !== "page") continue;
        if (scope === "faq" && d.kind !== "question") continue;
        r = scoreDoc(d, T, qJoined, qRaw, faqFactor);
        if (r) scored.push(r);
      }
      // trigram fallback for tokens nothing matched
      T.tokens.forEach(function (tok) {
        if (scored.some(function (s) { return s.hits[tok] || s.corr[tok]; })) return;
        for (i = 0; i < docs.length; i++) {
          var d2 = docs[i]; if (scope === "faq" && d2.kind !== "question") continue; if (scope === "programmes" && d2.kind === "question") continue;
          var m = matchTrigram(tok, d2.fields[0]) || matchTrigram(tok, d2.fields[1]);
          if (m) { var ex = scored.filter(function (s) { return s.doc === d2; })[0]; var add = d2.fields[0].boost * 0.5; if (ex) { ex.score += add; ex.corr[tok] = m.word; } else scored.push({ doc: d2, score: add * 0.75, full: false, strong: false, hits: {}, corr: (function () { var c = {}; c[tok] = m.word; return c; })(), cov: 1 }); }
        }
      });

      var progStrong = scored.some(function (s) { return s.doc.kind === "programme" && s.strong; });
      // intents (non-clinical navigation) — suppressed when a programme was named outright
      var hitIntents = [];
      intents.forEach(function (it) {
        for (i = 0; i < it.words.length; i++) if (hasPhrase(qJoined, it.words[i]) || hasPhrase(qRaw, it.words[i])) { hitIntents.push(it); break; }
      });
      hitIntents.forEach(function (it) {
        if (it.sort) { out.sort = it.sort; return; }
        if (progStrong || scope === "faq") return;
        var target = byKey[it.target]; if (!target) return;
        var ex = scored.filter(function (s) { return s.doc === target; })[0];
        if (ex) ex.score += 8; else scored.push({ doc: target, score: 8, full: false, strong: false, hits: {}, corr: {}, cov: 0 });
      });

      // generic (ambiguous) symptom → several programmes, unless a longer vocabulary phrase matched
      var g = null;
      generic.forEach(function (gg) { if ((hasPhrase(qJoined, gg.term) || hasPhrase(qRaw, gg.term)) && (!g || gg.len > g.len)) g = gg; });
      if (g && scope !== "faq") {
        var longer = scored.some(function (s) { return s.doc.kind === "programme" && s.doc.fields[0].phrases.some(function (p) { return p.split(" ").length > g.len && (hasPhrase(qJoined, p) || hasPhrase(qRaw, p)); }); });
        if (!longer) {
          out.generic = g.term;
          g.routes.forEach(function (route, n) {
            var d3 = byKey[route]; if (!d3) return;
            var ex = scored.filter(function (s) { return s.doc === d3; })[0];
            var bonus = 12 - n * 0.5;
            if (ex) { ex.score = Math.max(ex.score, bonus) + 0.01; ex.full = true; ex.strong = true; ex.gen = true; } else scored.push({ doc: d3, score: bonus, full: true, strong: true, gen: true, hits: {}, corr: {}, cov: 1 });
          });
        }
      }

      scored.sort(function (a, b) { return b.score - a.score || a.doc.labelT.length - b.doc.labelT.length; });
      var progs = scored.filter(function (s) { return s.doc.kind === "programme"; });
      var qs = scored.filter(function (s) { return s.doc.kind === "question"; });
      var pgs = scored.filter(function (s) { return s.doc.kind === "page"; });

      // duration facet
      if (T.nights != null && scope !== "faq") {
        var pool = progs.length ? progs : docs.filter(function (d4) { return d4.kind === "programme"; }).map(function (d4) { return { doc: d4, score: 1, strong: false, full: true, hits: {}, corr: {}, cov: 1 }; });
        var exact = pool.filter(function (s) { return s.doc.data.nights === T.nights; });
        progs = exact.length ? exact : pool.filter(function (s) { return s.doc.data.nights != null && s.doc.data.nights <= T.nights; });
        if (!T.tokens.length) progs.sort(function (a, b) { return (a.doc.data.from ? a.doc.data.from.INR : 9e9) - (b.doc.data.from ? b.doc.data.from.INR : 9e9); });
      }
      if (out.sort === "priceAsc" && scope !== "faq") {
        var named = progs.some(function (s) { return s.strong; });
        var pool2 = (named || T.nights != null) ? progs : docs.filter(function (d5) { return d5.kind === "programme"; }).map(function (d5) { return { doc: d5, score: 1, strong: false, full: true, exact: 0, hits: {}, corr: {}, cov: 1 }; });
        progs = pool2.filter(function (s) { return s.doc.data.from && s.doc.data.from.INR != null && s.doc.data.basis !== "night"; }).sort(function (a, b) { return a.doc.data.from.INR - b.doc.data.from.INR; });
      }

      // comorbidity: two or more strong programme hits joined in one sentence → the Personalised Programme leads
      // evidence for two DIFFERENT conditions: distinct strong hits, a generic term counting once
      var strongProgs = progs.filter(function (s) { return s.strong && !s.gen; });
      var evidence = strongProgs.length + (progs.some(function (s) { return s.gen; }) ? 1 : 0);
      var joined = / and | also | plus | as well as | und | sowie | et | ainsi que |,/.test(" " + String(raw).toLowerCase() + " ");
      var multi = false;
      if (evidence >= 2 && (joined || T.tokens.length >= 4)) {
        var pers = byKey["/personalized-customized-healing-program/"];
        if (pers) { progs = progs.filter(function (s) { return s.doc !== pers; }); progs.unshift({ doc: pers, score: 99, strong: true, full: true, hits: {}, corr: {}, cov: 1 }); multi = true; }
      }

      // classes
      var solid = progs.some(function (s) { return s.score >= 9; });
      if (out.cls !== CLS.DECLINE) {
        if (consult && !solid) { out.cls = CLS.CONSULT; out.consult = consult; progs = []; }
        else if (!progs.length && !qs.length && !pgs.length) out.cls = CLS.NONE;
        else if (multi || out.generic || (progs.length > 1 && progs[1].score >= progs[0].score * 0.9)) out.cls = CLS.MULTI;
        else out.cls = CLS.DIRECT;
      } else progs = [];
      if (out.urgent && out.cls !== CLS.DECLINE) out.cls = CLS.URGENT;

      // caveats for the programmes shown
      // caveats follow a NAMED condition, never a bare duration/price facet
      if (T.tokens.length) progs.slice(0, 6).forEach(function (s) { var c = V.caveat[s.doc.key]; if (c && out.caveats.indexOf(c) < 0) out.caveats.push(c); });

      // corrections → "Showing results for" / "Did you mean"
      var corrMap = {}; T.corrections.forEach(function (c) { corrMap[c.from] = c.to; });
      var top = progs[0] || qs[0] || pgs[0];
      if (top) Object.keys(top.corr).forEach(function (tok) { corrMap[tok] = top.corr[tok]; });
      if (Object.keys(corrMap).length) {
        out.corrected = qRaw.split(" ").map(function (w) { return corrMap[w] || w; }).join(" ");
        // alternatives: a different correction of the same token among the next-best docs within 15%
        var alts = {};
        [progs, qs, pgs].forEach(function (grp) { grp.slice(0, 4).forEach(function (s) { if (top && s.score >= top.score * 0.85) Object.keys(s.corr).forEach(function (tok) { if (corrMap[tok] && s.corr[tok] !== corrMap[tok]) alts[s.corr[tok]] = 1; }); }); });
        Object.keys(alts).forEach(function (a) { out.didYouMean.push(a); });
        if (out.corrected === qRaw) out.corrected = null;
      }

      // hand-off for the finder: a non-programme intent shows one grey row instead of "no close match"
      if (scope === "programmes" && !progs.length && pgs.length && pgs[0].score >= 8) out.handoff = { route: pgs[0].doc.key, label: pgs[0].doc.label };

      var cap = o.limit || (scope === "site" ? 12 : docs.length);
      out.counts = { programmes: progs.length, questions: qs.length, pages: pgs.length };
      out.programmes = progs.slice(0, cap).map(function (s) { return { route: s.doc.key, score: round(s.score), hits: Object.keys(s.hits), data: s.doc.data }; });
      out.questions = qs.slice(0, cap).map(function (s) { return { id: s.doc.key, score: round(s.score), hits: Object.keys(s.hits), data: s.doc.data }; });
      out.pages = pgs.slice(0, cap).map(function (s) { return { route: s.doc.key, score: round(s.score), hits: Object.keys(s.hits), data: s.doc.data }; });
      // group order: full-coverage page/question beats a partial programme; a named programme beats everything; else by score
      var order = [];
      var pFull = progs[0] && progs[0].full, pStrong = progs[0] && progs[0].strong;
      var best = { programmes: progs[0] ? progs[0].score : -1, questions: qs[0] ? qs[0].score : -1, pages: pgs[0] ? pgs[0].score : -1 };
      var navFull = (pgs[0] && pgs[0].full && (!pFull || !pStrong)) ? "pages" : null;
      var qFull = (qs[0] && qs[0].full && (!pFull || !pStrong)) ? "questions" : null;
      if (navFull && qFull) { navFull = best.pages >= best.questions ? "pages" : "questions"; qFull = null; }
      var pExact = progs[0] ? progs[0].exact : 0;
      var exactNav = (pgs[0] && pgs[0].exact > pExact) ? "pages" : (qs[0] && qs[0].exact && !pStrong) ? "questions" : null;
      var first = (out.sort || (T.nights != null && progs.length)) ? "programmes" : exactNav || navFull || qFull || (pStrong ? "programmes" : null);
      if (!first) first = ["programmes", "questions", "pages"].sort(function (a, b) { return best[b] - best[a]; })[0];
      ["programmes", "questions", "pages"].forEach(function (k) { if (k !== first && out[k].length) order.push(k); });
      if (out[first].length) order.unshift(first);
      out.order = order;
      out.total = progs.length + qs.length + pgs.length;
      out.shown = out.programmes.length + out.questions.length + out.pages.length;
      return out;
    }
    function round(x) { return Math.round(x * 100) / 100; }
    function firstPhrase(q, list) { for (var i = 0; i < (list || []).length; i++) if (hasPhrase(q, fold(list[i]))) return list[i]; return null; }

    /* ---- helpers the surfaces share */
    function priceLine(p, cur, ui) {
      ui = ui || index.ui;
      cur = cur || "INR";
      var parts = [];
      if (p.course) parts.push(fmt(ui.days, { n: p.nights }));
      else if (p.nights != null) parts.push(fmt(ui.nights, { n: p.nights }));
      if (p.priceState === "expired" || (p.validTo && new Date() > new Date(p.validTo + "T23:59:59"))) parts.push(ui.requestQuote);
      else if (p.from && p.from[cur] != null) parts.push(p.basis === "night" ? fmt(ui.perNight, { price: fmtNum(p.from[cur], cur) }) : fmt(ui.from, { price: fmtNum(p.from[cur], cur) }));
      return parts.join(" · ");
    }
    function answerLine(p, cur, ui) {
      var a = priceLine(p, cur, ui);
      if (p.forWhat) a += (a ? " · " : "") + p.forWhat;
      return a;
    }
    return { query: query, tokenise: tokenise, priceLine: priceLine, answerLine: answerLine, docs: docs, index: index };
  }

  /* --------------------------------------------------------- index load */
  var indexPromise = null;
  function load() {
    if (indexPromise) return indexPromise;
    if (typeof fetch !== "function") return Promise.reject(new Error("no fetch"));
    var lang = (root.document && root.document.documentElement.lang || "en").slice(0, 2).toLowerCase();
    var url = lang === "en" ? INDEX_URL : INDEX_URL.replace(/\.json$/, "." + lang + ".json");
    indexPromise = fetch(url, { credentials: "same-origin" }).then(function (r) { if (!r.ok && url !== INDEX_URL) return fetch(INDEX_URL).then(function (r2) { return r2.json(); }); if (!r.ok) throw new Error("index " + r.status); return r.json(); });
    indexPromise.catch(function () { indexPromise = null; });
    return indexPromise;
  }

  /* Consent-gated search event (D-20260922-37): gtag "site_search" {search_term, result_count, surface}.
   * Emitted ONLY when the site's measurement is ACTIVE — boot.ts startMeasurement() runs solely when the build set
   * AHV_ANALYTICS=1 AND the visitor accepted the cookie notice, and it is the only code that injects the gtag/js
   * loader; that loader tag is the signal read here. No consent logic is touched (HARD GATE 11); on staging the
   * loader never exists, so nothing fires. One event per distinct query per surface. */
  var tracked = {};
  function measurementActive() {
    if (!root.document) return false;
    return typeof root.gtag === "function" && !!root.document.querySelector('script[src^="https://www.googletagmanager.com/gtag/js"]');
  }
  function track(surface, term, count) {
    try {
      var key = surface + "|" + fold(term);
      if (tracked[key] || !String(term || "").trim()) return false;
      if (!measurementActive()) return false;
      tracked[key] = 1;
      root.gtag("event", "site_search", { search_term: String(term).slice(0, 100), result_count: count | 0, surface: surface });
      return true;
    } catch (e) { return false; }
  }
  var api = { track: track, measurementActive: measurementActive, version: "2026-09-24a", norm: norm, fold: fold, dl: dl, fmtNum: fmtNum, fmt: fmt, esc: esc, createEngine: createEngine, load: load, WA_HREF: WA_HREF, TEL_HREF: TEL_HREF, CONSULT_HREF: CONSULT_HREF };
  root.AHVSearch = api;
  if (!root.document) return;

  /* ============================================================ overlay */
  var doc = root.document;
  var dialog = null, input = null, status = null, body = null, engine = null, ui = null, trigger = null, open = false, cur = "INR", timer = null, trackTimer = null, pendingQ = null, chipsMode = false, uncorrected = false;
  try { cur = localStorage.getItem("ahv-cur") || "INR"; } catch (e) { /* private mode */ }
  var TRIGGER = 'button[aria-controls="ahv-search-dialog"], a[href="#search"], [data-ahv-search-trigger]';

  function ensureDialog() {
    if (dialog) return;
    dialog = doc.createElement("div");
    dialog.id = "ahv-search-dialog";
    dialog.className = "ahvs";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "ahvs-title");
    dialog.hidden = true;
    dialog.innerHTML =
      '<div class="ahvs-backdrop" data-close="1"></div>' +
      '<div class="ahvs-panel">' +
        '<div class="ahvs-head"><h2 id="ahvs-title" class="ahvs-title">Search Kairali</h2>' +
          '<div class="ahvs-cur" role="group" aria-label="Currency"><button type="button" data-cur="INR">₹</button><button type="button" data-cur="USD">$</button><button type="button" data-cur="EUR">€</button></div>' +
          '<button type="button" class="ahvs-close" data-close="1" aria-label="Close search">✕</button></div>' +
        '<form class="ahvs-form" action="/search/" method="get" role="search"><span class="ahvs-glyph" aria-hidden="true">⌕</span>' +
          '<label for="ahvs-input" class="ahvs-sr">Search Kairali</label>' +
          '<input id="ahvs-input" class="ahvs-input" name="q" type="search" maxlength="120" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" placeholder="Condition, price, airport, visa…">' +
          '<button type="button" class="ahvs-clear" aria-label="Clear" hidden>✕</button></form>' +
        '<p class="ahvs-status" aria-live="polite"></p>' +
        '<div class="ahvs-body"></div>' +
        '<div class="ahvs-fallback"><p class="ahvs-notsure">Need help finding the right information?</p><div class="ahvs-fb-row">' +
          '<a href="' + WA_HREF + '" target="_blank" rel="noopener noreferrer" data-fb="whatsapp">WhatsApp patient care</a>' +
          '<a href="' + CONSULT_HREF + '" data-fb="consultation">Free online consultation</a>' +
          '<a href="' + TEL_HREF + '" data-fb="call">Call +91 9555 156 156</a></div></div>' +
      '</div>';
    doc.body.appendChild(dialog);
    input = dialog.querySelector(".ahvs-input");
    status = dialog.querySelector(".ahvs-status");
    body = dialog.querySelector(".ahvs-body");
    dialog.addEventListener("click", function (e) {
      var t = e.target;
      if (t.closest("[data-close]")) { e.preventDefault(); close(); return; }
      var cb = t.closest("[data-cur]"); if (cb) { setCur(cb.getAttribute("data-cur")); return; }
      if (t.closest(".ahvs-clear")) { chipsMode = false; uncorrected = false; input.value = ""; input.focus(); render(); return; }
      var chip = t.closest("[data-q]"); if (chip) { e.preventDefault(); uncorrected = false; input.value = chip.getAttribute("data-q"); input.focus(); render(); return; }
      var raw = t.closest("[data-raw]"); if (raw) { e.preventDefault(); uncorrected = true; render(); return; }
      var cond = t.closest("[data-chips]"); if (cond) { e.preventDefault(); chipsMode = true; render(); return; }
      var cchip = t.closest("[data-chip]"); if (cchip) { e.preventDefault(); chipsMode = false; renderChip(cchip.getAttribute("data-chip")); return; }
      var more = t.closest("[data-more]"); if (more) { e.preventDefault(); var grp = more.closest(".ahvs-group"); grp.classList.add("ahvs-open"); more.remove(); return; }
    });
    // Enter in the input opens all results; Enter on a focused result follows that link.
    input.addEventListener("input", function () { uncorrected = false; chipsMode = false; clearTimeout(timer); timer = setTimeout(render, 80); });
    dialog.addEventListener("keydown", onKey);
    setCur(cur, true);
    load().then(function (index) { engine = createEngine(index); ui = index.ui; applyUi(); render(); }).catch(function () { status.textContent = "Search could not load. Please use WhatsApp or the consultation link below."; });
  }
  function applyUi() {
    if (!ui) return;
    dialog.querySelector("#ahvs-title").textContent = ui.dialogTitle;
    input.placeholder = ui.placeholder;
    dialog.querySelector(".ahvs-close").setAttribute("aria-label", ui.close);
    dialog.querySelector(".ahvs-clear").setAttribute("aria-label", ui.clear);
    dialog.querySelector(".ahvs-notsure").textContent = ui.notSure;
    dialog.querySelector('[data-fb="whatsapp"]').textContent = ui.fallback.whatsapp;
    dialog.querySelector('[data-fb="consultation"]').textContent = ui.fallback.consultation;
    dialog.querySelector('[data-fb="call"]').textContent = ui.fallback.call;
  }
  function setCur(c, silent) {
    cur = c; try { localStorage.setItem("ahv-cur", c); } catch (e) { /* private mode */ }
    Array.prototype.forEach.call(dialog.querySelectorAll("[data-cur]"), function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-cur") === c ? "true" : "false"); });
    if (!silent) render();
  }
  function onKey(e) {
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); return; }
    var rows = Array.prototype.filter.call(dialog.querySelectorAll("a.ahvs-row, .ahvs-empty a, .ahvs-empty button"), function (el) { return el.getClientRects().length > 0; });
    if ((e.key === "ArrowDown" || e.key === "ArrowUp") && rows.length) {
      e.preventDefault();
      var i = rows.indexOf(doc.activeElement);
      var n = e.key === "ArrowDown" ? (i < 0 ? 0 : Math.min(rows.length - 1, i + 1)) : (i <= 0 ? -1 : i - 1);
      if (n < 0) input.focus(); else rows[n].focus();
      return;
    }
    if (e.key === "Home" && rows.length && doc.activeElement !== input) { e.preventDefault(); rows[0].focus(); }
    if (e.key === "End" && rows.length && doc.activeElement !== input) { e.preventDefault(); rows[rows.length - 1].focus(); }
    if (e.key === "Tab") {
      var f = Array.prototype.filter.call(dialog.querySelectorAll("button:not([hidden]), input, a[href]"), function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  function openDialog(fromEl) {
    ensureDialog();
    trigger = fromEl || trigger;
    if (open) { input.focus(); return; }
    open = true;
    dialog.hidden = false;
    doc.documentElement.classList.add("ahvs-lock");
    if (trigger && trigger.setAttribute) trigger.setAttribute("aria-expanded", "true");
    try { history.pushState({ ahvs: 1 }, ""); } catch (e) { /* file: */ }
    render();
    setTimeout(function () { input.focus(); }, 0);
  }
  function close(fromPop) {
    if (!open) return;
    open = false;
    dialog.hidden = true;
    doc.documentElement.classList.remove("ahvs-lock");
    if (trigger && trigger.setAttribute) trigger.setAttribute("aria-expanded", "false");
    if (!fromPop && history.state && history.state.ahvs) { try { history.back(); } catch (e) { /* ignore */ } }
    if (trigger && trigger.focus) setTimeout(function () { trigger.focus(); }, 0);
  }
  root.addEventListener("popstate", function () { if (open) close(true); });

  /* ---- rendering */
  function rowProgramme(r) {
    var p = r.data, name = mark(p.name, r.hits);
    var a = engine.answerLine(p, cur, ui);
    return '<li><a class="ahvs-row" href="' + esc(p.route) + '"><span class="ahvs-row-t">' + name + (p.sanskrit ? ' <span class="ahvs-sk">' + esc(p.sanskrit) + "</span>" : "") + '</span><span class="ahvs-row-a">' + esc(a) + (p.from && p.basis !== "night" && p.priceState === "valid" ? " " + esc(ui.basis) : "") + "</span></a></li>";
  }
  function rowQuestion(r) {
    var q = r.data, href = "/faqs-downloads/?q=" + encodeURIComponent(input.value.trim()) + "#" + q.id;
    return '<li><a class="ahvs-row" href="' + esc(href) + '"><span class="ahvs-row-t">' + mark(q.q, r.hits) + '</span><span class="ahvs-row-a">' + esc(q.topic) + "</span></a></li>";
  }
  function rowPage(r) {
    var p = r.data;
    return '<li><a class="ahvs-row" href="' + esc(p.route) + '"><span class="ahvs-row-t">' + mark(p.label, r.hits) + '</span>' + (p.desc ? '<span class="ahvs-row-a">' + esc(p.desc) + "</span>" : "") + "</a></li>";
  }
  function mark(text, hits) {
    var out = esc(text);
    if (!hits || !hits.length) return out;
    var words = hits.filter(function (h) { return h.length >= 3; }).sort(function (a, b) { return b.length - a.length; });
    if (!words.length) return out;
    var re = new RegExp("(^|[^a-z0-9])(" + words.map(function (w) { return w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|") + ")", "ig");
    return out.replace(re, function (m, pre, w) { return pre + "<mark>" + w + "</mark>"; });
  }
  function group(key, rows, renderer) {
    if (!rows.length) return "";
    var shown = rows.slice(0, 3), rest = rows.slice(3);
    return '<section class="ahvs-group" aria-label="' + esc(ui.groups[key]) + '"><h3 class="ahvs-h">' + esc(ui.groups[key]) + '</h3><ul class="ahvs-list">' +
      shown.map(renderer).join("") + "</ul>" + (rest.length ? '<ul class="ahvs-list ahvs-rest">' + rest.map(renderer).join("") + "</ul>" : "") +
      (rest.length ? '<button type="button" class="ahvs-more" data-more="1">' + esc(fmt(ui.showAll, { n: rows.length }).replace(/^Show all /, "Show ")) + "</button>" : "") + "</section>";
  }
  function emptyState(heading) {
    var b = ui.emptyButtons.map(function (x) { return x.action === "chips" ? '<button type="button" data-chips="1">' + esc(x.label) + "</button>" : '<a href="' + esc(x.href) + '">' + esc(x.label) + "</a>"; }).join("");
    var often = (ui.oftenSearched || engine.index.oftenSearched || []).map(function (q) { return '<button type="button" data-q="' + esc(q) + '">' + esc(q) + "</button>"; }).join("");
    return '<div class="ahvs-empty"><p class="ahvs-empty-h">' + esc(heading || ui.emptyHeading) + '</p><div class="ahvs-six">' + b + '</div>' + (often ? '<p class="ahvs-often"><span>' + esc(ui.oftenSearchedLabel) + "</span> " + often + "</p>" : "") + "</div>";
  }
  function chipsState() {
    return '<div class="ahvs-empty"><p class="ahvs-empty-h">' + esc(ui.emptyButtons[0].label) + '</p><div class="ahvs-six ahvs-chips">' + engine.index.chips.map(function (c) { return '<button type="button" data-chip="' + esc(c.id) + '">' + esc(c.label) + "</button>"; }).join("") + "</div></div>";
  }
  function renderChip(id) {
    var chip = engine.index.chips.filter(function (c) { return c.id === id; })[0]; if (!chip) return;
    var rows = chip.routes.map(function (r) { return engine.index.programmes.filter(function (p) { return p.route === r; })[0]; }).filter(Boolean).map(function (p) { return { data: p, hits: [] }; });
    input.value = chip.label;
    dialog.querySelector(".ahvs-clear").hidden = false;
    status.textContent = fmt(ui.results, { n: rows.length, q: chip.label });
    body.innerHTML = group("programmes", rows, rowProgramme);
  }
  function render() {
    if (!dialog) return;
    var q = input.value.trim();
    dialog.querySelector(".ahvs-clear").hidden = !q;
    if (!engine) { status.textContent = ui ? ui.loading : "Loading search…"; body.innerHTML = ""; pendingQ = q; return; }
    if (chipsMode) { status.textContent = ""; body.innerHTML = chipsState(); return; }
    if (q.length < 2) { status.textContent = ""; body.innerHTML = emptyState(); return; }
    var res = engine.query(q, { scope: "site" });
    var html = "";
    if (res.cls === "URGENT_MEDICAL_HELP") html += '<div class="ahvs-note ahvs-urgent" role="note"><span aria-hidden="true">!</span><p>' + esc(ui.urgent) + "</p></div>";
    if (res.cls === "NOT_TREATED") html += '<div class="ahvs-note"><p>' + esc(ui.declined) + "</p></div>";
    if (res.cls === "CONSULT_FIRST") html += '<div class="ahvs-note"><p>' + esc(ui.consultFirst) + "</p></div>";
    if (res.cls === "MULTIPLE_POSSIBLE_MATCHES" && res.programmes.length > 1) html += '<p class="ahvs-multi">' + esc(ui.multi) + "</p>";
    res.caveats.forEach(function (c) { html += '<p class="ahvs-caveat">' + esc(c) + "</p>"; });
    var line;
    if (res.corrected && !uncorrected && res.total) {
      line = esc(fmt(ui.showingFor, { corrected: res.corrected, typed: res.typed }));
    } else line = esc(fmt(res.total === 1 ? ui.resultOne : ui.results, { n: res.total, q: res.typed }));
    if (res.didYouMean.length) html += '<p class="ahvs-dym"><span>' + esc(ui.didYouMean) + "</span> " + res.didYouMean.map(function (w) { return '<button type="button" data-q="' + esc(w) + '">' + esc(w) + "</button>"; }).join(" · ") + "</p>";
    if (!res.total) {
      status.textContent = "";
      body.innerHTML = html + emptyState(fmt(ui.zero, { q: res.typed }));
      return;
    }
    status.innerHTML = line;
    clearTimeout(trackTimer); trackTimer = setTimeout(function () { track("overlay", q, res.total); }, 900);
    res.order.forEach(function (k) {
      if (k === "programmes") html += group("programmes", res.programmes, rowProgramme);
      if (k === "questions") html += group("questions", res.questions, rowQuestion);
      if (k === "pages") html += group("pages", res.pages, rowPage);
    });
    html += '<p><a class="ahvs-all" href="/search/?q=' + encodeURIComponent(q) + '">View all ' + res.total + (res.total === 1 ? ' result' : ' results') + ' →</a></p>';
    body.innerHTML = html;
  }

  /* ---- triggers: capture-phase so the package's inert dialog and the homepage's own overlay never open */
  doc.addEventListener("click", function (e) {
    var t = e.target && e.target.closest ? e.target.closest(TRIGGER) : null;
    if (!t) return;
    e.preventDefault(); e.stopPropagation();
    openDialog(t);
  }, true);
  doc.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var t = e.target && e.target.closest ? e.target.closest(TRIGGER) : null;
    if (!t) return;
    e.preventDefault(); e.stopPropagation();
    openDialog(t);
  }, true);
  doc.addEventListener("pointerenter", function (e) { if (e.target && e.target.closest && e.target.closest(TRIGGER)) load().catch(function () {}); }, true);

  /* ---- the homepage "I am looking for" bar: live suggestions (owner, 23 Sep 2026:
     "should have auto suggest or auto complete"). The same engine and index as the
     dialog; a combobox listbox under the input with up to six rows (programmes first,
     then questions and pages), arrow keys + Enter to follow a row, Escape to close,
     Enter with nothing chosen submits the form to the finder as before. Rows are
     ≥48px, 17px type. Nothing here fires analytics. */
  // Carry only visitor-entered interests/dates into an editable enquiry draft.
  function homeEnquiryMessage(form) {
    var lines = [], q = form.querySelector('[name="q"]').value.trim().slice(0, 120);
    var from = form.querySelector('[name="from"]').value, to = form.querySelector('[name="to"]').value;
    if (q) lines.push("I am looking for: " + q);
    if (from) lines.push("Preferred arrival: " + from);
    if (to) lines.push("Preferred departure: " + to);
    return lines.join("\n");
  }
  doc.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var home = doc.querySelector('form[data-ahv-home-finder="1"]');
    var url; try { url = new URL(a.href, root.location.href); } catch (_) { return; }
    if (home && url.origin === root.location.origin && url.pathname === "/enquiry-form/") {
      var message = homeEnquiryMessage(home);
      a.href = "/enquiry-form/#message" + (message ? "?draft=" + encodeURIComponent(message) : "");
    }
    if (url.hostname === "wa.me" && url.pathname === "/919289838797") {
      var field = doc.querySelector('form[data-form="contact"] textarea[name="message"]');
      var draft = home ? homeEnquiryMessage(home) : (root.location.pathname === "/enquiry-form/" && field ? field.value.trim() : "");
      if (home || (root.location.pathname === "/enquiry-form/" && field)) {
        if (draft) url.searchParams.set("text", "Hello Kairali, I would like to enquire.\n\n" + draft);
        else url.searchParams.delete("text");
        a.href = url.href;
      }
    }
  }, true);
  function homeSuggest() {
    var form = doc.querySelector('form[data-ahv-home-finder="1"]');
    if (!form || form.getAttribute("data-ahvs-suggest") === "1") return;
    var inp = form.querySelector('input[name="q"]');
    if (!inp) return;
    form.setAttribute("data-ahvs-suggest", "1");
    var host = inp.parentNode;
    if (getComputedStyle(host).position === "static") host.style.position = "relative";
    var box = doc.createElement("ul");
    box.id = "ahvs-home-list"; box.className = "ahvs-home-list"; box.setAttribute("role", "listbox");
    box.setAttribute("aria-label", "Suggestions"); box.hidden = true;
    host.appendChild(box);
    inp.setAttribute("maxlength", "120");
    inp.setAttribute("role", "combobox"); inp.setAttribute("aria-autocomplete", "list");
    inp.setAttribute("aria-controls", box.id); inp.setAttribute("aria-expanded", "false");
    var active = -1, rows = [], t2 = null;
    function hide() { box.hidden = true; box.innerHTML = ""; rows = []; active = -1; inp.setAttribute("aria-expanded", "false"); inp.removeAttribute("aria-activedescendant"); }
    function paint() {
      rows.forEach(function (r, i) { r.setAttribute("aria-selected", i === active ? "true" : "false"); });
      if (active >= 0) inp.setAttribute("aria-activedescendant", rows[active].id); else inp.removeAttribute("aria-activedescendant");
    }
    function show() {
      var q = inp.value.trim();
      if (q.length < 2 || !engine) { hide(); return; }
      var res = engine.query(q, { scope: "site" });
      var list = [];
      res.order.forEach(function (kind) {
        res[kind].slice(0, 6).forEach(function (r) {
          var p = r.data;
          if (kind === "programmes") list.push({ href: p.route, t: p.name, a: p.sanskrit || p.durationDisplay || "", k: "Programme" });
          else if (kind === "questions") list.push({ href: p.href || "/faqs-downloads/#" + p.id, t: p.q, a: p.topic || "", k: "Question" });
          else list.push({ href: p.route, t: p.label, a: p.desc || "", k: "Page" });
        });
      });
      list = list.slice(0, 6);
      if (!list.length) { hide(); return; }
      box.innerHTML = list.map(function (it, i) {
        return '<li id="ahvs-home-opt-' + i + '" role="option" aria-selected="false"><a class="ahvs-home-row" href="' + esc(it.href) + '" tabindex="-1"><span class="ahvs-home-t">' + mark(it.t, res.tokens || []) + '</span><span class="ahvs-home-a">' + esc(it.k) + (it.a ? " · " + esc(String(it.a).slice(0, 70)) : "") + "</span></a></li>";
      }).join("");
      rows = Array.prototype.slice.call(box.querySelectorAll("li"));
      active = -1; box.hidden = false; inp.setAttribute("aria-expanded", "true"); paint();
    }
    inp.addEventListener("input", function () { clearTimeout(t2); load().then(function (index) { if (!engine) { engine = createEngine(index); ui = ui || index.ui; } t2 = setTimeout(show, 90); }).catch(function () {}); });
    inp.addEventListener("focus", function () { load().catch(function () {}); if (inp.value.trim().length >= 2) show(); });
    inp.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(rows.length - 1, active + 1); paint(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(-1, active - 1); paint(); }
      else if (e.key === "Escape") { e.preventDefault(); hide(); }
      else if (e.key === "Enter" && active >= 0) { e.preventDefault(); var a = rows[active].querySelector("a"); if (a) root.location.href = a.getAttribute("href"); }
    });
    box.addEventListener("mousedown", function (e) { var a = e.target.closest("a"); if (a) { e.preventDefault(); root.location.href = a.getAttribute("href"); } });
    doc.addEventListener("click", function (e) { if (!host.contains(e.target)) hide(); });
  }
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", homeSuggest); else homeSuggest();
  if (root.MutationObserver) { var hsRoot = doc.getElementById("ahv-design-root"); if (hsRoot) new MutationObserver(function () { setTimeout(homeSuggest, 0); }).observe(hsRoot, { childList: true, subtree: true }); }
  // a[href="#search"] in a snapshot without JS would jump to nothing; with JS the capture handler above owns it
})(typeof window !== "undefined" ? window : globalThis);

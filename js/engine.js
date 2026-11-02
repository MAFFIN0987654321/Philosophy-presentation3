/* js/engine.js — presentation engine (classic script, no modules) */
(function () {
  'use strict';
  var TOTAL = 10, W = 1920, H = 1080, NS = 'http://www.w3.org/2000/svg';
  var slides = [], extra = null, cur = 0, step = 0, timers = [], srcOpen = false;
  var canvas, counter, dbg, dbgOn = false, fps = 0, frames = 0, t0 = 0, hashSkip = false, cursorT = 0;
  var reduced = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var MARKS = {
    p: ['k-p', 'ПОТЕБНЯ'], h: ['k-h', 'ГУМБОЛЬДТ У ВИКЛАДІ ПОТЕБНІ'], r: ['k-r', 'РЕКОНСТРУКЦІЯ'],
    a: ['k-a', 'ПРИКЛАД АВТОРА'], i: ['k-a', 'ІНТЕРПРЕТАЦІЯ АВТОРА']
  };

  var Deck = window.Deck = {
    reduced: reduced,
    // def: {id,title,steps,transition,hidden?,build(root),setState(step,instant)}; step -1 = blank, 0 = state after arrival
    register: function (d) { if (d.hidden) extra = d; else slides.push(d); },
    later: function (fn, ms) { timers.push(setTimeout(fn, ms)); },            // cancelled on any navigation
    stag: function (fn, ms) { Deck.later(fn, reduced ? 0 : ms); },            // decorative stagger
    mk: function (tag, cls, parent, text) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text != null) e.textContent = text;
      if (parent) parent.appendChild(e);
      return e;
    },
    sv: function (tag, attrs, parent) {
      var e = document.createElementNS(NS, tag);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      if (parent) parent.appendChild(e);
      return e;
    },
    layer: function (root) { return Deck.sv('svg', { viewBox: '0 0 1920 1080', 'class': 'layer' }, root); },
    at: function (p, x, y) { var a = Deck.mk('div', 'pt', p); a.style.left = x + 'px'; a.style.top = y + 'px'; return a; },
    txt: function (p, cls, s, x, y, size) {            // text centred at (x,y)
      var e = Deck.mk('span', 't fx ' + cls, Deck.at(p, x, y), s);
      if (size) e.style.fontSize = size + 'px';
      return e;
    },
    orb: function (p, cls, x, y, r) {                  // dot / halo of radius r centred at (x,y)
      var e = Deck.mk('div', cls + ' fx', Deck.at(p, x, y));
      e.style.cssText = 'width:' + 2 * r + 'px;height:' + 2 * r + 'px;flex:none';
      return e;
    },
    show: function (el, on) { el.classList.toggle('v', !!on); },
    rv: function (el, on, inst, ms) {                  // reveal, optionally after a stagger delay
      if (!on || inst || !ms) Deck.show(el, on);
      else Deck.stag(function () { Deck.show(el, true); }, ms);
    },
    marks: function (root) {                           // marks.set(['p','a']) = visible marks, in order
      var box = Deck.mk('div', 'marks', root), els = {};
      for (var k in MARKS) {
        var m = Deck.mk('div', 'mark ' + MARKS[k][0], box);
        Deck.mk('i', '', m);
        m.appendChild(document.createTextNode(MARKS[k][1]));
        els[k] = m;
      }
      return { set: function (keys) {
        for (var k in els) {
          var i = keys.indexOf(k);
          els[k].classList.toggle('v', i >= 0);
          if (i >= 0) els[k].style.transform = 'translateY(' + (-30 * i) + 'px)';
        }
      } };
    },
    start: function () {
      canvas = document.getElementById('canvas'); counter = document.getElementById('counter'); dbg = document.getElementById('debug');
      if (!slides.length) return;
      slides.forEach(build);
      if (extra) { build(extra); extra.root.classList.add('src'); }
      resize(); bind();
      var h = fromHash(), sl = slides[h[0]];
      cur = h[0]; step = Math.min(h[1], sl.steps);
      apply(sl, -1, true); sl.root.classList.add('on'); void sl.root.offsetWidth;
      apply(sl, step, step > 0);
      refresh();
    }
  };

  function build(d) { d.root = Deck.mk('section', 'slide'); canvas.insertBefore(d.root, counter); d.build(d.root); }
  function clearTimers() { while (timers.length) clearTimeout(timers.pop()); }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function apply(sl, s, inst) {                        // inst = no transitions at all
    var r = sl.root;
    if (inst) r.classList.add('inst');
    sl.setState(s, inst);
    if (inst) { void r.offsetWidth; r.classList.remove('inst'); }
  }

  function go(i, s, inst) {
    var sl = slides[i];
    if (!sl) return;
    s = Math.max(0, Math.min(sl.steps, s));
    if (i === cur && s === step) return;
    clearTimers();
    if (i !== cur) {
      var from = slides[cur], pair = [from.root, sl.root];
      var cut = inst || slides[Math.min(i, cur)].transition === 'cut';
      apply(sl, inst ? s : -1, true);                  // prepare: final state (jump) or blank (arrival)
      if (cut) pair.forEach(function (r) { r.classList.add('cut'); });
      from.root.classList.remove('on'); sl.root.classList.add('on');
      void sl.root.offsetWidth;
      pair.forEach(function (r) { r.classList.remove('cut'); });
      cur = i; step = s;
      if (!inst) apply(sl, s, false);                  // arrival animation
    } else {
      var back = s < step;
      step = s; apply(sl, s, inst || back);
    }
    refresh();
  }

  function next() { var sl = slides[cur]; if (step < sl.steps) go(cur, step + 1); else go(cur + 1, 0); }
  function prev() { if (step > 0) go(cur, step - 1); else if (cur > 0) go(cur - 1, slides[cur - 1].steps, true); }

  function fromHash() {
    var m = /^#(\d+)(?:\.(\d+))?$/.exec(location.hash), i = m ? +m[1] - 1 : 0;
    return [Math.max(0, Math.min(slides.length - 1, i)), m && m[2] ? +m[2] : 0];
  }
  function refresh() {
    counter.textContent = pad(cur + 1) + ' / ' + TOTAL;
    var h = '#' + (cur + 1) + '.' + step;
    try { history.replaceState(null, '', h); } catch (e) { hashSkip = true; location.hash = h; }
    dbgText();
  }

  function toggleSrc(force) {
    if (!extra) return;
    var open = force === undefined ? !srcOpen : force;
    if (open === srcOpen) return;
    srcOpen = open;
    var r = extra.root;
    r.classList.add('cut');
    if (open) apply(extra, 0, true);
    r.classList.toggle('on', open);
    void r.offsetWidth; r.classList.remove('cut');
    counter.style.visibility = open ? 'hidden' : '';
  }
  function toggleFs() {
    var d = document, e = d.documentElement;
    if (d.fullscreenElement) d.exitFullscreen(); else if (e.requestFullscreen) e.requestFullscreen();
  }
  function toggleDbg() {
    dbgOn = !dbgOn; dbg.hidden = !dbgOn;
    if (dbgOn) { frames = 0; fps = 0; t0 = performance.now(); dbgText(); requestAnimationFrame(loop); }
  }
  function loop() {
    if (!dbgOn) return;
    frames++;
    var t = performance.now();
    if (t - t0 >= 500) { fps = Math.round(frames * 1000 / (t - t0)); frames = 0; t0 = t; dbgText(); }
    requestAnimationFrame(loop);
  }
  function dbgText() {
    if (dbgOn) dbg.textContent = 'FPS ' + fps + ' · слайд ' + (cur + 1) + '/' + TOTAL + ' · крок ' + step + '/' + slides[cur].steps;
  }
  function resize() { canvas.style.setProperty('--scale', Math.min(innerWidth / W, innerHeight / H)); }

  function onKey(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var c = e.code;                                    // physical key: works with any keyboard layout
    var nx = c === 'ArrowRight' || c === 'Space' || c === 'Enter' || c === 'NumpadEnter' || c === 'PageDown';
    var pv = c === 'ArrowLeft' || c === 'Backspace' || c === 'PageUp';
    if (!(nx || pv || /^(Home|End|ArrowDown|ArrowUp|Escape|KeyF|KeyS|KeyD)$/.test(c))) return;
    e.preventDefault();
    if (e.repeat) return;                              // holding a key must not skip steps
    if (c === 'KeyS') return toggleSrc();
    if (c === 'Escape') return toggleSrc(false);
    if (c === 'KeyD') return toggleDbg();
    if (c === 'KeyF') return toggleFs();
    if (srcOpen) return;
    if (nx) next();
    else if (pv) prev();
    else if (c === 'Home') go(0, 0, true);
    else if (c === 'End') go(slides.length - 1, slides[slides.length - 1].steps, true);
    else if (c === 'ArrowDown') go(cur + 1, 0);        // next slide, skipping steps
    else if (c === 'ArrowUp') go(cur - 1, 0, true);    // previous slide
  }

  function bind() {
    window.addEventListener('resize', resize);
    document.addEventListener('fullscreenchange', resize);
    window.addEventListener('hashchange', function () {
      if (hashSkip) { hashSkip = false; return; }
      var h = fromHash(); go(h[0], h[1], true);
    });
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', function (e) {
      if (srcOpen) return;
      if (e.clientX > innerWidth / 3) next(); else prev();
    });
    document.addEventListener('mousemove', function () {
      document.body.classList.remove('nocursor'); clearTimeout(cursorT);
      if (document.fullscreenElement) cursorT = setTimeout(function () { document.body.classList.add('nocursor'); }, 3000);
    });
  }
})();
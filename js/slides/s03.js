/* js/slides/s03.js — Slide 3 «Діаграма 1862 року»
   Steps: 1 triangles + «слово» + РЕКОНСТРУКЦІЯ (portrait/name/book follow after a delay)
          2 caption + source + ПОТЕБНЯ (angle arcs follow after a delay)
          3 outer vertices slide along their rays (angles at A stay equal) */
(function () {
  'use strict';
  var PORTRAIT_DELAY_MS = 9000;   // portrait appears this long after step 1 (≈ «Сам Потебня…» in the speech)
  var ARCS_DELAY_MS = 8000;       // arcs appear this long after step 2 (≈ «Ці два кути…»)
  var TWEEN_MS = 1600;
  var A = [960, 480];
  var O = { B: [440, 250], C: [440, 710], D: [1480, 250], E: [1480, 710] };   // original outer vertices
  var K = ['B', 'C', 'D', 'E'];
  var TARGET = { B: 0.62, C: 1.20, D: 1.25, E: 0.70 };                         // position on ray A->vertex (1 = original)
  var ONE = { B: 1, C: 1, D: 1, E: 1 };
  var R = 90;                                                                  // arc radius
  var E = {}, cur = { B: 1, C: 1, D: 1, E: 1 }, raf = 0;

  function vert(k) { return [A[0] + (O[k][0] - A[0]) * cur[k], A[1] + (O[k][1] - A[1]) * cur[k]]; }
  function setLine(l, p, q) {
    l.setAttribute('x1', p[0]); l.setAttribute('y1', p[1]);
    l.setAttribute('x2', q[0]); l.setAttribute('y2', q[1]);
  }
  function place() {
    var p = {};
    K.forEach(function (k) { p[k] = vert(k); setLine(E.rays[k], p[k], A); });
    setLine(E.sideL, p.B, p.C); setLine(E.sideR, p.D, p.E);
    E.triL.setAttribute('points', [A, p.B, p.C].join(' '));
    E.triR.setAttribute('points', [A, p.D, p.E].join(' '));
  }
  function arcPt(k) {                                   // point on the arc, in the direction of the ORIGINAL ray
    var dx = O[k][0] - A[0], dy = O[k][1] - A[1], l = Math.sqrt(dx * dx + dy * dy);
    return (A[0] + dx / l * R).toFixed(1) + ' ' + (A[1] + dy / l * R).toFixed(1);
  }
  function setNow(to) { K.forEach(function (k) { cur[k] = to[k]; }); place(); }
  function same(to) { return K.every(function (k) { return Math.abs(cur[k] - to[k]) < 1e-6; }); }
  function tween(to, ms) {
    var from = {}, t0 = null;
    K.forEach(function (k) { from[k] = cur[k]; });
    function frame(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / ms), e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      K.forEach(function (k) { cur[k] = from[k] + (to[k] - from[k]) * e; });
      place();
      if (p < 1) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
  }
  function css(el, s) { for (var k in s) el.style[k] = s[k]; return el; }

  Deck.register({
    id: 's03', title: 'Діаграма 1862 року', steps: 3, transition: 'fade',

    build: function (root) {
      var svg = Deck.layer(root);
      E.triL = css(Deck.sv('polygon', { 'class': 'fx' }, svg), { fill: 'var(--indiv)', fillOpacity: '.06' });
      E.triR = css(Deck.sv('polygon', { 'class': 'fx' }, svg), { fill: 'var(--indiv)', fillOpacity: '.06' });
      E.sideL = Deck.sv('line', { pathLength: 1, 'class': 'draw' }, svg);
      E.sideR = Deck.sv('line', { pathLength: 1, 'class': 'draw' }, svg);
      E.rays = {};
      K.forEach(function (k) { E.rays[k] = Deck.sv('line', { pathLength: 1, 'class': 'draw' }, svg); });
      E.arcL = css(Deck.sv('path', { d: 'M ' + arcPt('B') + ' A ' + R + ' ' + R + ' 0 0 0 ' + arcPt('C'), pathLength: 1, 'class': 'draw' }, svg),
        { stroke: 'var(--shared)', strokeWidth: '2', transition: 'stroke-dashoffset .6s ease-in-out' });
      E.arcR = css(Deck.sv('path', { d: 'M ' + arcPt('D') + ' A ' + R + ' ' + R + ' 0 0 1 ' + arcPt('E'), pathLength: 1, 'class': 'draw' }, svg),
        { stroke: 'var(--shared)', strokeWidth: '2', transition: 'stroke-dashoffset .6s ease-in-out' });
      place();

      E.halo = Deck.orb(root, 'halo', A[0], A[1], 60);          // same as the end of slide 2
      E.dot = Deck.orb(root, 'dot', A[0], A[1], 6);
      E.word = Deck.txt(root, 'serif it c-shared', 'слово', 960, 430, 40);

      // portrait + name + book (placeholder with initials if assets/potebnia.jpg is missing)
      E.who = css(Deck.mk('div', 'fx sans', root), { position: 'absolute', left: '80px', top: '120px', width: '340px' });
      var frame = css(Deck.mk('div', '', E.who), { position: 'relative', width: '240px', height: '300px',
        border: '1px solid var(--line)', background: 'var(--bg2)', overflow: 'hidden' });
      css(Deck.mk('div', 'serif c-muted', frame, 'О. П.'), { position: 'absolute', inset: '0', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: '84px', letterSpacing: '.06em' });
      var img = css(Deck.mk('img', '', frame), { position: 'absolute', inset: '0', width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: '50% 20%', display: 'none' });
      img.alt = 'Олександр Потебня';
      img.onload = function () { img.style.display = 'block'; };
      img.src = 'assets/potebnia.jpg';
      var name = css(Deck.mk('div', 'c-text', E.who), { marginTop: '30px', fontSize: '30px', lineHeight: '1.25' });
      css(Deck.mk('span', '', name, 'Олександр Потебня ·'), { display: 'block', whiteSpace: 'nowrap' });
      css(Deck.mk('span', '', name, '1835–1891 · Харків'), { display: 'block', whiteSpace: 'nowrap' });
      css(Deck.mk('div', 'c-muted', E.who, 'Мысль и язык, 1862 (рос.)'), { marginTop: '14px', fontSize: '24px' });

      E.cap = css(Deck.txt(root, 'serif c-text', '', 960, 880, 44), { lineHeight: '1.25' });
      Deck.mk('span', '', E.cap, 'Думки того, хто говорить, і того, хто слухає, збігаються лише в слові.').style.display = 'block';
      Deck.mk('span', 'c-indiv', E.cap, 'Решта — в кожного своя.').style.display = 'block';
      E.src = Deck.txt(root, 'sans c-muted', 'Потебня, «Мысль и язык», гл. VIII', 960, 965, 22);
      E.marks = Deck.marks(root);
    },

    setState: function (s, inst) {
      var V = Deck.show, rv = Deck.rv, first = s === 1, second = s === 2;
      cancelAnimationFrame(raf);
      var to = s >= 3 ? TARGET : ONE;
      if (inst || Deck.reduced || same(to)) setNow(to); else tween(to, TWEEN_MS);

      V(E.halo, true); V(E.dot, true);
      K.forEach(function (k) { V(E.rays[k], true); });      // entry = end of slide 2
      V(E.sideL, s >= 1); V(E.sideR, s >= 1);
      rv(E.triL, s >= 1, inst, first ? 400 : 0); rv(E.triR, s >= 1, inst, first ? 400 : 0);
      rv(E.word, s >= 1, inst, first ? 500 : 0);
      rv(E.who, s >= 1, inst, first ? PORTRAIT_DELAY_MS : 0);
      rv(E.cap, s >= 2, inst, 0); rv(E.src, s >= 2, inst, 0);
      rv(E.arcL, s >= 2, inst, second ? ARCS_DELAY_MS : 0); rv(E.arcR, s >= 2, inst, second ? ARCS_DELAY_MS : 0);
      E.marks.set(s >= 2 ? ['r', 'p'] : s >= 1 ? ['r'] : []);
    }
  });
})();
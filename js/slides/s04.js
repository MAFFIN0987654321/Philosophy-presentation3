/* js/slides/s04.js — Slide 4 «Іскра, а не посилка»
   Entry: one burning candle + three unlit ones + L1 + ПОТЕБНЯ
   Step 1: three sparks, candles light one by one, L2; L3 + ГУМБОЛЬДТ follow after a short delay */
(function () {
  'use strict';
  var L3_DELAY_MS = 2400;                       // L3 and its mark appear this long after step 1
  var WICK = 538;                               // flame base (top of the wick)
  var CX = [420, 880, 1220, 1560];              // candle centres: first burns, others are lit by sparks
  var FH = [90, 70, 100, 85];                   // flame heights
  var PERIOD = [2800, 3300, 3900, 3100];        // flicker periods, ms
  var SPARK_Y = [372, 346, 322];                // control-point heights of the three sparks
  var E = {}, candles = [], flames = [], sparks = [];

  function flamePath(h, w) {                    // teardrop: tip at (0,-h), round base at (0,0)
    function n(v) { return v.toFixed(1); }
    return 'M0 ' + n(-h) + ' C ' + n(.9 * w) + ' ' + n(-.55 * h) + ' ' + n(1.15 * w) + ' 0 0 0 C ' +
      n(-1.15 * w) + ' 0 ' + n(-.9 * w) + ' ' + n(-.55 * h) + ' 0 ' + n(-h) + ' Z';
  }
  function css(el, s) { for (var k in s) el.style[k] = s[k]; return el; }
  function lightDelay(i) { return (i - 1) * 250 + 600; }      // spark i-1 starts at (i-1)*250 and lasts 700 ms
  function light(i, on, delay) {
    var g = flames[i];
    g.style.transitionDelay = delay + 'ms';
    if (i === 0) g.style.opacity = on ? '1' : '0'; else g.style.transform = on ? 'scale(1)' : 'scale(0)';
  }

  Deck.register({
    id: 's04', title: 'Іскра, а не посилка', steps: 1, transition: 'fade',

    build: function (root) {
      var svg = Deck.layer(root), i;
      var defs = Deck.sv('defs', {}, svg);
      var grad = Deck.sv('linearGradient', { id: 's04-spark', x1: 0, y1: 0, x2: 1, y2: 0 }, defs);
      Deck.sv('stop', { offset: 0, 'stop-color': '#7FB2E5' }, grad);
      Deck.sv('stop', { offset: 1, 'stop-color': '#E3A857' }, grad);

      for (i = 0; i < 4; i++) {                 // candle bodies
        var g = Deck.sv('g', { 'class': 'fx' }, svg);
        Deck.sv('rect', { x: CX[i] - 32, y: 550, width: 64, height: 250, rx: 3, fill: '#151A22', stroke: '#8893A3', 'stroke-width': 1.5 }, g);
        Deck.sv('line', { x1: CX[i], y1: 550, x2: CX[i], y2: WICK, stroke: '#8893A3', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
        if (i > 0) g.style.setProperty('--o', '.35');
        candles.push(g);
      }
      for (i = 1; i < 4; i++) {                 // sparks: flame 1 tip -> wicks of the others
        var x1 = CX[0], x2 = CX[i], dx = (x2 - x1) * .25, cy = SPARK_Y[i - 1];
        var d = 'M ' + x1 + ' ' + (WICK - FH[0]) + ' C ' + (x1 + dx) + ' ' + cy + ' ' + (x2 - dx) + ' ' + (cy + 10) + ' ' + x2 + ' ' + (WICK - 8);
        sparks.push(css(Deck.sv('path', { d: d, pathLength: 1, 'class': 'draw' }, svg),
          { stroke: 'url(#s04-spark)', strokeWidth: '2.5', transition: 'stroke-dashoffset .7s ease-in-out' }));
      }
      for (i = 0; i < 4; i++) {                 // flames: pos (attr) > flick (infinite) > light (state)
        var pos = Deck.sv('g', { transform: 'translate(' + CX[i] + ' ' + WICK + ')' }, svg);
        var flick = Deck.sv('g', {}, pos), lg = Deck.sv('g', {}, flick), h = FH[i];
        css(Deck.sv('path', { d: flamePath(h, h * .27) }, lg), { fill: i ? 'var(--indiv)' : 'var(--shared)' });
        css(Deck.sv('path', { d: flamePath(h * .6, h * .15) }, lg), { fill: i ? '#F5D08A' : '#BFE0FF' });
        lg.style.transition = i ? 'transform .4s ease-in-out' : 'opacity .8s ease-in-out';
        lg.style.opacity = i ? '1' : '0';
        lg.style.transform = i ? 'scale(0)' : 'none';
        if (!Deck.reduced && flick.animate) flick.animate(
          [{ transform: 'scale(1,1) translateX(0px)' }, { transform: 'scale(1,.96) translateX(1px)' }],
          { duration: PERIOD[i], iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' });
        flames.push(lg);
      }

      E.l1 = Deck.txt(root, 'serif c-text', 'Слово не передає думку.', 960, 210, 56);
      E.l2 = Deck.txt(root, 'serif c-text', 'Воно запалює в іншому його власну.', 960, 290, 56);
      E.l3 = Deck.txt(root, 'sans c-muted', 'У кожному розумінні є й частка нерозуміння.', 960, 940, 32);
      E.marks = Deck.marks(root);
    },

    setState: function (s, inst) {
      var V = Deck.show, rv = Deck.rv, lit = s >= 1, anim = !inst && s === 1, i;
      V(candles[0], s >= 0); light(0, s >= 0, 0);
      rv(E.l1, s >= 0, inst, 0);
      for (i = 1; i < 4; i++) {
        rv(candles[i], s >= 0, inst, s === 0 ? 600 : 0);
        candles[i].style.transitionDelay = (anim ? lightDelay(i) : 0) + 'ms';
        candles[i].style.setProperty('--o', lit ? '1' : '.35');
        light(i, lit, anim ? lightDelay(i) : 0);
        sparks[i - 1].style.transitionDelay = (anim ? (i - 1) * 250 : 0) + 'ms';
        V(sparks[i - 1], lit);
      }
      rv(E.l2, lit, inst, 0);
      rv(E.l3, lit, inst, anim ? L3_DELAY_MS : 0);
      E.marks.set(s < 0 ? [] : ['p']);
      if (lit) {
        if (anim) Deck.stag(function () { E.marks.set(['p', 'h']); }, L3_DELAY_MS);
        else E.marks.set(['p', 'h']);
      }
    }
  });
})();
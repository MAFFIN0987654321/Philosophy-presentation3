/* js/slides/s08.js — Slide 8 «Коло мови»
   Entry: «ХАТА», rings drawn from the centre outward; L1 + ГУМБОЛЬДТ follow after a delay
   Step 1: amber spark shifts the second ring; blue point outside the rings and L2 follow after a delay */
(function () {
  'use strict';
  var L1_DELAY_MS = 9000;          // L1 + mark after entry (≈ «Цю думку Потебня викладає услід за Гумбольдтом…»)
  var L2_DELAY_MS = 6000;          // outer point + L2 after step 1 (≈ «себе ми розуміємо…»)
  var C = [960, 470];              // centre (moved up 30 px so that the outer ring clears L1)
  var RADII = [160, 280, 400], OPAC = [.5, .35, .22];
  var SPARK = [260, -150];         // spark travel: centre -> just beyond ring 2
  var OUT = [1500, 500];           // point outside the rings
  var E = { rings: [], groups: [] };

  function css(el, s) { for (var k in s) el.style[k] = s[k]; return el; }

  Deck.register({
    id: 's08', title: 'Коло мови', steps: 1, transition: 'fade',

    build: function (root) {
      var svg = Deck.layer(root);
      RADII.forEach(function (r, i) {
        var g = css(Deck.sv('g', {}, svg), { transformBox: 'fill-box', transformOrigin: '50% 50%', transition: 'transform .6s ease-in-out' });
        var c = Deck.sv('circle', { cx: C[0], cy: C[1], r: r, pathLength: 1, 'class': 'draw' }, g);
        css(c, { stroke: 'var(--shared)', opacity: OPAC[i], transition: 'stroke-dashoffset .6s ease-in-out' });
        E.groups.push(g); E.rings.push(c);
      });
      E.trail = Deck.sv('line', { x1: C[0] + 113, y1: C[1] - 65, x2: C[0] + SPARK[0], y2: C[1] + SPARK[1], pathLength: 1, 'class': 'draw' }, svg);
      css(E.trail, { opacity: '.4', transition: 'stroke-dashoffset .9s ease-in' });
      E.link = Deck.sv('line', { x1: OUT[0] - 8, y1: OUT[1] - 2, x2: 1110, y2: C[1] + 6, pathLength: 1, 'class': 'draw' }, svg);
      css(E.link, { stroke: 'var(--shared)', opacity: '.7' });

      E.word = Deck.txt(root, 'serif c-text hero', 'ХАТА', C[0], C[1], 90);
      E.spark = Deck.orb(root, 'dot', C[0], C[1], 8);
      css(E.spark, { background: 'var(--indiv)', transform: 'translate(0,0)', transition: 'opacity .4s ease-in-out, transform .9s ease-in' });
      E.out = Deck.orb(root, 'dot', OUT[0], OUT[1], 7);
      E.l1 = Deck.txt(root, 'serif c-text', 'Слово — спадок поколінь, але кожне вживання трохи змінює мову.', 960, 920, 40);
      E.l2 = Deck.txt(root, 'serif c-text', 'Себе ми розуміємо, перевіряючи слова на інших.', 960, 985, 40);
      E.marks = Deck.marks(root);
    },

    setState: function (s, inst) {
      var V = Deck.show, rv = Deck.rv, e = s === 0, go = !inst && s === 1;
      rv(E.word, s >= 0, inst, 0);
      E.rings.forEach(function (c, i) { c.style.transitionDelay = (e ? i * 200 : 0) + 'ms'; V(c, s >= 0); });
      rv(E.l1, s >= 0, inst, e ? L1_DELAY_MS : 0);
      E.marks.set(s >= 1 || (s === 0 && inst) ? ['h'] : []);
      if (e) Deck.stag(function () { E.marks.set(['h']); }, L1_DELAY_MS);

      V(E.spark, s >= 1);
      E.spark.style.transform = s >= 1 ? 'translate(' + SPARK[0] + 'px,' + SPARK[1] + 'px)' : 'translate(0,0)';
      E.trail.style.transitionDelay = '0ms'; V(E.trail, s >= 1);
      E.groups[1].style.transitionDelay = go ? '700ms' : '0ms';
      E.groups[1].style.transform = s >= 1 ? 'translate(10px,-6px) scale(1.02)' : 'none';
      rv(E.out, s >= 1, inst, go ? L2_DELAY_MS : 0);
      rv(E.link, s >= 1, inst, go ? L2_DELAY_MS : 0);
      rv(E.l2, s >= 1, inst, go ? L2_DELAY_MS : 0);
    }
  });
})();
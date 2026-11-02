/* js/slides/s02.js — Slide 2 «Одне слово. Два світи». Steps: 1 images cascade + caption · 2 collapse to the point */
(function () {
  'use strict';
  var SMALL = 'translateY(-20px) scale(.3733)';            // 300 px -> 112 px, centre (960,480)
  var A = [960, 480];
  var ENDS = [[440, 250], [440, 710], [1480, 250], [1480, 710]];
  var WORDS = [['мама', 520, 330], ['піч', 430, 450], ['вишні', 450, 570], ['біла стіна', 560, 690],
               ['ключі', 1400, 330], ['іпотека', 1490, 450], ['ремонт', 1470, 570], ['сусіди', 1360, 690]];
  var E = {};

  Deck.register({
    id: 's02', title: 'Одне слово. Два світи', steps: 2, transition: 'cut',

    build: function (root) {
      var svg = Deck.layer(root);
      E.lines = ENDS.map(function (p) {
        return Deck.sv('line', { x1: p[0], y1: p[1], x2: A[0], y2: A[1], pathLength: 1, 'class': 'draw' }, svg);
      });
      E.bigHalo = Deck.orb(root, 'halo', 960, 500, 380);   // continues the halo of slide 1
      E.halo = Deck.orb(root, 'halo', A[0], A[1], 60);
      E.dot = Deck.orb(root, 'dot', A[0], A[1], 6);
      E.word = Deck.txt(root, 'serif c-text hero', 'ХАТА', 960, 500, 300);
      E.words = WORDS.map(function (w) {
        var e = Deck.txt(root, 'serif it c-indiv', w[0], w[1], w[2], 44);
        e.style.setProperty('--dx', '16px');
        return e;
      });
      E.cap = Deck.txt(root, 'serif c-text', 'Слово — одне. Образи — різні.', 960, 860, 44);
      E.marks = Deck.marks(root);
    },

    setState: function (s, inst) {
      var V = Deck.show, rv = Deck.rv;
      V(E.bigHalo, s === -1);
      V(E.word, s < 2);
      E.word.style.transform = s >= 0 ? SMALL : '';
      V(E.halo, s >= 2); V(E.dot, s >= 2);
      E.lines.forEach(function (l) { V(l, s >= 2); });
      E.words.forEach(function (w, i) { rv(w, s === 1, inst, (i > 3 ? 900 : 0) + (i % 4) * 220); });
      rv(E.cap, s === 1, inst, 2300);
      E.marks.set(s >= 1 ? ['a'] : []);
    }
  });
})();
/* js/slides/s10.js — Slide 10 «Спільна точка»
   Entry: point → word «ХАТА», clouds, blue line, L1; L2 follows after a delay
   Step 1: clouds fade, L3 + ПОТЕБНЯ
   Step 2: L1–L3 fade out, closing question */
(function () {
  'use strict';
  var L2_DELAY_MS = 6000;          // «Решту кожен добудовує сам.» after entry
  var WORDS = [['мама', 520, 330], ['піч', 430, 450], ['вишні', 450, 570], ['біла стіна', 560, 690],
               ['ключі', 1400, 330], ['іпотека', 1490, 450], ['ремонт', 1470, 570], ['сусіди', 1360, 690]];
  var E = { clouds: [], lines: [] };

  Deck.register({
    id: 's10', title: 'Спільна точка', steps: 2, transition: 'fade',

    build: function (root) {
      var svg = Deck.layer(root);
      [[520, 765], [1155, 1400]].forEach(function (s) {
        var l = Deck.sv('line', { x1: s[0], y1: 470, x2: s[1], y2: 470, pathLength: 1, 'class': 'draw' }, svg);
        l.style.stroke = 'var(--shared)'; l.style.opacity = '.7';
        E.lines.push(l);
      });
      E.halo = Deck.orb(root, 'halo', 960, 470, 90);
      E.dot = Deck.orb(root, 'dot', 960, 470, 6);
      E.word = Deck.txt(root, 'serif c-text hero', 'ХАТА', 960, 470, 112);
      WORDS.forEach(function (w) {
        var e = Deck.txt(root, 'serif it c-indiv', w[0], w[1], w[2], 44);
        e.style.setProperty('--o', '.18');
        E.clouds.push(e);
      });
      E.l1 = Deck.txt(root, 'serif c-text', 'Слово не несе думку. Воно дає точку зустрічі.', 960, 760, 48);
      E.l2 = Deck.txt(root, 'serif c-text', 'Решту кожен добудовує сам.', 960, 830, 44);
      E.l3 = Deck.txt(root, 'serif c-text', 'Слово — спосіб зрозуміти іншого. І спосіб зрозуміти себе.', 960, 910, 36);
      E.final = Deck.txt(root, 'serif it c-text', 'А що ви побачили у слові «хата»?', 960, 810, 60);
      E.marks = Deck.marks(root);
    },

    setState: function (s, inst) {
      var V = Deck.show, rv = Deck.rv, e = s === 0;
      V(E.halo, s >= 0); V(E.dot, s >= 0);
      rv(E.word, s >= 0, inst, e ? 600 : 0);
      E.clouds.forEach(function (c, i) {
        c.style.setProperty('--o', s >= 1 ? '.08' : '.18');
        rv(c, s >= 0, inst, e ? 1000 + i * 100 : 0);
      });
      E.lines.forEach(function (l) { rv(l, s >= 0, inst, e ? 1600 : 0); });
      rv(E.l1, s >= 0 && s < 2, inst, e ? 2400 : 0);
      rv(E.l2, s >= 0 && s < 2, inst, e ? L2_DELAY_MS : 0);
      rv(E.l3, s === 1, inst, 0);
      rv(E.final, s >= 2, inst, !inst && s === 2 ? 500 : 0);
      E.marks.set(s >= 1 ? ['p'] : []);
    }
  });
})();
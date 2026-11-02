/* js/slides/s06.js — Slide 6 «Одна ознака — багато образів»
   Entry: glowing point; three cards, lines and caption cascade in (0.3 s step); ПОТЕБНЯ
   Step 1: «не горить, а тліє» + «вогонь» — «життя» connected by a shared feature */
(function () {
  'use strict';
  var P = [960, 470];
  var CARDS = [
    ['веселка', 'від кореня «світити» — за Потебнею', 380, 330, [520, 408]],
    ['красна пані', 'народна назва', 960, 230, [960, 305]],
    ['tęcza', 'польськ. — «п’є воду», за Потебнею', 1540, 330, [1400, 408]]
  ];
  var E = { cards: [], lines: [] };

  Deck.register({
    id: 's06', title: 'Одна ознака — багато образів', steps: 1, transition: 'fade',

    build: function (root) {
      var svg = Deck.layer(root);
      CARDS.forEach(function (c) {
        var l = Deck.sv('line', { x1: P[0], y1: P[1], x2: c[4][0], y2: c[4][1], pathLength: 1, 'class': 'draw' }, svg);
        l.style.stroke = 'var(--shared)'; l.style.opacity = '.6';
        E.lines.push(l);
      });
      E.fLine = Deck.sv('line', { x1: 670, y1: 730, x2: 1250, y2: 730, pathLength: 1, 'class': 'draw' }, svg);
      E.fLine.style.stroke = 'var(--shared)';

      E.halo = Deck.orb(root, 'halo', P[0], P[1], 44);
      E.dot = Deck.orb(root, 'dot', P[0], P[1], 6);
      CARDS.forEach(function (c) {
        E.cards.push([Deck.txt(root, 'serif c-text', c[0], c[2], c[3] - 14, 72), Deck.txt(root, 'sans c-muted', c[1], c[2], c[3] + 44, 26)]);
      });
      E.cap = Deck.txt(root, 'serif c-text', 'Одне явище. Різні образи.', 960, 640, 44);

      E.phrase = Deck.txt(root, 'serif it c-text', 'не горить, а тліє', 960, 830, 64);
      E.fire = Deck.txt(root, 'serif it c-indiv', 'вогонь', 600, 730, 36);
      E.life = Deck.txt(root, 'serif it c-indiv', 'життя', 1320, 730, 36);
      E.feat = Deck.txt(root, 'sans c-muted', 'спільна ознака', 960, 730, 22);
      E.feat.style.cssText += ';background:var(--bg);padding:0 16px';
      E.marks = Deck.marks(root);
    },

    setState: function (s, inst) {
      var V = Deck.show, rv = Deck.rv, e = s === 0;
      V(E.halo, s >= 0); V(E.dot, s >= 0);
      E.marks.set(s >= 0 ? ['p'] : []);
      E.cards.forEach(function (c, i) { rv(c[0], s >= 0, inst, e ? 600 + i * 300 : 0); rv(c[1], s >= 0, inst, e ? 700 + i * 300 : 0); });
      E.lines.forEach(function (l, i) { rv(l, s >= 0, inst, e ? 1500 + i * 150 : 0); });
      rv(E.cap, s >= 0, inst, e ? 2300 : 0);
      rv(E.phrase, s >= 1, inst, 0);
      rv(E.fire, s >= 1, inst, !inst && s === 1 ? 500 : 0); rv(E.life, s >= 1, inst, !inst && s === 1 ? 500 : 0);
      rv(E.fLine, s >= 1, inst, !inst && s === 1 ? 900 : 0); rv(E.feat, s >= 1, inst, !inst && s === 1 ? 1500 : 0);
    }
  });
})();
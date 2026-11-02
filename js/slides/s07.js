/* js/slides/s07.js — Slide 7 «Слово будує думку»
   Entry: title, point «Чичиков», three nodes with lines (250 ms step), source, ПОТЕБНЯ
   Step 1: proverb (lines dim to .5); the closing note follows after a delay */
(function () {
  'use strict';
  var NOTE_DELAY_MS = 14000;       // «Думка буває й без слів…» after step 1 (end of the ▶3 passage)
  var C = [960, 500];
  var NODES = [
    ['лікар', 'хворі', 400, 330, 'M 952 496 Q 720 520 505 345'],
    ['голова палати', 'купча', 1520, 330, 'M 968 496 Q 1230 440 1415 345'],
    ['поштмейстер', 'Копєйкін', 960, 780, 'M 960 508 Q 1010 610 960 715']
  ];
  var E = { lines: [], roles: [], words: [] };

  Deck.register({
    id: 's07', title: 'Слово будує думку', steps: 1, transition: 'fade',

    build: function (root) {
      var svg = Deck.layer(root);
      NODES.forEach(function (n) {
        var p = Deck.sv('path', { d: n[4], pathLength: 1, 'class': 'draw' }, svg);
        p.style.transition = 'stroke-dashoffset .9s ease-in-out, opacity .7s ease-in-out';
        E.lines.push(p);
      });
      E.title = Deck.txt(root, 'serif c-text', 'Одне враження — різні пояснення.', 960, 130, 48);
      E.dot = Deck.orb(root, 'dot', C[0], C[1], 8);
      E.dot.style.background = 'var(--text)';
      E.who = Deck.txt(root, 'sans c-muted', 'Чичиков', C[0], 458, 22);
      NODES.forEach(function (n) {
        E.roles.push(Deck.txt(root, 'sans c-muted', n[0], n[2], n[3] - 42, 24));
        E.words.push(Deck.txt(root, 'serif c-indiv', n[1], n[2], n[3] + 8, 64));
      });
      E.src = Deck.txt(root, 'sans c-muted', 'приклад Потебні: Гоголь, «Мертві душі»', 96, 992, 22);
      E.src.parentNode.style.justifyContent = 'flex-start';
      E.proverb = Deck.txt(root, 'serif it c-text', 'Пугана ворона й куща боїться', 960, 930, 52);
      E.note = Deck.txt(root, 'sans c-muted', 'Думка буває й без слів. Але поняття без слова не постає.', 960, 1025, 28);
      E.marks = Deck.marks(root);
    },

    setState: function (s, inst) {
      var V = Deck.show, rv = Deck.rv, e = s === 0;
      rv(E.title, s >= 0, inst, 0);
      V(E.dot, s >= 0); rv(E.who, s >= 0, inst, 0);
      E.marks.set(s >= 0 ? ['p'] : []);
      NODES.forEach(function (n, i) {
        rv(E.lines[i], s >= 0, inst, e ? 600 + i * 250 : 0);
        rv(E.roles[i], s >= 0, inst, e ? 900 + i * 250 : 0);
        rv(E.words[i], s >= 0, inst, e ? 900 + i * 250 : 0);
        E.lines[i].style.opacity = s >= 1 ? '.5' : '1';
      });
      rv(E.src, s >= 0, inst, e ? 1900 : 0);
      rv(E.proverb, s >= 1, inst, 0);
      rv(E.note, s >= 1, inst, !inst && s === 1 ? NOTE_DELAY_MS : 0);
    }
  });
})();
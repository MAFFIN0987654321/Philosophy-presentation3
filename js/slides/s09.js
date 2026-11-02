/* js/slides/s09.js — Slide 9 «Що це дає сьогодні — і де межа»
   Entry: dividing line, left half («плата» → three images, caption); ПОТЕБНЯ; line «Сьогодні…» + ІНТЕРПРЕТАЦІЯ after a delay
   Step 1: right half («Не слід казати:» + three items); the criticism line follows after a delay */
(function () {
  'use strict';
  var LINE_L_DELAY_MS = 12000;     // «Сьогодні: переклад · діалог…» + mark after entry (≈ «Тому ця теорія допомагає…»)
  var BOTTOM_DELAY_MS = 11000;     // «Критика: Шкловський, Шпет» after step 1
  var P = [480, 420];
  var WORDS = [['жалування', 240, 600], ['pensio', 480, 650], ['gage', 720, 600]];
  var RIGHT = [['що мова — це й є мислення', 400], ['що Потебня передбачив когнітивну науку', 480], ['що ми ніколи не розуміємо одне одного', 560]];
  var E = { lines: [], words: [], items: [] };

  Deck.register({
    id: 's09', title: 'Що це дає сьогодні — і де межа', steps: 1, transition: 'fade',

    build: function (root) {
      var svg = Deck.layer(root);
      E.vline = Deck.sv('line', { x1: 960, y1: 120, x2: 960, y2: 960, pathLength: 1, 'class': 'draw' }, svg);
      E.vline.style.stroke = '#3A4452'; E.vline.style.strokeWidth = '2';
      WORDS.forEach(function (w) {
        var l = Deck.sv('line', { x1: P[0], y1: P[1] + 8, x2: w[1], y2: w[2] - 36, pathLength: 1, 'class': 'draw' }, svg);
        l.style.opacity = '.6';
        E.lines.push(l);
      });
      E.border = Deck.txt(root, 'sans c-muted', 'межа', 996, 540, 24);
      E.border.parentNode.style.transform = 'rotate(90deg)';

      E.halo = Deck.orb(root, 'halo', P[0], P[1], 44);
      E.dot = Deck.orb(root, 'dot', P[0], P[1], 7);
      E.plata = Deck.txt(root, 'serif c-shared', 'плата', P[0], 366, 60);
      WORDS.forEach(function (w) { E.words.push(Deck.txt(root, 'serif it c-indiv', w[0], w[1], w[2], 52)); });
      E.capL = Deck.txt(root, 'serif c-text', 'Один зміст — різні образи.', 480, 780, 36);
      E.lineL = Deck.txt(root, 'sans c-text', 'Сьогодні: переклад · діалог · поетичний образ', 480, 860, 26);

      E.head = Deck.txt(root, 'serif c-muted', 'Не слід казати:', 1440, 300, 40);
      RIGHT.forEach(function (r) { E.items.push(Deck.txt(root, 'sans c-muted', r[0], 1440, r[1], 34)); });
      E.bottom = Deck.txt(root, 'sans c-muted', 'Критика: Шкловський, Шпет', 1440, 900, 28);
      E.marks = Deck.marks(root);
    },

    setState: function (s, inst) {
      var V = Deck.show, rv = Deck.rv, e = s === 0, go = !inst && s === 1;
      V(E.vline, s >= 0); rv(E.border, s >= 0, inst, e ? 400 : 0);
      V(E.halo, s >= 0); V(E.dot, s >= 0);
      rv(E.plata, s >= 0, inst, e ? 300 : 0);
      E.lines.forEach(function (l, i) { rv(l, s >= 0, inst, e ? 800 + i * 200 : 0); });
      E.words.forEach(function (w, i) { rv(w, s >= 0, inst, e ? 1000 + i * 250 : 0); });
      rv(E.capL, s >= 0, inst, e ? 2000 : 0);
      rv(E.lineL, s >= 0, inst, e ? LINE_L_DELAY_MS : 0);
      E.marks.set(s >= 1 || (s === 0 && inst) ? ['p', 'i'] : s >= 0 ? ['p'] : []);
      if (e && !inst) Deck.stag(function () { E.marks.set(['p', 'i']); }, LINE_L_DELAY_MS);

      rv(E.head, s >= 1, inst, 0);
      E.items.forEach(function (it, i) { rv(it, s >= 1, inst, go ? 400 + i * 300 : 0); });
      rv(E.bottom, s >= 1, inst, go ? BOTTOM_DELAY_MS : 0);
    }
  });
})();
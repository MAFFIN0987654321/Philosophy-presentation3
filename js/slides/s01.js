/* js/slides/s01.js — Slide 1 «Слово». Steps: 0 dot · 1 word + captions · 2 question (+ auto focus) */
(function () {
  'use strict';
  var FOCUS_AFTER_MS = 9000;   // dim captions this long after the question appears; 0 = never
  var E = {};

  Deck.register({
    id: 's01', title: 'Слово', steps: 2, transition: 'cut',

    build: function (root) {
      E.halo = Deck.orb(root, 'halo', 960, 500, 380);
      E.dot = Deck.orb(root, 'dot', 960, 500, 4);
      E.word = Deck.txt(root, 'serif c-text hero open-in', 'ХАТА', 960, 500, 300);
      E.top = Deck.txt(root, 'sans c-muted', 'Філософія мови О. О. Потебні', 960, 130, 26);
      E.bottom = Deck.txt(root, 'sans c-muted', 'за працею «Мысль и язык», 3-є вид., Харків, 1913', 960, 1010, 22);
      E.sub = Deck.txt(root, 'sans c-text', 'Ми чуємо слово. Але чи чуємо ми одне одного?', 960, 760, 40);
    },

    setState: function (s, inst) {
      var V = Deck.show, rv = Deck.rv, caps = [E.top, E.bottom, E.sub];
      E.halo.classList.remove('hi');
      V(E.halo, s >= 0);
      E.halo.style.transform = s < 1 ? 'scale(.12)' : '';
      V(E.dot, s === 0);
      V(E.word, s >= 1);
      rv(E.top, s >= 1, inst, s === 1 ? 600 : 0);
      rv(E.bottom, s >= 1, inst, s === 1 ? 1500 : 0);
      rv(E.sub, s >= 2, inst, 0);
      caps.forEach(function (e) { e.classList.toggle('dim', s >= 2 && inst); });
      if (s >= 2 && !inst && FOCUS_AFTER_MS) Deck.later(function () {
        caps.forEach(function (e) { e.classList.add('dim'); });
        E.halo.classList.add('hi');
        Deck.later(function () { E.halo.classList.remove('hi'); }, 1200);
      }, FOCUS_AFTER_MS);
    }
  });
})();
/* js/slides/s05.js — Slide 5 «Три шари слова» (CSS-3D is used only on this slide)
   Entry: whole word «вікно» + ПОТЕБНЯ + note
   Step 1: the word splits; letters (sound) on the front plane, «око» (image) follows after a delay
   Step 2: content plane with four amber words + ПРИКЛАД АВТОРА; brackets «спільне / своє» follow after a delay */
(function () {
  'use strict';
  var SOUND_LABEL_MS = 700;        // «звук — зовнішня форма» after step 1
  var EYE_DELAY_MS = 8000;         // «око» + «образ — внутрішня форма» after step 1 (≈ «…походить від «око»»)
  var BRACKETS_DELAY_MS = 12000;   // brackets after step 2 (≈ «Тож спільне в слові…»)
  var PW = 720, PH = 170;          // plane size
  var STACK_ON = 'translateX(-110px) rotateX(-14deg) rotateY(-20deg)';
  var T0 = 'translate3d(0,0,0)', T1 = 'translate3d(0,-190px,90px)', T3 = 'translate3d(0,190px,-90px)';
  // screen geometry of the tilted stack (measured): label rows and bracket spans, canvas px
  var ROW = [292, 476, 640];
  var BR_X = 1300, LBL_X = 1380;
  var BR1 = [200, 570], BR3 = [590, 735];
  var E = {}, P = [];

  function css(el, s) { for (var k in s) el.style[k] = s[k]; return el; }
  function plane(parent) {
    var el = css(Deck.mk('div', '', parent), { position: 'absolute', left: (-PW / 2) + 'px', top: (-PH / 2) + 'px',
      width: PW + 'px', height: PH + 'px', transform: T0, transition: 'transform .9s ease-in-out' });
    var frame = css(Deck.mk('div', 'fx', el), { position: 'absolute', left: '0', top: '0', width: '100%', height: '100%',
      border: '1px solid #3A4452', background: 'rgba(20,24,31,.6)' });
    return { el: el, frame: frame };
  }
  function label(root, cls, text, x, y, size) {              // left-aligned label centred on y
    return css(Deck.mk('div', 'fx sans ' + cls, root, text), { position: 'absolute', left: x + 'px', top: (y - size / 2) + 'px',
      fontSize: size + 'px', lineHeight: '1', whiteSpace: 'nowrap' });
  }
  function bracket(svg, y1, y2, color) {
    return css(Deck.sv('path', { d: 'M ' + (BR_X - 14) + ' ' + y1 + ' H ' + BR_X + ' V ' + y2 + ' H ' + (BR_X - 14), pathLength: 1, 'class': 'draw' }, svg),
      { stroke: color, strokeWidth: '2' });
  }
  function side(root, cls, text, y1, y2) {                   // vertical caption next to a bracket
    var t = Deck.txt(root, 'sans ' + cls, text, BR_X + 24, (y1 + y2) / 2, 24);
    t.parentNode.style.transform = 'rotate(-90deg)';
    return t;
  }

  Deck.register({
    id: 's05', title: 'Три шари слова', steps: 2, transition: 'fade',

    build: function (root) {
      var scene = css(Deck.mk('div', '', root), { position: 'absolute', left: '0', top: '0', width: '1920px', height: '1080px', perspective: '1600px' });
      E.stack = css(Deck.mk('div', '', scene), { position: 'absolute', left: '960px', top: '470px', width: '0', height: '0',
        transformStyle: 'preserve-3d', transition: 'transform .9s ease-in-out' });
      P = [plane(E.stack), plane(E.stack), plane(E.stack)];

      E.whole = Deck.txt(P[0].el, 'serif c-text hero', 'вікно', PW / 2, PH / 2, 260);
      E.whole.style.transition = 'opacity .35s ease-in-out';   // the whole word clears quickly while the planes separate
      E.letters = Deck.txt(P[0].el, 'serif c-text', 'в · і · к · н · о', PW / 2, PH / 2, 96);
      E.eye = Deck.txt(P[1].el, 'serif c-shared', 'око', PW / 2, PH / 2, 150);
      E.words = [['рама', 110, 62, 7000], ['скло', 270, 108, 8200], ['світло', 450, 66, 6200], ['двір', 610, 104, 9000]].map(function (w, i) {
        var e = Deck.txt(P[2].el, 'serif c-indiv', w[0], w[1], w[2], 56);
        if (!Deck.reduced && e.parentNode.animate) e.parentNode.animate(
          [{ transform: 'translate(0,0)' }, { transform: 'translate(' + (i % 2 ? -8 : 8) + 'px,' + (i < 2 ? -8 : 8) + 'px)' }],
          { duration: w[3], iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' });
        return e;
      });

      E.lblSound = label(root, 'c-text', 'звук — зовнішня форма', LBL_X, ROW[0], 30);
      E.lblImage = label(root, 'c-shared', 'образ — внутрішня форма', LBL_X, ROW[1], 30);
      E.lblContent = label(root, 'c-indiv', 'зміст — у кожного свій', LBL_X, ROW[2], 30);

      var svg = Deck.layer(root);
      E.br1 = bracket(svg, BR1[0], BR1[1], 'var(--shared)');
      E.br3 = bracket(svg, BR3[0], BR3[1], 'var(--indiv)');
      E.side1 = side(root, 'c-shared', 'спільне', BR1[0], BR1[1]);
      E.side3 = side(root, 'c-indiv', 'своє', BR3[0], BR3[1]);

      E.note = Deck.txt(root, 'sans c-muted', 'приклад Потебні (рос. «окно»); укр. «вікно» — за ЕСУМ', 960, 1010, 22);
      E.marks = Deck.marks(root);
    },

    setState: function (s, inst) {
      var V = Deck.show, rv = Deck.rv, one = s === 1, two = s === 2;
      E.stack.style.transform = s >= 1 ? STACK_ON : 'none';
      P[0].el.style.transform = s >= 1 ? T1 : T0;
      P[2].el.style.transform = s >= 2 ? T3 : T0;
      V(E.whole, s === 0);
      V(P[0].frame, s >= 1); V(P[1].frame, s >= 1); V(P[2].frame, s >= 2);
      rv(E.letters, s >= 1, inst, one ? 300 : 0);
      rv(E.lblSound, s >= 1, inst, one ? SOUND_LABEL_MS : 0);
      rv(E.eye, s >= 1, inst, one ? EYE_DELAY_MS : 0);
      rv(E.lblImage, s >= 1, inst, one ? EYE_DELAY_MS : 0);
      E.words.forEach(function (w, i) { rv(w, s >= 2, inst, two ? 400 + i * 250 : 0); });
      rv(E.lblContent, s >= 2, inst, two ? 400 : 0);
      [E.br1, E.br3, E.side1, E.side3].forEach(function (e) { rv(e, s >= 2, inst, two ? BRACKETS_DELAY_MS : 0); });
      rv(E.note, s >= 0, inst, 0);
      E.marks.set(s >= 2 ? ['p', 'a'] : s >= 0 ? ['p'] : []);
    }
  });
})();
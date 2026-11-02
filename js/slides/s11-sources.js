/* js/slides/s11-sources.js — hidden slide «Джерела й застереження» (key S; Esc / S closes; not numbered) */
(function () {
  'use strict';
  var COL1 = [
    ['1. О. Потебня. «Мысль и язык». 3-є вид. Харків, 1913 (VII + 225 с.). Оцифрування: ', 'crecleco.seriot.ch/textes/POTEBNJA-MiJaz/', ''],
    ['2. Першодрук: «Журнал Министерства народного просвещения», 1862, ч. 113–114; окремий відбиток: СПб., 1862, 191 с. (', 'rusneb.ru/catalog/000200_000018_v19_rc_1296073/', ')'],
    ['3. Видання й коментарі: ', 'gumer.info/bibliotek_Buks/Linguist/poteb/11.php', '']
  ];
  var COL2 = [
    ['4. А. Зализняк. «Внутренняя форма слова» (Кругосвет): ', 'krugosvet.ru/enc/gumanitarnye_nauki/lingvistika/VNUTRENNYAYA_FORMA_SLOVA.html', ''],
    ['5. І. Пильщиков. «Внутренняя форма слова» в теориях поэтического языка. «Критика и семиотика», вип. 21: ', 'fehu.philology.nsc.ru/journals/kis/pdf/CS_21/cs021pilshikov_1.pdf', ''],
    ['6. Г. Шпет. «Внутренняя форма слова». М., 1927; В. Шкловский. «Искусство как прием» (1917)', '', ''],
    ['7. Етимологічний словник української мови, т. 1 (К., 1982), ст. «вікно»; веб-передрук: ', 'goroh.pp.ua/Етимологія/вікно', '']
  ];
  var WARN = [
    'Потебня писав «Мысль и язык» російською; українські формулювання — переклад автора презентації.',
    'Схема двох трикутників — візуальна реконструкція текстового опису.',
    'Етимології Потебні — його історичні тлумачення.',
    'Формула про розуміння й нерозуміння — Гумбольдта; приклад «хата» — авторський.'
  ];

  function css(el, s) { for (var k in s) el.style[k] = s[k]; return el; }
  function column(root, x, title, items) {
    var box = css(Deck.mk('div', 'sans', root), { position: 'absolute', left: x + 'px', top: '230px', width: '780px', fontSize: '22px', lineHeight: '1.45' });
    css(Deck.mk('div', 'serif c-indiv', box, title), { fontSize: '36px', marginBottom: '18px', lineHeight: '1.1' });
    items.forEach(function (it) {
      var p = css(Deck.mk('p', '', box), { margin: '0 0 16px', overflowWrap: 'anywhere' });
      p.appendChild(document.createTextNode(it[0]));
      if (it[1]) Deck.mk('span', 'c-shared', p, it[1]);
      if (it[2]) p.appendChild(document.createTextNode(it[2]));
    });
  }

  Deck.register({
    id: 's11', title: 'Джерела', steps: 0, transition: 'cut', hidden: true,

    build: function (root) {
      css(Deck.mk('h1', 'serif c-text', root, 'Джерела й застереження'), { position: 'absolute', left: '96px', top: '96px', margin: '0', fontSize: '48px', fontWeight: '500', lineHeight: '1.1' });
      column(root, 96, 'Первинне', COL1);
      column(root, 1044, 'Дослідження', COL2);
      var w = css(Deck.mk('div', 'sans c-muted', root), { position: 'absolute', left: '96px', top: '800px', width: '1728px', fontSize: '20px', lineHeight: '1.5' });
      css(Deck.mk('div', 'c-text', w, 'Застереження'), { fontSize: '22px', fontWeight: '500', marginBottom: '6px' });
      WARN.forEach(function (t) { Deck.mk('div', '', w, '• ' + t); });
    },

    setState: function () {}
  });
})();
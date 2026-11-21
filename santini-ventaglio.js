/* santini-teca.js  (v2)
   Teca illuminata per Santini Collezione 1 e 2, al posto della foto della scheda.
   - Teca buia con cornice dorata: dentro, il retro del santino quasi al buio.
   - Un tocco accende i 5 ceri uno per uno; la luce dall'alto rivela il santino.
   - Un santino alla volta: frecce, scorrimento col dito o clic su un cero.
   - Un tocco sul santino (o sulla lente) lo ingrandisce a tutto schermo; un altro tocco lo richiude.
   Si aggancia alle schede create da app.js (article.card[data-id=...]). */
(function () {
  'use strict';

  var BACK = 'img/santini/santini-retro.png';
  var SETS = {
    'santini-collezione-1': [
      { n: 'Madonna delle Pastiglie', f: 'img/santini/scheda-1-madonna-delle-pastiglie.jpg' },
      { n: 'San Basato',              f: 'img/santini/scheda-2-san-basato.jpg' },
      { n: 'San Metilene',            f: 'img/santini/scheda-3-san-metilene.jpg' },
      { n: 'San Pezzata',             f: 'img/santini/scheda-4-san-pezzata.jpg' },
      { n: 'Santo Isomero S',         f: 'img/santini/scheda-5-santo-isomero-s.jpg' }
    ],
    'santini-collezione-2': [
      { n: 'Santino Karate',  f: 'img/santini-nobg/santini-karate.png' },
      { n: 'San Richiamino',  f: 'img/santini-nobg/santini-san-richiamino.png' },
      { n: 'San Sinapsi',     f: 'img/santini-nobg/santini-san-sinapsi.png' },
      { n: 'San Theodoro',    f: 'img/santini-nobg/santini-san-theodoro.png' },
      { n: 'La Vergine',      f: 'img/santini-nobg/santini-vergine.png' }
    ]
  };

  var css = [
    '.ph.teca-on{overflow:visible !important;height:auto !important;aspect-ratio:auto !important;background:none !important;box-shadow:none !important;border:0 !important;padding:0 !important}',
    '.ph.teca-on>img,.ph.teca-on>.fallback{display:none !important}',

    '.teca{--lit:0;--px:.5;position:relative;width:100%;outline:none;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;cursor:pointer;touch-action:pan-y}',
    '.teca:focus-visible .teca-frame{box-shadow:0 0 0 3px #7ab8ff,0 14px 28px rgba(0,0,0,.5)}',

    '.teca-frame{position:relative;padding:9px;border-radius:10px 10px 4px 4px;',
      'background:linear-gradient(135deg,#6b4a12,#f3d27a 22%,#a8761f 48%,#f6df94 72%,#5e400f);',
      'box-shadow:0 14px 28px rgba(0,0,0,.5),inset 0 0 0 1px rgba(255,255,255,.25)}',

    '.teca-glass{position:relative;width:100%;aspect-ratio:var(--teca-r,.66);overflow:hidden;border-radius:4px;',
      'background:radial-gradient(ellipse at 50% 0%,#2a2118 0,#0c0a08 70%);box-shadow:inset 0 0 22px #000}',

    /* cono di luce dall'alto */
    '.teca-light{position:absolute;top:0;left:6%;right:6%;height:90%;pointer-events:none;',
      'background:linear-gradient(180deg,rgba(255,226,160,.75),rgba(255,226,160,0) 85%);',
      'clip-path:polygon(30% 0,70% 0,100% 100%,0 100%);filter:blur(7px);',
      'opacity:calc(var(--lit) * .85);transition:opacity .45s ease}',

    /* santino: grande e luminoso */
    '.teca-stage{position:absolute;left:4%;right:4%;top:4%;bottom:13%}',
    '.teca-stage::before{content:"";position:absolute;inset:-4%;pointer-events:none;',
      'background:radial-gradient(ellipse at 50% 50%,rgba(255,226,170,.34),rgba(255,226,170,0) 70%);',
      'opacity:var(--lit);transition:opacity .5s ease}',
    '.teca.lit .teca-stage{cursor:zoom-in}',
    '.teca-img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;',
      'filter:brightness(calc(.16 + var(--lit) * 1.06)) contrast(1.04) drop-shadow(0 6px 10px rgba(0,0,0,.55));',
      'transition:filter .5s ease,opacity .22s ease}',
    '.teca-img.swap{opacity:0}',

    '.teca-shine{position:absolute;inset:0;pointer-events:none;',
      'background:linear-gradient(115deg,transparent calc(var(--px) * 60% - 10%),rgba(255,255,255,.10) calc(var(--px) * 60% + 8%),transparent calc(var(--px) * 60% + 26%))}',

    /* ceri: piccoli, con stoppino e fiamma a goccia */
    '.teca-candles{position:absolute;left:0;right:0;bottom:3%;height:7.5%;display:flex;justify-content:center;align-items:flex-end;gap:10%}',
    '.cero{position:relative;width:3.6%;height:58%;padding:0;border:0;cursor:pointer;border-radius:1.5px 1.5px 1px 1px;',
      'background:radial-gradient(ellipse at 50% 0,#fffbe9 0,#fffbe9 14%,rgba(255,251,233,0) 16%),linear-gradient(90deg,#b4a374,#f3e8c4 40%,#a39463);',
      'box-shadow:inset -1.5px 0 2px rgba(0,0,0,.2)}',
    '.cero:nth-child(2n){height:76%}',
    '.cero:nth-child(3n){height:92%}',
    '.cero::before{content:"";position:absolute;left:50%;top:-4px;width:1.5px;height:5px;margin-left:-.75px;background:#2a1a0e;border-radius:1px}',
    '.flame{position:absolute;left:50%;bottom:calc(100% + 2px);width:130%;aspect-ratio:.42;transform:translate(-50%,0) scale(0);transform-origin:50% 100%;opacity:0;',
      'background:radial-gradient(ellipse at 50% 88%,rgba(120,160,255,.9) 0,rgba(120,160,255,0) 22%),',
        'radial-gradient(ellipse at 50% 68%,#fffdf0 0,#ffe680 34%,#ff9f2e 62%,rgba(255,110,20,0) 76%);',
      'border-radius:50% 50% 50% 50%/78% 78% 22% 22%;transition:opacity .3s,transform .3s;pointer-events:none}',
    '.cero.on .flame{opacity:1;transform:translate(-50%,0) scale(1);animation:teca-flick .9s ease-in-out infinite}',
    '.cero:nth-child(2n).on .flame{animation-duration:1.15s;animation-delay:-.3s}',
    '.cero:nth-child(3n).on .flame{animation-duration:.8s;animation-delay:-.5s}',
    '.cero.on::after{content:"";position:absolute;left:50%;bottom:calc(100% + 8px);width:420%;aspect-ratio:1;transform:translate(-50%,50%);',
      'background:radial-gradient(circle,rgba(255,180,80,.30),rgba(255,180,80,0) 62%);pointer-events:none;mix-blend-mode:screen}',
    '.cero.on.sel .flame{transform:translate(-50%,0) scale(1.25)}',
    '@keyframes teca-flick{',
      '0%,100%{margin-left:0;filter:brightness(1);rotate:0deg}',
      '25%{margin-left:-.6px;filter:brightness(1.12);rotate:-2deg}',
      '55%{margin-left:.5px;filter:brightness(.94);rotate:1.5deg}',
      '80%{margin-left:-.3px;filter:brightness(1.18);rotate:-1deg}}',

    '.teca-hint{position:absolute;left:0;right:0;top:46%;text-align:center;font-size:.85rem;letter-spacing:.06em;color:#f3d27a;',
      'text-shadow:0 1px 6px #000;pointer-events:none;transition:opacity .4s;animation:teca-pulse 2s ease-in-out infinite}',
    '.teca.busy .teca-hint,.teca.lit .teca-hint{opacity:0;animation:none}',
    '@keyframes teca-pulse{0%,100%{opacity:.55}50%{opacity:1}}',

    '.teca-nav{position:absolute;top:42%;width:34px;height:44px;border:0;border-radius:6px;background:rgba(0,0,0,.4);color:#f3d27a;',
      'font-size:24px;line-height:1;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .3s}',
    '.teca.lit .teca-nav{opacity:1;pointer-events:auto}',
    '.teca-nav.p{left:15px}',
    '.teca-nav.n{right:15px}',

    /* lente per ingrandire */
    '.teca-z{position:absolute;top:10px;right:10px;width:32px;height:32px;padding:0;border:0;border-radius:50%;background:rgba(0,0,0,.55);',
      'cursor:pointer;opacity:0;pointer-events:none;transition:opacity .3s;display:flex;align-items:center;justify-content:center}',
    '.teca.lit .teca-z{opacity:1;pointer-events:auto}',
    '.teca-z svg{width:18px;height:18px;stroke:#f3d27a;fill:none;stroke-width:2;stroke-linecap:round}',

    '.teca-plaque{margin:8px auto 0;width:82%;padding:5px 8px;text-align:center;font-size:.78rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;',
      'color:#2a1c05;background:linear-gradient(180deg,#f3d27a,#a8761f);border-radius:3px;box-shadow:0 2px 6px rgba(0,0,0,.4)}',

    /* ingrandimento a tutto schermo */
    '.teca-zoom{display:none;position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.92);align-items:center;justify-content:center;cursor:zoom-out}',
    '.teca-zoom.open{display:flex}',
    '.teca-zoom img{max-width:96vw;max-height:92vh;object-fit:contain;filter:drop-shadow(0 6px 20px #000)}',
    '.teca-zoom span{position:absolute;left:0;right:0;bottom:12px;text-align:center;font-size:.8rem;color:#f3d27a;opacity:.8;letter-spacing:.06em}'
  ].join('');

  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  function isEn() { return (document.documentElement.lang || 'it') === 'en'; }

  /* proporzioni dal retro, una volta sola per pagina */
  var probe = new Image();
  probe.onload = function () {
    if (probe.naturalWidth && probe.naturalHeight) {
      document.documentElement.style.setProperty('--teca-r', (probe.naturalWidth / probe.naturalHeight).toFixed(4));
    }
  };
  probe.src = BACK;

  /* ---------- ingrandimento ---------- */
  var zoomEl = null;
  function closeZoom() { if (zoomEl) zoomEl.classList.remove('open'); }
  function zoom(src) {
    if (!zoomEl) {
      zoomEl = document.createElement('div');
      zoomEl.className = 'teca-zoom';
      zoomEl.innerHTML = '<img alt=""><span></span>';
      zoomEl.addEventListener('click', function (e) { e.stopPropagation(); closeZoom(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeZoom(); });
      document.body.appendChild(zoomEl);
    }
    zoomEl.querySelector('span').textContent = isEn() ? 'Tap to close' : 'Tocca per chiudere';
    zoomEl.querySelector('img').src = src;
    zoomEl.classList.add('open');
  }

  function build(card, id) {
    var ph = card.querySelector('.ph');
    if (!ph) return;
    var items = SETS[id], idx = 0, lit = false, busy = false, swiped = false;
    ph.classList.add('teca-on');

    var el = document.createElement('div');
    el.className = 'teca';
    el.tabIndex = 0;
    el.setAttribute('role', 'group');
    el.setAttribute('aria-label', 'Santini');

    var candlesHTML = '';
    items.forEach(function (it, k) {
      candlesHTML += '<button type="button" class="cero" data-i="' + k + '" aria-label="' + it.n + '"><i class="flame"></i></button>';
    });
    el.innerHTML =
      '<div class="teca-frame">' +
        '<div class="teca-glass">' +
          '<div class="teca-light"></div>' +
          '<div class="teca-stage"><img class="teca-img" alt=""></div>' +
          '<div class="teca-shine"></div>' +
          '<div class="teca-candles">' + candlesHTML + '</div>' +
          '<div class="teca-hint"></div>' +
          '<button type="button" class="teca-z" aria-label="Ingrandisci">' +
            '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>' +
          '</button>' +
        '</div>' +
        '<button type="button" class="teca-nav p" aria-label="Precedente">‹</button>' +
        '<button type="button" class="teca-nav n" aria-label="Successivo">›</button>' +
      '</div>' +
      '<div class="teca-plaque"></div>';

    var img = el.querySelector('.teca-img');
    var pl = el.querySelector('.teca-plaque');
    var candles = el.querySelectorAll('.cero');
    el.querySelector('.teca-hint').textContent = isEn() ? 'Tap to light the candles' : 'Tocca per accendere i ceri';
    img.src = BACK;

    function plaque() {
      pl.textContent = lit
        ? (idx + 1) + '/' + items.length + ' · ' + items[idx].n
        : (isEn() ? 'Light the candles' : 'Accendi i ceri');
    }
    plaque();

    function show(i) {
      idx = (i + items.length) % items.length;
      Array.prototype.forEach.call(candles, function (c, k) { c.classList.toggle('sel', k === idx); });
      plaque();
      img.classList.add('swap');
      setTimeout(function () {
        img.onload = img.onerror = function () { img.classList.remove('swap'); };
        img.src = items[idx].f;
      }, 200);
      setTimeout(function () { img.classList.remove('swap'); }, 800);
    }

    function ignite() {
      if (lit || busy) return;
      busy = true;
      el.classList.add('busy');
      items.forEach(function (it) { var p = new Image(); p.src = it.f; });
      items.forEach(function (it, k) {
        setTimeout(function () {
          candles[k].classList.add('on');
          el.style.setProperty('--lit', ((k + 1) / items.length).toFixed(2));
        }, 300 * k);
      });
      setTimeout(function () {
        lit = true; busy = false;
        el.classList.add('lit');
        show(0);
      }, 300 * items.length + 100);
    }

    el.addEventListener('click', function (e) {
      if (!lit) { ignite(); return; }
      if (swiped) return;
      var t = e.target;
      var c = t.closest ? t.closest('.cero') : null;
      var nav = t.closest ? t.closest('.teca-nav') : null;
      var z = t.closest ? t.closest('.teca-z') : null;
      var stage = t.closest ? t.closest('.teca-stage') : null;
      if (c) { show(+c.getAttribute('data-i')); return; }
      if (nav) { show(idx + (nav.classList.contains('n') ? 1 : -1)); return; }
      if (z || stage) { zoom(items[idx].f); }
    });

    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!lit) ignite(); else zoom(items[idx].f);
      } else if (lit && e.key === 'ArrowRight') { show(idx + 1); }
      else if (lit && e.key === 'ArrowLeft') { show(idx - 1); }
    });

    /* scorrimento col dito o col mouse (uno swipe non apre l'ingrandimento) */
    var x0 = null;
    el.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
    el.addEventListener('pointerup', function (e) {
      if (x0 === null || !lit) { x0 = null; return; }
      var dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 40) {
        swiped = true;
        setTimeout(function () { swiped = false; }, 300);
        show(idx + (dx < 0 ? 1 : -1));
      }
    });
    el.addEventListener('pointercancel', function () { x0 = null; });

    /* riflesso sul vetro che segue il mouse */
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      if (r.width) el.style.setProperty('--px', Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)).toFixed(3));
    });

    ph.appendChild(el);
    card.setAttribute('data-teca', '1');
  }

  function scan() {
    Object.keys(SETS).forEach(function (id) {
      var list = document.querySelectorAll('article.card[data-id="' + id + '"]');
      Array.prototype.forEach.call(list, function (card) {
        if (!card.hasAttribute('data-teca')) build(card, id);
      });
    });
  }

  scan();
  var t = null;
  new MutationObserver(function () {
    clearTimeout(t);
    t = setTimeout(scan, 50);
  }).observe(document.body, { childList: true, subtree: true });
})();

/* fx.js - tubini: inclinazione + farina risucchiata */
(function () {
  var RIGHT = ['tubino-muccato-milka',
    'primavera-inglese-arancione-e-verde',
    'primavera-inglese-blu-azzurro-e-bianco',
    'primavera-inglese-giallo-e-blu',
    'primavera-inglese-rosa-verde-chiaro-e-bianco',
    'tubino-zebrato-fetish',
    'tubino-zebrato-giallo'];
  var TILT = 22;        // gradi di inclinazione
  var DUR = 1500;       // durata dell'inclinazione (ms)
  var GRAINS = 10;      // numero di granelli
  var AX = 50, AY = 85; // apertura del tubino (% larghezza, % altezza)

  var st = document.createElement('style');
  st.textContent =
    '.fx-line{position:absolute;left:4%;right:4%;bottom:6%;height:2px;background:#111;opacity:0;pointer-events:none;z-index:2}' +
    '.fx-g{position:absolute;width:6px;height:6px;margin:-3px 0 0 -3px;border-radius:50%;background:#e9e2d0;box-shadow:0 0 0 1px rgba(0,0,0,.15);opacity:0;pointer-events:none;z-index:2}';
  document.head.appendChild(st);

  window.tubinoFx = function (img, ph) {
    try {
      if (!img || !ph || !img.animate) return;
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      var src = decodeURIComponent(img.getAttribute('src') || '').toLowerCase();
      var right = RIGHT.some(function (k) { return src.indexOf(k) >= 0; });

      if (getComputedStyle(ph).position === 'static') ph.style.position = 'relative';
      if (ph._fxT) clearTimeout(ph._fxT);
      if (ph._fxA) ph._fxA.cancel();
      Array.prototype.slice.call(ph.querySelectorAll('.fx-line,.fx-g')).forEach(function (n) { n.remove(); });

      var w = ph.clientWidth, h = ph.clientHeight;
      var deg = right ? TILT : -TILT;
      img.style.transformOrigin = right ? '100% 100%' : '0% 100%';
      ph._fxA = img.animate([
        { transform: 'rotate(0deg)', offset: 0 },
        { transform: 'rotate(' + deg + 'deg)', offset: 0.25 },
        { transform: 'rotate(' + deg + 'deg)', offset: 0.75 },
        { transform: 'rotate(0deg)', offset: 1 }
      ], { duration: DUR, easing: 'ease-in-out' });

      var line = document.createElement('div');
      line.className = 'fx-line';
      ph.appendChild(line);
      line.animate([{ opacity: 0 }, { opacity: 1, offset: 0.2 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }],
        { duration: DUR, fill: 'both' });

      for (var i = 0; i < GRAINS; i++) {
        var g = document.createElement('span');
        g.className = 'fx-g';
        var sx = 8 + Math.random() * 84;
        g.style.left = sx + '%';
        g.style.top = '94%';
        ph.appendChild(g);
        var dx = (AX - sx) / 100 * w, dy = (AY - 94) / 100 * h;
        g.animate([
          { transform: 'translate(0px,0px) scale(1)', opacity: 0 },
          { transform: 'translate(0px,0px) scale(1)', opacity: 1, offset: 0.15 },
          { transform: 'translate(' + (dx * 0.5) + 'px,' + (dy * 0.5 - 14) + 'px) scale(0.8)', opacity: 1, offset: 0.6 },
          { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(0.1)', opacity: 0 }
        ], { duration: 900, delay: 200 + i * 70, easing: 'ease-in', fill: 'both' });
      }

      ph._fxT = setTimeout(function () {
        Array.prototype.slice.call(ph.querySelectorAll('.fx-line,.fx-g')).forEach(function (n) { n.remove(); });
      }, 1900);
    } catch (e) {}
  };
})();
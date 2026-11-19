/* fx.js - tubini: il tubino si solleva, ruota e aspira una striscia di farina */
(function () {
  // ===== REGOLAZIONI =====
  var ANGLE = 80;             // gradi di rotazione (80 o 100 a seconda del verso)
  var T_LIFT = 350, T_ROT = 1700, T_S0 = 2100, T_S = 2400, T_HOLD = 5000, T_TOT = 6400; // ms
  var PAUSE = 2500;           // pausa tra un giro e l'altro (ms)
  var GRAINS = 24;            // granelli
  var PILE_LEN = 0.30;        // lunghezza mucchietto (frazione della larghezza scheda)
  var PILE_H = 0.8;           // altezza mucchietto (frazione dello spessore del tubino)
  var FLOOR = 0.86;           // altezza del piano (frazione dell'altezza scheda)
  var FLOOR_LINE = true;      // riga sottile del piano
  var OPEN_LEFT = ['primavera-inglese-blu-azzurro']; // riserva se la lettura automatica non funziona
  // =======================

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var st = document.createElement('style');
  st.textContent =
    '.fx-pile{position:absolute;z-index:2;pointer-events:none;background:#e4dcc6;border:1px solid rgba(0,0,0,.3);border-bottom:0;border-radius:50% 50% 0 0 / 100% 100% 0 0;opacity:0}' +
    '.fx-floor{position:absolute;left:6%;right:6%;height:0;border-top:2px solid #111;z-index:1;pointer-events:none;opacity:0}' +
    '.fx-g{position:absolute;z-index:3;width:5px;height:5px;margin:-2px 0 0 -2px;border-radius:50%;background:#e4dcc6;box-shadow:0 0 0 1px rgba(0,0,0,.25);opacity:0;pointer-events:none}';
  document.head.appendChild(st);

  function tf(x, y, r, k) { return 'translate(' + x + 'px,' + y + 'px) rotate(' + r + 'deg) scale(' + k + ')'; }
  function o(t) { return t / T_TOT; }
  function nop() {}

  // ---- lettura della foto: dove sta il tubino e da che parte e' aperto ----
  var geoCache = {};
  function measure(img) {
    var key = img.currentSrc || img.src;
    if (geoCache[key]) return geoCache[key];
    var src = decodeURIComponent(key).toLowerCase();
    var m = { xc: 0.5, yc: 0.47, len: 0.81, t: 0.09, auto: false,
      open: OPEN_LEFT.some(function (k) { return src.indexOf(k) >= 0; }) ? 'left' : 'right' };
    try {
      var nw = img.naturalWidth, nh = img.naturalHeight;
      var cw = 300, ch = Math.max(1, Math.round(cw * nh / nw));
      var cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
      var cx = cv.getContext('2d'); cx.drawImage(img, 0, 0, cw, ch);
      var d = cx.getImageData(0, 0, cw, ch).data;
      var lum = new Float32Array(cw * ch), mn = [], mx = [], maxExt = 0, x, y, i, r, g, b;
      for (y = 0; y < ch; y++) {
        mn[y] = cw; mx[y] = -1;
        for (x = 0; x < cw; x++) {
          i = (y * cw + x) * 4; r = d[i]; g = d[i + 1]; b = d[i + 2];
          lum[y * cw + x] = 0.3 * r + 0.59 * g + 0.11 * b;
          if (d[i + 3] > 20 && Math.min(r, g, b) < 235) { if (x < mn[y]) mn[y] = x; if (x > mx[y]) mx[y] = x; }
        }
        if (mx[y] - mn[y] > maxExt) maxExt = mx[y] - mn[y];
      }
      if (maxExt < cw * 0.4) throw 0;
      var y0 = -1, y1 = -1, x0 = cw, x1 = 0;
      for (y = 0; y < ch; y++) {
        if (mx[y] - mn[y] >= maxExt * 0.6) {
          if (y0 < 0) y0 = y; y1 = y;
          if (mn[y] < x0) x0 = mn[y]; if (mx[y] > x1) x1 = mx[y];
        }
      }
      var len = x1 - x0, ya = y0 + Math.round((y1 - y0) * 0.15), yb = y1 - Math.round((y1 - y0) * 0.15);
      var energy = function (xa, xb) {
        var e = 0, yy, xx;
        for (yy = ya; yy <= yb; yy++) for (xx = xa; xx < xb; xx++) e += Math.abs(lum[yy * cw + xx + 1] - lum[yy * cw + xx]);
        return e;
      };
      var eL = energy(Math.round(x0 + len * 0.03), Math.round(x0 + len * 0.28));
      var eR = energy(Math.round(x1 - len * 0.28), Math.round(x1 - len * 0.03));
      m.open = eL < eR ? 'left' : 'right'; // lato liscio = acciaio aperto
      m.xc = (x0 + x1 + 1) / 2 / cw; m.yc = (y0 + y1 + 1) / 2 / ch;
      m.len = (len + 1) / cw; m.t = (y1 - y0 + 1) / ch; m.auto = true;
    } catch (e) {}
    geoCache[key] = m;
    return m;
  }

  function clear(ph) {
    if (ph._fxT) { clearTimeout(ph._fxT); ph._fxT = 0; }
    (ph._fxA || []).forEach(function (a) { try { a.cancel(); } catch (e) {} });
    ph._fxA = [];
    if (ph._fxI) ph._fxI.style.transformOrigin = '';
    Array.prototype.slice.call(ph.querySelectorAll('.fx-pile,.fx-g,.fx-floor')).forEach(function (n) { n.remove(); });
  }

  // alternanza a scacchiera in base alla posizione della scheda nella griglia
  function isRight(ph) {
    var card = ph.closest('.card'), par = card && card.parentNode;
    if (!par) return true;
    var idx = Array.prototype.indexOf.call(par.children, card), cols = 1;
    try { cols = Math.max(1, getComputedStyle(par).gridTemplateColumns.split(' ').length); } catch (e) {}
    return ((Math.floor(idx / cols) + idx % cols) % 2) === 0;
  }

  function run(img, ph, onEnd) {
    try {
      if (!img || !ph || !img.animate || reduce) return;
      var w = ph.clientWidth, h = ph.clientHeight;
      if (!w || !h || !img.naturalWidth) return;
      clear(ph);
      ph._fxI = img;
      if (getComputedStyle(ph).position === 'static') ph.style.position = 'relative';

      var m = measure(img);
      var nw = img.naturalWidth, nh = img.naturalHeight;
      var k0 = Math.min(w / nw, h / nh), iw = nw * k0, ih = nh * k0;
      var Cx = (w - iw) / 2 + m.xc * iw, Cy = (h - ih) / 2 + m.yc * ih; // centro del tubino (perno)
      var Lh = m.len * iw / 2, T = m.t * ih;                             // mezza lunghezza, spessore
      var sgn = m.open === 'left' ? -1 : 1;                              // lato della bocchetta
      var dir = isRight(ph) ? 1 : -1;                                    // verso di scorrimento
      var th = sgn * (dir === sgn ? ANGLE : 180 - ANGLE);                // bocchetta in basso, inclinata verso dir
      var rad = th * Math.PI / 180, ax = sgn * Math.cos(rad), ay = sgn * Math.sin(rad);
      var floorY = h * FLOOR;
      var s = Math.min(1, (floorY - 6) / (2 * Lh * ay + T * Math.abs(ax)));
      var Le = Lh * s, Te = T * s;
      var cy1 = floorY - (Le * ay + Te / 2 * Math.abs(ax));
      var ty = cy1 - Cy;
      var nx0 = Cx + Le * ax;                                            // x della bocchetta
      var px0 = nx0 + dir * Te * 0.45;                                   // dove inizia il mucchietto
      var L = Math.max(30, Math.min(PILE_LEN * w, dir > 0 ? w - px0 - 6 : px0 - 6));
      var lift = h * 0.025, pileH = Math.max(8, PILE_H * Te);
      var q = T_S / 4, wob = 1.2;
      var ix = -ax * h * 0.12, iy = -ay * h * 0.12;                      // verso l'interno del tubino

      img.style.transformOrigin = Cx + 'px ' + Cy + 'px';
      var anims = [];
      anims.push(img.animate([
        { transform: tf(0, 0, 0, 1), offset: 0, easing: 'ease-out' },
        { transform: tf(0, -lift, 0, 1), offset: o(T_LIFT), easing: 'ease-in-out' },
        { transform: tf(0, ty, th, s), offset: o(T_ROT) },
        { transform: tf(0, ty, th, s), offset: o(T_S0), easing: 'linear' },
        { transform: tf(dir * L * 0.25, ty - 2, th + wob, s), offset: o(T_S0 + q), easing: 'linear' },
        { transform: tf(dir * L * 0.50, ty, th - wob, s), offset: o(T_S0 + 2 * q), easing: 'linear' },
        { transform: tf(dir * L * 0.75, ty - 2, th + wob, s), offset: o(T_S0 + 3 * q), easing: 'linear' },
        { transform: tf(dir * L, ty, th, s), offset: o(T_S0 + T_S), easing: 'ease-out' },
        { transform: tf(dir * L, ty - lift, th, s), offset: o(T_HOLD), easing: 'ease-in-out' },
        { transform: tf(0, 0, 0, 1), offset: 1 }
      ], { duration: T_TOT, fill: 'none' }));

      if (FLOOR_LINE) {
        var fl = document.createElement('div');
        fl.className = 'fx-floor';
        fl.style.top = floorY + 'px';
        ph.appendChild(fl);
        anims.push(fl.animate([
          { opacity: 0, offset: 0 },
          { opacity: 0, offset: o(T_LIFT) },
          { opacity: 0.5, offset: o(T_ROT) },
          { opacity: 0.5, offset: o(T_HOLD) },
          { opacity: 0, offset: 1 }
        ], { duration: T_TOT, fill: 'both' }));
      }

      var pile = document.createElement('div');
      pile.className = 'fx-pile';
      pile.style.left = (dir > 0 ? px0 : px0 - L) + 'px';
      pile.style.top = (floorY - pileH) + 'px';
      pile.style.width = L + 'px';
      pile.style.height = pileH + 'px';
      pile.style.transformOrigin = dir > 0 ? '100% 100%' : '0% 100%';
      ph.appendChild(pile);
      anims.push(pile.animate([
        { opacity: 0, transform: 'scale(1,0)', offset: 0 },
        { opacity: 0, transform: 'scale(1,0)', offset: o(T_ROT), easing: 'ease-out' },
        { opacity: 1, transform: 'scale(1,1)', offset: o(T_S0), easing: 'linear' },
        { opacity: 1, transform: 'scale(0,1)', offset: o(T_S0 + T_S) },
        { opacity: 0, transform: 'scale(0,1)', offset: 1 }
      ], { duration: T_TOT, fill: 'both' }));

      var FL = 360;
      for (var n = 0; n < GRAINS; n++) {
        var u = (n + 0.5) / GRAINS * 0.96;
        var sx = px0 + dir * L * u + dir * Math.random() * 10;
        var sy = floorY - 1 - Math.random() * Math.min(pileH * 0.6, 8);
        var ex = nx0 + dir * L * Math.min(1, u + FL / T_S);
        var dx = ex - sx, dy = (floorY - 2) - sy;
        var g = document.createElement('span');
        g.className = 'fx-g';
        g.style.left = sx + 'px';
        g.style.top = sy + 'px';
        ph.appendChild(g);
        anims.push(g.animate([
          { transform: 'translate(0px,0px) scale(1)', opacity: 0, offset: 0 },
          { transform: 'translate(0px,0px) scale(1)', opacity: 1, offset: 0.15 },
          { transform: 'translate(' + (dx * 0.7) + 'px,' + (dy * 0.7 - 8) + 'px) scale(0.9)', opacity: 1, offset: 0.55 },
          { transform: 'translate(' + (dx + ix) + 'px,' + (dy + iy) + 'px) scale(0.25)', opacity: 0, offset: 1 }
        ], { duration: FL, delay: T_S0 + u * T_S, easing: 'ease-in', fill: 'both' }));
      }

      ph._fxA = anims;
      ph._fxT = setTimeout(function () { clear(ph); if (onEnd) onEnd(); }, T_TOT + 60);
    } catch (err) {}
  }

  function whenReady(img, cb) {
    if (img.complete && img.naturalWidth) { cb(); return; }
    var done = false;
    function go() { if (done) return; done = true; cb(); }
    img.addEventListener('load', go, { once: true });
    setTimeout(go, 1500);
  }

  function watch(img, ph) {
    if (ph._fxW) return;
    ph._fxW = true;
    if (reduce || !('IntersectionObserver' in window) || !img.animate) return;
    var vis = false;
    function loop() {
      if (!vis) return;
      if (!img.complete || !img.naturalWidth || !ph.clientWidth) { ph._fxL = setTimeout(loop, 400); return; }
      run(img, ph, function () { ph._fxL = setTimeout(loop, PAUSE + Math.random() * 1500); });
    }
    ph._fxLoop = loop;
    new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting && !vis) { vis = true; clearTimeout(ph._fxL); ph._fxL = setTimeout(loop, 300 + Math.random() * 1500); }
        else if (!en.isIntersecting && vis) { vis = false; clearTimeout(ph._fxL); clear(ph); }
      });
    }, { threshold: 0.5 }).observe(ph);
  }

  // cambio variante: riparte subito
  window.tubinoFx = function (img, ph) {
    clearTimeout(ph._fxL);
    whenReady(img, function () {
      run(img, ph, function () { ph._fxL = setTimeout(ph._fxLoop || nop, PAUSE); });
    });
  };
  window.tubinoFx.watch = watch;

  // aggancio automatico di tutte le schede tubino, anche quelle create dopo
  function scan() {
    Array.prototype.slice.call(document.querySelectorAll('.card[data-id^="tubin"]')).forEach(function (card) {
      var img = card.querySelector('.ph img'), ph = card.querySelector('.ph');
      if (img && ph) watch(img, ph);
    });
  }
  var scanT = 0;
  function sched() { clearTimeout(scanT); scanT = setTimeout(scan, 150); }
  if (window.MutationObserver) new MutationObserver(sched).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', scan);
  scan();
})();
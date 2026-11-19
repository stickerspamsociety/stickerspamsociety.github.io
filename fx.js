/* fx.js - tubini v3: il tubino si allinea (anche se la foto e' storta), scende con l'estremita'
   NON metallica e aspira una striscia sottile di farina */
(function () {
  // ===== REGOLAZIONI =====
  var DOWN_STEEL = false;     // false = scende l'estremita' NON metallica; true = scende quella d'acciaio
  var TILT = 15;              // inclinazione dalla verticale, verso il senso di scorrimento (gradi)
  var T_LIFT = 350, T_ROT = 1700, T_S0 = 2100, T_S = 2400, T_HOLD = 5000, T_TOT = 6400; // ms
  var PAUSE = 2500;           // pausa tra un giro e l'altro (ms)
  var GRAINS = 24;            // granelli
  var PILE_LEN = 0.30;        // lunghezza striscia (frazione della larghezza scheda)
  var PILE_H = 0.18;          // spessore striscia (frazione dello spessore del tubino)
  var PILE_MIN = 3, PILE_MAX = 9; // limiti spessore striscia (px)
  var FLOOR = 0.86;           // altezza del piano (frazione dell'altezza scheda)
  var FLOOR_LINE = true;      // riga sottile del piano
  // riserva se la lettura automatica sbaglia: pezzo del nome file -> lato dell'acciaio nella foto
  var OPEN_LEFT = ['primavera-inglese-blu-azzurro'];
  var OPEN_RIGHT = [];
  // =======================

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var st = document.createElement('style');
  st.textContent =
    '.fx-pile{position:absolute;z-index:2;pointer-events:none;background:#efe8d6;border-radius:4px;box-shadow:0 0 0 1px rgba(0,0,0,.2);opacity:0}' +
    '.fx-floor{position:absolute;left:6%;right:6%;height:0;border-top:2px solid #111;z-index:1;pointer-events:none;opacity:0}' +
    '.fx-g{position:absolute;z-index:3;width:5px;height:5px;margin:-2px 0 0 -2px;border-radius:50%;background:#efe8d6;box-shadow:0 0 0 1px rgba(0,0,0,.25);opacity:0;pointer-events:none}';
  document.head.appendChild(st);

  function tf(x, y, r, k) { return 'translate(' + x + 'px,' + y + 'px) rotate(' + r + 'deg) scale(' + k + ')'; }
  function o(t) { return t / T_TOT; }
  function nop() {}

  // ---- analisi della foto: asse del tubino, lunghezza, spessore, lato d'acciaio ----
  // d = pixel RGBA, cw x ch. Restituisce misure in pixel del canvas, oppure null.
  function analyze(d, cw, ch) {
    var N = cw * ch, i, x, y, cnt = 0, sx = 0, sy = 0;
    var mask = new Uint8Array(N);
    for (i = 0; i < N; i++) {
      var r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2];
      if (d[i * 4 + 3] > 20 && Math.min(r, g, b) < 235) { mask[i] = 1; cnt++; sx += i % cw; sy += (i / cw) | 0; }
    }
    if (cnt < N * 0.02) return null;
    var mx = sx / cnt, my = sy / cnt, sxx = 0, syy = 0, sxy = 0, dx, dy;
    for (i = 0; i < N; i++) {
      if (!mask[i]) continue;
      dx = (i % cw) - mx; dy = ((i / cw) | 0) - my;
      sxx += dx * dx; syy += dy * dy; sxy += dx * dy;
    }
    var ang = 0.5 * Math.atan2(2 * sxy, sxx - syy);
    var ax = Math.cos(ang), ay = Math.sin(ang);
    if (ax < 0) { ax = -ax; ay = -ay; }            // asse orientato verso destra
    var px = -ay, py = ax;                          // perpendicolare
    var OFF = cw + ch, B = 2 * OFF + 2;
    var cntB = new Int32Array(B), nmin = new Float32Array(B), nmax = new Float32Array(B);
    for (i = 0; i < B; i++) { nmin[i] = 1e9; nmax[i] = -1e9; }
    var steelNeg = [], steelPos = []; // t dei pixel "acciaio"
    var tmin = 1e9, tmax = -1e9, t, n, bi;
    for (i = 0; i < N; i++) {
      if (!mask[i]) continue;
      dx = (i % cw) - mx; dy = ((i / cw) | 0) - my;
      t = dx * ax + dy * ay; n = dx * px + dy * py;
      bi = Math.round(t) + OFF;
      cntB[bi]++;
      if (n < nmin[bi]) nmin[bi] = n;
      if (n > nmax[bi]) nmax[bi] = n;
    }
    var bl = -1, bh = -1;
    for (i = 0; i < B; i++) if (cntB[i] >= 2) { if (bl < 0) bl = i; bh = i; }
    if (bl < 0 || bh - bl < cw * 0.3) return null;
    tmin = bl - OFF; tmax = bh - OFF;
    var L = tmax - tmin + 1, ws = [], cs = [];
    for (i = bl + Math.round(L * 0.1); i <= bh - Math.round(L * 0.1); i++) {
      if (cntB[i] >= 2) { ws.push(nmax[i] - nmin[i] + 1); cs.push((nmax[i] + nmin[i]) / 2); }
    }
    ws.sort(function (a, b) { return a - b; }); cs.sort(function (a, b) { return a - b; });
    var T = ws.length ? ws[ws.length >> 1] : L * 0.1;
    var nc = cs.length ? cs[cs.length >> 1] : 0;
    // lato acciaio: nelle due estremita' (35%) quale ha piu' pixel grigi poco saturi
    var cn = 0, cp = 0, mn, lum, sat, lim = L * 0.35;
    for (i = 0; i < N; i++) {
      if (!mask[i]) continue;
      var rr = d[i * 4], gg = d[i * 4 + 1], bb = d[i * 4 + 2];
      mn = Math.min(rr, gg, bb); sat = Math.max(rr, gg, bb) - mn; lum = (rr + gg + bb) / 3;
      if (sat > 45 || lum < 60 || lum > 205) continue;
      dx = (i % cw) - mx; dy = ((i / cw) | 0) - my;
      t = dx * ax + dy * ay;
      if (t < tmin + lim) cn++; else if (t > tmax - lim) cp++;
    }
    var tc = (tmin + tmax) / 2;
    return { xc: (mx + ax * tc + px * nc) / cw, yc: (my + ay * tc + py * nc) / ch,
      ax: ax, ay: ay, lh: L / 2 / cw, t: T / cw, ss: cp > cn ? 1 : -1, auto: true };
  }

  // misure per foto che non si possono leggere (apertura da file://), ricavate dalle foto
  var MANUAL = {
    'tirare': { xc: 0.4758, yc: 0.4873, ax: 0.73695, ay: -0.67595, lh: 0.52, t: 0.1094, ss: -1 },
    'zebrato': { xc: 0.4978, yc: 0.4489, ax: 0.99997, ay: -0.00759, lh: 0.4067, t: 0.07, ss: 1 },
    'primavera': { xc: 0.4983, yc: 0.4531, ax: 0.99958, ay: 0.02908, lh: 0.4083, t: 0.0701, ss: -1 }
  };

  var geoCache = {};
  function measure(img) {
    var key = img.currentSrc || img.src;
    if (geoCache[key]) return geoCache[key];
    var src = decodeURIComponent(key).toLowerCase();
    var m = null;
    try {
      var nw = img.naturalWidth, nh = img.naturalHeight;
      var cw = 300, ch = Math.max(1, Math.round(cw * nh / nw));
      var cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
      var cx = cv.getContext('2d'); cx.drawImage(img, 0, 0, cw, ch);
      m = analyze(cx.getImageData(0, 0, cw, ch).data, cw, ch);
    } catch (e) { m = null; }
    if (!m) {
      for (var k in MANUAL) if (src.indexOf(k) >= 0) { m = Object.assign({ auto: false }, MANUAL[k]); break; }
    }
    if (!m) m = { xc: 0.5, yc: 0.47, ax: 1, ay: 0, lh: 0.4, t: 0.07, ss: 1, auto: false };
    if (OPEN_LEFT.some(function (k) { return src.indexOf(k) >= 0; })) m.ss = -1;
    if (OPEN_RIGHT.some(function (k) { return src.indexOf(k) >= 0; })) m.ss = 1;
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
      var Cx = (w - iw) / 2 + m.xc * iw, Cy = (h - ih) / 2 + m.yc * ih;  // centro del tubino (perno)
      var Lh = m.lh * iw, T = m.t * iw;                                  // mezza lunghezza, spessore veri
      var dir = isRight(ph) ? 1 : -1;                                    // verso di scorrimento

      // estremita' che scende: non metallica (o d'acciaio se DOWN_STEEL)
      var sd = DOWN_STEEL ? m.ss : -m.ss;
      var phi = Math.atan2(sd * m.ay, sd * m.ax) * 180 / Math.PI;        // dove sta ora, nella foto
      var target = 90 - dir * TILT;                                      // dove deve stare (90 = giu')
      var th = target - phi;
      while (th > 180) th -= 360;
      while (th <= -180) th += 360;
      var tr = target * Math.PI / 180, tc = Math.cos(tr), ts = Math.sin(tr);

      var floorY = h * FLOOR;
      var s = Math.min(1, (floorY - 6) / (2 * Lh * ts + T * Math.abs(tc)));
      var Le = Lh * s, Te = T * s;
      var cy1 = floorY - (Le * ts + Te / 2 * Math.abs(tc));
      var ty = cy1 - Cy;
      var nx0 = Cx + Le * tc;                                            // x della punta
      var px0 = nx0 + dir * Te * 0.45;                                   // dove inizia la striscia
      var L = Math.max(30, Math.min(PILE_LEN * w, dir > 0 ? w - px0 - 6 : px0 - 6));
      var lift = h * 0.025, pileH = Math.max(PILE_MIN, Math.min(PILE_MAX, PILE_H * Te));
      var q = T_S / 4, wob = 1.2;
      var ix = -tc * h * 0.12, iy = -ts * h * 0.12;                      // verso l'interno del tubino

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
  window.tubinoFx._analyze = analyze;

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

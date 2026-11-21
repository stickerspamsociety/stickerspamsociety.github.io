/* santini-bg.js - video in loop sul RETRO della sezione santini, con pulsante audio on/off
   + audio che sale da 0 al 60% in 10 secondi (poi si spegne) quando si clicca
     il tasto della sezione santini o l'immagine di un santino */
(function () {
  // ===== REGOLAZIONI =====
  var SRC = 'santini-bg.mp4';   // il video nella stessa cartella di index.html
  var SECTION = '#santini';     // selettore della sezione santini (se non esiste, cerca le schede data-id="santin...")
  var MAX_VOL = 0.6;            // volume massimo raggiunto (0-1) = 60%. Su iPhone non conta: vale il volume del dispositivo
  var FADE_SECS = 10;           // durata della salita 0 -> MAX_VOL; alla fine l'audio si spegne
  var CURVE = 2;                // forma della salita: 1 = lineare (sembra veloce), 2 = piu' dolce all'inizio, 3 = ancora piu' lenta
  var SHADE = 0.15;             // velo scuro sopra il video, per leggere meglio le schede (0 = nessuno)
  var LABEL_ON = 'AUDIO ON', LABEL_OFF = 'AUDIO OFF';
  // =======================

  var st = document.createElement('style');
  st.textContent =
    '.sbg-host{position:relative;isolation:isolate;clip-path:inset(0)}' +
    '.sbg-video{position:fixed;left:0;top:0;width:100%;height:100%;object-fit:cover;z-index:-1;pointer-events:none;background:#000}' +
    '.sbg-shade{position:fixed;left:0;top:0;width:100%;height:100%;z-index:-1;pointer-events:none;background:rgba(0,0,0,' + SHADE + ')}' +
    '.sbg-btn{position:fixed;right:max(14px,env(safe-area-inset-right));bottom:max(18px,env(safe-area-inset-bottom));z-index:9999;' +
    'display:none;align-items:center;gap:8px;min-height:48px;padding:12px 18px;border:2px solid #111;border-radius:999px;' +
    'background:#f2efe6;color:#111;font:700 14px/1 system-ui,sans-serif;letter-spacing:.06em;cursor:pointer;box-shadow:0 3px 0 #111;' +
    '-webkit-tap-highlight-color:transparent}' +
    '.sbg-btn.show{display:flex}' +
    '.sbg-btn[aria-pressed="true"]{background:#111;color:#f2efe6;box-shadow:0 3px 0 #555}' +
    '.sbg-btn:active{transform:translateY(2px);box-shadow:0 1px 0 #111}';
  document.head.appendChild(st);

  var video = document.createElement('video');
  video.className = 'sbg-video';
  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'none';
  video.volume = MAX_VOL;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.setAttribute('aria-hidden', 'true');
  video.setAttribute('disablepictureinpicture', '');

  var shade = document.createElement('div');
  shade.className = 'sbg-shade';

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'sbg-btn';
  btn.setAttribute('aria-pressed', 'false');
  function paint() {
    var on = !video.muted;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.setAttribute('aria-label', on ? 'Spegni audio' : 'Accendi audio');
    btn.textContent = (on ? '\uD83D\uDD0A ' : '\uD83D\uDD07 ') + (on ? LABEL_ON : LABEL_OFF);
  }
  paint();

  function play() {
    if (!video.getAttribute('src')) video.src = SRC;
    var p = video.play(); if (p && p.catch) p.catch(function () {});
  }

  // ---- salita audio 0 -> MAX_VOL in FADE_SECS secondi, poi audio spento ----
  var fadeTimer = 0, triggered = false, userOff = false;
  function stopFade() { clearInterval(fadeTimer); fadeTimer = 0; }
  function startFade() {
    triggered = true;
    userOff = false;
    stopFade();
    video.volume = 0;
    video.muted = false;
    paint();
    play();
    setTimeout(function () { if (fadeTimer) play(); }, 600);
    setTimeout(function () { if (fadeTimer) play(); }, 1800);
    var t0 = Date.now();
    fadeTimer = setInterval(function () {
      var k = (Date.now() - t0) / (FADE_SECS * 1000);
      if (k >= 1) {
        stopFade();
        video.muted = true;
        video.volume = MAX_VOL;
        paint();
        return;
      }
      video.volume = MAX_VOL * Math.pow(k, CURVE);
    }, 100);
  }

  // ---- pulsante: ferma la salita e accende/spegne subito ----
  btn.addEventListener('click', function () {
    stopFade();
    triggered = true;
    video.muted = !video.muted;
    userOff = video.muted;
    if (!video.muted) video.volume = MAX_VOL;
    play();
    paint();
  });
  document.body ? document.body.appendChild(btn) : document.addEventListener('DOMContentLoaded', function () { document.body.appendChild(btn); });

  // ---- cosa fa partire l'audio: tasto della sezione santini o immagine di un santino ----
  function isTrigger(target) {
    if (!target || !target.closest) return false;
    if (target.closest('.sbg-btn')) return false;
    // click sul pulsante della barra in alto (link a #schede)
    if (target.closest('a[href="#schede"],a[href="#santini"]')) return true;
    // click su una scheda santino (immagine o scheda intera)
    if (target.closest('.card[data-id^="santin"]')) return true;
    // click sul tasto/link/tab della sezione (es. "Schede e santini"): sale di qualche livello cercando
    // un elemento con testo breve che contiene "santin", oppure un attributo che lo contiene
    var el = target;
    for (var depth = 0; el && el.nodeType === 1 && depth < 5; depth++, el = el.parentNode) {
      if (el === document.body || el === document.documentElement) break;
      var txt = (el.textContent || '').trim().toLowerCase();
      if (txt.length > 0 && txt.length < 40 && txt.indexOf('santin') !== -1) return true;
      for (var i = 0; i < el.attributes.length; i++) {
        if (/santin/i.test(el.attributes[i].value) && el.attributes[i].name !== 'class') return true;
      }
    }
    return false;
  }
  document.addEventListener('click', function (e) {
    if (isTrigger(e.target)) startFade();
  }, true);

  var hostSeen = false;
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (en.isIntersecting) {
        hostSeen = true;
        btn.classList.add('show'); play();
      } else {
        btn.classList.remove('show');
        if (!fadeTimer) video.pause();                          // durante la salita il video non si ferma
        if (hostSeen) { stopFade(); video.muted = true; paint(); } // si esce davvero dalla sezione: audio spento
      }
    });
  }, { threshold: 0 }) : null;

  // ---- schede santini: quando ricompaiono sullo schermo la salita riparte, quando escono l'audio si spegne ----
  var visibleCards = new Set();
  var cardIO = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
    var before = visibleCards.size;
    es.forEach(function (en) {
      if (en.isIntersecting) visibleCards.add(en.target); else visibleCards.delete(en.target);
    });
    if (before === 0 && visibleCards.size > 0) {
      if (triggered && !userOff && !fadeTimer) startFade();
    } else if (before > 0 && visibleCards.size === 0) {
      stopFade(); video.muted = true; paint();
    }
  }, { threshold: 0 }) : null;
  function watchCards() {
    if (!cardIO) return;
    var list = document.querySelectorAll('.card[data-id^="santin"]');
    for (var i = 0; i < list.length; i++) {
      if (!list[i].__sbgWatched) { list[i].__sbgWatched = true; cardIO.observe(list[i]); }
    }
  }

  function findHost() {
    var el = null;
    try { el = document.querySelector(SECTION); } catch (e) {}
    if (el) return el;
    var c = document.querySelector('.card[data-id^="santin"]');
    return c ? (c.closest('section') || c.parentNode) : null;
  }

  var observed = null;
  function attach() {
    watchCards();
    var host = findHost();
    if (!host) return;
    if (video.parentNode === host && shade.parentNode === host) return;
    host.classList.add('sbg-host');
    host.insertBefore(shade, host.firstChild);
    host.insertBefore(video, host.firstChild);
    if (fadeTimer) play();
    if (io) { if (observed) io.unobserve(observed); io.observe(host); observed = host; }
    else { btn.classList.add('show'); play(); }
  }

  var t = 0;
  function sched() { clearTimeout(t); t = setTimeout(attach, 150); }
  if (window.MutationObserver) new MutationObserver(sched).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', attach);
  attach();
})();

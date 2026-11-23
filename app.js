/* Sticker Spam Society - negozio (carrello, IT/EN, filtri, animazioni) */
(function () {
  'use strict';
  var C = window.CATALOG, CFG = window.SITE_CONFIG || {};
  var LANG_KEY = 'ssc_lang', CART_KEY = 'ssc_cart_v1', SHIP_KEY = 'ssc_ship';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // ---------- testi ----------
  var T = {
    it: {
      announce: 'Spedizione gratis da 50€ · Ordine minimo 5€',
      nav_shop: 'Shop', nav_ship: 'Spedizioni', nav_custom: 'Su misura', nav_about: 'Chi siamo', nav_contact: 'Contatti',
      cart: 'Carrello', hero_sub: 'Non solo stickers.', cta_box: 'Prendi il box da 400', cta_shop: 'Vai agli stickers',
      ship_title: 'Spedizioni',
      ship_1: 'Italia: pacchi con InPost al locker (5,50€) o a domicilio con BRT o SDA (7,50€). All’estero per ora solo lettera.',
      ship_2: 'Lettera: 3€ in Italia, 7€ all’estero (Europa compresa, fino a 100 stickers). Senza tracking, senza rispedizione e senza rimborso. All’estero ti mandiamo il video di quando la imbuchiamo alle poste.',
      ship_3: 'Spedizione gratis sui pacchi da 50€.', ship_4: 'Ordine minimo 5€.',
      ship_5: 'Prepariamo l’ordine in 1-2 giorni e lo consegniamo al corriere entro 1 giorno.',
      ship_6: 'Corrieri: Poste per le lettere, InPost, BRT e SDA per i pacchi.',
      ship_7: 'La lettera va bene solo per stickers, tubini, schede, santini e portaclipper: massimo 2 oggetti (devono stare in una busta a bolle 20x13) e 50 stickers in Italia, 100 all’estero.',
      ship_8: 'Ritiro a mano: alle feste tekno.',
      custom_title: 'Ordini personalizzati', custom_h: 'Hai un logo?',
      custom_p: 'Facciamo ordini personalizzati con i loghi dei clienti. Scrivici e ne parliamo.', custom_cta: 'Scrivici',
      whole_h: 'Bancarelle e rivenditori', whole_p: 'Hai una bancarella o vuoi rivendere i nostri prodotti? Contattaci.', whole_cta: 'Contattaci',
      about_title: 'Chi siamo', about_1: 'Sticker Spam Society dal 2016 in giro per le vostre strade.',
      about_2: 'Una parte degli incassi la teniamo da parte per donare cibo e medicinali ai volontari ENPA.',
      contact_title: 'Contatti', contact_online: 'Solo online. Ci trovi alle feste tekno.', terms: 'Termini',
      search: 'Cerca uno sticker…', all: 'Tutti', add: 'Aggiungi', added: 'Aggiunto al carrello', of: 'su',
      empty: 'Il carrello è vuoto.', nothing: 'Nessun risultato.', remove: 'rimuovi',
      subtotal: 'Subtotale', shipping: 'Spedizione', total: 'Totale', free: 'Gratis',
      ship_h: 'Come vuoi riceverlo?',
      m_inpost: 'InPost locker', m_inpost_s: 'Solo Italia, ritiro al locker.',
      m_brt: 'BRT / SDA', m_brt_s: 'Solo Italia, a domicilio.',
      m_letter: 'Lettera Italia', m_letter_s: 'Solo Italia. No tracking, no reship, no refund.',
      m_letter_off: 'Non disponibile per questo carrello (solo stickers, tubini, schede, santini, portaclipper: max 50 stickers o 2 oggetti).',
      m_world: 'Lettera estero', m_world_s: 'Tutto il mondo tranne l’Italia. Senza tracking, può andare persa: ti mandiamo il video di quando la imbuchiamo.',
      m_world_off: 'Non disponibile per questo carrello (solo stickers, tubini, schede, santini, portaclipper: max 100 stickers o 2 oggetti).',
      left: 'Ti mancano {x} per la spedizione gratis sui pacchi.', gotfree: 'Spedizione gratis sui pacchi!',
      min: 'Ordine minimo {x}.',
      agree: 'Ho letto i <a href="termini.html" target="_blank">termini</a> e accetto le condizioni di spedizione (la lettera non è tracciata, può andare persa e non si rimborsa).',
      pay: 'Vai al pagamento', wait: 'Un attimo…',
      e_terms: 'Devi accettare i termini.', e_unset: 'Il pagamento non è ancora collegato. Torna presto!', e_fail: 'Qualcosa è andato storto. Riprova o scrivici.',
      tag_uv: 'UV', tag_nuovo: 'Nuovo', tag_acab: 'ACAB'
    },
    en: {
      announce: 'Free shipping from €50 · Minimum order €5',
      nav_shop: 'Shop', nav_ship: 'Shipping', nav_custom: 'Custom', nav_about: 'About', nav_contact: 'Contact',
      cart: 'Cart', hero_sub: 'Not just stickers.', cta_box: 'Get the 400 box', cta_shop: 'Go to stickers',
      ship_title: 'Shipping',
      ship_1: 'Italy: parcels with InPost to a locker (€5.50) or home delivery with BRT or SDA (€7.50). Abroad: letter only for now.',
      ship_2: 'Letter: €3 in Italy, €7 abroad (Europe included, up to 100 stickers). No tracking, no reship and no refund. Abroad, we send you a video of us dropping the letter in the mailbox.',
      ship_3: 'Free shipping on parcels from €50.', ship_4: 'Minimum order €5.',
      ship_5: 'We prepare your order in 1-2 days and hand it to the courier within 1 day.',
      ship_6: 'Couriers: Poste for letters, InPost, BRT and SDA for parcels.',
      ship_7: 'Letters are only for stickers, tubes, cards, holy cards and lighter holders: max 2 items (they must fit in a 20x13 bubble mailer) and 50 stickers in Italy, 100 abroad.',
      ship_8: 'Hand pickup: at tekno parties.',
      custom_title: 'Custom orders', custom_h: 'Got a logo?',
      custom_p: 'We make custom orders with your logo. Write to us and let’s talk.', custom_cta: 'Write to us',
      whole_h: 'Stalls and resellers', whole_p: 'Run a stall or want to resell our stuff? Get in touch.', whole_cta: 'Get in touch',
      about_title: 'About', about_1: 'Sticker Spam Society, on your streets since 2016.',
      about_2: 'We always set aside part of our earnings to donate food and medicine to ENPA volunteers.',
      contact_title: 'Contact', contact_online: 'Online only. Find us at tekno parties.', terms: 'Terms',
      search: 'Search a sticker…', all: 'All', add: 'Add', added: 'Added to cart', of: 'of',
      empty: 'Your cart is empty.', nothing: 'No results.', remove: 'remove',
      subtotal: 'Subtotal', shipping: 'Shipping', total: 'Total', free: 'Free',
      ship_h: 'How do you want it?',
      m_inpost: 'InPost locker', m_inpost_s: 'Italy only, pick up at the locker.',
      m_brt: 'BRT / SDA', m_brt_s: 'Italy only, home delivery.',
      m_letter: 'Letter Italy', m_letter_s: 'Italy only. No tracking, no reship, no refund.',
      m_letter_off: 'Not available for this cart (only stickers, tubes, cards, holy cards, lighter holders: max 50 stickers or 2 items).',
      m_world: 'Letter abroad', m_world_s: 'Worldwide except Italy. No tracking, it can get lost: we send you a video of us dropping it in the mailbox.',
      m_world_off: 'Not available for this cart (only stickers, tubes, cards, holy cards, lighter holders: max 100 stickers or 2 items).',
      left: 'Add {x} more for free parcel shipping.', gotfree: 'Free parcel shipping!',
      min: 'Minimum order {x}.',
      agree: 'I read the <a href="termini.html" target="_blank">terms</a> and accept the shipping conditions (letters are untracked, can get lost and are non-refundable).',
      pay: 'Go to checkout', wait: 'One sec…',
      e_terms: 'You must accept the terms.', e_unset: 'Payment is not connected yet. Come back soon!', e_fail: 'Something went wrong. Try again or write to us.',
      tag_uv: 'UV', tag_nuovo: 'New', tag_acab: 'ACAB'
    }
  };

  // ---------- stato ----------
  var lang = 'it', cart = [], shipMethod = 'inpost', agreed = false;
  function load(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  try { var l0 = localStorage.getItem(LANG_KEY); if (l0 === 'en' || l0 === 'it') lang = l0; else if ((navigator.language || '').slice(0, 2) !== 'it') lang = 'en'; } catch (e) {}
  cart = load(CART_KEY, []); shipMethod = load(SHIP_KEY, 'inpost');
  if (['inpost', 'brt', 'letter', 'letterworld'].indexOf(shipMethod) < 0) shipMethod = 'inpost';

  var BASE_N = C.products.length, EXTRA_KEY = 'sss_extra';
  function applyExtra(list) { C.products.length = BASE_N; (list || []).forEach(function (p) { if (p && p.id && p.options && !C.products.some(function (b) { return b.id === p.id; })) C.products.push(p); }); }
  applyExtra(load(EXTRA_KEY, []));
  var byId = {}; C.products.forEach(function (p) { byId[p.id] = p; });
  function reindex() { Object.keys(byId).forEach(function (k) { delete byId[k]; }); C.products.forEach(function (p) { byId[p.id] = p; }); }
  cart = cart.filter(function (l) { var p = byId[l.id]; return p && p.options[l.o] && (l.v < 0 || (p.variants && p.variants[l.v])); });

  function t(k, vars) { var s = (T[lang] && T[lang][k]) || T.it[k] || k; if (vars) for (var x in vars) s = s.replace('{' + x + '}', vars[x]); return s; }
  function money(n) { try { return new Intl.NumberFormat(lang === 'en' ? 'en-IE' : 'it-IT', { style: 'currency', currency: C.config.currency }).format(n); } catch (e) { return n.toFixed(2) + ' €'; } }
  function slug(s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pname(p) { return p.name; }
  function vlabel(p, i) { return i >= 0 && p.variants ? p.variants[i][lang] || p.variants[i].it : ''; }
  function olabel(p, i) { return p.options[i].l[lang === 'en' ? 1 : 0]; }
  function pdesc(p) { return p.desc ? p.desc[lang === 'en' ? 1 : 0] : ''; }
  function cname(c) { return c[lang][0]; }

  // ---------- retrobottega: prodotti esauriti e vacanza ----------
  var SHOPST_KEY = 'sss_shopst';
  var shopSt = load(SHOPST_KEY, null) || { closed: false, mode: 'closed', msg: '', back: '', off: [] };
  var TX = {
    it: { soldout: 'Esaurito', soldout_s: 'esaurito', cart_off: 'Alcuni prodotti nel carrello sono esauriti: rimuovili per continuare.', closed_cart: 'Il negozio \u00e8 in vacanza: gli ordini sono chiusi.', vac_default: 'Siamo in vacanza! Torniamo presto.', vac_open: 'Siamo in vacanza: puoi ordinare, spediamo dal {x}.' },
    en: { soldout: 'Sold out', soldout_s: 'sold out', cart_off: 'Some items in your cart are sold out: remove them to continue.', closed_cart: 'The shop is on holiday: orders are closed.', vac_default: 'We are on holiday! Back soon.', vac_open: 'We are on holiday: you can order, we ship from {x}.' }
  };
  function tx(k, vars) { var s = (TX[lang === 'en' ? 'en' : 'it'] || TX.it)[k] || k; if (vars) for (var x in vars) s = s.replace('{' + x + '}', vars[x]); return s; }
  function isOff(p, vi) { var o = shopSt.off || []; return o.indexOf(p.id) > -1 || (vi >= 0 && p.variants && p.variants[vi] && o.indexOf(p.id + '|' + p.variants[vi].it) > -1); }
  function shopClosed() { return shopSt.closed && shopSt.mode === 'closed'; }
  function banner() {
    var el = $('.announce'); if (!el) return;
    if (shopSt.closed) { el.textContent = shopSt.msg || (shopSt.mode === 'open' ? tx('vac_open', { x: shopSt.back || '...' }) : tx('vac_default')); el.classList.add('vac'); }
    else if (el.classList.contains('vac')) { el.classList.remove('vac'); applyLang(); }
  }
  function loadStatus() {
    var ep = ((window.SITE_CONFIG || {}).checkoutEndpoint || '').replace(/\/+$/, ''); if (!ep) return;
    fetch(ep + '/status').then(function (r) { return r.json(); }).then(function (j) {
      var n = { closed: !!j.closed, mode: j.mode === 'open' ? 'open' : 'closed', msg: j.msg || '', back: j.back || '', off: Array.isArray(j.off) ? j.off : [] };
      var ex = Array.isArray(j.extra) ? j.extra : [];
      var exChanged = JSON.stringify(ex) !== JSON.stringify(load(EXTRA_KEY, []));
      if (exChanged) { save(EXTRA_KEY, ex); applyExtra(ex); reindex(); cart = cart.filter(function (l) { var p = byId[l.id]; return p && p.options[l.o] && (l.v < 0 || (p.variants && p.variants[l.v])); }); save(CART_KEY, cart); }
      var changed = exChanged || JSON.stringify(n) !== JSON.stringify(shopSt);
      shopSt = n; save(SHOPST_KEY, n);
      if (changed) { banner(); renderShop(); renderCart(); }
    }).catch(function () {});   // se non risponde: il sito resta normale
  }
  setTimeout(banner, 0); setTimeout(loadStatus, 50);

  // ---------- immagini con fallback ----------
  function sources(p, vi) {
    var s = [], base = 'img/prodotti/';
    if (vi >= 0 && p.variants) { var vs = slug(p.variants[vi].it); s.push(base + p.id + '-' + vs + '.png', base + p.id + '-' + vs + '.jpg'); }
    s.push(base + p.id + '.png', base + p.id + '.jpg');
    return s;
  }
  function setImg(img, ph, list) {
    var i = 0;
    ph.classList.remove('nofoto');
    img.onerror = function () { i++; if (i < list.length) img.src = list[i]; else ph.classList.add('nofoto'); };
    img.src = list[0];
  }
  function setThumb(img, list) {
    var i = 0;
    img.onerror = function () { i++; if (i < list.length) img.src = list[i]; else img.style.display = 'none'; };
    img.src = list[0];
  }

  // ---------- i18n statico ----------
  function applyLang() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    $$('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false'); });
    var title = $('#heroTitle');
    var txt = lang === 'en' ? 'The sticker shop you were looking for' : 'Il negozio di stickers che cercavi';
    title.setAttribute('data-text', txt);
    title.innerHTML = lang === 'en' ? 'The <em>sticker</em> shop you were looking for' : 'Il negozio di <em>stickers</em> che cercavi';
    var names = C.categories.map(cname).join(' · ') + ' · ';
    $('#marquee').textContent = names + names + names + names;
    var m = $('#mailCustom'); if (m) m.setAttribute('href', 'mailto:stickerspamsociety@gmail.com?subject=' + encodeURIComponent(lang === 'en' ? 'Custom order' : 'Ordine personalizzato'));
  }

  // ---------- shop ----------
  var shop = $('#shop'), catbar = $('#catbar');
  var filters = {};  // per categoria: {q, tag, sub}

  function badgeFor(p) {
    if (p.tags.indexOf('uv') > -1) return '<span class="badge uv">UV</span>';
    if (p.tags.indexOf('nuovo') > -1) return '<span class="badge">' + esc(t('tag_nuovo')) + '</span>';
    return '';
  }

  function makeCard(p) {
    var card = document.createElement('article');
    card.className = 'card rv'; card.setAttribute('data-id', p.id);
    var vi = p.variants ? 0 : -1, oi = 0;
    var opts = '';
    if (p.options.length > 1) {
      opts = '<select class="sel-o" aria-label="Opzione">' + p.options.map(function (o, i) { return '<option value="' + i + '">' + esc(olabel(p, i)) + ' – ' + money(o.price) + '</option>'; }).join('') + '</select>';
    }
    var vars = '';
    if (p.variants) vars = '<select class="sel-v" aria-label="Variante">' + p.variants.map(function (v, i) { return '<option value="' + i + '">' + esc(v[lang] || v.it) + (isOff(p, i) ? ' - ' + esc(tx('soldout_s')) : '') + '</option>'; }).join('') + '</select>';
    card.innerHTML =
      '<div class="ph">' + badgeFor(p) + '<img alt="" loading="lazy"><div class="fallback">' + esc(pname(p)) + '</div></div>' +
      '<div class="body"><h3>' + esc(pname(p)) + '</h3>' + (pdesc(p) ? '<p class="d">' + esc(pdesc(p)) + '</p>' : '') + vars + opts +
      '<div class="buy"><span class="price"></span><button type="button" class="add">' + esc(t('add')) + '</button></div></div>';
    var img = $('img', card), ph = $('.ph', card), price = $('.price', card);
    function upd() { price.textContent = money(p.options[oi].price); }
    upd(); setImg(img, ph, sources(p, vi));
    var sv = $('.sel-v', card), so = $('.sel-o', card);
    if (sv) sv.addEventListener('change', function () { vi = +sv.value; sync(); setImg(img, ph, sources(p, vi)); if (p.cat === 'tubini' && window.tubinoFx) setTimeout(function () { window.tubinoFx(img, ph); }, 60); });
    if (so) so.addEventListener('change', function () { oi = +so.value; upd(); });
    var btn = $('.add', card);
    ph.setAttribute('data-sold', tx('soldout'));
    function sync() { var off = isOff(p, vi); card.classList.toggle('soldout', off); btn.disabled = off; btn.textContent = off ? tx('soldout') : t('add'); }
    sync();
    btn.addEventListener('click', function () {
      addToCart(p.id, vi, oi, 1);
      btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop');
    });
    return card;
  }

  function matches(p, f) {
    if (f.sub && p.sub !== f.sub) return false;
    if (f.tag && p.tags.indexOf(f.tag) < 0) return false;
    if (f.q && norm(p.name + ' ' + (p.variants ? p.variants.map(function (v) { return v.it; }).join(' ') : '')).indexOf(norm(f.q)) < 0) return false;
    return true;
  }

  // video di categoria (muto, in loop, con bottone audio)
  function makeVideo(src) {
    var w = document.createElement('div'); w.className = 'catvideo rv';
    var v = document.createElement('video');
    v.src = src; v.muted = true; v.defaultMuted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
    v.setAttribute('playsinline', ''); v.setAttribute('muted', ''); v.preload = 'metadata';
    var b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = 'AUDIO OFF';
    var on = false;
    b.addEventListener('click', function () { on = !on; v.muted = !on; b.textContent = on ? 'AUDIO ON' : 'AUDIO OFF'; if (v.paused) v.play(); });
    v.addEventListener('error', function () { w.remove(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } else v.pause(); }); }, { threshold: 0.25 }).observe(v);
    var up = false, _pl = v.play.bind(v);
    v.play = function () { return up ? Promise.resolve() : _pl(); };
    var pb = document.createElement('button'); pb.type = 'button'; pb.className = 'btn'; pb.textContent = 'PAUSA'; pb.style.cssText = 'left:10px;right:auto';
    pb.addEventListener('click', function () { up = !up; if (up) { v.pause(); } else { _pl(); } pb.textContent = up ? 'PLAY' : 'PAUSA'; });
    w.appendChild(v); w.appendChild(b); w.appendChild(pb);
    return w;
  }

  function renderCategory(c) {
    var f = filters[c.id] = filters[c.id] || {};
    var sec = $('#' + c.id, shop);
    if (!sec) {
      sec = document.createElement('section'); sec.className = 'cat'; sec.id = c.id; shop.appendChild(sec);
    }
    var all = C.products.filter(function (p) { return p.cat === c.id; });
    var tagsHere = []; all.forEach(function (p) { p.tags.forEach(function (x) { if (tagsHere.indexOf(x) < 0) tagsHere.push(x); }); });
    var chips = '';
    if (c.subs) chips = '<button type="button" class="chip" data-sub="" aria-pressed="' + (!f.sub) + '">' + esc(t('all')) + '</button>' + c.subs.map(function (s) { return '<button type="button" class="chip" data-sub="' + s.id + '" aria-pressed="' + (f.sub === s.id) + '">' + esc(s[lang]) + '</button>'; }).join('');
    if (c.id === 'stickers') chips = '<button type="button" class="chip" data-tag="" aria-pressed="' + (!f.tag) + '">' + esc(t('all')) + '</button>' + tagsHere.map(function (x) { return '<button type="button" class="chip" data-tag="' + x + '" aria-pressed="' + (f.tag === x) + '">' + esc(t('tag_' + x)) + '</button>'; }).join('');
    if (c.id === 'stickers') chips = ''; var tools = '';
    if (c.id === 'stickers') tools = '<input class="search" type="search" placeholder="' + esc(t('search')) + '" value="' + esc(f.q || '') + '" aria-label="' + esc(t('search')) + '">';
    var list = all.filter(function (p) { return matches(p, f); });
    sec.innerHTML = '<div class="cat-head rv rv-out" style="--bg-img:url(img/sfondi/' + c.id + '.jpg)"><h2>' + esc(cname(c)) + '</h2><p>' + esc(c[lang][1]) + '</p></div>' +
      ((chips || tools) ? '<div class="tools-row">' + tools + chips + (c.id === 'stickers' ? '<span class="count">' + (f.q ? list.length + ' ' + esc(t('of')) + ' ' + all.length : all.length + ' stickers') + '</span>' : '') + '</div>' : '') +
      '<div class="body-' + c.id + '"></div>';
    var host = $('.body-' + c.id, sec);
    if (c.id === 'offerte') {
      list.forEach(function (p) {
        var vi = -1, oi = 0;
        var d = document.createElement('div'); d.className = 'feat rv';
        d.innerHTML = '<div class="ph"><img alt="" loading="lazy"><div class="fallback">' + esc(pname(p)) + '</div></div><div><h3>' + esc(pname(p)) + '</h3><p class="d" style="font-weight:400;color:var(--mute)">' + esc(pdesc(p)) + '</p><span class="price">' + money(p.options[0].price) + '</span><button type="button" class="btn add">' + esc(t('add')) + '</button></div>';
        setImg($('img', d), $('.ph', d), sources(p, vi));
        (function (ph) {
          var v = document.createElement('video');
          v.src = 'img/box-400.mp4'; v.muted = true; v.defaultMuted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
          v.setAttribute('playsinline', ''); v.setAttribute('muted', ''); v.preload = 'auto';
          v.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1';
          ph.style.position = 'relative';
          var b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = 'AUDIO OFF';
          b.style.cssText = 'position:absolute;right:10px;bottom:10px;z-index:2;padding:7px 12px;font-size:.75rem';
          var on = false;
          b.addEventListener('click', function () { on = !on; v.muted = !on; b.textContent = on ? 'AUDIO ON' : 'AUDIO OFF'; if (v.paused) v.play(); });
          v.addEventListener('error', function () { v.remove(); b.remove(); });
          v.addEventListener('loadeddata', function () { ph.appendChild(b); });
          if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } else v.pause(); }); }, { threshold: 0.25 }).observe(v);
          ph.appendChild(v);
        })($('.ph', d));
        $('.add', d).addEventListener('click', function () { addToCart(p.id, vi, oi, 1); });
        if (isOff(p, -1)) { $('.add', d).disabled = true; $('.add', d).textContent = tx('soldout'); d.classList.add('soldout'); }
        host.appendChild(d);
      });
    } else {
      var g = document.createElement('div'); g.className = 'grid'; host.appendChild(g);
      if (c.id === 'tubini') host.insertBefore(makeVideo('img/tubini.mp4'), g);
      if (!list.length) host.innerHTML = '<p class="empty">' + esc(t('nothing')) + '</p>';
      list.forEach(function (p) { g.appendChild(makeCard(p)); });
    }
    // eventi filtri
    $$('.chip', sec).forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.hasAttribute('data-sub')) f.sub = b.getAttribute('data-sub');
        if (b.hasAttribute('data-tag')) f.tag = b.getAttribute('data-tag');
        renderCategory(c); observe(sec);
      });
    });
    var s = $('.search', sec);
    if (s) s.addEventListener('input', function () {
      f.q = s.value; var pos = s.selectionStart;
      renderCategory(c); var ns = $('.search', sec); ns.focus(); try { ns.setSelectionRange(pos, pos); } catch (e) {} observe(sec);
    });
  }

  function renderShop() {
    C.categories.forEach(renderCategory);
    catbar.innerHTML = C.categories.filter(function (c) { return c.id !== 'offerte'; }).map(function (c) { return '<a class="chip" href="#' + c.id + '">' + esc(cname(c)) + '</a>'; }).join('');
    observe(document);
  }

  // ---------- carrello ----------
  function lineKey(l) { return l.id + '|' + l.v + '|' + l.o; }
  function addToCart(id, v, o, q) {
    if (isOff(byId[id], v)) { toast(tx('soldout')); return; }
    var found = cart.filter(function (l) { return l.id === id && l.v === v && l.o === o; })[0];
    if (found) found.q = Math.min(99, found.q + q); else cart.push({ id: id, v: v, o: o, q: q });
    save(CART_KEY, cart); renderCart(); toast(t('added'));
    var tab = $('#cartTab'); tab.classList.remove('bump'); void tab.offsetWidth; tab.classList.add('bump');
  }
  function subtotal() { return cart.reduce(function (s, l) { return s + byId[l.id].options[l.o].price * l.q; }, 0); }
  function count() { return cart.reduce(function (s, l) { return s + l.q; }, 0); }

  // spedizioni: lettera Italia (3 euro) e lettera estero (7 euro) hanno limiti propri
  function letterCfg(kind) {
    var S = C.config.shipping;
    if (kind === 'letterworld') return S.letterWorld || { price: 7, maxStickers: 100, maxObjects: 2 };
    return S.letter;
  }
  function letterOk(kind) {
    if (!cart.length) return false;
    var L = letterCfg(kind), stk = 0, obj = 0;
    for (var i = 0; i < cart.length; i++) {
      var p = byId[cart[i].id], o = p.options[cart[i].o];
      if (!p.letter) return false;
      if (o.stk) stk += o.stk * cart[i].q; else obj += cart[i].q;
    }
    return stk <= L.maxStickers && obj <= L.maxObjects;
  }
  function isLetter(m) { return m === 'letter' || m === 'letterworld'; }
  function shipCost(sub) {
    var S = C.config.shipping;
    if (isLetter(shipMethod)) return letterCfg(shipMethod).price;
    if (sub >= C.config.freeShippingFrom) return 0;
    return S[shipMethod].price;
  }

  function renderCart() {
    var n = count(), sub = subtotal();
    $('#cartCount').textContent = n; $('#tabCount').textContent = n; $('#tabTotal').textContent = money(sub);
    if (isLetter(shipMethod) && !letterOk(shipMethod)) { shipMethod = 'inpost'; save(SHIP_KEY, shipMethod); }
    var lines = $('#cartLines'), foot = $('#cartFoot');
    if (!cart.length) { lines.innerHTML = '<p class="empty">' + esc(t('empty')) + '</p>'; foot.innerHTML = ''; return; }
    lines.innerHTML = cart.map(function (l, i) {
      var p = byId[l.id], o = p.options[l.o];
      var sub2 = [vlabel(p, l.v), p.options.length > 1 ? olabel(p, l.o) : ''].filter(Boolean).join(' · ');
      return '<div class="line' + (isOff(p, l.v) ? ' soldout-line' : '') + '" data-i="' + i + '"><div class="th"><img alt=""></div>' +
        '<div><div class="nm">' + esc(pname(p)) + '</div>' + (sub2 ? '<div class="vr">' + esc(sub2) + '</div>' : '') +
        '<div class="qty"><button type="button" data-d="-1" aria-label="-">−</button><span>' + l.q + '</span><button type="button" data-d="1" aria-label="+">+</button></div></div>' +
        '<div class="pr">' + money(o.price * l.q) + '<button type="button" class="rm" data-rm="1">' + esc(t('remove')) + '</button></div></div>';
    }).join('');
    $$('.line', lines).forEach(function (row) {
      var i = +row.getAttribute('data-i');
      setThumb($('.th img', row), sources(byId[cart[i].id], cart[i].v));
      $$('[data-d]', row).forEach(function (b) { b.addEventListener('click', function () { cart[i].q += +b.getAttribute('data-d'); if (cart[i].q <= 0) cart.splice(i, 1); if (cart[i] && cart[i].q > 99) cart[i].q = 99; save(CART_KEY, cart); renderCart(); }); });
      $('[data-rm]', row).addEventListener('click', function () { cart.splice(i, 1); save(CART_KEY, cart); renderCart(); });
    });
    var S = C.config.shipping, lokIT = letterOk('letter'), lokW = letterOk('letterworld'), free = C.config.freeShippingFrom, min = C.config.minOrder;
    var cost = shipCost(sub), tot = sub + cost;
    function m(id, name, price, small, off) {
      return '<label class="' + (off ? 'off' : '') + '"><input type="radio" name="ship" value="' + id + '"' + (shipMethod === id ? ' checked' : '') + (off ? ' disabled' : '') + '><span>' + esc(name) + ' – ' + money(price) + (small ? '<small>' + esc(small) + '</small>' : '') + '</span></label>';
    }
    var inpostP = sub >= free ? 0 : S.inpost.price, brtP = sub >= free ? 0 : S.brt.price;
    var bar = !isLetter(shipMethod) ? '<div class="bar"><i style="width:' + Math.min(100, sub / free * 100) + '%"></i></div><div class="hint">' + (sub >= free ? esc(t('gotfree')) : esc(t('left', { x: money(free - sub) }))) + '</div>' : '';
    foot.innerHTML =
      '<div class="hint" style="color:var(--ink)">' + esc(t('ship_h')) + '</div><div class="ship">' +
        m('inpost', t('m_inpost'), inpostP, t('m_inpost_s')) +
        m('brt', t('m_brt'), brtP, t('m_brt_s')) +
        m('letter', t('m_letter'), S.letter.price, lokIT ? t('m_letter_s') : t('m_letter_off'), !lokIT) +
        m('letterworld', t('m_world'), letterCfg('letterworld').price, lokW ? t('m_world_s') : t('m_world_off'), !lokW) +
      '</div>' + bar +
      '<div class="sum"><span>' + esc(t('subtotal')) + '</span><span>' + money(sub) + '</span></div>' +
      '<div class="sum"><span>' + esc(t('shipping')) + '</span><span>' + (cost === 0 ? esc(t('free')) : money(cost)) + '</span></div>' +
      '<div class="sum tot"><span>' + esc(t('total')) + '</span><span>' + money(tot) + '</span></div>' +
      (sub < min ? '<div class="hint">' + esc(t('min', { x: money(min) })) + '</div>' : '') +
      '<label class="terms"><input type="checkbox" id="agree"' + (agreed ? ' checked' : '') + '><span>' + t('agree') + '</span></label>' +
      '<button type="button" class="btn" id="payBtn"' + (sub < min ? ' disabled' : '') + '>' + esc(t('pay')) + '</button><div class="err" id="err" role="alert"></div>';
    $$('input[name=ship]', foot).forEach(function (r) { r.addEventListener('change', function () { shipMethod = r.value; save(SHIP_KEY, shipMethod); renderCart(); }); });
    $('#agree').addEventListener('change', function (e) { agreed = e.target.checked; });
    $('#payBtn').addEventListener('click', checkout);
  }

  function checkout() {
    if (shopClosed()) { toast(tx('closed_cart')); return; }
    if (cart.some(function (l) { return isOff(byId[l.id], l.v); })) { toast(tx('cart_off')); return; }
    var err = $('#err'), btn = $('#payBtn'); err.textContent = '';
    if (!$('#agree').checked) { err.textContent = t('e_terms'); return; }
    if (!CFG.checkoutEndpoint) { err.textContent = t('e_unset'); return; }
    btn.disabled = true; btn.textContent = t('wait');
    fetch(CFG.checkoutEndpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart.map(function (l) { return { id: l.id, v: l.v, o: l.o, q: l.q }; }), shipping: shipMethod, lang: lang })
    }).then(function (r) { return r.json().then(function (j) { if (!r.ok || !j.url) throw new Error(j.error || 'err'); return j; }); })
      .then(function (j) { window.location.href = j.url; })
      .catch(function (e) { err.textContent = t('e_fail') + (e && e.message && e.message !== 'err' ? ' (' + e.message + ')' : ''); btn.disabled = false; btn.textContent = t('pay'); });
  }

  // ---------- drawer / toast ----------
  function openCart() { $('#drawer').classList.add('open'); $('#veil').classList.add('open'); $('#drawer').setAttribute('aria-hidden', 'false'); }
  function closeCart() { $('#drawer').classList.remove('open'); $('#veil').classList.remove('open'); $('#drawer').setAttribute('aria-hidden', 'true'); }
  var toastT; function toast(msg) { var el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('show'); }, 1400); }
  $('#cartTab').addEventListener('click', openCart); $('#cartBtn').addEventListener('click', openCart);
  $('#closeCart').addEventListener('click', closeCart); $('#veil').addEventListener('click', closeCart);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeCart(); });
  $$('.lang button').forEach(function (b) { b.addEventListener('click', function () { lang = b.getAttribute('data-lang'); try { localStorage.setItem(LANG_KEY, lang); } catch (e) {} applyLang(); banner(); renderShop(); renderCart(); }); });

  // ---------- comparsa / scomparsa allo scroll ----------
  var io = null;
  function observe(root) {
    var els = $$('.rv', root === document ? document : root);
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    if (!io) io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var el = en.target;
        if (en.isIntersecting) { el.classList.add('in'); el.classList.remove('in-out'); }
        else if (el.classList.contains('rv-out')) el.classList.remove('in');   // titoli: svaniscono quando escono
      });
    }, { threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  }

  // ---------- scia del cursore ----------
  function trail() {
    var cv = $('#trail');
    if (!window.matchMedia || !matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) { cv.style.display = 'none'; return; }
    var ctx = cv.getContext('2d'), pts = [], W, H;
    function size() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; }
    size(); window.addEventListener('resize', size);
    var last = 0;
    window.addEventListener('pointermove', function (e) { var n = performance.now(); if (n - last < 16) return; last = n; pts.push({ x: e.clientX, y: e.clientY, a: 1 }); if (pts.length > 40) pts.shift(); });
    (function loop() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i]; p.a -= 0.035;
        if (p.a > 0) { var s = 4 + p.a * 8; ctx.fillStyle = 'rgba(182,255,0,' + (p.a * 0.55).toFixed(3) + ')'; ctx.fillRect(Math.round(p.x - s / 2), Math.round(p.y - s / 2), s, s); }
      }
      pts = pts.filter(function (p) { return p.a > 0; });
      requestAnimationFrame(loop);
    })();
  }

  // ---------- logo / foto opzionali ----------
  function optionalImages() {
    var im = new Image();
    im.onload = function () { $('#logoText').innerHTML = ''; var i = document.createElement('img'); i.src = 'img/logo.png'; i.alt = 'Sticker Spam Society'; $('#logoText').appendChild(i); };
    im.src = 'img/logo.png';
    var ab = $('#aboutImg'), a2 = new Image();
    a2.onload = function () { ab.hidden = false; }; a2.src = 'img/chi-siamo.jpg';
  }

  // ---------- avvio ----------
  applyLang(); renderShop(); renderCart(); trail(); optionalImages(); observe(document);
})();
/* Logo animato hero: inserisce il disegno e il filtro liquido */
(function () {
  function init() {
    var h = document.querySelector('.hero');
    if (!h || document.querySelector('.hero-art')) return;
    var d = document.createElement('div');
    d.className = 'hero-art'; d.setAttribute('aria-hidden', 'true'); d.innerHTML = '<i></i>';
    h.insertBefore(d, h.firstChild);
    var s = document.createElement('div');
    s.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    s.innerHTML = '<svg width="0" height="0" aria-hidden="true"><filter id="ssc-liquid" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.010 0.014" numOctaves="2" seed="4" result="n"><animate attributeName="baseFrequency" dur="12s" values="0.010 0.014;0.018 0.009;0.010 0.014" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" in2="n" scale="40" xChannelSelector="R" yChannelSelector="G"/></filter></svg>';
    document.body.appendChild(s);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
/* Tubi 3D ordinati: vista isometrica fissa, zone libere attorno a testo e raptor */
(function () {
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  function init() {
    var hero = document.querySelector('.hero');
    if (!hero || hero.querySelector('.hero-pipes')) return;
    var cv = document.createElement('canvas');
    cv.className = 'hero-pipes'; cv.setAttribute('aria-hidden', 'true');
    cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:.8';
    hero.insertBefore(cv, hero.firstChild);
    var mk = document.createElement('canvas'), mx = mk.getContext('2d');
    var ctx = cv.getContext('2d'), W = 0, H = 0, S = 36, running = false, visible = true;
    var AY = 0.785, AX = 0.5, CAM = 70, STEPF = 3, TICK = 1000 / 60, BND = [8, 6, 8], pipes = [], last = 0, acc = 0, frames = 0;
    var cy = Math.cos(AY), sy = Math.sin(AY), cx = Math.cos(AX), sx = Math.sin(AX);
    var DIRS = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
    var PAL = [['#2f6a00','#b6ff00','#f2ffc2'],['#2f6a00','#b6ff00','#f2ffc2'],['#3f7a00','#7acc00','#e6ff8a'],['#244d00','#5aa000','#c8f060']];
    function rnd(n) { return Math.floor(Math.random() * n); }
    function same(a, b) { return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]; }
    function proj(p) {
      var x1 = p[0] * cy + p[2] * sy, z1 = -p[0] * sy + p[2] * cy;
      var y2 = p[1] * cx - z1 * sx, z2 = p[1] * sx + z1 * cx, s = CAM / (CAM + z2);
      return [W * 0.5 + x1 * S * s, H * 0.5 - y2 * S * s, z2, s];
    }
    /* zone vietate: righe di testo, bottoni e raptor, con sfumatura */
    function buildMask() {
      var hr = hero.getBoundingClientRect(), pad = 26, off = W + 400, rects = [];
      function add(r) { if (r.width > 2 && r.height > 2) rects.push([r.left - hr.left - pad, r.top - hr.top - pad, r.width + pad * 2, r.height + pad * 2]); }
      var els = hero.querySelectorAll('.hero-in h1, .hero-in p, .hero-in blockquote, .hero-in .btn, .hero-in a, .hero-in button');
      for (var i = 0; i < els.length; i++) {
        var e = els[i];
        if (e.tagName === 'A' || e.tagName === 'BUTTON' || (e.className + '').indexOf('btn') > -1) { add(e.getBoundingClientRect()); continue; }
        var rg = document.createRange(); rg.selectNodeContents(e);
        var rs = rg.getClientRects(); for (var k = 0; k < rs.length; k++) add(rs[k]);
      }
      var art = hero.querySelector('.hero-art'); if (art) { var ar = art.getBoundingClientRect(); rects.push([ar.left - hr.left - 40, ar.top - hr.top - 40, ar.width + 80, ar.height + 80]); }
      mx.clearRect(0, 0, W, H);
      mx.save(); mx.shadowColor = '#000'; mx.shadowBlur = 44; mx.shadowOffsetX = off; mx.fillStyle = '#000';
      for (var j = 0; j < rects.length; j++) { var q = rects[j]; mx.fillRect(q[0] - off, q[1], q[2], q[3]); mx.fillRect(q[0] - off, q[1], q[2], q[3]); }
      mx.restore();
    }
    function resize() {
      var r = hero.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mk.width = W; mk.height = H;
      S = Math.max(22, Math.min(40, W / 34));
      BND = [Math.min(18, Math.ceil(W / (2.83 * S))), Math.min(10, Math.ceil(H / (1.8 * S))), Math.min(18, Math.ceil(W / (2.83 * S)))];
      buildMask();
    }
    function freeness(pt) {
      var q = proj(pt); if (q[0] < 0 || q[0] > W || q[1] < 0 || q[1] > H) return -1;
      try { return 255 - mx.getImageData(Math.floor(q[0]), Math.floor(q[1]), 1, 1).data[3]; } catch (e) { return 255; }
    }
    function newPipe(delay) {
      var best = null, bf = -2;
      for (var i = 0; i < 24; i++) {
        var p = [rnd(2*BND[0]+1)-BND[0], rnd(2*BND[1]+1)-BND[1], rnd(2*BND[2]+1)-BND[2]], f = freeness(p);
        if (f > bf) { bf = f; best = p; }
      }
      return { p: best, d: null, t: 0, n: 0, max: 14 + rnd(14), pal: PAL[rnd(PAL.length)], w: 0.24,
               segs: [], balls: [best.slice()], phase: 'wait', timer: delay || 1, alpha: 1 };
    }
    function pickDir(pp) {
      var ok = [];
      for (var i = 0; i < 6; i++) {
        var d = DIRS[i];
        if (pp.d && d[0] === -pp.d[0] && d[1] === -pp.d[1] && d[2] === -pp.d[2]) continue;
        if (Math.abs(pp.p[0]+d[0]) > BND[0] || Math.abs(pp.p[1]+d[1]) > BND[1] || Math.abs(pp.p[2]+d[2]) > BND[2]) continue;
        ok.push(d);
      }
      if (!ok.length) return null;
      if (pp.d && Math.random() > 0.18) for (var j = 0; j < ok.length; j++) if (same(ok[j], pp.d)) return ok[j];
      return ok[rnd(ok.length)];
    }
    function update(pp, i) {
      if (pp.phase === 'wait') { if (--pp.timer <= 0) pp.phase = 'grow'; return; }
      if (pp.phase === 'hold') { if (--pp.timer <= 0) pp.phase = 'fade'; return; }
      if (pp.phase === 'fade') { pp.alpha -= 0.04; if (pp.alpha <= 0) pipes[i] = newPipe(10 + rnd(40)); return; }
      if (!pp.d) { pp.d = pickDir(pp); pp.t = 0; if (!pp.d) { pp.phase = 'hold'; pp.timer = 20; return; } }
      pp.t++;
      if (pp.t >= STEPF) {
        var a = pp.p, b = [a[0]+pp.d[0], a[1]+pp.d[1], a[2]+pp.d[2]];
        pp.segs.push([a, b]); pp.p = b; pp.n++;
        var nd = pickDir(pp);
        if (pp.n >= pp.max || !nd) { pp.balls.push(b.slice()); pp.phase = 'hold'; pp.timer = 40 + rnd(40); pp.d = null; return; }
        if (!same(nd, pp.d)) pp.balls.push(b.slice());
        pp.d = nd; pp.t = 0;
      }
    }
    function strokeSeg(A, Bp, pp, pass) {
      var w = pp.w * S * (A[3] + Bp[3]) * 0.5, o = w * 0.22, dx = pass === 2 ? -o : 0;
      ctx.strokeStyle = pp.pal[pass]; ctx.lineWidth = w * [1.8, 1.25, 0.4][pass];
      ctx.beginPath(); ctx.moveTo(A[0] + dx, A[1] + dx); ctx.lineTo(Bp[0] + dx, Bp[1] + dx); ctx.stroke();
    }
    function drawBall(pt, pp) {
      var c = pt, r = pp.w * S * c[3] * 1.15;
      var g = ctx.createRadialGradient(c[0]-r*0.35, c[1]-r*0.35, r*0.08, c[0], c[1], r);
      g.addColorStop(0, pp.pal[2]); g.addColorStop(0.45, pp.pal[1]); g.addColorStop(1, pp.pal[0]);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c[0], c[1], r, 0, 6.2832); ctx.fill();
    }
    function loop(ts) {
      if (!running) return;
      if (!last) last = ts;
      acc += Math.min(ts - last, 100); last = ts;
      while (acc >= TICK) { for (var i = 0; i < pipes.length; i++) update(pipes[i], i); acc -= TICK; if (++frames % 90 === 0) buildMask(); }
      ctx.clearRect(0, 0, W, H);
      var list = [];
      for (var i2 = 0; i2 < pipes.length; i2++) {
        var pp = pipes[i2];
        if (pp.phase === 'wait') continue;
        var sg = [], zs = 0;
        for (var k = 0; k < pp.segs.length; k++) { var A = proj(pp.segs[k][0]), Bp = proj(pp.segs[k][1]); sg.push([A, Bp]); zs += A[2]; }
        if (pp.d && pp.phase === 'grow') {
          var f = pp.t / STEPF; sg.push([proj(pp.p), proj([pp.p[0]+pp.d[0]*f, pp.p[1]+pp.d[1]*f, pp.p[2]+pp.d[2]*f])]);
        }
        var bl = []; for (var j = 0; j < pp.balls.length; j++) bl.push(proj(pp.balls[j]));
        list.push({ pp: pp, sg: sg, bl: bl, z: sg.length ? zs / Math.max(1, pp.segs.length) : 0 });
      }
      list.sort(function (a, b) { return b.z - a.z; });
      ctx.lineCap = 'round';
      for (var m = 0; m < list.length; m++) {
        var L = list[m]; ctx.globalAlpha = Math.max(0, L.pp.alpha);
        for (var pass = 0; pass < 3; pass++) for (var n = 0; n < L.sg.length; n++) strokeSeg(L.sg[n][0], L.sg[n][1], L.pp, pass);
        for (var q = 0; q < L.bl.length; q++) drawBall(L.bl[q], L.pp);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'destination-out'; ctx.drawImage(mk, 0, 0, W, H); ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(loop);
    }
    function start() { if (!running && visible && !document.hidden) { running = true; last = 0; requestAnimationFrame(loop); } }
    function stop() { running = false; }
    function setup() {
      resize(); pipes = [];
      var count = W < 700 ? 2 : 4;
      for (var i = 0; i < count; i++) pipes.push(newPipe(1 + i * 25));
    }
    setup();
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(setup, 200); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(buildMask);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; visible ? start() : stop(); }).observe(hero);
    start();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

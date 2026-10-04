/**
 * LUCKY SHAKER — CAN CAROUSEL SHOP
 * Drag / swipe / wheel / keyboard carousel, quick-view pop-up with a "can flies
 * into the modal" transition, spirit index, custom cursor and view toggle.
 * Vanilla JS (no GSAP dependency) so it works whatever the script load order.
 */
(function () {
  'use strict';

  var DICT = {
    es: {
      more: 'VER MÁS', add: 'AGREGAR A LA BOLSA', added: 'AGREGADO ✓', soldout: 'AGOTADO',
      ingredients: 'Ingredientes', ritual: 'Ritual de servicio', full: 'Ver ficha completa',
      trust: 'Entrega con verificación de identidad 21+.', view: 'VER',
      sp_tequila: 'Tequila', sp_rum: 'Ron', sp_gin: 'Gin', sp_vodka: 'Vodka', sp_whiskey: 'Whiskey', sp_sparkling: 'Espumoso',
      default_desc: 'Cóctel artesanal de autor, listo para servir.',
      view_carousel: 'Carrusel', view_grid: 'Cuadrícula', prev: 'Anterior', next: 'Siguiente', close: 'Cerrar', qty: 'Cantidad'
    },
    en: {
      more: 'SEE MORE', add: 'ADD TO BAG', added: 'ADDED ✓', soldout: 'SOLD OUT',
      ingredients: 'Ingredients', ritual: 'Serving ritual', full: 'View full details',
      trust: 'Delivery requires 21+ ID verification.', view: 'VIEW',
      sp_tequila: 'Tequila', sp_rum: 'Rum', sp_gin: 'Gin', sp_vodka: 'Vodka', sp_whiskey: 'Whiskey', sp_sparkling: 'Sparkling',
      default_desc: 'Craft signature cocktail, ready to serve.',
      view_carousel: 'Carousel', view_grid: 'Grid', prev: 'Previous', next: 'Next', close: 'Close', qty: 'Quantity'
    }
  };
  var SPIRIT_ORDER = ['tequila', 'rum', 'gin', 'vodka', 'whiskey', 'sparkling'];

  /* ---------- Ingredient atmosphere (data) ----------
   * Every drink gets its own cloud of ingredient sprites (assets/ing-<name>.webp)
   * floating behind (b) and in front of (f) the cans. The first tokens are the
   * "hero" ingredients and land in the most prominent slots. Tokens:
   *   <sprite>  a photo sprite · ice  a CSS ice cube · blue-wheel  tinted orange
   *   fizz      rising bubbles (no slot)                                         */
  var ING_LABEL = {
    es: { 'lime-wheel': 'Lima', 'lime-half': 'Lima', 'lemon-wheel': 'Limón', 'lemon-twist': 'Twist de limón', 'orange-wheel': 'Naranja', 'orange-peel': 'Piel de naranja', 'grapefruit-half': 'Toronja', 'pineapple-wedge': 'Piña', peach: 'Durazno', cranberries: 'Cranberry', mint: 'Menta', 'coffee-beans': 'Café', ginger: 'Jengibre', 'coconut-half': 'Coco', agave: 'Agave', 'sugar-cubes': 'Azúcar', juniper: 'Enebro', cherry: 'Cereza', 'sea-salt': 'Sal marina', olive: 'Aceituna', ice: 'Hielo', 'blue-curacao': 'Blue Curaçao' },
    en: { 'lime-wheel': 'Lime', 'lime-half': 'Lime', 'lemon-wheel': 'Lemon', 'lemon-twist': 'Lemon twist', 'orange-wheel': 'Orange', 'orange-peel': 'Orange peel', 'grapefruit-half': 'Grapefruit', 'pineapple-wedge': 'Pineapple', peach: 'Peach', cranberries: 'Cranberry', mint: 'Mint', 'coffee-beans': 'Coffee', ginger: 'Ginger', 'coconut-half': 'Coconut', agave: 'Agave', 'sugar-cubes': 'Sugar', juniper: 'Juniper', cherry: 'Cherry', 'sea-salt': 'Sea salt', olive: 'Olive', ice: 'Ice', 'blue-curacao': 'Blue Curaçao' }
  };
  var FX_RECIPES = {
    margarita: ['lime-half', 'sea-salt', 'agave', 'orange-wheel', 'lime-wheel', 'ice', 'lime-wheel'],
    paloma: ['grapefruit-half', 'sea-salt', 'lime-wheel', 'agave', 'grapefruit-half', 'ice', 'lime-half'],
    daiquiri: ['lime-half', 'sugar-cubes', 'lime-wheel', 'ice', 'lime-wheel', 'sugar-cubes', 'ice'],
    caipirinha: ['lime-half', 'sugar-cubes', 'lime-wheel', 'ice', 'lime-wheel', 'ice', 'lime-half'],
    'mai-tai': ['pineapple-wedge', 'lime-half', 'mint', 'orange-wheel', 'cherry', 'coconut-half', 'ice'],
    'pina-colada': ['pineapple-wedge', 'coconut-half', 'cherry', 'pineapple-wedge', 'ice', 'coconut-half', 'cherry'],
    'malibu-bay-breeze': ['pineapple-wedge', 'cranberries', 'coconut-half', 'lime-wheel', 'ice', 'cranberries', 'pineapple-wedge'],
    'blue-hawaii': ['pineapple-wedge', 'blue-wheel', 'lime-wheel', 'ice', 'cherry', 'pineapple-wedge', 'blue-wheel'],
    'gin-tonic': ['lemon-wheel', 'juniper', 'lime-wheel', 'ice', 'lemon-twist', 'ice', 'juniper', 'fizz'],
    negroni: ['orange-wheel', 'juniper', 'orange-peel', 'ice', 'orange-wheel', 'ice', 'orange-peel'],
    'classic-martini': ['olive', 'lemon-twist', 'juniper', 'ice', 'lemon-wheel', 'olive', 'ice'],
    'moscow-mule': ['ginger', 'lime-half', 'mint', 'lime-wheel', 'ice', 'ginger', 'lime-wheel', 'fizz'],
    cosmopolitan: ['cranberries', 'lime-wheel', 'orange-wheel', 'ice', 'lime-half', 'cranberries', 'orange-peel'],
    'sex-on-the-beach': ['peach', 'orange-wheel', 'cranberries', 'ice', 'peach', 'cranberries', 'orange-wheel'],
    'espresso-martini': ['coffee-beans', 'sugar-cubes', 'coffee-beans', 'ice', 'coffee-beans', 'sugar-cubes', 'coffee-beans'],
    manhattan: ['cherry', 'orange-peel', 'ice', 'cherry', 'orange-peel', 'ice', 'orange-wheel'],
    'old-fashioned': ['orange-peel', 'sugar-cubes', 'cherry', 'ice', 'orange-wheel', 'ice', 'orange-peel'],
    mimosa: ['orange-wheel', 'orange-peel', 'orange-wheel', 'orange-peel', 'orange-wheel', 'fizz']
  };
  // relative visual weight of each sprite so a cherry isn't as big as a coconut
  var FX_SIZE = {
    'lime-wheel': 1, 'lime-half': 1, 'lemon-wheel': 1, 'lemon-twist': 0.95, 'orange-wheel': 1.05, 'orange-peel': 1.05,
    'grapefruit-half': 1.1, 'pineapple-wedge': 1.15, peach: 1.15, cranberries: 0.85, mint: 1, 'coffee-beans': 0.85,
    ginger: 1.1, 'coconut-half': 1.2, agave: 1.05, 'sugar-cubes': 0.85, juniper: 0.95, cherry: 0.85, 'sea-salt': 0.9,
    olive: 1.05, ice: 0.95, 'blue-wheel': 1.05
  };
  // layer, x%, y%, size (× can height), parallax depth px, blur px, opacity — left column stays clear of the spirit index
  var FX_SLOTS = [
    ['b', 27, 22, 0.27, 14, 0, 0.96],
    ['f', 4, 93, 0.44, 46, 3.5, 1],
    ['f', 95, 34, 0.38, 40, 3, 1],
    ['b', 75, 16, 0.25, 14, 0, 0.96],
    ['f', 92, 75, 0.33, 34, 2, 1],
    ['b', 31, 77, 0.22, 18, 0.4, 0.94],
    ['b', 67, 80, 0.21, 18, 0.4, 0.94],
    ['f', 18, 91, 0.26, 30, 1.2, 1],
    ['b', 86, 46, 0.26, 22, 1.2, 0.92],
    ['f', 42, 93, 0.22, 28, 0, 1]
  ];
  function hashStr(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { var t = seed >>> 0; return function () { t += 0x6D2B79F5; var r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function lang() {
    var l = (window.LuckyShakerLang && window.LuckyShakerLang.currentLang) || document.documentElement.lang || 'es';
    return l.indexOf('en') === 0 ? 'en' : 'es';
  }
  function T(key) { return (DICT[lang()] && DICT[lang()][key]) || DICT.es[key] || key; }
  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function init(root) {
    if (!root || root.getAttribute('data-cc-ready')) return;
    root.setAttribute('data-cc-ready', '1');

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    var stage = root.querySelector('.cc-stage');
    var track = root.querySelector('.cc-track');
    var infosWrap = root.querySelector('.cc-infos');
    var live = root.querySelector('[data-cc-live]');
    var modal = root.querySelector('[data-cc-modal]');
    var cursor = root.querySelector('[data-cc-cursor]');
    var cursorLabel = root.querySelector('[data-cc-cursor-label]');
    var spiritBtns = [].slice.call(root.querySelectorAll('.cc-spirit'));
    var toolBtns = [].slice.call(root.querySelectorAll('[data-cc-view]'));

    /* ---------- Build the ordered item list (grouped by spirit, stable) ---------- */
    var infos = [].slice.call(root.querySelectorAll('.cc-info'));
    var cans = [].slice.call(root.querySelectorAll('.cc-can'));
    var bgs = [].slice.call(root.querySelectorAll('.cc-bg-img'));
    var items = infos.map(function (info, k) {
      return { info: info, can: cans[k], bg: bgs[k], rank: SPIRIT_ORDER.indexOf(info.getAttribute('data-spirit')), k: k };
    }).sort(function (x, y) { return (x.rank - y.rank) || (x.k - y.k); });
    var n = items.length;
    items.forEach(function (it, i) {
      it.i = i;
      it.info.setAttribute('data-i', i);
      it.can.setAttribute('data-i', i);
      if (it.bg) it.bg.setAttribute('data-i', i);
    });

    applyLang();
    document.addEventListener('luckyshaker:langchange', applyLang);

    if (!n) return;

    var a = 0;
    var hash = (location.hash || '').replace('#', '');
    if (hash) {
      items.forEach(function (it) { if (it.info.getAttribute('data-handle') === hash) a = it.i; });
    }

    /* ---------- Rendering ---------- */
    function offset(i) {
      var d = ((i - a) % n + n) % n;
      if (d > n / 2) d -= n;
      return d;
    }

    function prime(el, past) {
      // put a title in its "entry" position without animating
      var span = el.querySelector('.cc-info-title > span');
      if (!span) return;
      span.style.transition = 'none';
      el.classList.toggle('is-past', !!past);
      void span.offsetWidth;
      span.style.transition = '';
    }

    function render(dir, first, oldA) {
      var isJump = !first && oldA != null && Math.abs(offset(oldA)) > 1;

      items.forEach(function (it) {
        var d = offset(it.i);
        var pos = Math.abs(d) <= 3 ? d : (d > 0 ? 9 : -9);

        if (!first && oldA != null) {
          if (it.i === a) {
            var entryPos = dir > 0 ? 9 : -9;
            var curPos = parseInt(it.can.getAttribute('data-pos'), 10);
            if (curPos !== entryPos && (isJump || curPos === 0)) {
              it.can.classList.add('is-priming');
              it.can.setAttribute('data-pos', entryPos);
              void it.can.offsetWidth;
              it.can.classList.remove('is-priming');
            }
            pos = 0;
          } else if (it.i === oldA) {
            pos = dir > 0 ? -9 : 9;
          } else if (isJump && Math.abs(d) <= 2) {
            var neighborEntry = dir > 0 ? 9 : -9;
            it.can.classList.add('is-priming');
            it.can.setAttribute('data-pos', neighborEntry);
            void it.can.offsetWidth;
            it.can.classList.remove('is-priming');
          }
        }

        it.can.setAttribute('data-pos', pos);
        it.can.tabIndex = -1;
        if (it.bg) it.bg.classList.toggle('is-on', it.i === a);
      });
      fxApply(dir, first, oldA);

      items.forEach(function (it) {
        var el = it.info;
        var active = it.i === a;
        var wasActive = el.classList.contains('is-active');
        if (active && !wasActive) {
          if (!first) prime(el, dir < 0);
          el.classList.remove('is-past');
          if (first) el.classList.remove('is-past');
          // next frame so the primed position is committed before animating
          el.classList.add('is-active');
        } else if (!active && wasActive) {
          el.classList.remove('is-active');
          el.classList.toggle('is-past', dir > 0);
        }
        el.setAttribute('aria-hidden', active ? 'false' : 'true');
        var btn = el.querySelector('[data-cc-open]');
        if (btn) btn.tabIndex = active ? 0 : -1;
      });

      var cur = items[a];
      root.style.setProperty('--cc-tint', cur.info.getAttribute('data-tint') || '#d9dbe3');

      var now = root.querySelector('[data-cc-now]');
      if (now) now.textContent = pad2(a + 1);
      var total = root.querySelector('[data-cc-total]');
      if (total) total.textContent = pad2(n);

      var sp = cur.info.getAttribute('data-spirit');
      spiritBtns.forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-spirit') === sp); });

      if (live) live.textContent = cur.info.getAttribute('data-title') + ' — ' + (a + 1) + ' / ' + n;

      try {
        if (!first) history.replaceState(null, '', '#' + cur.info.getAttribute('data-handle'));
      } catch (e) { /* ignore */ }
    }

    /* ---------- Ingredient atmosphere (engine) ---------- */
    var fxBack = root.querySelector('[data-cc-fx-back]');
    var fxFront = root.querySelector('[data-cc-fx-front]');
    var fxTip = root.querySelector('[data-cc-fx-tip]');
    var fxAssets = {};
    try {
      var fxJson = document.querySelector('[data-cc-fx-assets]');
      if (fxJson) fxAssets = JSON.parse(fxJson.textContent);
    } catch (e) { fxAssets = {}; }

    function fxToken(tok) {
      if (tok === 'ice') {
        if (fxAssets['ice']) return { kind: 'img', src: fxAssets['ice'], label: 'ice', size: FX_SIZE['ice'] || 0.95 };
        return { kind: 'ice', label: 'ice' };
      }
      if (tok === 'blue-wheel') return { kind: 'img', src: fxAssets['orange-wheel'], label: 'blue-curacao', blue: true, size: FX_SIZE['blue-wheel'] };
      return { kind: 'img', src: fxAssets[tok], label: tok, size: FX_SIZE[tok] || 1 };
    }

    function fxBuild(it) {
      if (it.fx !== undefined) return it.fx;
      var handle = it.info.getAttribute('data-handle');
      var recipe = FX_RECIPES[handle];
      if (!recipe || !fxBack || !fxFront) { it.fx = null; return null; }
      var rnd = rng(hashStr(handle));
      var setB = document.createElement('div');
      var setF = document.createElement('div');
      setB.className = setF.className = 'cc-fx-set is-after';
      var pieces = [];
      var slotIdx = 0;

      recipe.forEach(function (tok) {
        if (tok === 'fizz') {
          for (var b = 0; b < 14; b++) {
            var bub = document.createElement('i');
            bub.className = 'cc-bub';
            bub.style.cssText = '--x:' + (6 + rnd() * 88).toFixed(1) + '%;--d:' + (6 + rnd() * 15).toFixed(1) + 'px;--bd:' + (5.5 + rnd() * 5).toFixed(1) + 's;--bw:' + (-rnd() * 9).toFixed(1) + 's;--sw:' + ((rnd() - 0.5) * 46).toFixed(0) + 'px';
            setB.appendChild(bub);
          }
          return;
        }
        var slot = FX_SLOTS[slotIdx];
        if (!slot) return;
        var spec = fxToken(tok);
        if (spec.kind === 'img' && !spec.src) return;
        var idx = slotIdx++;
        var sz = slot[3] * (spec.size || 1) * (0.92 + rnd() * 0.18);
        var p = document.createElement('span');
        p.className = 'cc-fx-p';
        p.setAttribute('data-k', spec.label);
        var dk = (slot[0] === 'f' ? 0.78 : 0.52) * (0.85 + rnd() * 0.3);
        p.style.cssText = '--x:' + slot[1] + '%;--y:' + slot[2] + '%;--sz:' + sz.toFixed(3) + ';--k:' + (slot[4] * (0.85 + rnd() * 0.3)).toFixed(1) +
          ';--dk:' + dk.toFixed(3) + ';--bl:' + slot[5] + 'px;--op:' + slot[6] + ';--rot:' + ((rnd() * 70 - 35).toFixed(1)) + 'deg;--dl:' + (idx * 68) + 'ms;--fd:' + (4.6 + rnd() * 3.2).toFixed(1) +
          's;--fy:' + (-rnd() * 7).toFixed(1) + 's;--fa:' + (-(16 + rnd() * 22)).toFixed(0) + 'px;--fx:' + ((rnd() - 0.5) * 28).toFixed(0) + 'px;--fr:' + ((rnd() - 0.5) * 16).toFixed(1) +
          'deg;--ex-k:' + (0.85 + rnd() * 0.35).toFixed(2) + ';--ey:' + ((rnd() - 0.5) * 50).toFixed(0) + 'px';
        var inner = document.createElement('span');
        inner.className = 'cc-fx-i';
        var vis;
        if (spec.kind === 'ice') {
          vis = document.createElement('span');
          vis.className = 'cc-fx-f cc-fx-ice';
        } else {
          vis = document.createElement('img');
          vis.className = 'cc-fx-f' + (spec.blue ? ' cc-fx-f--blue' : '');
          vis.src = spec.src;
          vis.alt = '';
          vis.width = 560;
          vis.height = 560;
          vis.draggable = false;
          vis.decoding = 'async';
        }
        inner.appendChild(vis);
        p.appendChild(inner);
        (slot[0] === 'b' ? setB : setF).appendChild(p);
        pieces.push({ el: p, vis: vis, layer: slot[0] });
      });

      fxBack.appendChild(setB);
      fxFront.appendChild(setF);
      void setB.offsetWidth; // commit the "entry" state so the first reveal animates
      void setF.offsetWidth;
      it.fx = { back: setB, front: setF, pieces: pieces };
      return it.fx;
    }

    var fxEntryRaf = 0;
    function fxApply(dir, first, oldA) {
      if (fxEntryRaf) {
        cancelAnimationFrame(fxEntryRaf);
        fxEntryRaf = 0;
      }

      // Ensure active and outgoing sets are built
      fxBuild(items[a]);
      if (oldA != null && items[oldA]) fxBuild(items[oldA]);

      // Pre-build nearby items so they are ready
      for (var k = 0; k < n; k++) {
        var it = items[k];
        var d = offset(it.i);
        if (Math.abs(d) <= 2) fxBuild(it);
      }

      var incoming = items[a];
      var outgoing = (oldA != null && oldA !== a) ? items[oldA] : null;

      if (first) {
        for (var k = 0; k < n; k++) {
          var it = items[k];
          if (!it.fx) continue;
          var d = offset(it.i);
          var cls = 'cc-fx-set ' + (d === 0 ? 'is-on' : (d < 0 ? 'is-before' : 'is-after'));
          it.fx.back.className = it.fx.front.className = cls;
        }
        return;
      }

      // 1. Outgoing set: slide smoothly out to exit side
      if (outgoing && outgoing.fx) {
        var exitClass = dir > 0 ? 'is-before' : 'is-after';
        outgoing.fx.back.className = outgoing.fx.front.className = 'cc-fx-set ' + exitClass;
      }

      // 2. All other inactive sets: park them offscreen without triggering transitions
      for (var k = 0; k < n; k++) {
        var it = items[k];
        if (it.i !== a && it.i !== oldA && it.fx) {
          var d = offset(it.i);
          var parkClass = 'cc-fx-set ' + (d < 0 ? 'is-before' : 'is-after');
          if (it.fx.back.className !== parkClass) {
            it.fx.back.className = it.fx.front.className = parkClass;
          }
        }
      }

      // 3. Incoming set: prime at entry position with transitions suppressed, then animate in
      if (incoming && incoming.fx) {
        var entryClass = dir > 0 ? 'is-after' : 'is-before';
        incoming.fx.back.className = incoming.fx.front.className = 'cc-fx-set is-priming ' + entryClass;
        void incoming.fx.back.offsetWidth;
        void incoming.fx.front.offsetWidth;

        fxEntryRaf = requestAnimationFrame(function () {
          incoming.fx.back.className = incoming.fx.front.className = 'cc-fx-set is-on';
          fxEntryRaf = 0;
        });
      }
    }
    // warm all sets shortly after load so every sprite is decoded and ready
    (window.requestIdleCallback || function (f) { return setTimeout(f, 400); })(function () {
      items.forEach(function (it) { fxBuild(it); });
    });

    // parallax: the clouds drift against the pointer (or the tilt of the phone), nearer pieces move more
    var fxLayers = [fxBack, fxFront].filter(Boolean);
    var tpx = 0, tpy = 0, cpx = 0, cpy = 0, fxRaf = 0;
    function fxLoop() {
      cpx += (tpx - cpx) * 0.075;
      cpy += (tpy - cpy) * 0.075;
      var sx = cpx.toFixed(4), sy = cpy.toFixed(4);
      fxLayers.forEach(function (l) { l.style.setProperty('--px', sx); l.style.setProperty('--py', sy); });
      fxRaf = (Math.abs(tpx - cpx) > 0.002 || Math.abs(tpy - cpy) > 0.002) ? requestAnimationFrame(fxLoop) : 0;
    }
    function fxTarget(x, y) {
      if (reduced) return;
      tpx = clamp(x, -1, 1);
      tpy = clamp(y, -1, 1);
      if (!fxRaf) fxRaf = requestAnimationFrame(fxLoop);
    }
    if (!reduced && !finePointer && window.DeviceOrientationEvent && typeof window.DeviceOrientationEvent.requestPermission !== 'function') {
      window.addEventListener('deviceorientation', function (e) {
        if (e.gamma == null || drag) return;
        fxTarget(e.gamma / 26, ((e.beta || 50) - 50) / 26);
      }, { passive: true });
    }

    // hover label: name the ingredient under the pointer (proximity test, so the sprites never block the cans)
    var tipRaf = 0, tipLast = null, tipKey = '', tipAt = 0;
    function tipHide() {
      tipKey = '';
      if (fxTip) fxTip.classList.remove('is-on');
    }
    function tipUpdate() {
      tipRaf = 0;
      var e = tipLast;
      if (!e || !fxTip || drag || (modal && !modal.hidden)) { tipHide(); return; }
      var cur = items[a];
      if (!cur || !cur.fx) { tipHide(); return; }
      var overCan = !!(e.target && e.target.closest && e.target.closest('.cc-can'));
      var hit = null;
      for (var i = cur.fx.pieces.length - 1; i >= 0; i--) {
        var pc = cur.fx.pieces[i];
        if (overCan && pc.layer === 'b') continue;
        var r = pc.vis.getBoundingClientRect();
        var padX = r.width * 0.04, padY = r.height * 0.04;
        if (e.clientX >= r.left + padX && e.clientX <= r.right - padX && e.clientY >= r.top + padY && e.clientY <= r.bottom - padY) {
          hit = { pc: pc, r: r };
          break;
        }
      }
      if (!hit) { tipHide(); return; }
      var key = hit.pc.el.getAttribute('data-k');
      var st = stage.getBoundingClientRect();
      fxTip.textContent = (ING_LABEL[lang()] && ING_LABEL[lang()][key]) || key;
      fxTip.style.setProperty('--tx', (hit.r.left + hit.r.width / 2 - st.left).toFixed(0) + 'px');
      fxTip.style.setProperty('--ty', (hit.r.top - st.top + hit.r.height * 0.12).toFixed(0) + 'px');
      fxTip.classList.add('is-on');
      tipKey = key;
    }
    function tipSchedule(e) {
      tipLast = e;
      var now = Date.now();
      if (tipRaf || now - tipAt < 70) return;
      tipAt = now;
      tipRaf = requestAnimationFrame(tipUpdate);
    }
    if (finePointer && fxTip) {
      root.addEventListener('mousemove', function (e) {
        var r = stage.getBoundingClientRect();
        fxTarget((e.clientX - r.left - r.width / 2) / (r.width / 2), (e.clientY - r.top - r.height / 2) / (r.height / 2));
      });
      root.addEventListener('mouseleave', function () { fxTarget(0, 0); });
      stage.addEventListener('mousemove', tipSchedule);
      stage.addEventListener('mouseleave', function () {
        tipLast = null;
        tipHide();
      });
    }

    // Intro: every can starts off to the sides, then glides into place
    items.forEach(function (it) { it.can.setAttribute('data-pos', offset(it.i) > 0 ? '9' : '-9'); });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { render(1, true); });
    });

    function go(delta) {
      if (n < 2) return;
      var oldA = a;
      a = ((a + delta) % n + n) % n;
      render(delta > 0 ? 1 : -1, false, oldA);
    }
    function jumpTo(i, preferredDir) {
      if (i === a) return;
      var oldA = a;
      var dir;
      if (preferredDir != null) {
        dir = preferredDir > 0 ? 1 : -1;
      } else {
        var d = i - a;
        if (d > n / 2) d -= n;
        if (d < -n / 2) d += n;
        dir = d > 0 ? 1 : -1;
      }
      a = i;
      render(dir, false, oldA);
    }

    root.querySelector('[data-cc-prev]').addEventListener('click', function () { go(-1); });
    root.querySelector('[data-cc-next]').addEventListener('click', function () { go(1); });
    spiritBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var targetSp = b.getAttribute('data-spirit');
        var curSp = items[a].info.getAttribute('data-spirit');
        var curRank = SPIRIT_ORDER.indexOf(curSp);
        var targetRank = SPIRIT_ORDER.indexOf(targetSp);
        for (var i = 0; i < n; i++) {
          if (items[i].info.getAttribute('data-spirit') === targetSp) {
            if (i === a) return;
            var preferredDir = 1;
            if (targetRank !== curRank && targetRank !== -1 && curRank !== -1) {
              preferredDir = targetRank > curRank ? 1 : -1;
            } else {
              preferredDir = i > a ? 1 : -1;
            }
            jumpTo(i, preferredDir);
            break;
          }
        }
      });
    });

    /* ---------- Drag / swipe ---------- */
    var drag = null;
    var suppressClick = false;

    stage.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.target.closest('.cc-arrow')) return;
      drag = { x: e.clientX, y: e.clientY, dx: 0, moved: false, id: e.pointerId };
    });
    window.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 7) {
        drag.moved = true;
        root.classList.add('is-dragging');
        if (cursor) cursor.classList.add('is-drag');
      }
      if (drag.moved) {
        drag.dx = dx;
        stage.style.setProperty('--cc-drag', dx + 'px');
        stage.style.setProperty('--cc-tilt', Math.max(-9, Math.min(9, dx / 22)) + 'deg');
        fxTarget(-dx / 220, 0);
        tipHide();
      }
    });
    function endDrag(e) {
      if (!drag || (e && e.pointerId !== drag.id)) return;
      var moved = drag.moved, dx = drag.dx;
      drag = null;
      root.classList.remove('is-dragging');
      if (cursor) cursor.classList.remove('is-drag');
      stage.style.setProperty('--cc-drag', '0px');
      stage.style.setProperty('--cc-tilt', '0deg');
      fxTarget(0, 0);
      if (moved) {
        suppressClick = true;
        setTimeout(function () { suppressClick = false; }, 60);
        if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
      }
    }
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    var wheelLock = 0;
    stage.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 24) {
        e.preventDefault();
        var now = Date.now();
        if (now - wheelLock < 520) return;
        wheelLock = now;
        go(e.deltaX > 0 ? 1 : -1);
      }
    }, { passive: false });

    stage.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
    });

    track.addEventListener('click', function (e) {
      if (suppressClick) return;
      var can = e.target.closest('.cc-can');
      if (!can) return;
      var i = parseInt(can.getAttribute('data-i'), 10);
      if (i === a) {
        openModal();
      } else {
        var curPos = parseInt(can.getAttribute('data-pos'), 10);
        var pDir = (!isNaN(curPos) && curPos !== 0) ? (curPos > 0 ? 1 : -1) : null;
        jumpTo(i, pDir);
      }
    });
    infosWrap.addEventListener('click', function (e) {
      if (e.target.closest('[data-cc-open]')) openModal();
    });

    /* ---------- Custom cursor ---------- */
    if (finePointer && cursor) {
      root.classList.add('has-cursor');
      var cx = 0, cy = 0, tx = 0, ty = 0, raf = 0, inside = false;
      var loop = function () {
        cx += (tx - cx) * 0.24;
        cy += (ty - cy) * 0.24;
        cursor.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
        raf = inside ? requestAnimationFrame(loop) : 0;
      };
      stage.addEventListener('mouseenter', function (e) {
        inside = true; tx = cx = e.clientX; ty = cy = e.clientY;
        cursor.classList.add('is-in');
        if (!raf) raf = requestAnimationFrame(loop);
      });
      stage.addEventListener('mouseleave', function () {
        inside = false;
        cursor.classList.remove('is-in', 'is-view', 'is-go');
        cursorLabel.textContent = '';
      });
      stage.addEventListener('mousemove', function (e) {
        tx = e.clientX; ty = e.clientY;
        var can = e.target.closest('.cc-can');
        var state = '', label = '';
        if (can && !drag) {
          var pos = parseInt(can.getAttribute('data-pos'), 10);
          if (pos === 0) { state = 'is-view'; label = T('view'); }
          else if (Math.abs(pos) <= 2) { state = 'is-go'; label = pos < 0 ? '←' : '→'; }
        }
        cursor.classList.toggle('is-view', state === 'is-view');
        cursor.classList.toggle('is-go', state === 'is-go');
        if (cursorLabel.textContent !== label) cursorLabel.textContent = label;
      });
    }

    /* ---------- View toggle ---------- */
    toolBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var view = btn.getAttribute('data-cc-view');
        root.setAttribute('data-view', view);
        toolBtns.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-on', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        if (view === 'grid' && modal && !modal.hidden) closeModal();
      });
    });
    if (root.getAttribute('data-view') === 'grid') {
      toolBtns.forEach(function (b) {
        var on = b.getAttribute('data-cc-view') === 'grid';
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    /* ---------- Quick-view modal ---------- */
    var mPhoto = modal.querySelector('[data-cc-m-photo]');
    var panel = modal.querySelector('.cc-modal-panel');
    var closeBtn = modal.querySelector('.cc-modal-close');
    var qtyOut = modal.querySelector('[data-cc-m-qty]');
    var addBtn = modal.querySelector('[data-cc-add]');

    // Portal: escape the section's stacking context (sticky header, overflow, isolation)
    var owner = root.id || 'cc';
    [].forEach.call(document.querySelectorAll('body > [data-cc-modal][data-cc-owner="' + owner + '"]'), function (old) { old.remove(); });
    modal.setAttribute('data-cc-owner', owner);
    document.body.appendChild(modal);
    var qty = 1;
    var opener = null;
    var modalOpen = false;

    function q(sel) { return modal.querySelector(sel); }

    function fillModal(it) {
      var d = it.info.dataset;
      q('[data-cc-m-spirit]').textContent = T('sp_' + d.spirit);
      q('[data-cc-m-abv]').textContent = d.abv;
      q('[data-cc-m-title]').textContent = d.title;
      q('[data-cc-m-price]').textContent = d.price;
      q('[data-cc-m-compare]').textContent = d.compare || '';
      var descEl = it.info.querySelector('.cc-detail-desc');
      q('[data-cc-m-desc]').textContent = (descEl && descEl.textContent.trim()) || T('default_desc');

      var chips = q('[data-cc-m-chips]');
      chips.innerHTML = '';
      [].forEach.call(it.info.querySelectorAll('.cc-detail-chips li'), function (li) {
        chips.appendChild(li.cloneNode(true));
      });
      chips.parentNode.hidden = !chips.children.length;

      var ritualEl = it.info.querySelector('.cc-detail-ritual');
      q('[data-cc-m-ritual-block]').hidden = !ritualEl;
      q('[data-cc-m-ritual]').textContent = ritualEl ? ritualEl.textContent : '';

      mPhoto.classList.remove('is-can');
      mPhoto.parentNode.style.setProperty('--tint', d.tint || '#d9dbe3');
      mPhoto.onerror = function () {
        mPhoto.onerror = null;
        mPhoto.classList.add('is-can');
        mPhoto.src = d.can;
      };
      mPhoto.src = d.photo || d.bg;
      mPhoto.alt = d.title;
      q('[data-cc-m-link]').setAttribute('href', d.url);

      qty = 1;
      qtyOut.textContent = '1';
      var available = d.available !== 'false';
      addBtn.disabled = !available;
      addBtn.querySelector('span').setAttribute('data-cc-t', available ? 'add' : 'soldout');
      addBtn.querySelector('span').textContent = T(available ? 'add' : 'soldout');
    }

    function openModal() {
      if (modalOpen || root.getAttribute('data-view') !== 'carousel') return;
      modalOpen = true;
      opener = document.activeElement;
      fillModal(items[a]);
      modal.hidden = false;
      document.documentElement.classList.add('cc-lock');
      void panel.offsetWidth;
      requestAnimationFrame(function () { modal.classList.add('is-open'); });
      closeBtn.focus({ preventScroll: true });
    }

    function closeModal() {
      if (!modalOpen) return;
      modalOpen = false;
      modal.classList.remove('is-open');
      setTimeout(function () {
        modal.hidden = true;
        document.documentElement.classList.remove('cc-lock');
        if (opener && opener.focus) { try { opener.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
      }, reduced ? 0 : 480);
    }

    modal.addEventListener('click', function (e) {
      if (e.target.closest('[data-cc-close]')) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (!modalOpen) return;
      if (e.key === 'Escape') { e.preventDefault(); closeModal(); }
      else if (e.key === 'Tab') {
        var f = [].slice.call(modal.querySelectorAll('button:not([disabled]), a[href]')).filter(function (el) { return el.offsetParent !== null; });
        if (!f.length) return;
        var firstEl = f[0], lastEl = f[f.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
      }
    });

    [].forEach.call(modal.querySelectorAll('[data-cc-qty]'), function (b) {
      b.addEventListener('click', function () {
        qty = Math.max(1, Math.min(12, qty + parseInt(b.getAttribute('data-cc-qty'), 10)));
        qtyOut.textContent = qty;
      });
    });

    addBtn.addEventListener('click', function () {
      var it = items[a];
      var d = it.info.dataset;
      var span = addBtn.querySelector('span');
      span.textContent = T('added');
      setTimeout(function () {
        closeModal();
        if (window.LuckyShakerCart && typeof window.LuckyShakerCart.addItem === 'function') {
          window.LuckyShakerCart.addItem(d.variant, qty, d.title, d.price);
        }
        span.textContent = T('add');
      }, 520);
    });

    /* ---------- Language ---------- */
    function applyLang() {
      [].forEach.call(root.querySelectorAll('[data-cc-t]'), function (el) {
        el.textContent = T(el.getAttribute('data-cc-t'));
      });
      [].forEach.call(root.querySelectorAll('[data-cc-label]'), function (el) {
        el.setAttribute('aria-label', T(el.getAttribute('data-cc-label')));
      });
      if (modalOpen) {
        var it = items[a];
        modal.querySelector('[data-cc-m-spirit]').textContent = T('sp_' + it.info.getAttribute('data-spirit'));
      }
    }
  }

  function boot() {
    [].forEach.call(document.querySelectorAll('[data-cc]'), init);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  document.addEventListener('shopify:section:load', boot);
})();

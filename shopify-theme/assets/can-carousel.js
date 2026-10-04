/**
 * LUCKY SHAKER — CAN & PRODUCT CAROUSEL SHOP
 * Multi-Category 3D Carousel (Cocktails, Dry Fruits, Creams, Gift Sets),
 * Quick-view popup, Fluid Atmosphere Layer with Continuous Organic 3D Float,
 * Drag / swipe / wheel / keyboard navigation, and full multi-language (ES/EN) support.
 */
(function () {
  'use strict';

  var DICT = {
    es: {
      more: 'VER MÁS', add: 'AGREGAR A LA BOLSA', added: 'AGREGADO ✓', soldout: 'AGOTADO',
      ingredients: 'Ingredientes', ritual: 'Ritual de servicio', full: 'Ver ficha completa',
      trust: 'Entrega con verificación de identidad 21+.', view: 'VER',
      cat_cocktails: 'CÓCTELES', cat_dry_fruits: 'FRUTOS DESHIDRATADOS', cat_creams: 'CREMAS', cat_gift_sets: 'SETS DE REGALO',
      sp_tequila: 'Tequila', sp_rum: 'Ron', sp_gin: 'Gin', sp_vodka: 'Vodka', sp_whiskey: 'Whiskey', sp_sparkling: 'Espumoso',
      sp_citrus: 'Cítricos', sp_sweet: 'Dulces', sp_tropical: 'Tropicales',
      sp_lemon: 'Limón', sp_manzana: 'Manzana', sp_naranja: 'Naranja', sp_pina: 'Piña',
      sp_creams: 'Cremas', sp_gift_sets: 'Sets de Regalo',
      default_desc: 'Producto artesanal de autor, calidad premium lista para disfrutar.',
      view_carousel: 'Carrusel', view_grid: 'Cuadrícula', prev: 'Anterior', next: 'Siguiente', close: 'Cerrar', qty: 'Cantidad'
    },
    en: {
      more: 'SEE MORE', add: 'ADD TO BAG', added: 'ADDED ✓', soldout: 'SOLD OUT',
      ingredients: 'Ingredients', ritual: 'Serving ritual', full: 'View full details',
      trust: 'Delivery requires 21+ ID verification.', view: 'VIEW',
      cat_cocktails: 'COCKTAILS', cat_dry_fruits: 'DRY FRUITS', cat_creams: 'CREAMS', cat_gift_sets: 'GIFT SETS',
      sp_tequila: 'Tequila', sp_rum: 'Rum', sp_gin: 'Gin', sp_vodka: 'Vodka', sp_whiskey: 'Whiskey', sp_sparkling: 'Sparkling',
      sp_citrus: 'Citrus', sp_sweet: 'Sweet', sp_tropical: 'Tropical',
      sp_lemon: 'Lemon', sp_manzana: 'Apple', sp_naranja: 'Orange', sp_pina: 'Pineapple',
      sp_creams: 'Creams', sp_gift_sets: 'Gift Sets',
      default_desc: 'Craft artisanal signature product, ready to enjoy.',
      view_carousel: 'Carousel', view_grid: 'Grid', prev: 'Previous', next: 'Next', close: 'Close', qty: 'Quantity'
    }
  };

  var ING_LABEL = {
    es: {
      'lime-wheel': 'Lima', 'lime-half': 'Lima', 'lemon-wheel': 'Limón', 'lemon-twist': 'Twist de limón',
      'orange-wheel': 'Naranja', 'orange-peel': 'Piel de naranja', 'grapefruit-half': 'Toronja',
      'pineapple-wedge': 'Piña', peach: 'Durazno', cranberries: 'Cranberry', mint: 'Menta',
      'coffee-beans': 'Café', ginger: 'Jengibre', 'coconut-half': 'Coco', agave: 'Agave',
      'sugar-cubes': 'Azúcar', juniper: 'Enebro', cherry: 'Cereza', 'sea-salt': 'Sal marina',
      olive: 'Aceituna', ice: 'Hielo', 'blue-curacao': 'Blue Curaçao', apple: 'Manzana Deshidratada'
    },
    en: {
      'lime-wheel': 'Lime', 'lime-half': 'Lime', 'lemon-wheel': 'Lemon', 'lemon-twist': 'Lemon twist',
      'orange-wheel': 'Orange', 'orange-peel': 'Orange peel', 'grapefruit-half': 'Grapefruit',
      'pineapple-wedge': 'Pineapple', peach: 'Peach', cranberries: 'Cranberry', mint: 'Mint',
      'coffee-beans': 'Coffee', ginger: 'Ginger', 'coconut-half': 'Coconut', agave: 'Agave',
      'sugar-cubes': 'Sugar', juniper: 'Juniper', cherry: 'Cherry', 'sea-salt': 'Sea salt',
      olive: 'Olive', ice: 'Ice', 'blue-curacao': 'Blue Curaçao', apple: 'Dried Apple'
    }
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
    mimosa: ['orange-wheel', 'orange-peel', 'orange-wheel', 'orange-peel', 'orange-wheel', 'fizz'],
    mojito: ['lime-wheel', 'mint', 'sugar-cubes', 'lime-half', 'mint', 'ice'],
    'whiskey-cream': ['coffee-beans', 'sugar-cubes', 'coffee-beans', 'sugar-cubes', 'ice'],
    'lemon-dry': ['lemon-wheel', 'lemon-twist', 'lemon-wheel', 'lemon-twist', 'lemon-wheel', 'lemon-twist'],
    'manzana-dry': ['apple', 'sugar-cubes', 'apple', 'apple', 'sugar-cubes', 'apple'],
    'naranja-dry': ['orange-wheel', 'orange-peel', 'orange-wheel', 'orange-peel', 'orange-wheel', 'orange-peel'],
    'pina-dry': ['pineapple-wedge', 'coconut-half', 'pineapple-wedge', 'pineapple-wedge', 'coconut-half'],
    'signature-box': ['cherry', 'orange-wheel', 'lemon-twist', 'olive', 'ice']
  };

  var FX_SIZE = {
    'lime-wheel': 1, 'lime-half': 1, 'lemon-wheel': 1, 'lemon-twist': 0.95, 'orange-wheel': 1.05, 'orange-peel': 1.05,
    'grapefruit-half': 1.1, 'pineapple-wedge': 1.15, peach: 1.15, cranberries: 0.85, mint: 1, 'coffee-beans': 0.85,
    ginger: 1.1, 'coconut-half': 1.2, agave: 1.05, 'sugar-cubes': 0.85, juniper: 0.95, cherry: 0.85, 'sea-salt': 0.9,
    olive: 1.05, ice: 0.95, 'blue-wheel': 1.05, apple: 1.15
  };

  var FX_SLOTS = [
    ['b', 27, 22, 0.28, 18, 0, 0.96],
    ['f', 4, 93, 0.44, 48, 3.5, 1],
    ['f', 95, 34, 0.38, 42, 3, 1],
    ['b', 75, 16, 0.26, 18, 0, 0.96],
    ['f', 92, 75, 0.34, 36, 2, 1],
    ['b', 31, 77, 0.24, 22, 0.4, 0.94],
    ['b', 67, 80, 0.23, 22, 0.4, 0.94],
    ['f', 18, 91, 0.28, 32, 1.2, 1],
    ['b', 86, 46, 0.28, 24, 1.2, 0.92],
    ['f', 42, 93, 0.24, 30, 0, 1]
  ];

  var CATEGORIES = {
    cocktails: {
      key: 'cocktails',
      sidebarOrder: ['tequila', 'rum', 'gin', 'vodka', 'whiskey', 'sparkling'],
      sidebarLabels: {
        es: { tequila: 'Tequila', rum: 'Ron', gin: 'Gin', vodka: 'Vodka', whiskey: 'Whiskey', sparkling: 'Espumoso' },
        en: { tequila: 'Tequila', rum: 'Rum', gin: 'Gin', vodka: 'Vodka', whiskey: 'Whiskey', sparkling: 'Sparkling' }
      },
      items: [] // populated from initial DOM
    },
    'dry-fruits': {
      key: 'dry-fruits',
      sidebarOrder: ['citrus', 'sweet', 'tropical'],
      sidebarLabels: {
        es: { citrus: 'Cítricos', sweet: 'Dulces', tropical: 'Tropicales' },
        en: { citrus: 'Citrus', sweet: 'Sweet', tropical: 'Tropical' }
      },
      items: [
        {
          handle: 'lemon-dry',
          spirit: 'citrus',
          title: 'LIMÓN DESHIDRATADO',
          sub: 'Rodajas de limón amarillo 100% natural, deshidratado a baja temperatura para cócteles.',
          desc: 'Rodajas de limón amarillo 100% natural deshidratado artesanalmente a baja temperatura para preservar al máximo sus aceites esenciales, aroma y color dorado vibrante. Perfecto para realzar Gin Tonic, Margaritas y destilados finos.',
          price: '$16.00',
          compare: '',
          abv: 'CÍTRICOS • 100% NATURAL',
          tint: '#E8D77A',
          can: 'pkg-lemon-dry.webp',
          chips: ['Limón amarillo', 'Piel cítrica', '100% Natural', 'Sin azúcar añadida'],
          ritual: 'Colocar 1 rodaja en tu copa con hielo antes de servir tu cóctel favorito para liberar aceites esenciales.',
          recipe: ['lemon-wheel', 'lemon-twist', 'lemon-wheel', 'lemon-twist', 'lemon-wheel', 'lemon-twist']
        },
        {
          handle: 'manzana-dry',
          spirit: 'sweet',
          title: 'MANZANA DESHIDRATADA',
          sub: 'Crujientes láminas de manzana con corte de estrella natural para garnishes sofisticados.',
          desc: 'Láminas de manzana seleccionada con corte central en estrella, deshidratadas para lograr una textura crujiente y aroma sutilmente acaramelado. Diseñadas para complementar coctelería con whiskey, ron o infusiones botánicas.',
          price: '$16.00',
          compare: '',
          abv: 'DULCES • 100% NATURAL',
          tint: '#D9A765',
          can: 'pkg-manzana-dry.webp',
          chips: ['Manzana seleccionada', 'Corte estrella', 'Notas acarameladas', 'Aroma floral'],
          ritual: 'Flotar 1 lámina sobre cócteles aromáticos como Manhattan, Old Fashioned o té frío botánico.',
          recipe: ['apple', 'sugar-cubes', 'apple', 'apple', 'sugar-cubes', 'apple']
        },
        {
          handle: 'naranja-dry',
          spirit: 'citrus',
          title: 'NARANJA DESHIDRATADA',
          sub: 'Rodajas seleccionadas de naranja dulce, perfectas para Spritz, Negroni y Old Fashioned.',
          desc: 'Rodajas doradas de naranja dulce deshidratada, con borde caramelizado y pulpa translúcida. Aporta una nota amarga suave y elegancia visual insuperable a cualquier cóctel clásico o contemporáneo.',
          price: '$16.00',
          compare: '',
          abv: 'CÍTRICOS • 100% NATURAL',
          tint: '#F0A13A',
          can: 'pkg-naranja-dry.webp',
          chips: ['Naranja dulce', 'Cítricos maduros', 'Aceites concentrados', 'Garnish premium'],
          ritual: 'Sumergir en cócteles con vermouth o amargos para potenciar los aromas cítricos de la madera.',
          recipe: ['orange-wheel', 'orange-peel', 'orange-wheel', 'orange-peel', 'orange-wheel', 'orange-peel']
        },
        {
          handle: 'pina-dry',
          spirit: 'tropical',
          title: 'PIÑA DESHIDRATADA',
          sub: 'Láminas tropicales de piña madura, sabor intenso y aroma caribeño concentrado.',
          desc: 'Láminas deshidratadas de piña miel de alta calidad, con notas dulces y acidez balanceada. Ideal para cócteles tropicales, Mai Tai, Piña Colada y presentaciones de coctelería tiki.',
          price: '$18.00',
          compare: '',
          abv: 'TROPICALES • 100% NATURAL',
          tint: '#F3E3B5',
          can: 'pkg-pina-dry.webp',
          chips: ['Piña miel madura', 'Dulzura tropical', '100% Fruta real', 'Corte artesanal'],
          ritual: 'Acompañar cócteles tiki, rones añejos o mocktails para un toque exótico y aromático.',
          recipe: ['pineapple-wedge', 'coconut-half', 'pineapple-wedge', 'pineapple-wedge', 'coconut-half']
        }
      ]
    },
    creams: {
      key: 'creams',
      sidebarOrder: ['creams'],
      sidebarLabels: {
        es: { creams: 'Cremas' },
        en: { creams: 'Creams' }
      },
      items: [
        {
          handle: 'whiskey-cream',
          spirit: 'creams',
          title: 'WHISKEY CREAM',
          sub: 'Crema artesanal de whiskey irlandés, vainilla de Madagascar y notas de cacao tostado.',
          desc: 'Un blend aterciopelado elaborado con auténtico whiskey añejado, crema fresca de pastoreo, vainilla pura de Madagascar y un toque de cacao selecto. Suavidad incomparable lista para servir en frío.',
          price: '$44.00',
          compare: '',
          abv: 'CREMAS • 17% ABV',
          tint: '#C8B195',
          can: 'can-whiskey-cream.webp',
          chips: ['Whiskey añejo', 'Crema fresca', 'Vainilla Bourbon', 'Cacao tostado'],
          ritual: 'Servir muy frío sobre una roca de hielo grande en vaso tumbler o junto a café specialty.',
          recipe: ['coffee-beans', 'sugar-cubes', 'coffee-beans', 'sugar-cubes', 'ice']
        }
      ]
    },
    'gift-sets': {
      key: 'gift-sets',
      sidebarOrder: ['gift_sets'],
      sidebarLabels: {
        es: { gift_sets: 'Sets de Regalo' },
        en: { gift_sets: 'Gift Sets' }
      },
      items: [
        {
          handle: 'signature-box',
          spirit: 'gift_sets',
          title: 'SIGNATURE GIFT BOX',
          sub: 'Caja de lujo con 4 cócteles de autor, jigger profesional grabado y frasco de frutos disecados.',
          desc: 'La experiencia de barra móvil Lucky Shaker en un estuche de colección de edición limitada. Incluye cuatro cócteles signature de 750ml, jigger de acero inoxidable grabado, selección de cítricos deshidratados y guía de servicio.',
          price: '$89.00',
          compare: '$99.00',
          abv: 'SETS • EDICIÓN LIMITADA',
          tint: '#E82B7D',
          can: 'pkg-lemon-dry.webp',
          chips: ['4 Latas de autor', 'Jigger de acero', 'Fruto disecado', 'Packaging de lujo'],
          ritual: 'Perfecto para obsequios corporativos o celebraciones especiales en casa. Listo para regalar.',
          recipe: ['cherry', 'orange-wheel', 'lemon-twist', 'olive', 'ice']
        }
      ]
    }
  };

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
    var bgsWrap = root.querySelector('.cc-bg');
    var spiritsNav = root.querySelector('.cc-spirits');
    var live = root.querySelector('[data-cc-live]');
    var modal = root.querySelector('[data-cc-modal]');
    var cursor = root.querySelector('[data-cc-cursor]');
    var cursorLabel = root.querySelector('[data-cc-cursor-label]');
    var catTabs = [].slice.call(root.querySelectorAll('.cc-cat-tab'));
    var toolBtns = [].slice.call(root.querySelectorAll('[data-cc-view]'));

    var fxBack = root.querySelector('[data-cc-fx-back]');
    var fxFront = root.querySelector('[data-cc-fx-front]');
    var fxTip = root.querySelector('[data-cc-fx-tip]');
    var fxAssets = {};
    try {
      var fxJson = document.querySelector('[data-cc-fx-assets]');
      if (fxJson) fxAssets = JSON.parse(fxJson.textContent);
    } catch (e) { fxAssets = {}; }

    // Resolve asset url helper
    function getAssetUrl(fn) {
      if (!fn) return '';
      if (fn.indexOf('/') === 0 || fn.indexOf('http') === 0) return fn;
      if (fxAssets[fn]) return fxAssets[fn];
      var base = (window.LuckyShaker && window.LuckyShaker.assetUrlTemplate) || '';
      if (base) return base.replace('frame-PLACEHOLDER.webp', fn);
      return fn;
    }

    /* ---------- Harvest initial cocktails from Liquid DOM ---------- */
    var initialInfos = [].slice.call(root.querySelectorAll('.cc-info'));
    var initialCans = [].slice.call(root.querySelectorAll('.cc-can'));
    var initialBgs = [].slice.call(root.querySelectorAll('.cc-bg-img'));

    var cocktailsHarvested = initialInfos.map(function (info, k) {
      var canImg = initialCans[k] ? initialCans[k].querySelector('img') : null;
      var bgImg = initialBgs[k];
      return {
        handle: info.getAttribute('data-handle'),
        spirit: info.getAttribute('data-spirit') || 'rum',
        title: info.getAttribute('data-title'),
        price: info.getAttribute('data-price'),
        compare: info.getAttribute('data-compare') || '',
        abv: info.getAttribute('data-abv') || '',
        tint: info.getAttribute('data-tint') || '#d9dbe3',
        can: canImg ? canImg.getAttribute('src') : getAssetUrl('can-' + info.getAttribute('data-handle') + '.webp'),
        photo: info.getAttribute('data-photo') || info.getAttribute('data-bg'),
        bg: bgImg ? bgImg.getAttribute('src') : (info.getAttribute('data-bg') || ''),
        url: info.getAttribute('data-url') || '#',
        variant: info.getAttribute('data-variant') || '',
        available: info.getAttribute('data-available') || 'true',
        sub: (info.querySelector('.cc-info-sub') && info.querySelector('.cc-info-sub').textContent) || '',
        desc: (info.querySelector('.cc-detail-desc') && info.querySelector('.cc-detail-desc').textContent) || '',
        chips: [].map.call(info.querySelectorAll('.cc-detail-chips li'), function (li) { return li.textContent.trim(); }),
        ritual: (info.querySelector('.cc-detail-ritual') && info.querySelector('.cc-detail-ritual').textContent) || '',
        recipe: FX_RECIPES[info.getAttribute('data-handle')]
      };
    });
    if (cocktailsHarvested.length > 0) {
      CATEGORIES.cocktails.items = cocktailsHarvested;
    }

    var currentCat = 'cocktails';
    var items = [];
    var n = 0;
    var a = 0;

    /* ---------- Build/Switch Category Engine ---------- */
    function buildCategory(catKey, targetIndex) {
      var catData = CATEGORIES[catKey] || CATEGORIES.cocktails;
      currentCat = catKey;

      // Update category tabs active state
      catTabs.forEach(function (tab) {
        var on = tab.getAttribute('data-cat') === catKey;
        tab.classList.toggle('is-active', on);
        tab.setAttribute('aria-pressed', on ? 'true' : 'false');
      });

      // Clear FX sets
      if (fxBack) fxBack.innerHTML = '';
      if (fxFront) fxFront.innerHTML = '';

      // Clear stage
      track.innerHTML = '';
      infosWrap.innerHTML = '';
      if (bgsWrap) bgsWrap.innerHTML = '';

      // Build DOM elements for each item in category
      var rawList = catData.items || [];
      var orderList = catData.sidebarOrder || [];

      var mapped = rawList.map(function (itemData, k) {
        return {
          data: itemData,
          rank: orderList.indexOf(itemData.spirit),
          k: k
        };
      }).sort(function (x, y) {
        return (x.rank - y.rank) || (x.k - y.k);
      });

      items = [];
      mapped.forEach(function (m, idx) {
        var d = m.data;

        // 1. Can / Pouch button
        var canBtn = document.createElement('button');
        canBtn.type = 'button';
        canBtn.className = 'cc-can';
        canBtn.setAttribute('data-i', idx);
        canBtn.setAttribute('data-pos', '9');
        canBtn.tabIndex = -1;
        canBtn.setAttribute('aria-label', d.title);
        var canImg = document.createElement('img');
        canImg.className = 'cc-can-img';
        canImg.src = getAssetUrl(d.can);
        canImg.alt = d.title;
        canImg.width = 640;
        canImg.height = 1040;
        canImg.draggable = false;
        canImg.decoding = 'async';
        if (idx > 2) canImg.loading = 'lazy';
        canBtn.appendChild(canImg);
        track.appendChild(canBtn);

        // 2. Background image
        var bgImg = null;
        if (bgsWrap) {
          bgImg = document.createElement('img');
          bgImg.className = 'cc-bg-img';
          bgImg.setAttribute('data-i', idx);
          bgImg.src = getAssetUrl(d.bg || d.photo || d.can);
          bgImg.alt = '';
          bgImg.width = 520;
          bgImg.height = 520;
          bgImg.decoding = 'async';
          if (idx > 1) bgImg.loading = 'lazy';
          bgsWrap.appendChild(bgImg);
        }

        // 3. Info article
        var infoArt = document.createElement('article');
        infoArt.className = 'cc-info';
        infoArt.setAttribute('data-i', idx);
        infoArt.setAttribute('data-handle', d.handle);
        infoArt.setAttribute('data-spirit', d.spirit);
        infoArt.setAttribute('data-tint', d.tint || '#d9dbe3');
        infoArt.setAttribute('data-variant', d.variant || '');
        infoArt.setAttribute('data-available', d.available != null ? d.available : 'true');
        infoArt.setAttribute('data-url', d.url || '#');
        infoArt.setAttribute('data-title', d.title);
        infoArt.setAttribute('data-price', d.price);
        infoArt.setAttribute('data-compare', d.compare || '');
        infoArt.setAttribute('data-abv', d.abv || '');
        infoArt.setAttribute('data-bg', getAssetUrl(d.bg || d.can));
        infoArt.setAttribute('data-photo', getAssetUrl(d.photo || d.can));
        infoArt.setAttribute('data-can', getAssetUrl(d.can));
        infoArt.setAttribute('aria-hidden', 'true');

        var spName = (catData.sidebarLabels[lang()] && catData.sidebarLabels[lang()][d.spirit]) || d.spirit.toUpperCase();
        var chipsHtml = (d.chips || []).map(function (c) { return '<li>' + c + '</li>'; }).join('');

        infoArt.innerHTML =
          '<p class="cc-info-kicker"><span data-cc-sp>' + spName + '</span><i aria-hidden="true"></i><span>' + (d.abv || '') + '</span></p>' +
          '<h2 class="cc-info-title"><span>' + d.title + '</span></h2>' +
          '<p class="cc-info-sub">' + (d.sub || d.desc) + '</p>' +
          '<div class="cc-info-cta">' +
            '<span class="cc-price">' + d.price + (d.compare ? ' <s>' + d.compare + '</s>' : '') + '</span>' +
            '<button type="button" class="cc-more" data-cc-open tabindex="-1">' +
              '<span data-cc-t="more">' + T('more') + '</span>' +
              '<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 7h12M8 2l5 5-5 5"/></svg>' +
            '</button>' +
          '</div>' +
          '<div class="cc-detail" hidden>' +
            '<p class="cc-detail-desc">' + (d.desc || d.sub) + '</p>' +
            '<ul class="cc-detail-chips">' + chipsHtml + '</ul>' +
            (d.ritual ? '<p class="cc-detail-ritual">' + d.ritual + '</p>' : '') +
          '</div>';

        infosWrap.appendChild(infoArt);

        items.push({
          info: infoArt,
          can: canBtn,
          bg: bgImg,
          i: idx,
          k: idx,
          rank: m.rank,
          handle: d.handle,
          recipe: d.recipe || FX_RECIPES[d.handle]
        });
      });

      n = items.length;
      a = clamp(targetIndex || 0, 0, Math.max(0, n - 1));

      // Rebuild left sidebar navigation
      rebuildSidebar(catData);

      // Re-hook item event listeners
      hookItemClickEvents();

      // Animate entry
      items.forEach(function (it) { it.can.setAttribute('data-pos', offset(it.i) > 0 ? '9' : '-9'); });
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { render(1, true); });
      });
    }

    function rebuildSidebar(catData) {
      if (!spiritsNav) return;
      spiritsNav.innerHTML = '';
      var order = catData.sidebarOrder || [];
      var seenSpirits = {};
      items.forEach(function (it) {
        var sp = it.info.getAttribute('data-spirit');
        if (sp) seenSpirits[sp] = true;
      });

      order.forEach(function (sp) {
        if (!seenSpirits[sp]) return;
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cc-spirit';
        btn.setAttribute('data-spirit', sp);
        var label = (catData.sidebarLabels[lang()] && catData.sidebarLabels[lang()][sp]) || sp.toUpperCase();
        btn.textContent = label;
        btn.addEventListener('click', function () {
          var targetSp = sp;
          var curSp = items[a] ? items[a].info.getAttribute('data-spirit') : '';
          var curRank = order.indexOf(curSp);
          var targetRank = order.indexOf(targetSp);
          for (var i = 0; i < n; i++) {
            if (items[i].info.getAttribute('data-spirit') === targetSp) {
              if (i === a) return;
              var preferredDir = targetRank !== -1 && curRank !== -1 && targetRank !== curRank
                ? (targetRank > curRank ? 1 : -1)
                : (i > a ? 1 : -1);
              jumpTo(i, preferredDir);
              break;
            }
          }
        });
        spiritsNav.appendChild(btn);
      });
    }

    // Category Tabs listeners
    catTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var catKey = tab.getAttribute('data-cat');
        if (catKey && catKey !== currentCat) {
          buildCategory(catKey, 0);
        }
      });
    });

    /* ---------- Navigation Math & Rendering ---------- */
    function offset(i) {
      if (n <= 0) return 0;
      var d = ((i - a) % n + n) % n;
      if (d > n / 2) d -= n;
      return d;
    }

    function prime(el, past) {
      var span = el.querySelector('.cc-info-title > span');
      if (!span) return;
      span.style.transition = 'none';
      el.classList.toggle('is-past', !!past);
      void span.offsetWidth;
      span.style.transition = '';
    }

    function render(dir, first, oldA) {
      if (n === 0) return;
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
      if (cur) {
        root.style.setProperty('--cc-tint', cur.info.getAttribute('data-tint') || '#d9dbe3');
        var sp = cur.info.getAttribute('data-spirit');
        var sidebarBtns = [].slice.call(spiritsNav.querySelectorAll('.cc-spirit'));
        sidebarBtns.forEach(function (b) {
          b.classList.toggle('is-on', b.getAttribute('data-spirit') === sp);
        });
        if (live) live.textContent = cur.info.getAttribute('data-title') + ' — ' + (a + 1) + ' / ' + n;
      }

      var now = root.querySelector('[data-cc-now]');
      if (now) now.textContent = pad2(a + 1);
      var total = root.querySelector('[data-cc-total]');
      if (total) total.textContent = pad2(n);
    }

    /* ---------- Ingredient Atmosphere Engine (Float & Parallax) ---------- */
    function fxToken(tok) {
      if (tok === 'ice') {
        if (fxAssets['ice']) return { kind: 'img', src: fxAssets['ice'], label: 'ice', size: FX_SIZE['ice'] || 0.95 };
        return { kind: 'ice', label: 'ice' };
      }
      if (tok === 'apple') {
        var appleSrc = fxAssets['apple'] || fxAssets['apple-slice'] || getAssetUrl('ing-apple.webp');
        return { kind: 'img', src: appleSrc, label: 'apple', size: FX_SIZE['apple'] || 1.15 };
      }
      if (tok === 'blue-wheel') return { kind: 'img', src: fxAssets['orange-wheel'], label: 'blue-curacao', blue: true, size: FX_SIZE['blue-wheel'] };
      return { kind: 'img', src: fxAssets[tok] || getAssetUrl('ing-' + tok + '.webp'), label: tok, size: FX_SIZE[tok] || 1 };
    }

    function fxBuild(it) {
      if (it.fx !== undefined) return it.fx;
      var handle = it.handle || it.info.getAttribute('data-handle');
      var recipe = it.recipe || FX_RECIPES[handle];
      if (!recipe || !fxBack || !fxFront) { it.fx = null; return null; }

      var rnd = rng(hashStr(handle));
      var setB = document.createElement('div');
      var setF = document.createElement('div');
      setB.className = setF.className = 'cc-fx-set is-after';

      var pieces = [];
      var slotIdx = 0;

      recipe.forEach(function (tok) {
        if (tok === 'fizz') return;
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

        // Robust, multi-harmonic floating variables
        var floatDuration = (4.2 + rnd() * 2.8).toFixed(1);
        var floatDelay = (-rnd() * 6).toFixed(1);
        var floatAmp = (-(26 + rnd() * 30)).toFixed(0);
        var floatSway = ((rnd() - 0.5) * 40).toFixed(0);
        var floatRot = ((rnd() - 0.5) * 20).toFixed(1);

        p.style.cssText =
          '--x:' + slot[1] + '%;' +
          '--y:' + slot[2] + '%;' +
          '--sz:' + sz.toFixed(3) + ';' +
          '--k:' + (slot[4] * (0.9 + rnd() * 0.35)).toFixed(1) + ';' +
          '--dk:' + dk.toFixed(3) + ';' +
          '--bl:' + slot[5] + 'px;' +
          '--op:' + slot[6] + ';' +
          '--rot:' + ((rnd() * 70 - 35).toFixed(1)) + 'deg;' +
          '--dl:' + (idx * 68) + 'ms;' +
          '--fd:' + floatDuration + 's;' +
          '--fy:' + floatDelay + 's;' +
          '--fa:' + floatAmp + 'px;' +
          '--fx:' + floatSway + 'px;' +
          '--fr:' + floatRot + 'deg;' +
          '--ex-k:' + (0.85 + rnd() * 0.35).toFixed(2) + ';' +
          '--ey:' + ((rnd() - 0.5) * 50).toFixed(0) + 'px';

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
      void setB.offsetWidth;
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

      if (items[a]) fxBuild(items[a]);
      if (oldA != null && items[oldA]) fxBuild(items[oldA]);

      for (var k = 0; k < n; k++) {
        var it = items[k];
        if (Math.abs(offset(it.i)) <= 2) fxBuild(it);
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

      if (outgoing && outgoing.fx) {
        var exitClass = dir > 0 ? 'is-before' : 'is-after';
        outgoing.fx.back.className = outgoing.fx.front.className = 'cc-fx-set ' + exitClass;
      }

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

    /* ---------- Continuous Organic Parallax Loop on PC & Mobile ---------- */
    var fxLayers = [fxBack, fxFront].filter(Boolean);
    var tpx = 0, tpy = 0, cpx = 0, cpy = 0;
    var ambientT = 0;

    function fxLoop() {
      ambientT += 0.024;
      var ambX = Math.sin(ambientT * 0.85) * 0.18;
      var ambY = Math.cos(ambientT * 0.65) * 0.22;
      cpx += (tpx + ambX - cpx) * 0.085;
      cpy += (tpy + ambY - cpy) * 0.085;
      var sx = cpx.toFixed(4), sy = cpy.toFixed(4);
      fxLayers.forEach(function (l) {
        if (l) {
          l.style.setProperty('--px', sx);
          l.style.setProperty('--py', sy);
        }
      });
      requestAnimationFrame(fxLoop);
    }
    requestAnimationFrame(fxLoop);

    function fxTarget(x, y) {
      if (reduced) return;
      tpx = clamp(x, -1, 1);
      tpy = clamp(y, -1, 1);
    }

    if (!reduced) {
      window.addEventListener('mousemove', function (e) {
        var cx = window.innerWidth / 2;
        var cy = window.innerHeight / 2;
        fxTarget((e.clientX - cx) / cx, (e.clientY - cy) / cy);
      }, { passive: true });
    }

    if (!reduced && window.DeviceOrientationEvent && typeof window.DeviceOrientationEvent.requestPermission !== 'function') {
      window.addEventListener('deviceorientation', function (e) {
        if (e.gamma == null || drag) return;
        fxTarget(e.gamma / 24, ((e.beta || 50) - 50) / 24);
      }, { passive: true });
    }

    /* ---------- Ingredient Hover Tooltip ---------- */
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
        var padX = r.width * 0.05, padY = r.height * 0.05;
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
      if (tipRaf || now - tipAt < 65) return;
      tipAt = now;
      tipRaf = requestAnimationFrame(tipUpdate);
    }
    if (finePointer && fxTip && stage) {
      stage.addEventListener('mousemove', tipSchedule);
      stage.addEventListener('mouseleave', function () {
        tipLast = null;
        tipHide();
      });
    }

    /* ---------- Navigation Commands ---------- */
    function go(delta) {
      if (n < 2) return;
      var oldA = a;
      a = ((a + delta) % n + n) % n;
      render(delta > 0 ? 1 : -1, false, oldA);
    }

    function jumpTo(i, preferredDir) {
      if (i === a || n <= 1) return;
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

    var prevBtn = root.querySelector('[data-cc-prev]');
    var nextBtn = root.querySelector('[data-cc-next]');
    if (prevBtn) prevBtn.addEventListener('click', function () { go(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(1); });

    /* ---------- Drag & Swipe ---------- */
    var drag = null;
    var suppressClick = false;

    if (stage) {
      stage.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        if (e.target.closest('.cc-arrow')) return;
        drag = { x: e.clientX, y: e.clientY, dx: 0, moved: false, id: e.pointerId };
      });
    }

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
      if (stage) {
        stage.style.setProperty('--cc-drag', '0px');
        stage.style.setProperty('--cc-tilt', '0deg');
      }
      fxTarget(0, 0);
      if (moved) {
        suppressClick = true;
        setTimeout(function () { suppressClick = false; }, 60);
        var threshold = Math.min(80, window.innerWidth * 0.12);
        if (dx < -threshold) go(1);
        else if (dx > threshold) go(-1);
      }
    }
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    // Mouse wheel navigation
    var wheelLock = false, wheelDelta = 0;
    if (stage) {
      stage.addEventListener('wheel', function (e) {
        var dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        if (Math.abs(dx) < 18) return;
        e.preventDefault();
        wheelDelta += dx;
        if (wheelLock) return;
        if (Math.abs(wheelDelta) > 42) {
          go(wheelDelta > 0 ? 1 : -1);
          wheelDelta = 0;
          wheelLock = true;
          setTimeout(function () { wheelLock = false; }, 360);
        }
      }, { passive: false });
    }

    // Keyboard navigation
    stage.addEventListener('keydown', function (e) {
      if (modal && !modal.hidden) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'Enter' || e.key === ' ') {
        if (document.activeElement && document.activeElement.classList.contains('cc-stage')) {
          e.preventDefault();
          openModal();
        }
      }
    });

    function hookItemClickEvents() {
      items.forEach(function (it) {
        it.can.onclick = function (e) {
          if (suppressClick) return;
          if (it.i === a) openModal();
          else jumpTo(it.i);
        };
        var openBtn = it.info.querySelector('[data-cc-open]');
        if (openBtn) {
          openBtn.onclick = function (e) {
            e.stopPropagation();
            openModal();
          };
        }
      });
    }

    /* ---------- Quick-View Modal ---------- */
    var mPhoto = modal ? modal.querySelector('[data-cc-m-photo]') : null;
    var panel = modal ? modal.querySelector('.cc-modal-panel') : null;
    var closeBtn = modal ? modal.querySelector('.cc-modal-close') : null;
    var qtyOut = modal ? modal.querySelector('[data-cc-m-qty]') : null;
    var addBtn = modal ? modal.querySelector('[data-cc-add]') : null;

    var owner = root.id || 'cc';
    if (modal) {
      [].forEach.call(document.querySelectorAll('body > [data-cc-modal][data-cc-owner="' + owner + '"]'), function (old) { old.remove(); });
      modal.setAttribute('data-cc-owner', owner);
      document.body.appendChild(modal);
    }

    var qty = 1;
    var opener = null;
    var modalOpen = false;

    function q(sel) { return modal ? modal.querySelector(sel) : null; }

    function fillModal(it) {
      if (!modal || !it) return;
      var d = it.info.dataset;
      var spEl = q('[data-cc-m-spirit]');
      if (spEl) spEl.textContent = (CATEGORIES[currentCat] && CATEGORIES[currentCat].sidebarLabels[lang()] && CATEGORIES[currentCat].sidebarLabels[lang()][d.spirit]) || d.spirit.toUpperCase();
      var abvEl = q('[data-cc-m-abv]');
      if (abvEl) abvEl.textContent = d.abv;
      var tEl = q('[data-cc-m-title]');
      if (tEl) tEl.textContent = d.title;
      var prEl = q('[data-cc-m-price]');
      if (prEl) prEl.textContent = d.price;
      var cmpEl = q('[data-cc-m-compare]');
      if (cmpEl) cmpEl.textContent = d.compare || '';

      var descEl = it.info.querySelector('.cc-detail-desc');
      var mDesc = q('[data-cc-m-desc]');
      if (mDesc) mDesc.textContent = (descEl && descEl.textContent.trim()) || T('default_desc');

      var chips = q('[data-cc-m-chips]');
      if (chips) {
        chips.innerHTML = '';
        [].forEach.call(it.info.querySelectorAll('.cc-detail-chips li'), function (li) {
          chips.appendChild(li.cloneNode(true));
        });
        chips.parentNode.hidden = !chips.children.length;
      }

      var ritualEl = it.info.querySelector('.cc-detail-ritual');
      var ritBlock = q('[data-cc-m-ritual-block]');
      if (ritBlock) ritBlock.hidden = !ritualEl;
      var ritTxt = q('[data-cc-m-ritual]');
      if (ritTxt) ritTxt.textContent = ritualEl ? ritualEl.textContent : '';

      if (mPhoto) {
        mPhoto.classList.remove('is-can');
        mPhoto.parentNode.style.setProperty('--tint', d.tint || '#d9dbe3');
        mPhoto.onerror = function () {
          mPhoto.onerror = null;
          mPhoto.classList.add('is-can');
          mPhoto.src = d.can;
        };
        mPhoto.src = d.photo || d.bg || d.can;
        mPhoto.alt = d.title;
      }

      var link = q('[data-cc-m-link]');
      if (link) link.setAttribute('href', d.url || '#');

      qty = 1;
      if (qtyOut) qtyOut.textContent = '1';
      var available = d.available !== 'false';
      if (addBtn) {
        addBtn.disabled = !available;
        var btnSpan = addBtn.querySelector('span');
        if (btnSpan) {
          btnSpan.setAttribute('data-cc-t', available ? 'add' : 'soldout');
          btnSpan.textContent = T(available ? 'add' : 'soldout');
        }
      }
    }

    function openModal() {
      if (modalOpen || !modal || root.getAttribute('data-view') !== 'carousel') return;
      modalOpen = true;
      opener = document.activeElement;
      fillModal(items[a]);
      modal.hidden = false;
      document.documentElement.classList.add('cc-lock');
      if (panel) void panel.offsetWidth;
      requestAnimationFrame(function () { modal.classList.add('is-open'); });
      if (closeBtn) closeBtn.focus({ preventScroll: true });
    }

    function closeModal() {
      if (!modalOpen || !modal) return;
      modalOpen = false;
      modal.classList.remove('is-open');
      setTimeout(function () {
        modal.hidden = true;
        document.documentElement.classList.remove('cc-lock');
        if (opener && opener.focus) { try { opener.focus({ preventScroll: true }); } catch (e) { } }
      }, reduced ? 0 : 450);
    }

    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target.closest('[data-cc-close]')) closeModal();
      });
      [].forEach.call(modal.querySelectorAll('[data-cc-qty]'), function (b) {
        b.addEventListener('click', function () {
          qty = Math.max(1, Math.min(12, qty + parseInt(b.getAttribute('data-cc-qty'), 10)));
          if (qtyOut) qtyOut.textContent = qty;
        });
      });
      if (addBtn) {
        addBtn.addEventListener('click', function () {
          var it = items[a];
          if (!it) return;
          var d = it.info.dataset;
          var span = addBtn.querySelector('span');
          if (span) span.textContent = T('added');
          setTimeout(function () {
            closeModal();
            if (window.LuckyShakerCart && typeof window.LuckyShakerCart.addItem === 'function') {
              window.LuckyShakerCart.addItem(d.variant || d.handle, qty, d.title, d.price);
            }
            if (span) span.textContent = T('add');
          }, 450);
        });
      }
    }

    document.addEventListener('keydown', function (e) {
      if (!modalOpen) return;
      if (e.key === 'Escape') { e.preventDefault(); closeModal(); }
    });

    /* ---------- View Toggle (Carousel vs Grid) ---------- */
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

    /* ---------- Internationalization / Lang Support ---------- */
    function applyLang() {
      [].forEach.call(root.querySelectorAll('[data-cc-t]'), function (el) {
        var k = el.getAttribute('data-cc-t');
        if (k) el.textContent = T(k);
      });
      if (modal) {
        [].forEach.call(modal.querySelectorAll('[data-cc-t]'), function (el) {
          var k = el.getAttribute('data-cc-t');
          if (k) el.textContent = T(k);
        });
      }
      var catData = CATEGORIES[currentCat];
      if (catData) rebuildSidebar(catData);
    }
    document.addEventListener('luckyshaker:langchange', applyLang);

    /* ---------- Start with Initial Category ---------- */
    buildCategory('cocktails', 0);
  }

  // Auto-init on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      [].forEach.call(document.querySelectorAll('[data-cc]'), init);
    });
  } else {
    [].forEach.call(document.querySelectorAll('[data-cc]'), init);
  }

  // Support Shopify section reloads
  document.addEventListener('shopify:section:load', function (e) {
    if (e.target) {
      var cc = e.target.querySelector('[data-cc]');
      if (cc) init(cc);
    }
  });
})();

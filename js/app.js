/**
 * LUCKY SHAKER BARTENDER — CONTINUOUS SCROLL-DRIVEN CINEMATIC TRANSFORMATION
 * 
 * Architecture: Prime Stone Builders Cinematic Scroll Engine
 * - ONE Pinned Viewport (position: sticky, top: 0, height: 100vh)
 * - ONE Continuous Scroll Timeline (0% -> 100% across container)
 * - Master Timeline Mapping:
 *     MOJITO:        0% -> ~38% (scrubs 0s -> 4s through transition)
 *     TRANSITION 1:  25% -> 45% (overlapping simultaneous scenes)
 *     OLD FASHIONED: 38% -> ~70% (scrubs 0s -> 4s through transition)
 *     TRANSITION 2:  60% -> 78% (overlapping simultaneous scenes)
 *     WHISKEY CREAM: 70% -> 100% (scrubs 0s -> 4s)
 * - Multi-layered Physical Transformation (scale, opacity, blur, depth rack focus, ambient lighting)
 * - requestAnimationFrame with targetProgress / currentProgress smoothing physics
 * - NO autoplay, NO slide translations up/down, NO scroll hijacking.
 * - Bidirectional, reversible frame-by-frame scrub.
 */

// --------------------------------------------------------------------------
// 1. DATA-DRIVEN ARCHITECTURE (Shopify Ready Model)
// --------------------------------------------------------------------------
const LUCKY_SHAKER_DATA = {
  brand: {
    name: "Lucky Shaker",
    subtitle: "Bartender",
    tagline: "Crafted Cocktails. Ready to Pour."
  },
  flavors: [
    {
      id: "margarita",
      name: "Margarita",
      subtitle: "Tequila · Lima · Naranja · Agave",
      price: "$38.00",
      numericPrice: 38.00,
      productImage: "assets/cocteles/margarita.jpg",
      volume: "750 ML",
      shopifyVariantId: "gid://shopify/ProductVariant/89102301"
    },
    {
      id: "mojito",
      name: "Mojito",
      subtitle: "Ron blanco · Lima · Menta · Azúcar",
      price: "$36.00",
      numericPrice: 36.00,
      productImage: "assets/cocteles/mojito.jpg",
      volume: "750 ML",
      shopifyVariantId: "gid://shopify/ProductVariant/89102302"
    },
    {
      id: "daiquiri",
      name: "Daiquiri",
      subtitle: "Ron blanco · Lima · Azúcar",
      price: "$36.00",
      numericPrice: 36.00,
      productImage: "assets/cocteles/daiquiri.jpg",
      volume: "750 ML",
      shopifyVariantId: "gid://shopify/ProductVariant/89102303"
    },
    {
      id: "gin-tonic",
      name: "Gin & Tonic",
      subtitle: "Gin · Tonic · Cítricos",
      price: "$38.00",
      numericPrice: 38.00,
      productImage: "assets/cocteles/gin-tonic.jpg",
      volume: "750 ML",
      shopifyVariantId: "gid://shopify/ProductVariant/89102304"
    },
    {
      id: "paloma",
      name: "Paloma",
      subtitle: "Tequila · Toronja · Lima · Sal",
      price: "$38.00",
      numericPrice: 38.00,
      productImage: "assets/cocteles/paloma.jpg",
      volume: "750 ML",
      shopifyVariantId: "gid://shopify/ProductVariant/89102305"
    },
    {
      id: "mimosa",
      name: "Mimosa",
      subtitle: "Jugo de naranja · Prosecco",
      price: "$34.00",
      numericPrice: 34.00,
      productImage: "assets/cocteles/mimosa.jpg",
      volume: "750 ML",
      shopifyVariantId: "gid://shopify/ProductVariant/89102306"
    },
    {
      id: "moscow-mule",
      name: "Moscow Mule",
      subtitle: "Vodka · Ginger Beer · Lima",
      price: "$38.00",
      numericPrice: 38.00,
      productImage: "assets/cocteles/moscow-mule.jpg",
      volume: "750 ML",
      shopifyVariantId: "gid://shopify/ProductVariant/89102307"
    },
    {
      id: "cosmopolitan",
      name: "Cosmopolitan",
      subtitle: "Vodka · Cranberry · Naranja · Lima",
      price: "$38.00",
      numericPrice: 38.00,
      productImage: "assets/cocteles/cosmopolitan.jpg",
      volume: "750 ML",
      shopifyVariantId: "gid://shopify/ProductVariant/89102308"
    },
    {
      id: "sex-on-the-beach",
      name: "Sex on the Beach",
      subtitle: "Vodka · Durazno · Naranja · Cranberry",
      price: "$36.00",
      numericPrice: 36.00,
      productImage: "assets/cocteles/sex-on-the-beach.jpg",
      volume: "750 ML",
      shopifyVariantId: "gid://shopify/ProductVariant/89102309"
    },
    {
      id: "pina-colada",
      name: "Piña Colada",
      subtitle: "Ron blanco · Piña · Coco",
      price: "$38.00",
      numericPrice: 38.00,
      productImage: "assets/cocteles/pina-colada.jpg",
      volume: "750 ML",
      shopifyVariantId: "gid://shopify/ProductVariant/89102310"
    },
    {
      id: "blue-hawaii",
      name: "Blue Hawaii",
      subtitle: "Ron · Vodka · Blue Curaçao · Piña",
      price: "$38.00",
      numericPrice: 38.00,
      productImage: "assets/cocteles/blue-hawaii.jpg",
      volume: "750 ML",
      shopifyVariantId: "gid://shopify/ProductVariant/89102311"
    },
    {
      id: "malibu-bay-breeze",
      name: "Malibu Bay Breeze",
      subtitle: "Malibu · Piña · Cranberry",
      price: "$36.00",
      numericPrice: 36.00,
      productImage: "assets/cocteles/malibu-bay-breeze.jpg",
      volume: "750 ML",
      shopifyVariantId: "gid://shopify/ProductVariant/89102312"
    },
    {
      id: "negroni",
      name: "Negroni",
      subtitle: "Gin · Campari · Vermouth rojo",
      price: "$42.00",
      numericPrice: 42.00,
      productImage: "assets/cocteles/negroni.jpg",
      volume: "750 ML",
      shopifyVariantId: "gid://shopify/ProductVariant/89102313"
    },
    {
      id: "old-fashioned",
      name: "Old Fashioned",
      subtitle: "Whiskey · Bitters · Azúcar · Naranja",
      price: "$42.00",
      numericPrice: 42.00,
      productImage: "assets/cocteles/old-fashioned.jpg",
      volume: "750 ML",
      shopifyVariantId: "gid://shopify/ProductVariant/89102314"
    },
    {
      id: "manhattan",
      name: "Manhattan",
      subtitle: "Rye Whiskey · Vermouth rojo · Bitters",
      price: "$42.00",
      numericPrice: 42.00,
      productImage: "assets/cocteles/manhattan.jpg",
      volume: "750 ML",
      shopifyVariantId: "gid://shopify/ProductVariant/89102315"
    },
    {
      id: "classic-martini",
      name: "Classic Martini",
      subtitle: "Gin · Dry Vermouth · Limón",
      price: "$42.00",
      numericPrice: 42.00,
      productImage: "assets/cocteles/classic-martini.jpg",
      volume: "750 ML",
      shopifyVariantId: "gid://shopify/ProductVariant/89102316"
    },
    {
      id: "espresso-martini",
      name: "Espresso Martini",
      subtitle: "Vodka · Decaf Espresso · Coffee Liqueur · Sugar",
      price: "$40.00",
      numericPrice: 40.00,
      productImage: "assets/cocteles/espresso-martini.jpg",
      volume: "750 ML",
      shopifyVariantId: "gid://shopify/ProductVariant/89102317"
    },
    {
      id: "caipirinha",
      name: "Caipirinha",
      subtitle: "Cachaça · Lima · Azúcar",
      price: "$38.00",
      numericPrice: 38.00,
      productImage: "assets/cocteles/caipirinha.jpg",
      volume: "750 ML",
      shopifyVariantId: "gid://shopify/ProductVariant/89102318"
    }
  ]
};

// --------------------------------------------------------------------------
// 2. STATE MANAGEMENT
// --------------------------------------------------------------------------
const AppState = {
  cart: []
};

// --------------------------------------------------------------------------
// 3. INITIALIZATION ON DOM READY
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initNavbarScroll();
  initPrimeStoneCinematicEngine();
  initCartDrawer();
  initNewsletterForm();
});

// --------------------------------------------------------------------------
// 4. NAVBAR SCROLL EFFECT
// --------------------------------------------------------------------------
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// --------------------------------------------------------------------------
// 5. PRIME STONE BUILDERS CINEMATIC SCROLL TRANSFORMATION ENGINE
// --------------------------------------------------------------------------
function initPrimeStoneCinematicEngine() {
  const sequenceSection = document.getElementById("cinematic-sequence");
  const viewport = document.getElementById("cinematic-viewport");

  // Scene Layers (co-planar depth stack)
  const sceneMojito = document.getElementById("scene-mojito");
  const sceneOF = document.getElementById("scene-old-fashioned");
  const sceneWC = document.getElementById("scene-whiskey-cream");

  // Video & Canvas Elements
  const wcCanvas = document.getElementById("wc-sequence-canvas");
  const ofCanvas = document.getElementById("of-sequence-canvas");
  const mojitoCanvas = document.getElementById("mojito-sequence-canvas");

  const commVideo = document.getElementById("video-whiskey-cream-commercial");
  const videoMojito = document.getElementById("video-mojito");
  const videoOF = document.getElementById("video-old-fashioned");
  const videoWC = document.getElementById("video-whiskey-cream");
  const bgVideoWC = document.getElementById("bg-video-whiskey-cream");

  // Atmospheric Lighting Overlay
  const atmosphere = document.getElementById("cinematic-atmosphere");

  // Editorial Floating Cards
  const cardMojito = document.getElementById("card-mojito");
  const cardOF = document.getElementById("card-old-fashioned");
  const cardWC = document.getElementById("card-whiskey-cream");

  // Prime Stone & GN Investment DNA: Phase HUD, Liquid Glow, Scan Beam & 3D Badges
  const phaseHud = document.getElementById("cinematic-phase-hud");
  const phaseLabel = document.getElementById("phase-label");
  const phasePercent = document.getElementById("phase-percent");
  const phaseFill = document.getElementById("phase-progress-fill");
  const liquidGlow = document.getElementById("wc-liquid-glow");
  const scanBeam = document.getElementById("wc-scan-beam");
  const badgeWhiskey = document.getElementById("badge-whiskey");
  const badgeCocoa = document.getElementById("badge-cocoa");
  const badgeCream = document.getElementById("badge-cream");
  const badgeArtisan = document.getElementById("badge-artisan");
  const scrollCue = document.getElementById("scroll-cue");

  // Scrubber Elements
  const fillBar = document.getElementById("timeline-fill-bar");
  const markerMojito = document.getElementById("marker-mojito");
  const markerOF = document.getElementById("marker-oldfashioned");
  const markerWC = document.getElementById("marker-whiskeycream");

  // Telemetry HUD Elements
  const debugMaster = document.getElementById("debug-master-progress");
  const debugDirection = document.getElementById("debug-direction");
  const debugActive = document.getElementById("debug-active-cocktail");
  const debugTimecode = document.getElementById("debug-timecode");
  const toggleHudBtn = document.getElementById("toggle-debug-hud");
  const hudContainer = document.getElementById("cinematic-debug-hud");

  if (toggleHudBtn && hudContainer) {
    toggleHudBtn.addEventListener("click", () => {
      hudContainer.style.display = "none";
    });
  }

  if (!sequenceSection || !viewport) {
    console.warn("Cinematic elements missing from DOM.");
    return;
  }

  // 1. Ensure NO AUTOPLAY & initialize available videos
  const allVideos = [];
  if (commVideo) allVideos.push(commVideo);
  if (videoWC) allVideos.push(videoWC);
  if (bgVideoWC) allVideos.push(bgVideoWC);
  if (videoMojito) allVideos.push(videoMojito);
  if (videoOF) allVideos.push(videoOF);
  allVideos.forEach(v => {
    v.muted = true;
    v.playsInline = true;
    v.pause();
    v.preload = "auto";
  });

  // Explicitly prime videos at frame 0 on load
  function primeVideo(video) {
    if (video.readyState >= 1) {
      video.currentTime = 0;
    } else {
      video.addEventListener("loadedmetadata", () => {
        video.currentTime = 0;
      }, { once: true });
    }
  }
  allVideos.forEach(primeVideo);

  // -------------------------------------------------------------------------
  // 2. PRIME STONE 3-ACT CANVAS SEQUENCE ENGINE (ZERO-LATENCY 60FPS)
  // -------------------------------------------------------------------------
  function isMobileView() {
    return window.innerWidth <= 768;
  }

  const cocktails = {
    wc: {
      canvas: wcCanvas,
      totalFrames: 120,
      mobileFolder: "whiskey_scroll_mobile",
      desktopFolder: "whiskey_scroll",
      mobileCache: new Map(),
      desktopCache: new Map(),
      mobileLoading: new Set(),
      desktopLoading: new Set(),
      displayedFrame: -1
    },
    of: {
      canvas: ofCanvas,
      totalFrames: 48,
      mobileFolder: "old_fashioned_mobile",
      desktopFolder: "old_fashioned_desktop",
      mobileCache: new Map(),
      desktopCache: new Map(),
      mobileLoading: new Set(),
      desktopLoading: new Set(),
      displayedFrame: -1
    },
    mojito: {
      canvas: mojitoCanvas,
      totalFrames: 48,
      mobileFolder: "mojito_mobile",
      desktopFolder: "mojito_desktop",
      mobileCache: new Map(),
      desktopCache: new Map(),
      mobileLoading: new Set(),
      desktopLoading: new Set(),
      displayedFrame: -1
    }
  };

  function getFrameUrl(itemKey, idx, isMobile = isMobileView()) {
    const item = cocktails[itemKey];
    const padded = String(idx).padStart(4, "0");
    const folder = isMobile ? item.mobileFolder : item.desktopFolder;
    return `assets/frames/${folder}/frame-${padded}.webp?v=6`;
  }

  function preloadFrame(itemKey, idx, priority = false) {
    const item = cocktails[itemKey];
    if (!item || idx < 1 || idx > item.totalFrames) return;
    const isMobile = isMobileView();
    const cache = isMobile ? item.mobileCache : item.desktopCache;
    const loading = isMobile ? item.mobileLoading : item.desktopLoading;
    if (cache.has(idx) || loading.has(idx)) return;

    loading.add(idx);
    const img = new Image();
    img.src = getFrameUrl(itemKey, idx, isMobile);
    img.decoding = "async";
    if (priority) img.fetchPriority = "high";

    if ("decode" in img) {
      img.decode()
        .then(() => {
          loading.delete(idx);
          cache.set(idx, img);
          if (item.displayedFrame === -1 && idx === 1) {
            drawFrameToCanvas(item.canvas, img);
            item.displayedFrame = 1;
          }
        })
        .catch(() => {
          img.onload = () => {
            loading.delete(idx);
            cache.set(idx, img);
            if (item.displayedFrame === -1 && idx === 1) {
              drawFrameToCanvas(item.canvas, img);
              item.displayedFrame = 1;
            }
          };
          img.onerror = () => loading.delete(idx);
        });
    } else {
      img.onload = () => {
        loading.delete(idx);
        cache.set(idx, img);
        if (item.displayedFrame === -1 && idx === 1) {
          drawFrameToCanvas(item.canvas, img);
          item.displayedFrame = 1;
        }
      };
      img.onerror = () => loading.delete(idx);
    }
  }

  function loadNearbyFrames(itemKey, center) {
    const item = cocktails[itemKey];
    if (!item) return;
    const minF = Math.max(1, center - 4);
    const maxF = Math.min(item.totalFrames, center + 12);
    for (let f = minF; f <= maxF; f++) {
      preloadFrame(itemKey, f);
    }
  }

  function startBackgroundPrefetch() {
    // 1. Preload immediate critical frames for all 3 drinks
    preloadFrame("wc", 1, true);
    preloadFrame("of", 1, true);
    preloadFrame("mojito", 1, true);

    for (let i = 1; i <= 24; i++) preloadFrame("wc", i);
    for (let i = 1; i <= 12; i++) preloadFrame("of", i);
    for (let i = 1; i <= 12; i++) preloadFrame("mojito", i);

    // 2. Prefetch remaining in background
    let seq = ["wc", "of", "mojito"];
    let seqIdx = 0;
    let f = 1;
    const timer = setInterval(() => {
      if (seqIdx >= seq.length) {
        clearInterval(timer);
        return;
      }
      const k = seq[seqIdx];
      preloadFrame(k, f);
      f++;
      if (f > cocktails[k].totalFrames) {
        seqIdx++;
        f = 1;
      }
    }, 20);
  }

  // Cover aspect-ratio math (from Prime Stone Builders ScrollFrameSequence.jsx)
  function drawFrameToCanvas(canvas, img) {
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    if (cw === 0 || ch === 0 || iw === 0 || ih === 0) return;

    const imgAspect = iw / ih;
    const canvasAspect = cw / ch;

    let dw, dh;
    if (canvasAspect > imgAspect) {
      dw = cw;
      dh = cw / imgAspect;
    } else {
      dh = ch;
      dw = ch * imgAspect;
    }

    const offsetX = (cw - dw) / 2;
    const offsetY = (ch - dh) / 2;
    ctx.drawImage(img, offsetX, offsetY, dw, dh);
  }

  function renderCocktailFrame(itemKey, targetFrame) {
    const item = cocktails[itemKey];
    if (!item || !item.canvas) return;
    const isMobile = isMobileView();
    const cache = isMobile ? item.mobileCache : item.desktopCache;

    if (item.displayedFrame !== targetFrame) {
      let img = cache.get(targetFrame);
      if (!img) {
        let closestDist = Infinity;
        for (const [fIdx, fImg] of cache.entries()) {
          const d = Math.abs(fIdx - targetFrame);
          if (d < closestDist && fImg.complete && fImg.naturalWidth > 0) {
            closestDist = d;
            img = fImg;
          }
        }
      }
      if (img && img.complete && img.naturalWidth > 0) {
        drawFrameToCanvas(item.canvas, img);
        item.displayedFrame = targetFrame;
      }
      loadNearbyFrames(itemKey, targetFrame);
    }
  }

  let lastMobileRecorded = isMobileView();
  function resizeAllCanvases() {
    const isMobile = isMobileView();
    const mobileChanged = isMobile !== lastMobileRecorded;
    if (mobileChanged) {
      lastMobileRecorded = isMobile;
      Object.keys(cocktails).forEach(k => {
        cocktails[k].displayedFrame = -1;
      });
      startBackgroundPrefetch();
      if (commVideo) commVideo.load();
      if (videoOF) videoOF.load();
      if (videoMojito) videoMojito.load();
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    Object.keys(cocktails).forEach(k => {
      const item = cocktails[k];
      if (!item.canvas) return;
      const rect = item.canvas.getBoundingClientRect();
      const targetW = Math.max(1, Math.round(rect.width * dpr));
      const targetH = Math.max(1, Math.round(rect.height * dpr));
      if (item.canvas.width !== targetW || item.canvas.height !== targetH || mobileChanged) {
        item.canvas.width = targetW;
        item.canvas.height = targetH;
        const cache = isMobile ? item.mobileCache : item.desktopCache;
        const curF = item.displayedFrame > 0 ? item.displayedFrame : 1;
        if (cache.has(curF)) {
          drawFrameToCanvas(item.canvas, cache.get(curF));
          item.displayedFrame = curF;
        }
      }
    });
  }

  window.addEventListener("resize", resizeAllCanvases);
  window.addEventListener("orientationchange", resizeAllCanvases);
  resizeAllCanvases();
  startBackgroundPrefetch();

  // -------------------------------------------------------------------------
  // 3. Mathematical Utilities
  // -------------------------------------------------------------------------
  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function scrubVideo(video, targetSeconds) {
    if (!video || !video.duration || isNaN(video.duration)) return;
    const clamped = Math.max(0, Math.min(video.duration - 0.02, targetSeconds));
    if (Math.abs(video.currentTime - clamped) > 0.02) {
      video.currentTime = clamped;
    }
  }

  // -------------------------------------------------------------------------
  // 4. Physics State: targetProgress & currentProgress with rAF smoothing
  // -------------------------------------------------------------------------
  let targetProgress = 0;
  let currentProgress = 0;
  let scrollDirection = "IDLE";
  let isLoopActive = false;
  const SMOOTHING_FACTOR = 0.09; // Buttery smooth physical response

  // Milestone Latch / Kinetic End Stop State
  function computeScrollProgress() {
    const rect = sequenceSection.getBoundingClientRect();
    const scrollDistance = sequenceSection.offsetHeight - window.innerHeight;
    if (scrollDistance <= 0) return 0;
    const raw = -rect.top / scrollDistance;
    return clamp(raw, 0, 1);
  }

  function onScrollOrResize() {
    const newTarget = computeScrollProgress();

    if (newTarget !== targetProgress) {
      scrollDirection = newTarget >= targetProgress ? "SCROLLING DOWN (▼)" : "SCROLLING UP (▲)";
      targetProgress = newTarget;

      if (!isLoopActive) {
        isLoopActive = true;
        requestAnimationFrame(renderLoop);
      }
    }
  }

  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize, { passive: true });

  // -------------------------------------------------------------------------
  // 5. Continuous Animation Loop (requestAnimationFrame)
  // -------------------------------------------------------------------------
  function renderLoop() {
    const diff = targetProgress - currentProgress;
    
    if (Math.abs(diff) > 0.0001) {
      currentProgress += diff * SMOOTHING_FACTOR;
      applyCinematicTransformation(currentProgress);
      requestAnimationFrame(renderLoop);
    } else {
      currentProgress = targetProgress;
      applyCinematicTransformation(currentProgress);
      isLoopActive = false;
    }
  }

  // -------------------------------------------------------------------------
  // 6. Master Multi-layered 3-Act Cinematic Transformation
  // -------------------------------------------------------------------------
  function applyCinematicTransformation(p) {
    const isMobile = isMobileView();

    // -----------------------------------------------------------------------
    // A. ACT 1: WHISKEY CREAM (p: 0.00 -> 0.32)
    // -----------------------------------------------------------------------
    let targetFrameWC = 1;
    if (p <= 0.02) {
      targetFrameWC = 1;
    } else if (p >= 0.22) {
      targetFrameWC = 120;
    } else {
      const normWC = (p - 0.02) / 0.20;
      targetFrameWC = Math.min(120, Math.max(1, Math.round(normWC * 119) + 1));
    }
    renderCocktailFrame("wc", targetFrameWC);

    if (commVideo && commVideo.duration && p <= 0.28) {
      scrubVideo(commVideo, (targetFrameWC / 120) * commVideo.duration);
    }

    // -----------------------------------------------------------------------
    // B. TRANSITION 1 -> 2: OLD FASHIONED SLIDES IN FROM RIGHT (p: 0.28 -> 0.33)
    // -----------------------------------------------------------------------
    let t1 = clamp((p - 0.28) / 0.05, 0, 1);
    let e1 = easeInOutCubic(t1);

    if (sceneWC) {
      if (p < 0.28) {
        sceneWC.style.display = "block";
        sceneWC.style.transform = `translateX(0%) scale(${(1.0 + p * 0.02).toFixed(4)})`;
        sceneWC.style.opacity = "1";
      } else if (p <= 0.34) {
        sceneWC.style.display = "block";
        const xOffsetWC = -e1 * 25; // shifts slightly left for dimensional depth
        sceneWC.style.transform = `translateX(${xOffsetWC.toFixed(2)}%) scale(1.0)`;
        sceneWC.style.opacity = (1 - e1 * 0.4).toFixed(3);
      } else {
        sceneWC.style.display = "none";
      }
    }

    if (sceneOF) {
      if (p < 0.28) {
        sceneOF.style.display = "none";
        sceneOF.style.transform = "translateX(100%)";
      } else if (p < 0.60) {
        sceneOF.style.display = "block";
        const xOffsetOF = (1 - e1) * 100;
        sceneOF.style.transform = `translateX(${xOffsetOF.toFixed(2)}%)`;
        sceneOF.style.opacity = "1";
      }
    }

    // -----------------------------------------------------------------------
    // C. ACT 2: OLD FASHIONED SCRUB (p: 0.33 -> 0.64)
    // -----------------------------------------------------------------------
    let targetFrameOF = 1;
    if (p <= 0.35) {
      targetFrameOF = 1;
    } else if (p >= 0.53) {
      targetFrameOF = 48;
    } else {
      const normOF = (p - 0.35) / 0.18;
      targetFrameOF = Math.min(48, Math.max(1, Math.round(normOF * 47) + 1));
    }
    renderCocktailFrame("of", targetFrameOF);

    if (videoOF && videoOF.duration && p >= 0.28 && p <= 0.60) {
      scrubVideo(videoOF, (targetFrameOF / 48) * videoOF.duration);
    }

    // -----------------------------------------------------------------------
    // D. TRANSITION 2 -> 3: MOJITO SLIDES IN FROM RIGHT (p: 0.60 -> 0.65)
    // -----------------------------------------------------------------------
    let t2 = clamp((p - 0.60) / 0.05, 0, 1);
    let e2 = easeInOutCubic(t2);

    if (sceneOF && p >= 0.60) {
      if (p <= 0.66) {
        sceneOF.style.display = "block";
        const xOffsetOF2 = -e2 * 25;
        sceneOF.style.transform = `translateX(${xOffsetOF2.toFixed(2)}%) scale(1.0)`;
        sceneOF.style.opacity = (1 - e2 * 0.4).toFixed(3);
      } else {
        sceneOF.style.display = "none";
      }
    }

    if (sceneMojito) {
      if (p < 0.60) {
        sceneMojito.style.display = "none";
        sceneMojito.style.transform = "translateX(100%)";
      } else {
        sceneMojito.style.display = "block";
        const xOffsetMojito = (1 - e2) * 100;
        sceneMojito.style.transform = `translateX(${xOffsetMojito.toFixed(2)}%)`;
        sceneMojito.style.opacity = "1";
      }
    }

    // -----------------------------------------------------------------------
    // E. ACT 3: MOJITO SCRUB (p: 0.65 -> 0.98)
    // -----------------------------------------------------------------------
    let targetFrameMojito = 1;
    if (p <= 0.67) {
      targetFrameMojito = 1;
    } else if (p >= 0.85) {
      targetFrameMojito = 48;
    } else {
      const normMojito = (p - 0.67) / 0.18;
      targetFrameMojito = Math.min(48, Math.max(1, Math.round(normMojito * 47) + 1));
    }
    renderCocktailFrame("mojito", targetFrameMojito);

    if (videoMojito && videoMojito.duration && p >= 0.60) {
      scrubVideo(videoMojito, (targetFrameMojito / 48) * videoMojito.duration);
    }

    // -----------------------------------------------------------------------
    // F. EDITORIAL CARDS REVEALS & SLIDE-OUT TRANSITIONS
    // -----------------------------------------------------------------------
    // Card 1: Whiskey Cream
    if (cardWC) {
      if (p < 0.18) {
        cardWC.style.opacity = "0";
        cardWC.style.transform = "translate3d(0, 32px, 0) scale(0.95)";
        cardWC.style.filter = "blur(8px)";
        cardWC.style.pointerEvents = "none";
      } else if (p <= 0.28) {
        const rev1 = Math.min(1, (p - 0.18) / 0.05); // 18% - 23%
        cardWC.style.opacity = rev1.toFixed(2);
        const yOff1 = (1 - rev1) * 32;
        cardWC.style.transform = `translate3d(0, ${yOff1.toFixed(1)}px, 0) scale(${(0.95 + rev1 * 0.05).toFixed(3)})`;
        cardWC.style.filter = rev1 > 0.8 ? "none" : `blur(${((1 - rev1) * 6).toFixed(1)}px)`;
        cardWC.style.pointerEvents = rev1 > 0.6 ? "auto" : "none";
      } else if (p <= 0.33) {
        // Slide left during transition to Old Fashioned
        const exit1 = (p - 0.28) / 0.05;
        cardWC.style.opacity = (1 - exit1).toFixed(2);
        cardWC.style.transform = `translate3d(${(-exit1 * 50).toFixed(1)}px, 0, 0)`;
        cardWC.style.pointerEvents = "none";
      } else {
        cardWC.style.opacity = "0";
        cardWC.style.pointerEvents = "none";
      }
    }

    // Card 2: Old Fashioned
    if (cardOF) {
      if (p < 0.49) {
        cardOF.style.opacity = "0";
        cardOF.style.transform = "translate3d(0, 32px, 0) scale(0.95)";
        cardOF.style.filter = "blur(8px)";
        cardOF.style.pointerEvents = "none";
      } else if (p <= 0.60) {
        const rev2 = Math.min(1, (p - 0.49) / 0.05); // 49% - 54%
        cardOF.style.opacity = rev2.toFixed(2);
        const yOff2 = (1 - rev2) * 32;
        cardOF.style.transform = `translate3d(0, ${yOff2.toFixed(1)}px, 0) scale(${(0.95 + rev2 * 0.05).toFixed(3)})`;
        cardOF.style.filter = rev2 > 0.8 ? "none" : `blur(${((1 - rev2) * 6).toFixed(1)}px)`;
        cardOF.style.pointerEvents = rev2 > 0.6 ? "auto" : "none";
      } else if (p <= 0.65) {
        // Slide left during transition to Mojito
        const exit2 = (p - 0.60) / 0.05;
        cardOF.style.opacity = (1 - exit2).toFixed(2);
        cardOF.style.transform = `translate3d(${(-exit2 * 50).toFixed(1)}px, 0, 0)`;
        cardOF.style.pointerEvents = "none";
      } else {
        cardOF.style.opacity = "0";
        cardOF.style.pointerEvents = "none";
      }
    }

    // Card 3: Mojito
    if (cardMojito) {
      if (p < 0.82) {
        cardMojito.style.opacity = "0";
        cardMojito.style.transform = "translate3d(0, 32px, 0) scale(0.95)";
        cardMojito.style.filter = "blur(8px)";
        cardMojito.style.pointerEvents = "none";
      } else {
        const rev3 = Math.min(1, (p - 0.82) / 0.05); // 82% - 87%
        cardMojito.style.opacity = rev3.toFixed(2);
        const yOff3 = (1 - rev3) * 32;
        cardMojito.style.transform = `translate3d(0, ${yOff3.toFixed(1)}px, 0) scale(${(0.95 + rev3 * 0.05).toFixed(3)})`;
        cardMojito.style.filter = rev3 > 0.8 ? "none" : `blur(${((1 - rev3) * 6).toFixed(1)}px)`;
        cardMojito.style.pointerEvents = rev3 > 0.6 ? "auto" : "none";
      }
    }

    // -----------------------------------------------------------------------
    // G. TOP PHASE HUD & PROGRESS TRACK
    // -----------------------------------------------------------------------
    const currentPercent = Math.round(p * 100);
    if (phasePercent) phasePercent.textContent = `${currentPercent}%`;
    if (phaseFill) phaseFill.style.width = `${(p * 100).toFixed(1)}%`;

    if (scrollCue) {
      scrollCue.style.opacity = p > 0.03 ? "0" : "1";
    }

    if (phaseLabel) {
      if (p < 0.28) {
        phaseLabel.textContent = "ACT 01 // WHISKEY CREAM • PRIVATE RESERVE";
      } else if (p < 0.33) {
        phaseLabel.textContent = "TRANSITION // DISCOVERING OLD FASHIONED";
      } else if (p < 0.60) {
        phaseLabel.textContent = "ACT 02 // OLD FASHIONED • BOURBON & BITTERS";
      } else if (p < 0.65) {
        phaseLabel.textContent = "TRANSITION // DISCOVERING MOJITO CRAFT";
      } else {
        phaseLabel.textContent = "ACT 03 // MOJITO CRAFT • CARIBBEAN BOTANICAL";
      }
    }

    // -----------------------------------------------------------------------
    // H. FLOATING BADGES (Whiskey Cream Specific)
    // -----------------------------------------------------------------------
    if (badgeWhiskey && badgeCocoa && badgeCream && badgeArtisan) {
      if (p < 0.28) {
        badgeWhiskey.style.opacity = "1";
        badgeCocoa.style.opacity = "1";
        badgeCream.style.opacity = "1";
        badgeArtisan.style.opacity = "1";
      } else {
        badgeWhiskey.style.opacity = "0";
        badgeCocoa.style.opacity = "0";
        badgeCream.style.opacity = "0";
        badgeArtisan.style.opacity = "0";
      }
    }

    // -----------------------------------------------------------------------
    // I. TELEMETRY & HUD
    // -----------------------------------------------------------------------
    if (fillBar) {
      fillBar.style.width = `${(p * 100).toFixed(2)}%`;
    }

    if (debugMaster) debugMaster.textContent = `${(p * 100).toFixed(1)}%`;
    if (debugDirection) {
      debugDirection.textContent = scrollDirection;
      debugDirection.style.color = scrollDirection.includes("DOWN") ? "#E82B7D" : "#4A4D57";
    }
    if (debugActive) {
      if (p < 0.28) debugActive.textContent = isMobile ? "WHISKEY CREAM (MOBILE 9:16)" : "WHISKEY CREAM (4K)";
      else if (p < 0.60) debugActive.textContent = isMobile ? "OLD FASHIONED (MOBILE 9:16)" : "OLD FASHIONED (4K)";
      else debugActive.textContent = isMobile ? "MOJITO (MOBILE 9:16)" : "MOJITO (4K)";
    }
    if (debugTimecode) {
      let activeActF = p < 0.33 ? `${targetFrameWC}/120` : (p < 0.65 ? `${targetFrameOF}/48` : `${targetFrameMojito}/48`);
      debugTimecode.textContent = `Progress: ${(p * 100).toFixed(0)}% • Frame ${activeActF}`;
    }
  }

  // Initial call on load to guarantee pristine state at scroll 0
  applyCinematicTransformation(0);
}

// --------------------------------------------------------------------------
// 6. CART DRAWER & SHOPIFY ARCHITECTURE
// --------------------------------------------------------------------------
function initCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const backdrop = document.getElementById("cart-backdrop");
  const openButtons = document.querySelectorAll(".open-cart-btn");
  const closeButton = document.getElementById("close-cart-btn");
  const checkoutButton = document.getElementById("checkout-btn");

  const openDrawer = () => {
    if (!drawer || !backdrop) return;
    drawer.classList.add("open");
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    if (!drawer || !backdrop) return;
    drawer.classList.remove("open");
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
  };

  openButtons.forEach(btn => btn.addEventListener("click", (e) => {
    e.preventDefault();
    openDrawer();
  }));

  if (closeButton) closeButton.addEventListener("click", closeDrawer);
  if (backdrop) backdrop.addEventListener("click", closeDrawer);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer && drawer.classList.contains("open")) {
      closeDrawer();
    }
  });

  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      if (!AppState.cart.length) {
        showToast("Your selection is currently empty.");
        return;
      }
      showToast("Redirecting to secure Shopify checkout...");
      setTimeout(() => {
        alert("Shopify Integration Endpoint: In production, forwards payload directly to https://checkout.luckyshaker.com");
      }, 400);
    });
  }
}

// Global addToCart
window.addToCart = function(flavorId, quantity = 1) {
  const flavor = LUCKY_SHAKER_DATA.flavors.find(f => f.id === flavorId);
  if (!flavor) return;

  const existing = AppState.cart.find(item => item.id === flavorId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    AppState.cart.push({
      id: flavor.id,
      name: flavor.name,
      price: flavor.numericPrice,
      priceString: flavor.price,
      image: flavor.productImage,
      volume: flavor.volume,
      shopifyVariantId: flavor.shopifyVariantId,
      quantity: quantity
    });
  }

  updateCartUI();
  showToast(`Added ${flavor.name} to your selection`);

  const badge = document.querySelector(".cart-badge");
  if (badge) {
    badge.classList.remove("bloom", "pulse");
    void badge.offsetWidth;
    badge.classList.add("bloom");
  }
};

function updateCartUI() {
  const container = document.getElementById("cart-items-list");
  const badge = document.querySelector(".cart-badge");
  const drawerSubtotal = document.getElementById("drawer-subtotal");
  const drawerCountBadge = document.getElementById("drawer-count-badge");
  const shippingText = document.getElementById("shipping-progress-text");
  const shippingPercent = document.getElementById("shipping-progress-percent");
  const shippingFill = document.getElementById("shipping-progress-fill");

  const totalItems = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (badge) badge.textContent = totalItems;
  if (drawerSubtotal) drawerSubtotal.textContent = `$${totalPrice.toFixed(2)}`;
  if (drawerCountBadge) {
    drawerCountBadge.textContent = totalItems === 1 ? "1 ITEM" : `${totalItems} ITEMS`;
  }

  // Free shipping threshold at $80.00
  const freeShippingThreshold = 80;
  if (shippingText && shippingFill) {
    if (totalPrice === 0) {
      shippingText.innerHTML = `Spend <strong>$${freeShippingThreshold.toFixed(2)}</strong> for <strong>Free Express Shipping</strong>`;
      if (shippingPercent) shippingPercent.textContent = "0%";
      shippingFill.style.width = "0%";
    } else if (totalPrice < freeShippingThreshold) {
      const remaining = freeShippingThreshold - totalPrice;
      const pct = Math.min(100, Math.round((totalPrice / freeShippingThreshold) * 100));
      shippingText.innerHTML = `Add <strong>$${remaining.toFixed(2)}</strong> more for <strong>Free Express Shipping</strong> 🍸`;
      if (shippingPercent) shippingPercent.textContent = `${pct}%`;
      shippingFill.style.width = `${pct}%`;
    } else {
      shippingText.innerHTML = `🎉 <strong>Complimentary Express Shipping Unlocked!</strong>`;
      if (shippingPercent) shippingPercent.textContent = "100%";
      shippingFill.style.width = "100%";
    }
  }

  if (!container) return;

  if (AppState.cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-message">
        <div class="empty-cart-icon-wrap">
          <img src="assets/lucky_shaker_glass_icon.png" alt="Lucky Shaker">
        </div>
        <h4 class="empty-cart-title">YOUR BAR IS EMPTY</h4>
        <p class="empty-cart-desc">Explore our signature ready-to-pour craft cocktails to curate your collection.</p>
        <a href="shop.html" class="empty-cart-cta">
          <span>EXPLORE COCKTAILS</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 7h12M8 2l5 5-5 5"/>
          </svg>
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = AppState.cart.map(item => `
    <div class="cart-item-row" data-id="${item.id}">
      <div class="cart-item-img-wrap">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      </div>
      <div class="cart-item-info">
        <h5>${item.name}</h5>
        <div class="item-vol">${item.volume || '700ml'} • Ready to Pour</div>
        <div class="cart-item-actions">
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="modifyCartQty('${item.id}', -1)" aria-label="Decrease quantity">−</button>
            <span class="qty-count">${item.quantity}</span>
            <button class="qty-btn" onclick="modifyCartQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
          </div>
          <button class="cart-item-remove-btn" onclick="modifyCartQty('${item.id}', -${item.quantity})" aria-label="Remove item" title="Remove">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="cart-item-right">
        <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
      </div>
    </div>
  `).join("");
}

window.modifyCartQty = function(id, delta) {
  const itemIndex = AppState.cart.findIndex(i => i.id === id);
  if (itemIndex === -1) return;

  AppState.cart[itemIndex].quantity += delta;
  if (AppState.cart[itemIndex].quantity <= 0) {
    AppState.cart.splice(itemIndex, 1);
  }
  updateCartUI();
};

// --------------------------------------------------------------------------
// 7. TOAST NOTIFICATION MICRO-INTERACTION (Animated SVG Checkmark Draw-on)
// --------------------------------------------------------------------------
let toastTimeout = null;
function showToast(message) {
  let toast = document.getElementById("luxury-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "luxury-toast";
    toast.className = "toast-notification";
    document.body.appendChild(toast);
  }

  // Re-inject fresh SVG paths on trigger to guarantee stroke-dashoffset draw-on animation runs
  toast.innerHTML = `
    <svg class="toast-check-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10" class="toast-check-circle"/>
      <path d="m8 12 3 3 5-6" class="toast-check-path"/>
    </svg>
    <span class="toast-message" id="toast-text">${message}</span>
  `;

  // Force reflow and activate
  void toast.offsetWidth;
  toast.classList.add("active");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("active");
  }, 2800);
}

// --------------------------------------------------------------------------
// 8. NEWSLETTER & PRIVATE RESERVE FORM
// --------------------------------------------------------------------------
function initNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector(".newsletter-input");
    if (!input || !input.value.trim()) return;

    showToast("Welcome to the Lucky Shaker Private Reserve.");
    input.value = "";
  });
}

/**
 * LUCKY SHAKER BARTENDER — MASTER CINEMATIC SCROLL-CONTROLLED VIDEO ENGINE
 * 
 * Concept:
 * SCROLL POSITION = VIDEO PLAYHEAD
 * The 3 cocktail clips form ONE continuous cinematic film.
 * Scroll progress (0 to 1) directly scrubs video.currentTime with RAF lerp smoothing.
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
      id: "mojito",
      name: "Mojito",
      subtitle: "Fresh Spearmint • Caribbean Rum • Crisp Lime Zest",
      tag: "Crisp & Botanical",
      description: "An effervescent masterpiece balancing triple-filtered Caribbean rum, hand-bruised garden spearmint, cold-pressed Persian limes, and pure cane sweetness.",
      price: "$36.00",
      numericPrice: 36.00,
      productImage: "assets/posters/mojito_desktop.jpg",
      volume: "750 ML",
      shopifyVariantId: "gid://shopify/ProductVariant/89102341"
    },
    {
      id: "old-fashioned",
      name: "Old Fashioned",
      subtitle: "Aged Kentucky Bourbon • Aromatic Bitters • Demerara • Orange Oils",
      tag: "Bold & Timeless",
      description: "The undisputed sovereign of classic cocktails. Bold Kentucky straight bourbon gently stirred with artisanal aromatic bitters, rich caramelized demerara sugar, and cold-expressed orange oils.",
      price: "$42.00",
      numericPrice: 42.00,
      productImage: "assets/posters/old_fashioned_desktop.jpg",
      volume: "750 ML",
      shopifyVariantId: "gid://shopify/ProductVariant/89102342"
    },
    {
      id: "whiskey-cream",
      name: "Whiskey Cream",
      subtitle: "Small-Batch Whiskey • Velvet Fresh Cream • Madagascar Vanilla",
      tag: "Velvety & Decadent",
      description: "Created by Katherin. A sumptuous indulgence marrying triple-distilled whiskeys with rich dairy cream, toasted cocoa, and bourbon vanilla bean.",
      price: "$38.00",
      numericPrice: 38.00,
      productImage: "assets/posters/whiskey_cream_desktop.jpg",
      volume: "750 ML",
      shopifyVariantId: "gid://shopify/ProductVariant/89102343"
    }
  ]
};

// --------------------------------------------------------------------------
// 2. TIMELINE SPECIFICATION & BOUNDARIES
// --------------------------------------------------------------------------
const TIMELINE_CONFIG = {
  // Master Timeline Segments & Transition Windows
  mojito: {
    start: 0.00,
    end: 0.38,
    fadeStart: 0.28,
    fadeEnd: 0.38
  },
  oldFashioned: {
    start: 0.28,
    end: 0.71,
    fadeInStart: 0.28,
    fadeInEnd: 0.38,
    fadeOutStart: 0.61,
    fadeOutEnd: 0.71
  },
  whiskeyCream: {
    start: 0.61,
    end: 1.00,
    fadeInStart: 0.61,
    fadeInEnd: 0.71
  }
};

// --------------------------------------------------------------------------
// 3. APPLICATION STATE
// --------------------------------------------------------------------------
const AppState = {
  cart: [],
  targetProgress: 0,
  currentProgress: 0,
  smoothingFactor: 0.16, // Buttery smooth lerp tracking
  isHudVisible: true,
  isFilmInView: false,
  heroFlavor: "whiskey-cream"
};

// --------------------------------------------------------------------------
// 4. INITIALIZATION
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initNavbarScroll();
  initHeroVideoControls();
  initMasterCinematicEngine();
  initCartDrawer();
  initNewsletterForm();
});

// --------------------------------------------------------------------------
// 5. NAVBAR SCROLL EFFECT
// --------------------------------------------------------------------------
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

// --------------------------------------------------------------------------
// 6. HERO VIDEO CONTROLS
// --------------------------------------------------------------------------
function initHeroVideoControls() {
  const heroVideo = document.getElementById("hero-video");
  const tabButtons = document.querySelectorAll(".flavor-tab-btn");
  if (!heroVideo) return;

  heroVideo.play().catch(() => {});

  const videoMap = {
    "whiskey-cream": {
      desktop: "videos para web/Whiskey Cream/Whiskey_cream_desktop.mp4",
      mobile: "videos para web/Whiskey Cream/Whiskey_cream_mobile.mp4",
      poster: "assets/posters/whiskey_cream_desktop.jpg"
    },
    "old-fashioned": {
      desktop: "videos para web/Old Fashioned/Cinematic_Old_Fashioned desktop.mp4",
      mobile: "videos para web/Old Fashioned/Old_Fashioned_cocktail_mobile.mp4",
      poster: "assets/posters/old_fashioned_desktop.jpg"
    },
    "mojito": {
      desktop: "videos para web/Mojito/Cinematic_mojito_desktop.mp4",
      mobile: "videos para web/Mojito/Mojito_product_video mobile.mp4",
      poster: "assets/posters/mojito_desktop.jpg"
    }
  };

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const flavorId = btn.dataset.flavor;
      if (!flavorId || flavorId === AppState.heroFlavor) return;

      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      AppState.heroFlavor = flavorId;

      const info = videoMap[flavorId];
      if (!info) return;

      const isMobile = window.innerWidth <= 768;
      const targetSrc = isMobile ? info.mobile : info.desktop;

      heroVideo.style.opacity = "0.2";
      setTimeout(() => {
        heroVideo.poster = info.poster;
        heroVideo.src = targetSrc;
        heroVideo.load();
        heroVideo.play().catch(() => {});
        heroVideo.style.opacity = "1";
      }, 150);
    });
  });
}

// --------------------------------------------------------------------------
// 7. MASTER CINEMATIC SCROLL-CONTROLLED VIDEO ENGINE
// --------------------------------------------------------------------------
function initMasterCinematicEngine() {
  const filmSection = document.getElementById("cinematic-film");
  if (!filmSection) return;

  // Video elements
  const mojitoVideo = document.getElementById("video-mojito");
  const ofVideo = document.getElementById("video-old-fashioned");
  const wcVideo = document.getElementById("video-whiskey-cream");

  if (!mojitoVideo || !ofVideo || !wcVideo) return;

  // Explicitly guarantee NO AUTOPLAY on all timeline videos
  [mojitoVideo, ofVideo, wcVideo].forEach(v => {
    v.muted = true;
    v.pause();
    v.currentTime = 0;
    // Preload
    v.load();
  });

  // Track metadata ready states
  const readyMap = {
    mojito: mojitoVideo.readyState >= 1,
    oldFashioned: ofVideo.readyState >= 1,
    whiskeyCream: wcVideo.readyState >= 1
  };

  mojitoVideo.addEventListener("loadedmetadata", () => { readyMap.mojito = true; });
  ofVideo.addEventListener("loadedmetadata", () => { readyMap.oldFashioned = true; });
  wcVideo.addEventListener("loadedmetadata", () => { readyMap.whiskeyCream = true; });

  // DOM Elements for synchronized UI
  const watermarkMojito = document.getElementById("watermark-mojito");
  const watermarkOF = document.getElementById("watermark-oldfashioned");
  const watermarkWC = document.getElementById("watermark-whiskeycream");

  const storyMojito = document.getElementById("story-overlay-mojito");
  const storyOF = document.getElementById("story-overlay-old-fashioned");
  const storyWC = document.getElementById("story-overlay-whiskey-cream");

  const timelineFill = document.getElementById("timeline-fill-bar");
  const markerMojito = document.getElementById("marker-mojito");
  const markerOF = document.getElementById("marker-oldfashioned");
  const markerWC = document.getElementById("marker-whiskeycream");

  // HUD Elements
  const debugMaster = document.getElementById("debug-master-progress");
  const debugActive = document.getElementById("debug-active-cocktail");
  const debugLocal = document.getElementById("debug-local-progress");
  const debugTimecode = document.getElementById("debug-timecode");
  const debugState = document.getElementById("debug-state");
  const toggleHudBtn = document.getElementById("toggle-debug-hud");
  const hudContainer = document.getElementById("cinematic-debug-hud");

  if (toggleHudBtn && hudContainer) {
    toggleHudBtn.addEventListener("click", () => {
      hudContainer.style.display = "none";
    });
  }

  // IntersectionObserver to activate/deactivate RAF loop when section is near
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      AppState.isFilmInView = entry.isIntersecting;
    });
  }, {
    root: null,
    rootMargin: "20% 0px",
    threshold: 0
  });

  observer.observe(filmSection);

  // Safe seek helper: avoids microscopic stutter while strictly following timeline
  function seekVideoFrame(video, targetSeconds) {
    if (!video || isNaN(video.duration) || video.duration === 0) return;
    const clamped = Math.max(0, Math.min(video.duration - 0.02, targetSeconds));
    if (Math.abs(video.currentTime - clamped) > 0.018) {
      video.currentTime = clamped;
    }
  }

  // Scroll Position Calculation (SCROLL POSITION = MASTER PLAYHEAD)
  function calculateMasterProgress() {
    const rect = filmSection.getBoundingClientRect();
    const scrollableDistance = rect.height - window.innerHeight;
    
    if (scrollableDistance <= 0) return 0;

    if (rect.top > 0) {
      return 0; // Above film section
    } else if (rect.top < -scrollableDistance) {
      return 1; // Past film section
    } else {
      return (-rect.top) / scrollableDistance;
    }
  }

  // Master Render Loop (requestAnimationFrame with Lerp Smoothing)
  function renderTimeline() {
    // Calculate current scroll target
    AppState.targetProgress = calculateMasterProgress();

    // Lerp smooth towards target
    const diff = AppState.targetProgress - AppState.currentProgress;
    AppState.currentProgress += diff * AppState.smoothingFactor;

    // Snap if very close
    if (Math.abs(diff) < 0.0003) {
      AppState.currentProgress = AppState.targetProgress;
    }

    const P = Math.max(0, Math.min(1, AppState.currentProgress));

    // Active Cocktail Identification for UI
    let activeName = "MOJITO";
    let activeLocalProgress = 0;
    let activeCurrentTime = 0;
    let activeDuration = 4.0;

    // ------------------------------------------------------------------------
    // 1. MOJITO VIDEO SCRUB & TRANSITION [0.00 -> 0.38]
    // ------------------------------------------------------------------------
    if (P <= TIMELINE_CONFIG.mojito.end) {
      const localP = (P - TIMELINE_CONFIG.mojito.start) / (TIMELINE_CONFIG.mojito.end - TIMELINE_CONFIG.mojito.start);
      const clampedP = Math.max(0, Math.min(1, localP));
      const dur = mojitoVideo.duration || 4.0;
      const targetTime = clampedP * dur;

      seekVideoFrame(mojitoVideo, targetTime);

      if (P <= TIMELINE_CONFIG.mojito.fadeStart) {
        // Pure Mojito dominance
        mojitoVideo.style.opacity = "1";
        mojitoVideo.style.transform = "scale(1.0)";
        mojitoVideo.style.filter = "brightness(0.88) contrast(1.08)";
      } else {
        // Transition Mojito -> Old Fashioned [0.28 -> 0.38]
        // Mojito scrubs its final frames while fading out & scaling slightly
        const t = (P - TIMELINE_CONFIG.mojito.fadeStart) / (TIMELINE_CONFIG.mojito.fadeEnd - TIMELINE_CONFIG.mojito.fadeStart);
        mojitoVideo.style.opacity = (1 - t).toFixed(3);
        mojitoVideo.style.transform = `scale(${(1.0 + t * 0.04).toFixed(3)})`;
        mojitoVideo.style.filter = `brightness(${(0.88 - t * 0.15).toFixed(2)}) blur(${(t * 4).toFixed(1)}px) contrast(1.08)`;
      }

      if (P < 0.33) {
        activeName = "MOJITO";
        activeLocalProgress = clampedP;
        activeCurrentTime = mojitoVideo.currentTime;
        activeDuration = dur;
      }
    } else {
      mojitoVideo.style.opacity = "0";
    }

    // ------------------------------------------------------------------------
    // 2. OLD FASHIONED VIDEO SCRUB & TRANSITION [0.28 -> 0.71]
    // ------------------------------------------------------------------------
    if (P >= TIMELINE_CONFIG.oldFashioned.start && P <= TIMELINE_CONFIG.oldFashioned.end) {
      const localP = (P - TIMELINE_CONFIG.oldFashioned.start) / (TIMELINE_CONFIG.oldFashioned.end - TIMELINE_CONFIG.oldFashioned.start);
      const clampedP = Math.max(0, Math.min(1, localP));
      const dur = ofVideo.duration || 4.0;
      const targetTime = clampedP * dur;

      seekVideoFrame(ofVideo, targetTime);

      if (P < TIMELINE_CONFIG.oldFashioned.fadeInEnd) {
        // Transition In from Mojito [0.28 -> 0.38]
        // Old Fashioned scrubs its first frames simultaneously!
        const t = (P - TIMELINE_CONFIG.oldFashioned.fadeInStart) / (TIMELINE_CONFIG.oldFashioned.fadeInEnd - TIMELINE_CONFIG.oldFashioned.fadeInStart);
        ofVideo.style.opacity = t.toFixed(3);
        ofVideo.style.transform = `scale(${(1.04 - t * 0.04).toFixed(3)})`;
        ofVideo.style.filter = `brightness(${(0.73 + t * 0.15).toFixed(2)}) blur(${((1 - t) * 4).toFixed(1)}px) contrast(1.08)`;
      } else if (P <= TIMELINE_CONFIG.oldFashioned.fadeOutStart) {
        // Pure Old Fashioned dominance [0.38 -> 0.61]
        ofVideo.style.opacity = "1";
        ofVideo.style.transform = "scale(1.0)";
        ofVideo.style.filter = "brightness(0.88) contrast(1.08)";
      } else {
        // Transition Out into Whiskey Cream [0.61 -> 0.71]
        // Old Fashioned scrubs its final frames while fading out
        const t = (P - TIMELINE_CONFIG.oldFashioned.fadeOutStart) / (TIMELINE_CONFIG.oldFashioned.fadeOutEnd - TIMELINE_CONFIG.oldFashioned.fadeOutStart);
        ofVideo.style.opacity = (1 - t).toFixed(3);
        ofVideo.style.transform = `scale(${(1.0 + t * 0.04).toFixed(3)})`;
        ofVideo.style.filter = `brightness(${(0.88 - t * 0.15).toFixed(2)}) blur(${(t * 4).toFixed(1)}px) contrast(1.08)`;
      }

      if (P >= 0.33 && P < 0.66) {
        activeName = "OLD FASHIONED";
        activeLocalProgress = clampedP;
        activeCurrentTime = ofVideo.currentTime;
        activeDuration = dur;
      }
    } else {
      ofVideo.style.opacity = "0";
    }

    // ------------------------------------------------------------------------
    // 3. WHISKEY CREAM VIDEO SCRUB & DOMINANCE [0.61 -> 1.00]
    // ------------------------------------------------------------------------
    if (P >= TIMELINE_CONFIG.whiskeyCream.start) {
      const localP = (P - TIMELINE_CONFIG.whiskeyCream.start) / (TIMELINE_CONFIG.whiskeyCream.end - TIMELINE_CONFIG.whiskeyCream.start);
      const clampedP = Math.max(0, Math.min(1, localP));
      const dur = wcVideo.duration || 4.0;
      const targetTime = clampedP * dur;

      seekVideoFrame(wcVideo, targetTime);

      if (P < TIMELINE_CONFIG.whiskeyCream.fadeInEnd) {
        // Transition In from Old Fashioned [0.61 -> 0.71]
        // Whiskey Cream scrubs its beginning frames simultaneously!
        const t = (P - TIMELINE_CONFIG.whiskeyCream.fadeInStart) / (TIMELINE_CONFIG.whiskeyCream.fadeInEnd - TIMELINE_CONFIG.whiskeyCream.fadeInStart);
        wcVideo.style.opacity = t.toFixed(3);
        wcVideo.style.transform = `scale(${(1.04 - t * 0.04).toFixed(3)})`;
        wcVideo.style.filter = `brightness(${(0.73 + t * 0.15).toFixed(2)}) blur(${((1 - t) * 4).toFixed(1)}px) contrast(1.08)`;
      } else {
        // Pure Whiskey Cream dominance [0.71 -> 1.00]
        wcVideo.style.opacity = "1";
        wcVideo.style.transform = "scale(1.0)";
        wcVideo.style.filter = "brightness(0.88) contrast(1.08)";
      }

      if (P >= 0.66) {
        activeName = "WHISKEY CREAM";
        activeLocalProgress = clampedP;
        activeCurrentTime = wcVideo.currentTime;
        activeDuration = dur;
      }
    } else {
      wcVideo.style.opacity = "0";
    }

    // ------------------------------------------------------------------------
    // 4. OVERLAYS & WATERMARKS SYNCHRONIZATION
    // ------------------------------------------------------------------------
    if (P < 0.33) {
      // Mojito active
      storyMojito?.classList.add("active");
      storyOF?.classList.remove("active");
      storyWC?.classList.remove("active");

      watermarkMojito?.classList.add("active");
      watermarkOF?.classList.remove("active");
      watermarkWC?.classList.remove("active");

      markerMojito?.classList.add("active");
      markerOF?.classList.remove("active");
      markerWC?.classList.remove("active");
    } else if (P < 0.66) {
      // Old Fashioned active
      storyMojito?.classList.remove("active");
      storyOF?.classList.add("active");
      storyWC?.classList.remove("active");

      watermarkMojito?.classList.remove("active");
      watermarkOF?.classList.add("active");
      watermarkWC?.classList.remove("active");

      markerMojito?.classList.remove("active");
      markerOF?.classList.add("active");
      markerWC?.classList.remove("active");
    } else {
      // Whiskey Cream active
      storyMojito?.classList.remove("active");
      storyOF?.classList.remove("active");
      storyWC?.classList.add("active");

      watermarkMojito?.classList.remove("active");
      watermarkOF?.classList.remove("active");
      watermarkWC?.classList.add("active");

      markerMojito?.classList.remove("active");
      markerOF?.classList.remove("active");
      markerWC?.classList.add("active");
    }

    // Timeline Progress Bar
    if (timelineFill) {
      timelineFill.style.width = `${(P * 100).toFixed(1)}%`;
    }

    // ------------------------------------------------------------------------
    // 5. DEVELOPER HUD TELEMETRY UPDATE
    // ------------------------------------------------------------------------
    if (debugMaster) debugMaster.textContent = `${(P * 100).toFixed(1)}%`;
    if (debugActive) debugActive.textContent = activeName;
    if (debugLocal) debugLocal.textContent = `${(activeLocalProgress * 100).toFixed(1)}%`;
    if (debugTimecode) debugTimecode.textContent = `${activeCurrentTime.toFixed(2)}s / ${activeDuration.toFixed(2)}s`;
    if (debugState) {
      debugState.textContent = Math.abs(diff) > 0.001 ? "SCRUBBING" : "LOCKED AT FRAME";
      debugState.style.color = Math.abs(diff) > 0.001 ? "#D8BA78" : "#48E587";
    }

    // Request next animation frame
    window.requestAnimationFrame(renderTimeline);
  }

  // Kick off RAF loop
  window.requestAnimationFrame(renderTimeline);
}

// --------------------------------------------------------------------------
// 8. CART DRAWER & SHOPIFY ARCHITECTURE
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
    badge.classList.remove("pulse");
    void badge.offsetWidth;
    badge.classList.add("pulse");
  }
};

function updateCartUI() {
  const container = document.getElementById("cart-items-list");
  const badge = document.querySelector(".cart-badge");
  const drawerSubtotal = document.getElementById("drawer-subtotal");

  const totalItems = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (badge) badge.textContent = totalItems;
  if (drawerSubtotal) drawerSubtotal.textContent = `$${totalPrice.toFixed(2)}`;

  if (!container) return;

  if (AppState.cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-message">
        <p>Your cocktail bar is empty.</p>
        <p style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--text-dim);">Explore our signature collection to begin.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = AppState.cart.map(item => `
    <div class="cart-item-row" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h5>${item.name}</h5>
        <div class="item-vol">${item.volume} • Craft Cocktail</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="modifyCartQty('${item.id}', -1)" aria-label="Decrease quantity">−</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" onclick="modifyCartQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
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
// 9. TOAST NOTIFICATION MICRO-INTERACTION
// --------------------------------------------------------------------------
let toastTimeout = null;
function showToast(message) {
  let toast = document.getElementById("luxury-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "luxury-toast";
    toast.className = "toast-notification";
    toast.innerHTML = `
      <span class="toast-icon">✦</span>
      <span class="toast-message" id="toast-text"></span>
    `;
    document.body.appendChild(toast);
  }

  const textEl = document.getElementById("toast-text");
  if (textEl) textEl.textContent = message;

  toast.classList.add("active");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("active");
  }, 2800);
}

// --------------------------------------------------------------------------
// 10. NEWSLETTER & PRIVATE RESERVE FORM
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

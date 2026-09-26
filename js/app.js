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
      id: "mojito",
      name: "Mojito",
      subtitle: "Fresh Spearmint • Caribbean Rum • Crisp Lime Zest",
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
      price: "$38.00",
      numericPrice: 38.00,
      productImage: "assets/posters/whiskey_cream_desktop.jpg",
      volume: "750 ML",
      shopifyVariantId: "gid://shopify/ProductVariant/89102343"
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

  // Video Elements
  const videoMojito = document.getElementById("video-mojito");
  const videoOF = document.getElementById("video-old-fashioned");
  const videoWC = document.getElementById("video-whiskey-cream");

  // Atmospheric Lighting Overlay
  const atmosphere = document.getElementById("cinematic-atmosphere");

  // Editorial Floating Cards
  const cardMojito = document.getElementById("card-mojito");
  const cardOF = document.getElementById("card-old-fashioned");
  const cardWC = document.getElementById("card-whiskey-cream");

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

  if (!sequenceSection || !viewport || !videoMojito || !videoOF || !videoWC) {
    console.warn("Cinematic elements missing from DOM.");
    return;
  }

  // 1. Ensure NO AUTOPLAY & initialize videos
  const allVideos = [videoMojito, videoOF, videoWC];
  allVideos.forEach(v => {
    v.muted = true;
    v.playsInline = true;
    v.pause();
    v.preload = "auto";
  });

  // Explicitly prime Mojito at frame 0 on load
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

  // 2. Mathematical Utilities
  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // Safe frame seeking avoiding decoder thrashing
  function scrubVideo(video, targetSeconds) {
    if (!video || !video.duration || isNaN(video.duration)) return;
    const clamped = Math.max(0, Math.min(video.duration - 0.02, targetSeconds));
    if (Math.abs(video.currentTime - clamped) > 0.015) {
      video.currentTime = clamped;
    }
  }

  // 3. Physics State: targetProgress & currentProgress with rAF smoothing
  let targetProgress = 0;
  let currentProgress = 0;
  let prevTargetProgress = 0;
  let scrollDirection = "IDLE";
  let isLoopActive = false;
  const SMOOTHING_FACTOR = 0.09; // Buttery smooth physical response

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
      prevTargetProgress = targetProgress;
      targetProgress = newTarget;

      if (!isLoopActive) {
        isLoopActive = true;
        requestAnimationFrame(renderLoop);
      }
    }
  }

  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize, { passive: true });

  // 4. Continuous Animation Loop (requestAnimationFrame)
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

  // 5. Master Multi-layered Cinematic Transformation
  function applyCinematicTransformation(p) {
    // -----------------------------------------------------------------------
    // A. VIDEO SCRUBBING TIMELINE
    // -----------------------------------------------------------------------
    // Mojito: 0% -> ~42% (duration: 3.98s)
    const mojitoT = clamp(p / 0.42, 0, 1) * 3.98;
    scrubVideo(videoMojito, mojitoT);

    // Old Fashioned: 25% -> 75% (duration: 3.98s)
    const ofT = clamp((p - 0.25) / 0.50, 0, 1) * 3.98;
    if (p >= 0.22 && p <= 0.80) {
      scrubVideo(videoOF, ofT);
    }

    // Whiskey Cream: 60% -> 98% (duration: 3.98s)
    const wcT = clamp((p - 0.60) / 0.38, 0, 1) * 3.98;
    if (p >= 0.56) {
      scrubVideo(videoWC, wcT);
    }

    // -----------------------------------------------------------------------
    // B. SCENE 1: MOJITO VISUAL TRANSFORMATION
    // -----------------------------------------------------------------------
    if (sceneMojito) {
      let mojitoOpacity = 1;
      let mojitoScale = 1.0;
      let mojitoBlur = 0;

      if (p < 0.25) {
        // Steady cinematic forward camera travel
        mojitoScale = 1.00 + (p / 0.25) * 0.05;
        mojitoOpacity = 1;
        mojitoBlur = 0;
      } else if (p <= 0.45) {
        // Transition 1: camera accelerates push-in, racks focus, and dissolves
        const t = (p - 0.25) / 0.20;
        const tSmooth = smoothstep(0, 1, t);
        mojitoScale = 1.05 + tSmooth * 0.12; // 1.05 -> 1.17
        mojitoOpacity = 1.0 - tSmooth;       // 1.0 -> 0.0
        mojitoBlur = tSmooth * 12;           // 0px -> 12px depth blur
      } else {
        mojitoOpacity = 0;
        mojitoScale = 1.17;
        mojitoBlur = 12;
      }

      sceneMojito.style.opacity = mojitoOpacity.toFixed(3);
      sceneMojito.style.transform = `scale(${mojitoScale.toFixed(4)})`;
      sceneMojito.style.filter = mojitoBlur > 0.3 ? `blur(${mojitoBlur.toFixed(1)}px)` : "none";
      sceneMojito.style.display = mojitoOpacity <= 0.001 ? "none" : "block";
    }

    // -----------------------------------------------------------------------
    // C. SCENE 2: OLD FASHIONED VISUAL TRANSFORMATION
    // -----------------------------------------------------------------------
    if (sceneOF) {
      let ofOpacity = 0;
      let ofScale = 0.92;
      let ofBlur = 12;

      if (p < 0.25) {
        // Waiting in depth
        ofOpacity = 0;
        ofScale = 0.92;
        ofBlur = 12;
      } else if (p < 0.45) {
        // Transition 1: emerging organically from depth into full focus
        const tIn = smoothstep(0.25, 0.45, p);
        ofOpacity = tIn;                        // 0.0 -> 1.0
        ofScale = lerp(0.92, 1.00, tIn);        // 0.92 -> 1.00
        ofBlur = (1.0 - tIn) * 12;              // 12px -> 0px
      } else if (p <= 0.60) {
        // Dominant Phase: continuous subtle camera momentum
        ofOpacity = 1;
        ofScale = 1.00 + ((p - 0.45) / 0.15) * 0.04; // 1.00 -> 1.04
        ofBlur = 0;
      } else if (p <= 0.78) {
        // Transition 2: camera pushes deeper and racks focus as Whiskey Cream emerges
        const tOut = smoothstep(0.60, 0.78, p);
        ofOpacity = 1.0 - tOut;                 // 1.0 -> 0.0
        ofScale = 1.04 + tOut * 0.12;           // 1.04 -> 1.16
        ofBlur = tOut * 12;                     // 0px -> 12px
      } else {
        ofOpacity = 0;
        ofScale = 1.16;
        ofBlur = 12;
      }

      sceneOF.style.opacity = ofOpacity.toFixed(3);
      sceneOF.style.transform = `scale(${ofScale.toFixed(4)})`;
      sceneOF.style.filter = ofBlur > 0.3 ? `blur(${ofBlur.toFixed(1)}px)` : "none";
      sceneOF.style.display = ofOpacity <= 0.001 ? "none" : "block";
    }

    // -----------------------------------------------------------------------
    // D. SCENE 3: WHISKEY CREAM VISUAL TRANSFORMATION
    // -----------------------------------------------------------------------
    if (sceneWC) {
      let wcOpacity = 0;
      let wcScale = 0.92;
      let wcBlur = 12;

      if (p < 0.60) {
        // Waiting in depth
        wcOpacity = 0;
        wcScale = 0.92;
        wcBlur = 12;
      } else if (p < 0.78) {
        // Transition 2: emerging organically from depth into full focus
        const tIn = smoothstep(0.60, 0.78, p);
        wcOpacity = tIn;                        // 0.0 -> 1.0
        wcScale = lerp(0.92, 1.00, tIn);        // 0.92 -> 1.00
        wcBlur = (1.0 - tIn) * 12;              // 12px -> 0px
      } else {
        // Final Dominant Phase: majestic presence
        wcOpacity = 1;
        wcScale = 1.00 + ((p - 0.78) / 0.22) * 0.04; // 1.00 -> 1.04
        wcBlur = 0;
      }

      sceneWC.style.opacity = wcOpacity.toFixed(3);
      sceneWC.style.transform = `scale(${wcScale.toFixed(4)})`;
      sceneWC.style.filter = wcBlur > 0.3 ? `blur(${wcBlur.toFixed(1)}px)` : "none";
      sceneWC.style.display = wcOpacity <= 0.001 ? "none" : "block";
    }

    // -----------------------------------------------------------------------
    // E. ATMOSPHERIC ENVIRONMENTAL LIGHTING TRANSITIONS
    // -----------------------------------------------------------------------
    if (atmosphere) {
      if (p >= 0.25 && p <= 0.45) {
        // Transition 1: Amber bourbon lens flare blooming
        const flare = Math.sin(((p - 0.25) / 0.20) * Math.PI);
        atmosphere.style.background = "radial-gradient(ellipse at 58% 45%, rgba(229, 164, 84, 0.38) 0%, rgba(229, 164, 84, 0.1) 45%, transparent 75%)";
        atmosphere.style.opacity = (flare * 0.45).toFixed(3);
      } else if (p >= 0.60 && p <= 0.78) {
        // Transition 2: Velvet cream & amber atmospheric illumination
        const flare = Math.sin(((p - 0.60) / 0.18) * Math.PI);
        atmosphere.style.background = "radial-gradient(ellipse at 48% 52%, rgba(245, 230, 204, 0.48) 0%, rgba(232, 43, 125, 0.16) 45%, transparent 75%)";
        atmosphere.style.opacity = (flare * 0.45).toFixed(3);
      } else {
        atmosphere.style.opacity = "0";
      }
    }

    // -----------------------------------------------------------------------
    // F. EDITORIAL NARRATIVE CARDS (Participating in the Cinematic Space)
    // -----------------------------------------------------------------------
    // Card 1: Mojito
    if (cardMojito) {
      let cardOp = 1;
      let cardY = 0;
      let cardBl = 0;

      if (p < 0.22) {
        cardOp = 1;
        cardY = 0;
        cardBl = 0;
      } else if (p <= 0.38) {
        const t = smoothstep(0.22, 0.38, p);
        cardOp = 1.0 - t;
        cardY = -t * 30;
        cardBl = t * 6;
      } else {
        cardOp = 0;
        cardY = -30;
        cardBl = 6;
      }

      cardMojito.style.opacity = cardOp.toFixed(3);
      cardMojito.style.transform = `translate3d(0, ${cardY.toFixed(1)}px, 0)`;
      cardMojito.style.filter = cardBl > 0.3 ? `blur(${cardBl.toFixed(1)}px)` : "none";
      cardMojito.style.display = cardOp <= 0.001 ? "none" : "block";
    }

    // Card 2: Old Fashioned
    if (cardOF) {
      let cardOp = 0;
      let cardY = 30;
      let cardBl = 6;

      if (p < 0.28) {
        cardOp = 0;
        cardY = 30;
        cardBl = 6;
      } else if (p <= 0.44) {
        const t = smoothstep(0.28, 0.44, p);
        cardOp = t;
        cardY = (1.0 - t) * 30;
        cardBl = (1.0 - t) * 6;
      } else if (p <= 0.58) {
        cardOp = 1;
        cardY = 0;
        cardBl = 0;
      } else if (p <= 0.72) {
        const t = smoothstep(0.58, 0.72, p);
        cardOp = 1.0 - t;
        cardY = -t * 30;
        cardBl = t * 6;
      } else {
        cardOp = 0;
        cardY = -30;
        cardBl = 6;
      }

      cardOF.style.opacity = cardOp.toFixed(3);
      cardOF.style.transform = `translate3d(0, ${cardY.toFixed(1)}px, 0)`;
      cardOF.style.filter = cardBl > 0.3 ? `blur(${cardBl.toFixed(1)}px)` : "none";
      cardOF.style.display = cardOp <= 0.001 ? "none" : "block";
    }

    // Card 3: Whiskey Cream
    if (cardWC) {
      let cardOp = 0;
      let cardY = 30;
      let cardBl = 6;

      if (p < 0.64) {
        cardOp = 0;
        cardY = 30;
        cardBl = 6;
      } else if (p <= 0.78) {
        const t = smoothstep(0.64, 0.78, p);
        cardOp = t;
        cardY = (1.0 - t) * 30;
        cardBl = (1.0 - t) * 6;
      } else {
        cardOp = 1;
        cardY = 0;
        cardBl = 0;
      }

      cardWC.style.opacity = cardOp.toFixed(3);
      cardWC.style.transform = `translate3d(0, ${cardY.toFixed(1)}px, 0)`;
      cardWC.style.filter = cardBl > 0.3 ? `blur(${cardBl.toFixed(1)}px)` : "none";
      cardWC.style.display = cardOp <= 0.001 ? "none" : "block";
    }

    // -----------------------------------------------------------------------
    // G. SCRUBBER PROGRESS TRACKER & ACTIVE MARKERS
    // -----------------------------------------------------------------------
    if (fillBar) {
      fillBar.style.width = `${(p * 100).toFixed(2)}%`;
    }

    let activeCocktail = "MOJITO";
    let activeTime = videoMojito.currentTime;

    if (p < 0.38) {
      activeCocktail = "MOJITO";
      activeTime = videoMojito.currentTime;
      markerMojito?.classList.add("active");
      markerOF?.classList.remove("active");
      markerWC?.classList.remove("active");
    } else if (p < 0.70) {
      activeCocktail = "OLD FASHIONED";
      activeTime = videoOF.currentTime;
      markerMojito?.classList.remove("active");
      markerOF?.classList.add("active");
      markerWC?.classList.remove("active");
    } else {
      activeCocktail = "WHISKEY CREAM";
      activeTime = videoWC.currentTime;
      markerMojito?.classList.remove("active");
      markerOF?.classList.remove("active");
      markerWC?.classList.add("active");
    }

    // -----------------------------------------------------------------------
    // H. LIVE TELEMETRY HUD
    // -----------------------------------------------------------------------
    if (debugMaster) debugMaster.textContent = `${(p * 100).toFixed(1)}%`;
    if (debugDirection) {
      debugDirection.textContent = scrollDirection;
      debugDirection.style.color = scrollDirection.includes("DOWN") ? "#E82B7D" : "#4A4D57";
    }
    if (debugActive) debugActive.textContent = activeCocktail;
    if (debugTimecode) debugTimecode.textContent = `${activeTime.toFixed(2)}s / 4.00s`;
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
// 7. TOAST NOTIFICATION MICRO-INTERACTION
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

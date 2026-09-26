/**
 * LUCKY SHAKER BARTENDER — GSAP 3.12 & SCROLLTRIGGER MASTER VIDEO ENGINE
 * 
 * Architecture:
 * - GSAP ScrollTrigger Pinned Timeline (450% scroll runway)
 * - True Frame-by-Frame Scrubbing via GSAP Proxy Objects
 * - Seamless Dual-Video Scrubbing in Transition Windows (28%-38% & 61%-71%)
 * - Reverse Scrubbing & Absolute Frame Locking on Scroll Stop
 * - Staggered Text Reveals & Atmospheric Depth Glow
 * - Real-Time Developer Telemetry HUD
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
// 2. APPLICATION STATE
// --------------------------------------------------------------------------
const AppState = {
  cart: [],
  heroFlavor: "whiskey-cream"
};

// --------------------------------------------------------------------------
// 3. INITIALIZATION ON DOM READY
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP Plugin
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  } else {
    console.error("GSAP or ScrollTrigger not loaded.");
  }

  initNavbarScroll();
  initHeroVideoControls();
  initGsapMasterCinematicEngine();
  initCartDrawer();
  initNewsletterForm();
});

// --------------------------------------------------------------------------
// 4. NAVBAR SCROLL EFFECT
// --------------------------------------------------------------------------
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  ScrollTrigger.create({
    start: "top -40",
    end: 99999,
    toggleClass: { className: "scrolled", targets: navbar }
  });
}

// --------------------------------------------------------------------------
// 5. HERO VIDEO CONTROLS
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

      gsap.to(heroVideo, {
        opacity: 0.2,
        duration: 0.15,
        onComplete: () => {
          heroVideo.poster = info.poster;
          heroVideo.src = targetSrc;
          heroVideo.load();
          heroVideo.play().catch(() => {});
          gsap.to(heroVideo, { opacity: 1, duration: 0.25 });
        }
      });
    });
  });
}

// --------------------------------------------------------------------------
// 6. GSAP SCROLLTRIGGER MASTER CINEMATIC ENGINE
// --------------------------------------------------------------------------
function initGsapMasterCinematicEngine() {
  const filmSection = document.getElementById("cinematic-film");
  if (!filmSection) return;

  const mojitoVideo = document.getElementById("video-mojito");
  const ofVideo = document.getElementById("video-old-fashioned");
  const wcVideo = document.getElementById("video-whiskey-cream");

  if (!mojitoVideo || !ofVideo || !wcVideo) return;

  // 1. Strict No-Autoplay Setup & Initial Properties
  [mojitoVideo, ofVideo, wcVideo].forEach(v => {
    v.muted = true;
    v.pause();
    v.currentTime = 0;
    v.load();
  });

  // Initial Visibility States
  gsap.set(mojitoVideo, { opacity: 1, scale: 1.0, filter: "brightness(0.88) contrast(1.08)" });
  gsap.set(ofVideo, { opacity: 0, scale: 1.04, filter: "brightness(0.7) blur(6px) contrast(1.08)" });
  gsap.set(wcVideo, { opacity: 0, scale: 1.04, filter: "brightness(0.7) blur(6px) contrast(1.08)" });

  // DOM Elements
  const watermarkMojito = document.getElementById("watermark-mojito");
  const watermarkOF = document.getElementById("watermark-oldfashioned");
  const watermarkWC = document.getElementById("watermark-whiskeycream");

  const storyMojito = document.getElementById("story-overlay-mojito");
  const storyOF = document.getElementById("story-overlay-old-fashioned");
  const storyWC = document.getElementById("story-overlay-whiskey-cream");

  const markerMojito = document.getElementById("marker-mojito");
  const markerOF = document.getElementById("marker-oldfashioned");
  const markerWC = document.getElementById("marker-whiskeycream");

  // Initial Content Placement
  gsap.set(storyMojito, { opacity: 1, y: 0 });
  gsap.set(storyOF, { opacity: 0, y: 25 });
  gsap.set(storyWC, { opacity: 0, y: 25 });

  gsap.set(watermarkMojito, { opacity: 1, scale: 1.0 });
  gsap.set(watermarkOF, { opacity: 0, scale: 0.96 });
  gsap.set(watermarkWC, { opacity: 0, scale: 0.96 });

  // HUD Elements
  const debugMaster = document.getElementById("debug-master-progress");
  const debugDirection = document.getElementById("debug-direction");
  const debugActive = document.getElementById("debug-active-cocktail");
  const debugTimecode = document.getElementById("debug-timecode");
  const debugState = document.getElementById("debug-state");
  const toggleHudBtn = document.getElementById("toggle-debug-hud");
  const hudContainer = document.getElementById("cinematic-debug-hud");

  if (toggleHudBtn && hudContainer) {
    toggleHudBtn.addEventListener("click", () => {
      hudContainer.style.display = "none";
    });
  }

  // Safe Frame Seeker Helper
  function seekFrame(video, targetSeconds) {
    if (!video || isNaN(video.duration) || video.duration === 0) return;
    const clamped = Math.max(0, Math.min(video.duration - 0.02, targetSeconds));
    if (Math.abs(video.currentTime - clamped) > 0.02) {
      video.currentTime = clamped;
    }
  }

  // Proxy scrub targets (Duration = 4.0s for all 3 clips)
  const mojitoProxy = { time: 0 };
  const ofProxy = { time: 0 };
  const wcProxy = { time: 0 };

  // ------------------------------------------------------------------------
  // 2. MASTER GSAP SCROLLTRIGGER TIMELINE (100 Units of Cinematic Time)
  // ------------------------------------------------------------------------
  const masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#cinematic-film",
      start: "top top",
      end: "+=450%", // 450vh of natural scroll distance
      pin: true,
      scrub: 0.8, // 0.8s buttery smooth lag smoothing
      anticipatePin: 1,
      onUpdate: (self) => {
        const P = self.progress;

        // Telemetry Update in HUD
        if (debugMaster) debugMaster.textContent = `${(P * 100).toFixed(1)}%`;
        if (debugDirection) {
          debugDirection.textContent = self.direction > 0 ? "SCROLLING DOWN (▼)" : "SCROLLING UP (▲)";
          debugDirection.style.color = self.direction > 0 ? "#48E587" : "#F0A500";
        }

        // Active cocktail name & markers
        if (P < 0.33) {
          if (debugActive) debugActive.textContent = "MOJITO";
          if (debugTimecode) debugTimecode.textContent = `${mojitoVideo.currentTime.toFixed(2)}s / 4.00s`;
          markerMojito?.classList.add("active");
          markerOF?.classList.remove("active");
          markerWC?.classList.remove("active");
        } else if (P < 0.66) {
          if (debugActive) debugActive.textContent = "OLD FASHIONED";
          if (debugTimecode) debugTimecode.textContent = `${ofVideo.currentTime.toFixed(2)}s / 4.00s`;
          markerMojito?.classList.remove("active");
          markerOF?.classList.add("active");
          markerWC?.classList.remove("active");
        } else {
          if (debugActive) debugActive.textContent = "WHISKEY CREAM";
          if (debugTimecode) debugTimecode.textContent = `${wcVideo.currentTime.toFixed(2)}s / 4.00s`;
          markerMojito?.classList.remove("active");
          markerOF?.classList.remove("active");
          markerWC?.classList.add("active");
        }
      }
    }
  });

  // ------------------------------------------------------------------------
  // 3. SEGMENT 1: MOJITO DOMINANCE [0s -> 28s]
  // ------------------------------------------------------------------------
  // Mojito scrubs from 0.00s to 2.95s
  masterTl.to(mojitoProxy, {
    time: 2.95,
    ease: "none",
    duration: 28,
    onUpdate: () => seekFrame(mojitoVideo, mojitoProxy.time)
  }, 0);

  // ------------------------------------------------------------------------
  // 4. TRANSITION ZONE 1: MOJITO -> OLD FASHIONED [28s -> 38s]
  // (Both clips scrub simultaneously: Mojito ends, Old Fashioned begins)
  // ------------------------------------------------------------------------
  // Mojito scrubs final frames (2.95s -> 4.00s) while fading out & scaling
  masterTl.to(mojitoProxy, {
    time: 4.00,
    ease: "none",
    duration: 10,
    onUpdate: () => seekFrame(mojitoVideo, mojitoProxy.time)
  }, 28);

  masterTl.to(mojitoVideo, {
    opacity: 0,
    scale: 1.05,
    filter: "brightness(0.7) blur(6px) contrast(1.08)",
    ease: "none",
    duration: 10
  }, 28);

  // Old Fashioned simultaneously scrubs first frames (0.00s -> 0.93s) while fading in
  masterTl.to(ofProxy, {
    time: 0.93,
    ease: "none",
    duration: 10,
    onUpdate: () => seekFrame(ofVideo, ofProxy.time)
  }, 28);

  masterTl.fromTo(ofVideo, {
    opacity: 0,
    scale: 1.05,
    filter: "brightness(0.7) blur(6px) contrast(1.08)"
  }, {
    opacity: 1,
    scale: 1.0,
    filter: "brightness(0.88) blur(0px) contrast(1.08)",
    ease: "none",
    duration: 10
  }, 28);

  // Content Crossfade: Mojito -> Old Fashioned
  masterTl.to(storyMojito, { opacity: 0, y: -25, duration: 6, ease: "power1.in" }, 28);
  masterTl.fromTo(storyOF, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 6, ease: "power1.out" }, 32);

  // Watermark Crossfade
  masterTl.to(watermarkMojito, { opacity: 0, scale: 1.04, duration: 6, ease: "none" }, 28);
  masterTl.fromTo(watermarkOF, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1.0, duration: 6, ease: "none" }, 32);

  // ------------------------------------------------------------------------
  // 5. SEGMENT 2: OLD FASHIONED DOMINANCE [38s -> 61s]
  // ------------------------------------------------------------------------
  // Old Fashioned scrubs from 0.93s to 3.07s
  masterTl.to(ofProxy, {
    time: 3.07,
    ease: "none",
    duration: 23,
    onUpdate: () => seekFrame(ofVideo, ofProxy.time)
  }, 38);

  // ------------------------------------------------------------------------
  // 6. TRANSITION ZONE 2: OLD FASHIONED -> WHISKEY CREAM [61s -> 71s]
  // (Both clips scrub simultaneously: Old Fashioned ends, Whiskey Cream begins)
  // ------------------------------------------------------------------------
  // Old Fashioned scrubs final frames (3.07s -> 4.00s) while fading out
  masterTl.to(ofProxy, {
    time: 4.00,
    ease: "none",
    duration: 10,
    onUpdate: () => seekFrame(ofVideo, ofProxy.time)
  }, 61);

  masterTl.to(ofVideo, {
    opacity: 0,
    scale: 1.05,
    filter: "brightness(0.7) blur(6px) contrast(1.08)",
    ease: "none",
    duration: 10
  }, 61);

  // Whiskey Cream simultaneously scrubs first frames (0.00s -> 1.02s) while fading in
  masterTl.to(wcProxy, {
    time: 1.02,
    ease: "none",
    duration: 10,
    onUpdate: () => seekFrame(wcVideo, wcProxy.time)
  }, 61);

  masterTl.fromTo(wcVideo, {
    opacity: 0,
    scale: 1.05,
    filter: "brightness(0.7) blur(6px) contrast(1.08)"
  }, {
    opacity: 1,
    scale: 1.0,
    filter: "brightness(0.88) blur(0px) contrast(1.08)",
    ease: "none",
    duration: 10
  }, 61);

  // Content Crossfade: Old Fashioned -> Whiskey Cream
  masterTl.to(storyOF, { opacity: 0, y: -25, duration: 6, ease: "power1.in" }, 61);
  masterTl.fromTo(storyWC, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 6, ease: "power1.out" }, 65);

  // Watermark Crossfade
  masterTl.to(watermarkOF, { opacity: 0, scale: 1.04, duration: 6, ease: "none" }, 61);
  masterTl.fromTo(watermarkWC, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1.0, duration: 6, ease: "none" }, 65);

  // ------------------------------------------------------------------------
  // 7. SEGMENT 3: WHISKEY CREAM DOMINANCE [71s -> 100s]
  // ------------------------------------------------------------------------
  // Whiskey Cream scrubs from 1.02s to 4.00s
  masterTl.to(wcProxy, {
    time: 4.00,
    ease: "none",
    duration: 29,
    onUpdate: () => seekFrame(wcVideo, wcProxy.time)
  }, 71);

  // Bottom Timeline Scrubber Track fill (0% -> 100%)
  masterTl.fromTo("#timeline-fill-bar", { width: "0%" }, { width: "100%", duration: 100, ease: "none" }, 0);
}

// --------------------------------------------------------------------------
// 7. CART DRAWER & SHOPIFY ARCHITECTURE
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
// 8. TOAST NOTIFICATION MICRO-INTERACTION
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
// 9. NEWSLETTER & PRIVATE RESERVE FORM
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

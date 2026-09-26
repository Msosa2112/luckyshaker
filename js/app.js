/**
 * LUCKY SHAKER BARTENDER — CONTINUOUS SCROLLING CINEMATIC SEQUENCE
 * 
 * Behavior:
 * - Starts at SCROLL 0 with MOJITO filling the entire screen.
 * - On the VERY FIRST scroll, the cinematic scene transition begins immediately.
 * - MOJITO moves upward (translateY 0% -> -100%) while OLD FASHIONED enters from below (translateY 100% -> 0%).
 * - At 45%, OLD FASHIONED fully fills the viewport.
 * - From 45% -> 90%, OLD FASHIONED moves upward while WHISKEY CREAM enters from below.
 * - At 90% -> 100%, WHISKEY CREAM settles into position.
 * - Video Playheads are scrubbed simultaneously during their overlap windows:
 *     MOJITO:        0% -> 45%  (currentTime: 0 -> 4s)
 *     OLD FASHIONED: 25% -> 70% (currentTime: 0 -> 4s)
 *     WHISKEY CREAM: 55% -> 100% (currentTime: 0 -> 4s)
 * - Scrolling back up reverses the entire sequence frame by frame.
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
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  initNavbarScroll();
  initContinuousCinematicSequence();
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
// 5. MASTER CONTINUOUS SCROLL CINEMATIC ENGINE
// --------------------------------------------------------------------------
function initContinuousCinematicSequence() {
  const sequenceSection = document.getElementById("cinematic-sequence");
  const viewport = document.getElementById("cinematic-viewport");

  const panelMojito = document.getElementById("panel-mojito");
  const panelOF = document.getElementById("panel-old-fashioned");
  const panelWC = document.getElementById("panel-whiskey-cream");

  const videoMojito = document.getElementById("video-mojito");
  const videoOF = document.getElementById("video-old-fashioned");
  const videoWC = document.getElementById("video-whiskey-cream");

  if (!sequenceSection || !viewport || !videoMojito || !videoOF || !videoWC) return;

  // 1. Ensure NO AUTOPLAY & initial video state
  [videoMojito, videoOF, videoWC].forEach(v => {
    v.muted = true;
    v.pause();
    v.currentTime = 0;
    v.load();
  });

  // Initial Panel States
  // Mojito: 100% visible at scroll 0
  gsap.set(panelMojito, { yPercent: 0, scale: 1.0, opacity: 1, filter: "blur(0px)", zIndex: 10 });
  // Old Fashioned: waiting below at 100%
  gsap.set(panelOF, { yPercent: 100, scale: 0.94, opacity: 0, filter: "blur(5px)", zIndex: 20 });
  // Whiskey Cream: waiting below at 100%
  gsap.set(panelWC, { yPercent: 100, scale: 0.94, opacity: 0, filter: "blur(5px)", zIndex: 30 });

  // HUD Elements
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

  // Scrubber Markers
  const markerMojito = document.getElementById("marker-mojito");
  const markerOF = document.getElementById("marker-oldfashioned");
  const markerWC = document.getElementById("marker-whiskeycream");

  // Helper for safe video seeking
  function seekFrame(video, targetSeconds) {
    if (!video || isNaN(video.duration) || video.duration === 0) return;
    const clamped = Math.max(0, Math.min(video.duration - 0.02, targetSeconds));
    if (Math.abs(video.currentTime - clamped) > 0.02) {
      video.currentTime = clamped;
    }
  }

  // Video proxy scrub objects (Duration: 4.00s for each clip)
  const mojitoProxy = { time: 0 };
  const ofProxy = { time: 0 };
  const wcProxy = { time: 0 };

  // ------------------------------------------------------------------------
  // 2. MASTER GSAP SCROLLTRIGGER TIMELINE (100 Units of Progress)
  // ------------------------------------------------------------------------
  const sequenceTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#cinematic-sequence",
      start: "top top",
      end: "+=350%", // 350vh scroll distance
      pin: viewport,
      scrub: 0.6, // Fast, responsive, smooth scrub
      anticipatePin: 1,
      onUpdate: (self) => {
        const P = self.progress;

        // Telemetry Update in HUD
        if (debugMaster) debugMaster.textContent = `${(P * 100).toFixed(1)}%`;
        if (debugDirection) {
          debugDirection.textContent = self.direction > 0 ? "SCROLLING DOWN (▼)" : "SCROLLING UP (▲)";
          debugDirection.style.color = self.direction > 0 ? "#48E587" : "#F0A500";
        }

        // Active Scene Tracking & Markers
        if (P < 0.45) {
          if (debugActive) debugActive.textContent = "MOJITO";
          if (debugTimecode) debugTimecode.textContent = `${videoMojito.currentTime.toFixed(2)}s / 4.00s`;
          markerMojito?.classList.add("active");
          markerOF?.classList.remove("active");
          markerWC?.classList.remove("active");
        } else if (P < 0.90) {
          if (debugActive) debugActive.textContent = "OLD FASHIONED";
          if (debugTimecode) debugTimecode.textContent = `${videoOF.currentTime.toFixed(2)}s / 4.00s`;
          markerMojito?.classList.remove("active");
          markerOF?.classList.add("active");
          markerWC?.classList.remove("active");
        } else {
          if (debugActive) debugActive.textContent = "WHISKEY CREAM";
          if (debugTimecode) debugTimecode.textContent = `${videoWC.currentTime.toFixed(2)}s / 4.00s`;
          markerMojito?.classList.remove("active");
          markerOF?.classList.remove("active");
          markerWC?.classList.add("active");
        }
      }
    }
  });

  // ------------------------------------------------------------------------
  // 3. SCENE TRANSITION 1: MOJITO -> OLD FASHIONED [0% -> 45%]
  // Starts on the VERY FIRST SCROLL!
  // ------------------------------------------------------------------------
  // Mojito moves upward and fades out
  sequenceTl.to(panelMojito, {
    yPercent: -100,
    scale: 0.92,
    opacity: 0.1,
    filter: "blur(6px)",
    ease: "none",
    duration: 45
  }, 0);

  // Old Fashioned enters from below into full view
  sequenceTl.fromTo(panelOF, {
    yPercent: 100,
    scale: 0.94,
    opacity: 0,
    filter: "blur(5px)"
  }, {
    yPercent: 0,
    scale: 1.0,
    opacity: 1,
    filter: "blur(0px)",
    ease: "none",
    duration: 45
  }, 0);

  // ------------------------------------------------------------------------
  // 4. SCENE TRANSITION 2: OLD FASHIONED -> WHISKEY CREAM [45% -> 90%]
  // ------------------------------------------------------------------------
  // Old Fashioned moves upward and fades out
  sequenceTl.to(panelOF, {
    yPercent: -100,
    scale: 0.92,
    opacity: 0.1,
    filter: "blur(6px)",
    ease: "none",
    duration: 45
  }, 45);

  // Whiskey Cream enters from below into full view
  sequenceTl.fromTo(panelWC, {
    yPercent: 100,
    scale: 0.94,
    opacity: 0,
    filter: "blur(5px)"
  }, {
    yPercent: 0,
    scale: 1.0,
    opacity: 1,
    filter: "blur(0px)",
    ease: "none",
    duration: 45
  }, 45);

  // ------------------------------------------------------------------------
  // 5. OVERLAPPING VIDEO SCRUB PLAYHEADS
  // ------------------------------------------------------------------------
  // Mojito Video: 0% -> 45% (currentTime: 0s -> 3.98s)
  sequenceTl.to(mojitoProxy, {
    time: 3.98,
    ease: "none",
    duration: 45,
    onUpdate: () => seekFrame(videoMojito, mojitoProxy.time)
  }, 0);

  // Old Fashioned Video: 25% -> 70% (currentTime: 0s -> 3.98s)
  // Starts scrub-playing at 25% while entering from below!
  sequenceTl.fromTo(ofProxy, { time: 0 }, {
    time: 3.98,
    ease: "none",
    duration: 45,
    onUpdate: () => seekFrame(videoOF, ofProxy.time)
  }, 25);

  // Whiskey Cream Video: 55% -> 100% (currentTime: 0s -> 3.98s)
  // Starts scrub-playing at 55% while entering from below!
  sequenceTl.fromTo(wcProxy, { time: 0 }, {
    time: 3.98,
    ease: "none",
    duration: 45,
    onUpdate: () => seekFrame(videoWC, wcProxy.time)
  }, 55);

  // ------------------------------------------------------------------------
  // 6. BOTTOM TIMELINE FILL PROGRESS (0% -> 100%)
  // ------------------------------------------------------------------------
  sequenceTl.fromTo("#timeline-fill-bar", { width: "0%" }, { width: "100%", duration: 100, ease: "none" }, 0);
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

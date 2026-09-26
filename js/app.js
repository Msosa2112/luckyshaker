/**
 * LUCKY SHAKER BARTENDER — LUXURY BEVERAGE WEB EXPERIENCE
 * Architecture: Data-driven, Shopify-ready, Performance-first
 */

// --------------------------------------------------------------------------
// 1. DATA-DRIVEN ARCHITECTURE (Shopify Ready Model)
// --------------------------------------------------------------------------
const LUCKY_SHAKER_DATA = {
  brand: {
    name: "Lucky Shaker",
    subtitle: "Bartender",
    tagline: "Crafted Cocktails. Ready to Pour.",
    statement: "An elevated cocktail experience crafted by master mixologists. Real spirits. Pure botanicals. Zero compromise."
  },
  flavors: [
    {
      id: "mojito",
      name: "Mojito",
      subtitle: "Fresh Spearmint • Caribbean Rum • Crisp Lime Zest",
      tag: "Crisp & Botanical",
      description: "An effervescent masterpiece balancing triple-filtered Caribbean rum, hand-bruised garden spearmint, cold-pressed Persian limes, and pure cane sweetness. Finished with fine effervescence for an unmistakably invigorating pour.",
      tastingNotes: "Spearmint Leaf, Caribbean Rum, Crisp Lime Zest, Demerara Sugar",
      specs: {
        abv: "12% ABV",
        volume: "750 ML",
        serve: "Chilled over crushed ice with mint"
      },
      price: "$36.00",
      numericPrice: 36.00,
      videoDesktop: "videos para web/Mojito/Cinematic_mojito_desktop.mp4",
      videoMobile: "videos para web/Mojito/Mojito_product_video mobile.mp4",
      posterDesktop: "assets/posters/mojito_desktop.jpg",
      posterMobile: "assets/posters/mojito_mobile.jpg",
      productImage: "assets/posters/mojito_desktop.jpg",
      shopifyVariantId: "gid://shopify/ProductVariant/89102341",
      notes: ["Fresh Mint", "Tahitian Lime", "White Rum"]
    },
    {
      id: "old-fashioned",
      name: "Old Fashioned",
      subtitle: "Aged Kentucky Bourbon • Aromatic Bitters • Demerara • Orange Oils",
      tag: "Bold & Timeless",
      description: "The undisputed sovereign of classic cocktails. Bold Kentucky straight bourbon gently stirred with artisanal aromatic bitters, rich caramelized demerara sugar, and cold-expressed orange oils. Deep, smoky, and timeless.",
      tastingNotes: "Kentucky Bourbon, Angostura Bark, Blood Orange Peel, Toasted Sugar",
      specs: {
        abv: "24% ABV",
        volume: "750 ML",
        serve: "Over large clear ice sphere with orange twist"
      },
      price: "$42.00",
      numericPrice: 42.00,
      videoDesktop: "videos para web/Old Fashioned/Cinematic_Old_Fashioned desktop.mp4",
      videoMobile: "videos para web/Old Fashioned/Old_Fashioned_cocktail_mobile.mp4",
      posterDesktop: "assets/posters/old_fashioned_desktop.jpg",
      posterMobile: "assets/posters/old_fashioned_mobile.jpg",
      productImage: "assets/posters/old_fashioned_desktop.jpg",
      shopifyVariantId: "gid://shopify/ProductVariant/89102342",
      notes: ["Kentucky Bourbon", "Citrus Oils", "Aromatic Bitters"]
    },
    {
      id: "whiskey-cream",
      name: "Whiskey Cream",
      subtitle: "Small-Batch Whiskey • Velvet Fresh Cream • Madagascar Vanilla",
      tag: "Velvety & Decadent",
      description: "Created by Katherin. A sumptuous indulgence marrying triple-distilled whiskeys with rich dairy cream, toasted cocoa, and bourbon vanilla bean. Velvety, warm, and supremely decadent with a satin mouthfeel.",
      tastingNotes: "Irish Whiskey, Single-Origin Cocoa, Double Cream, Madagascar Vanilla",
      specs: {
        abv: "17% ABV",
        volume: "750 ML",
        serve: "Neat, on the rocks, or floated in craft espresso"
      },
      price: "$38.00",
      numericPrice: 38.00,
      videoDesktop: "videos para web/Whiskey Cream/Whiskey_cream_desktop.mp4",
      videoMobile: "videos para web/Whiskey Cream/Whiskey_cream_mobile.mp4",
      posterDesktop: "assets/posters/whiskey_cream_desktop.jpg",
      posterMobile: "assets/posters/whiskey_cream_mobile.jpg",
      productImage: "renders/lucky_shaker_hero_9_16.png",
      shopifyVariantId: "gid://shopify/ProductVariant/89102343",
      notes: ["Artisan Whiskey", "Rich Cream", "Vanilla Bean"]
    }
  ]
};

// --------------------------------------------------------------------------
// 2. STATE MANAGEMENT & CART
// --------------------------------------------------------------------------
const AppState = {
  cart: [],
  isScrubbingEnabled: true,
  currentHeroFlavor: "whiskey-cream",
  isMobile: window.innerWidth <= 768
};

// --------------------------------------------------------------------------
// 3. INITIALIZATION
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initNavbarScroll();
  initHeroVideoControls();
  initFlavorSections();
  initScrollDrivenVideoArchitecture();
  initCartDrawer();
  initNewsletterForm();
  initWindowResizeHandler();
});

// --------------------------------------------------------------------------
// 4. NAVBAR SCROLL EFFECT
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
// 5. HERO VIDEO SELECTION & PERFORMANCE
// --------------------------------------------------------------------------
function initHeroVideoControls() {
  const heroVideo = document.getElementById("hero-video");
  const tabButtons = document.querySelectorAll(".flavor-tab-btn");
  if (!heroVideo) return;

  // Ensure autoplay starts smoothly
  const playPromise = heroVideo.play();
  if (playPromise !== undefined) {
    playPromise.catch(err => {
      // Autoplay fallback: muted video is guaranteed, but handle gracefully
      console.log("Hero autoplay initialized muted:", err);
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const flavorId = btn.dataset.flavor;
      if (!flavorId || flavorId === AppState.currentHeroFlavor) return;

      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const flavor = LUCKY_SHAKER_DATA.flavors.find(f => f.id === flavorId);
      if (!flavor) return;

      AppState.currentHeroFlavor = flavorId;
      const isMobile = window.innerWidth <= 768;
      const targetSrc = isMobile ? flavor.videoMobile : flavor.videoDesktop;
      const targetPoster = isMobile ? flavor.posterMobile : flavor.posterDesktop;

      // Smooth switch
      heroVideo.style.opacity = "0.2";
      setTimeout(() => {
        heroVideo.poster = targetPoster;
        heroVideo.src = targetSrc;
        heroVideo.load();
        heroVideo.play().catch(() => {});
        heroVideo.style.opacity = "1";
      }, 200);
    });
  });
}

// --------------------------------------------------------------------------
// 6. SCROLL-DRIVEN VIDEO ARCHITECTURE
// --------------------------------------------------------------------------
function initScrollDrivenVideoArchitecture() {
  // Respect prefers-reduced-motion
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mediaQuery.matches) {
    console.log("Reduced motion preference detected. Scroll-driven scrub deactivated.");
    return;
  }

  const flavorBlocks = document.querySelectorAll(".flavor-block");
  if (!flavorBlocks.length) return;

  // IntersectionObserver to only process videos in or near viewport
  const observerOptions = {
    root: null,
    rootMargin: "15% 0px",
    threshold: [0, 0.25, 0.5, 0.75, 1.0]
  };

  const activeBlocks = new Set();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target.querySelector("video");
      if (!video) return;

      if (entry.isIntersecting) {
        activeBlocks.add(entry.target);
        // Ensure video is ready to play or scrub
        if (video.paused && !entry.target.dataset.scrubbing) {
          video.play().catch(() => {});
        }
      } else {
        activeBlocks.delete(entry.target);
        if (!video.paused) {
          video.pause();
        }
      }
    });
  }, observerOptions);

  flavorBlocks.forEach(block => observer.observe(block));

  // Throttled Scroll Engine for Smooth Video Scrubbing
  let isTicking = false;

  const onScroll = () => {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        updateActiveVideoScrub(activeBlocks);
        isTicking = false;
      });
      isTicking = true;
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
}

function updateActiveVideoScrub(activeBlocks) {
  if (!activeBlocks.size) return;

  const windowHeight = window.innerHeight;
  const scrollY = window.scrollY;

  activeBlocks.forEach(block => {
    const video = block.querySelector(".flavor-video");
    if (!video || isNaN(video.duration) || video.duration === 0) return;

    const rect = block.getBoundingClientRect();
    const blockTop = rect.top;
    const blockHeight = rect.height;

    // Calculate normalized progress (0.0 to 1.0) while scrolling through the block
    const progress = Math.min(Math.max((windowHeight - blockTop) / (windowHeight + blockHeight), 0), 1);

    // Apply scrub smoothly if video is loaded
    if (video.readyState >= 2) {
      // Calculate target time based on normalized progress
      const targetTime = progress * video.duration;
      // Seek if difference is significant enough to avoid micro-stutter
      if (Math.abs(video.currentTime - targetTime) > 0.08) {
        video.currentTime = targetTime;
      }
    }

    // Update pill text indicator if present
    const pillSpan = block.querySelector(".scrub-val");
    if (pillSpan) {
      pillSpan.textContent = `${Math.round(progress * 100)}%`;
    }
  });
}

// --------------------------------------------------------------------------
// 7. FLAVOR SECTION RENDERING & ACTIONS
// --------------------------------------------------------------------------
function initFlavorSections() {
  // Bind Shop buttons in flavor sections
  document.querySelectorAll("[data-action='quick-add']").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const flavorId = btn.dataset.flavor;
      addToCart(flavorId);
    });
  });
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

  // Esc key to close
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer && drawer.classList.contains("open")) {
      closeDrawer();
    }
  });

  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      // Simulation of Shopify Cart Permalink Redirect
      if (!AppState.cart.length) {
        showToast("Your selection is currently empty.");
        return;
      }
      showToast("Redirecting to secure Shopify checkout...");
      setTimeout(() => {
        alert("Shopify Integration Endpoint: In production, this forwards the cart payload directly to https://checkout.luckyshaker.com with variant tokens.");
      }, 400);
    });
  }
}

function addToCart(flavorId, quantity = 1) {
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
      volume: flavor.specs.volume,
      shopifyVariantId: flavor.shopifyVariantId,
      quantity: quantity
    });
  }

  updateCartUI();
  showToast(`Added ${flavor.name} to your selection`);

  // Cart Badge Bloom Micro-Interaction
  const badge = document.querySelector(".cart-badge");
  if (badge) {
    badge.classList.remove("pulse");
    void badge.offsetWidth; // Trigger reflow
    badge.classList.add("pulse");
  }
}

function updateCartUI() {
  const container = document.getElementById("cart-items-list");
  const subtotalEl = document.getElementById("cart-subtotal");
  const badge = document.querySelector(".cart-badge");
  const drawerSubtotal = document.getElementById("drawer-subtotal");

  const totalItems = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (badge) {
    badge.textContent = totalItems;
  }

  if (subtotalEl) {
    subtotalEl.textContent = `$${totalPrice.toFixed(2)}`;
  }
  if (drawerSubtotal) {
    drawerSubtotal.textContent = `$${totalPrice.toFixed(2)}`;
  }

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

// Global hook for inline quantity adjustments in drawer
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

// --------------------------------------------------------------------------
// 11. RESPONSIVE VIDEO SWITCHER ON RESIZE
// --------------------------------------------------------------------------
function initWindowResizeHandler() {
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const isMobileNow = window.innerWidth <= 768;
      if (isMobileNow !== AppState.isMobile) {
        AppState.isMobile = isMobileNow;
        // Optionally swap sources for active videos if orientation changed significantly
      }
    }, 250);
  }, { passive: true });
}

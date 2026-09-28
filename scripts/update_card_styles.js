const fs = require('fs');

const updatedCardCss = `
/* ==========================================================================
   LUCKY SHAKER — LUXURY EDITORIAL PRODUCT CARDS (COMPACT & CLEAN)
   ========================================================================== */
.products-catalog {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(1.25rem, 2.2vw, 2rem);
}

@media (max-width: 1024px) {
  .products-catalog {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.15rem;
  }
}

@media (max-width: 640px) {
  .products-catalog {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.65rem;
  }
}

.product-item.luxury-glass-card {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(28px) saturate(190%);
  -webkit-backdrop-filter: blur(28px) saturate(190%);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 
    0 4px 16px -2px rgba(0, 0, 0, 0.04),
    0 1px 4px -1px rgba(0, 0, 0, 0.02);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.3s ease,
              background 0.3s ease;
}

.product-item.luxury-glass-card:hover {
  background: rgba(255, 255, 255, 0.98);
  transform: translateY(-4px);
  border-color: rgba(232, 43, 125, 0.35);
  box-shadow: 
    0 16px 36px -8px rgba(0, 0, 0, 0.08),
    0 0 20px rgba(232, 43, 125, 0.12);
}

.product-visual-box {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: radial-gradient(circle at 50% 50%, #FFFFFF 0%, #F3F4F6 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.product-visual-box img.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.product-item.luxury-glass-card:hover .product-visual-box img.product-img {
  transform: scale(1.05);
}

.product-badge-group {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 5px;
  z-index: 2;
  pointer-events: none;
}

/* Single-Line Frosted Glass ABV Badge */
.product-visual-badge {
  white-space: nowrap !important;
  display: inline-flex !important;
  align-items: center !important;
  font-size: 0.7rem !important;
  font-weight: 700 !important;
  letter-spacing: 0.06em !important;
  text-transform: uppercase !important;
  padding: 4px 10px !important;
  border-radius: 100px !important;
  line-height: 1 !important;
  height: auto !important;
  width: auto !important;
}

.product-visual-badge.glass-badge {
  background: rgba(255, 255, 255, 0.94) !important;
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
  color: #121316 !important;
  border: 1px solid rgba(255, 255, 255, 0.95) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
}

.product-visual-badge.bestseller-badge {
  background: #E82B7D !important;
  color: #FFFFFF !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  box-shadow: 0 2px 8px rgba(232, 43, 125, 0.35) !important;
}

/* Compact Editorial Content Area (Zero Wasted Space) */
.product-details {
  padding: 1rem 1.15rem 1.15rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-eyebrow-row {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 3px;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #8E8E93;
  text-transform: uppercase;
  line-height: 1;
  white-space: nowrap;
}

.product-dot-sep {
  color: #C7C7CC;
  font-size: 0.65rem;
}

.product-name {
  font-family: 'Playfair Display', 'Cinzel', Georgia, serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #121316;
  letter-spacing: -0.01em;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.product-name a {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
}

.product-name a:hover {
  color: #E82B7D;
}

.product-tasting-notes {
  font-size: 0.8rem;
  color: #555866;
  line-height: 1.35;
  margin: 0 0 0.75rem 0;
  font-style: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: unset;
}

/* Footer: Price Side-by-Side with Add to Bag on ALL screen sizes */
.product-card-footer {
  margin-top: auto;
  padding-top: 0.65rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 8px !important;
}

.product-price-box {
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
}

.product-price-amount {
  font-size: 1.2rem;
  font-weight: 800;
  color: #121316;
  letter-spacing: -0.02em;
  line-height: 1;
}

.product-compare-price {
  font-size: 0.75rem;
  color: #8E8E93;
  text-decoration: line-through;
  margin-top: 2px;
}

.btn-luxury-pink {
  background: #E82B7D;
  color: #FFFFFF !important;
  border: none;
  border-radius: 100px;
  padding: 0.55rem 1.1rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  display: inline-flex !important;
  align-items: center !important;
  gap: 5px;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(232, 43, 125, 0.28);
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  text-decoration: none;
  line-height: 1;
  white-space: nowrap !important;
}

.btn-luxury-pink .btn-arrow {
  width: 11px;
  height: 11px;
  transition: transform 0.2s ease;
}

.btn-luxury-pink:hover {
  background: #FF3888;
  transform: translateY(-1px);
  box-shadow: 0 5px 16px rgba(232, 43, 125, 0.4);
}

.btn-luxury-pink:hover .btn-arrow {
  transform: translateX(2px);
}

.btn-luxury-pink:active {
  transform: scale(0.96);
}

.btn-luxury-pink.is-soldout {
  background: #E5E5EA;
  color: #8E8E93 !important;
  cursor: not-allowed;
  box-shadow: none;
}

/* Mobile Specific Optimizations (Side-by-Side & Super Compact) */
@media (max-width: 640px) {
  .product-item.luxury-glass-card {
    border-radius: 16px;
  }

  .product-details {
    padding: 0.65rem 0.65rem 0.75rem;
  }

  .product-badge-group {
    top: 6px;
    left: 6px;
    gap: 4px;
  }

  .product-visual-badge {
    font-size: 0.58rem !important;
    padding: 3px 7px !important;
  }

  .product-eyebrow-row {
    font-size: 0.56rem;
    letter-spacing: 0.05em;
    gap: 3px;
    margin-bottom: 2px;
  }

  .product-name {
    font-size: 0.96rem;
    margin-bottom: 2px;
    line-height: 1.18;
  }

  .product-tasting-notes {
    font-size: 0.68rem;
    line-height: 1.25;
    margin-bottom: 0.45rem;
    -webkit-line-clamp: 2;
  }

  .product-card-footer {
    padding-top: 0.45rem !important;
    gap: 4px !important;
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
  }

  .product-price-box {
    text-align: left !important;
  }

  .product-price-amount {
    font-size: 0.95rem !important;
    font-weight: 800;
  }

  .btn-luxury-pink {
    width: auto !important;
    padding: 0.42rem 0.65rem !important;
    font-size: 0.64rem !important;
    letter-spacing: 0.02em !important;
    gap: 3px !important;
  }

  .btn-luxury-pink .btn-arrow {
    width: 9px;
    height: 9px;
  }
}
`;

fs.appendFileSync('shopify-theme/assets/lucky-shaker.css', '\n' + updatedCardCss);
fs.appendFileSync('css/style.css', '\n' + updatedCardCss);
console.log('Successfully updated compact luxury card CSS');

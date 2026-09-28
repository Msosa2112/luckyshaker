const fs = require('fs');

const perfectCompactCardCss = `
/* ==========================================================================
   LUCKY SHAKER — ZERO-GAP LUXURY COMPACT PRODUCT CARDS
   ========================================================================== */
.products-catalog {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(1.25rem, 2vw, 1.85rem);
  align-items: stretch;
}

@media (max-width: 1024px) {
  .products-catalog {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 640px) {
  .products-catalog {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.65rem;
  }
}

.product-item.luxury-glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(28px) saturate(190%);
  -webkit-backdrop-filter: blur(28px) saturate(190%);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 
    0 4px 14px -2px rgba(0, 0, 0, 0.04),
    0 1px 3px -1px rgba(0, 0, 0, 0.02);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.25s ease;
}

.product-item.luxury-glass-card:hover {
  background: #FFFFFF;
  transform: translateY(-4px);
  border-color: rgba(232, 43, 125, 0.35);
  box-shadow: 
    0 16px 32px -8px rgba(0, 0, 0, 0.08),
    0 0 18px rgba(232, 43, 125, 0.12);
}

.product-visual-box {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: radial-gradient(circle at 50% 50%, #FFFFFF 0%, #F4F5F7 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.product-visual-box img.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.product-item.luxury-glass-card:hover .product-visual-box img.product-img {
  transform: scale(1.04);
}

.product-badge-group {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 4px;
  z-index: 2;
  pointer-events: none;
}

.product-visual-badge {
  white-space: nowrap !important;
  display: inline-flex !important;
  align-items: center !important;
  font-size: 0.65rem !important;
  font-weight: 700 !important;
  letter-spacing: 0.06em !important;
  text-transform: uppercase !important;
  padding: 3px 8px !important;
  border-radius: 100px !important;
  line-height: 1 !important;
  height: auto !important;
  width: auto !important;
}

.product-visual-badge.glass-badge {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
  color: #121316 !important;
  border: 1px solid rgba(255, 255, 255, 0.95) !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08) !important;
}

.product-visual-badge.bestseller-badge {
  background: #E82B7D !important;
  color: #FFFFFF !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  box-shadow: 0 2px 8px rgba(232, 43, 125, 0.3) !important;
}

/* Compact Editorial Content Area */
.product-details {
  padding: 0.85rem 1rem 1rem !important;
  display: flex !important;
  flex-direction: column !important;
  flex-grow: 1 !important;
  justify-content: space-between !important;
}

.product-eyebrow-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 3px;
  font-size: 0.64rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #8E8E93;
  text-transform: uppercase;
  line-height: 1;
  white-space: nowrap;
}

.product-dot-sep {
  color: #C7C7CC;
  font-size: 0.6rem;
}

.product-name {
  font-family: 'Playfair Display', 'Cinzel', Georgia, serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: #121316;
  letter-spacing: -0.01em;
  margin: 0 0 4px 0;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  font-size: 0.78rem;
  color: #555866;
  line-height: 1.35;
  margin: 0 0 0.5rem 0;
  font-style: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.7em; /* Unified exact height eliminating empty gaps */
}

/* Footer: Price Side-by-Side with Add to Bag */
.product-card-footer {
  margin-top: auto !important;
  padding-top: 0.55rem !important;
  border-top: 1px solid rgba(0, 0, 0, 0.06) !important;
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 6px !important;
}

.product-price-box {
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
}

.product-price-amount {
  font-size: 1.15rem !important;
  font-weight: 800;
  color: #121316;
  letter-spacing: -0.02em;
  line-height: 1;
}

.product-compare-price {
  font-size: 0.72rem;
  color: #8E8E93;
  text-decoration: line-through;
  margin-top: 1px;
}

.btn-luxury-pink {
  background: #E82B7D;
  color: #FFFFFF !important;
  border: none;
  border-radius: 100px;
  padding: 0.5rem 1rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  display: inline-flex !important;
  align-items: center !important;
  gap: 4px;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(232, 43, 125, 0.25);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  text-decoration: none;
  line-height: 1;
  white-space: nowrap !important;
}

.btn-luxury-pink .btn-arrow {
  width: 10px;
  height: 10px;
  transition: transform 0.2s ease;
}

.btn-luxury-pink:hover {
  background: #FF3888;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(232, 43, 125, 0.35);
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

/* Mobile Specific Optimizations */
@media (max-width: 640px) {
  .product-item.luxury-glass-card {
    border-radius: 16px;
  }

  .product-details {
    padding: 0.65rem 0.7rem 0.75rem !important;
  }

  .product-badge-group {
    top: 6px;
    left: 6px;
    gap: 3px;
  }

  .product-visual-badge {
    font-size: 0.56rem !important;
    padding: 2.5px 6px !important;
  }

  .product-eyebrow-row {
    font-size: 0.54rem;
    letter-spacing: 0.05em;
    gap: 3px;
    margin-bottom: 2px;
  }

  .product-name {
    font-size: 0.95rem;
    margin-bottom: 2px;
    line-height: 1.18;
  }

  .product-tasting-notes {
    font-size: 0.68rem;
    line-height: 1.25;
    margin-bottom: 0.35rem;
    height: 2.5em;
  }

  .product-card-footer {
    padding-top: 0.42rem !important;
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
    font-size: 0.62rem !important;
    letter-spacing: 0.02em !important;
    gap: 3px !important;
  }

  .btn-luxury-pink .btn-arrow {
    width: 8px;
    height: 8px;
  }
}
`;

fs.appendFileSync('shopify-theme/assets/lucky-shaker.css', '\n' + perfectCompactCardCss);
fs.appendFileSync('css/style.css', '\n' + perfectCompactCardCss);
console.log('Successfully injected zero-gap luxury compact card CSS');

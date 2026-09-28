const fs = require('fs');

const luxuryCardCss = `
/* ==========================================================================
   LUCKY SHAKER — LUXURY EDITORIAL PRODUCT CARDS (APPLE LIQUID GLASS)
   ========================================================================== */
.products-catalog {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(1.5rem, 2.5vw, 2.5rem);
}

@media (max-width: 1024px) {
  .products-catalog {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
}

@media (max-width: 640px) {
  .products-catalog {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
}

.product-item.luxury-glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(28px) saturate(190%);
  -webkit-backdrop-filter: blur(28px) saturate(190%);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 22px;
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
  transform: translateY(-5px);
  border-color: rgba(232, 43, 125, 0.35);
  box-shadow: 
    0 20px 40px -10px rgba(0, 0, 0, 0.09),
    0 0 25px rgba(232, 43, 125, 0.15);
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
  top: 12px;
  left: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  z-index: 2;
  pointer-events: none;
}

.product-visual-badge {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 100px;
  line-height: 1.2;
}

.product-visual-badge.glass-badge {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  color: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.product-visual-badge.bestseller-badge {
  background: #E82B7D;
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 2px 10px rgba(232, 43, 125, 0.35);
}

.product-details {
  padding: 1.35rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-eyebrow-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #8E8E93;
  text-transform: uppercase;
  line-height: 1;
}

.product-dot-sep {
  color: #C7C7CC;
  font-size: 0.7rem;
}

.product-name {
  font-family: 'Playfair Display', 'Cinzel', Georgia, serif;
  font-size: 1.35rem;
  font-weight: 700;
  color: #121316;
  letter-spacing: -0.01em;
  margin: 0 0 8px 0;
  line-height: 1.22;
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
  font-size: 0.84rem;
  color: #555866;
  line-height: 1.45;
  margin: 0 0 1.25rem 0;
  font-style: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.45em;
}

.product-card-footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.product-price-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.product-price-amount {
  font-size: 1.25rem;
  font-weight: 800;
  color: #121316;
  letter-spacing: -0.02em;
  line-height: 1;
}

.product-compare-price {
  font-size: 0.8rem;
  color: #8E8E93;
  text-decoration: line-through;
  margin-top: 2px;
}

.btn-luxury-pink {
  background: #E82B7D;
  color: #FFFFFF !important;
  border: none;
  border-radius: 100px;
  padding: 0.65rem 1.25rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(232, 43, 125, 0.3);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  text-decoration: none;
  line-height: 1;
}

.btn-luxury-pink .btn-arrow {
  width: 12px;
  height: 12px;
  transition: transform 0.25s ease;
}

.btn-luxury-pink:hover {
  background: #FF3888;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(232, 43, 125, 0.45);
}

.btn-luxury-pink:hover .btn-arrow {
  transform: translateX(3px);
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
    border-radius: 18px;
  }

  .product-details {
    padding: 0.85rem;
  }

  .product-badge-group {
    top: 8px;
    left: 8px;
    gap: 4px;
  }

  .product-visual-badge {
    font-size: 0.6rem;
    padding: 3px 7px;
  }

  .product-eyebrow-row {
    font-size: 0.6rem;
    letter-spacing: 0.08em;
    gap: 4px;
    margin-bottom: 4px;
  }

  .product-name {
    font-size: 1.05rem;
    margin-bottom: 4px;
    line-height: 1.2;
  }

  .product-tasting-notes {
    font-size: 0.74rem;
    line-height: 1.35;
    margin-bottom: 0.75rem;
    min-height: unset;
    -webkit-line-clamp: 2;
  }

  .product-card-footer {
    padding-top: 0.65rem;
    gap: 8px;
    flex-direction: column;
    align-items: stretch;
  }

  .product-price-box {
    text-align: left;
  }

  .product-price-amount {
    font-size: 1.1rem;
  }

  .btn-luxury-pink {
    width: 100%;
    justify-content: center;
    padding: 0.55rem 0.75rem;
    font-size: 0.72rem;
  }
}
`;

fs.appendFileSync('shopify-theme/assets/lucky-shaker.css', '\n' + luxuryCardCss);
fs.appendFileSync('css/style.css', '\n' + luxuryCardCss);
console.log('Successfully injected luxury card CSS');

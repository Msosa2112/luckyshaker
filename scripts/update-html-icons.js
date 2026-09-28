const fs = require('fs');

const htmlFiles = ['index.html', 'shop.html', 'product.html', 'cart.html', 'contact.html', 'faq.html', 'story.html'];

htmlFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace shopping bag icon in header
  content = content.replace(/<button class="cart-toggle-btn open-cart-btn"[^>]*>[\s\S]*?<span class="cart-badge"/g, (m) => {
    return `<button class="cart-toggle-btn open-cart-btn" aria-label="Ver Bolsa de Compras" id="nav-cart-trigger">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="nav-cart-icon">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
        <path d="M3 6h18"></path>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>
      <span class="cart-badge"`;
  });

  // Replace drawer close button
  content = content.replace(/<button id="close-cart-btn" class="close-drawer-btn"[^>]*>[\s\S]*?<\/button>/g, () => {
    return `<button id="close-cart-btn" class="close-drawer-btn" aria-label="Cerrar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18"></path>
        <path d="m6 6 12 12"></path>
      </svg>
    </button>`;
  });

  // Replace .btn-arrow
  content = content.replace(/<svg class="btn-arrow"[^>]*>[\s\S]*?<\/svg>/g, () => {
    return `<svg class="btn-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"></path>
        <path d="m12 5 7 7-7 7"></path>
      </svg>`;
  });

  // Replace trust badges in drawer
  content = content.replace(/<div class="cart-trust-badges">[\s\S]*?<\/div>/g, () => {
    return `<div class="cart-trust-badges">
      <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E82B7D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>Pago Seguro</span>
      <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E82B7D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path><path d="M12 22V12"></path><polyline points="3.29 7 12 12 20.71 7"></polyline></svg>Embalaje Protegido 21+</span>
    </div>`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated icons in HTML: ${file}`);
  }
});

const fs = require('fs');

const files = [
  'index.html',
  'shop.html',
  'product.html',
  'cart.html',
  'contact.html',
  'faq.html',
  'story.html'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/<button class="cart-toggle-btn open-cart-btn"[^>]*>[\s\S]*?<span class="cart-badge"/g, () => {
    return `<button class="cart-toggle-btn open-cart-btn" aria-label="Ver Bolsa de Compras" id="nav-cart-trigger">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="nav-cart-icon">
        <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z"></path>
      </svg>
      <span class="cart-badge"`;
  });

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Synced luxury cart bag icon in: ${file}`);
});

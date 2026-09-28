const fs = require('fs');

let html = fs.readFileSync('shop.html', 'utf8');

// Replace the two-button container in shop.html with the single full-width ADD TO BAG button
// Pattern: <div style="display: flex; gap: 0.5rem; margin-top: auto;"> ... </div>

const regex = /<div style="display: flex; gap: 0\.5rem; margin-top: auto;">[\s\S]*?<button class="btn btn-primary" onclick="addToCart\('([^']+)'\)" aria-label="Add ([^"]+) to Bag"[^>]*>[\s\S]*?<\/button>\s*<\/div>/g;

html = html.replace(regex, (match, id, name) => {
  return `<button class="btn btn-primary" onclick="addToCart('${id}')" aria-label="Add ${name} to Bag" style="margin-top: auto;">
            <span>ADD TO BAG</span>
            <svg class="btn-arrow" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M1 7h12M8 2l5 5-5 5"/>
            </svg>
          </button>`;
});

fs.writeFileSync('shop.html', html, 'utf8');
console.log('Successfully updated shop.html buttons to unified full-width ADD TO BAG!');

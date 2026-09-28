const fs = require('fs');
const path = require('path');

function processLiquidFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace arrow buttons
  content = content.replace(/<svg[^>]*class="[^"]*btn-arrow[^"]*"[^>]*>[\s\S]*?<\/svg>/g, (m) => {
    return `{% render 'icon', name: 'arrow-right', size: 14, class: 'btn-arrow', stroke_width: 1.8 %}`;
  });

  // Replace generic 14x14 arrow SVGs
  content = content.replace(/<svg[^>]*viewBox="0 0 14 14"[^>]*>[\s\S]*?<path[^>]*d="M1 7h12M8 2l5 5-5 5"[^>]*\/>[\s\S]*?<\/svg>/g, (m) => {
    return `{% render 'icon', name: 'arrow-right', size: 14, stroke_width: 2 %}`;
  });

  // Replace contact mail
  content = content.replace(/<svg[^>]*>[\s\S]*?<polyline points="22,6 12,13 2,6"[\s\S]*?<\/svg>/g, (m) => {
    return `{% render 'icon', name: 'mail', size: 20, stroke_width: 1.8 %}`;
  });

  // Replace contact phone
  content = content.replace(/<svg[^>]*>[\s\S]*?16.92[\s\S]*?<\/svg>/g, (m) => {
    return `{% render 'icon', name: 'phone', size: 20, stroke_width: 1.8 %}`;
  });

  // Replace contact map pin
  content = content.replace(/<svg[^>]*>[\s\S]*?M21 10c0 7-9 13-9 13[\s\S]*?<\/svg>/g, (m) => {
    return `{% render 'icon', name: 'map-pin', size: 20, stroke_width: 1.8 %}`;
  });

  // Replace stars in testimonials
  content = content.replace(/<svg[^>]*>[\s\S]*?M12 2l3.09 6.26L22 9.27[\s\S]*?<\/svg>/g, (m) => {
    return `{% render 'icon', name: 'star', size: 15, stroke: '#E82B7D', fill: '#E82B7D', stroke_width: 1.5 %}`;
  });

  // Replace shield / lock / package in cart and sections
  content = content.replace(/<svg[^>]*>[\s\S]*?M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z[\s\S]*?<\/svg>/g, (m) => {
    return `{% render 'icon', name: 'shield-check', size: 18, stroke: '#E82B7D', stroke_width: 1.8 %}`;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated icons in: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      walkDir(full);
    } else if (f.endsWith('.liquid') && f !== 'icon.liquid') {
      processLiquidFile(full);
    }
  }
}

walkDir('shopify-theme');
console.log('Smart icon replacement complete!');

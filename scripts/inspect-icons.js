const fs = require('fs');

const lucide = fs.readFileSync('lib/cojeev/lucide-icon-data.ts', 'utf8');
const custom = fs.readFileSync('lib/cojeev/icon-data.ts', 'utf8');

const names = [
  'shopping-bag', 'shopping-cart', 'x', 'arrow-right', 'arrow-up-right',
  'lock', 'shield-check', 'shield', 'package', 'truck', 'check', 'circle-check',
  'plus', 'minus', 'trash-2', 'sparkles', 'star', 'calendar', 'clock',
  'glass-water', 'wine', 'sparkle', 'heart', 'chevron-right', 'chevron-down',
  'instagram', 'mail', 'phone', 'map-pin', 'search', 'menu'
];

names.forEach(name => {
  let idx = lucide.indexOf('"' + name + '":');
  let src = 'lucide';
  if (idx === -1) {
    idx = custom.indexOf('"' + name + '":');
    src = 'custom';
  }
  if (idx !== -1) {
    const raw = (src === 'lucide' ? lucide : custom).substring(idx, idx + 250);
    console.log(`[${name}] (${src}): ${raw.replace(/\n/g, ' ')}`);
  } else {
    console.log(`[${name}]: not found`);
  }
});

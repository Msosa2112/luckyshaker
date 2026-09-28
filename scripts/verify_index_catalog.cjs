const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const cocktails = [
  'MARGARITA', 'MOJITO', 'DAIQUIRI', 'GIN &amp; TONIC', 'PALOMA', 'MIMOSA',
  'MOSCOW MULE', 'COSMOPOLITAN', 'SEX ON THE BEACH', 'PIÑA COLADA', 'BLUE HAWAII',
  'MALIBU BAY BREEZE', 'NEGRONI', 'OLD FASHIONED', 'MANHATTAN', 'CLASSIC MARTINI',
  'ESPRESSO MARTINI', 'CAIPIRINHA'
];

const startIdx = html.indexOf('<div class="products-catalog">');
const endIdx = html.indexOf('</section>', startIdx);
const catalogPart = html.substring(startIdx, endIdx);

let missing = [];
cocktails.forEach(c => {
  if (!catalogPart.includes(c)) missing.push(c);
});

const itemsCount = (catalogPart.match(/class="product-item"/g) || []).length;
const hasWhiskeyCream = catalogPart.includes('WHISKEY CREAM');

console.log('Total product-item in index.html catalog:', itemsCount);
console.log('Missing cocktails:', missing.length === 0 ? 'None' : missing.join(', '));
console.log('Is Whiskey Cream in catalog:', hasWhiskeyCream);

if (itemsCount === 18 && missing.length === 0 && !hasWhiskeyCream) {
  console.log('SUCCESS: All 18 cocktails verified in index.html, Whiskey Cream removed completely from catalog!');
} else {
  console.error('FAILED verification!');
  process.exit(1);
}

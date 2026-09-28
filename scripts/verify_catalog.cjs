const fs = require('fs');
const html = fs.readFileSync('shop.html', 'utf8');

const cocktails = [
  'MARGARITA', 'MOJITO', 'DAIQUIRI', 'GIN &amp; TONIC', 'PALOMA', 'MIMOSA',
  'MOSCOW MULE', 'COSMOPOLITAN', 'SEX ON THE BEACH', 'PIÑA COLADA', 'BLUE HAWAII',
  'MALIBU BAY BREEZE', 'NEGRONI', 'OLD FASHIONED', 'MANHATTAN', 'CLASSIC MARTINI',
  'ESPRESSO MARTINI', 'CAIPIRINHA'
];

let allFound = true;
cocktails.forEach((name, i) => {
  if (!html.includes(name)) {
    console.error(`Missing cocktail: ${name}`);
    allFound = false;
  }
});

const itemsCount = (html.match(/class="product-item"/g) || []).length;
console.log('Total product-item cards in shop.html:', itemsCount);

const ingredientsCount = (html.match(/class="product-ingredients-line"/g) || []).length;
console.log('Total product-ingredients-line in shop.html:', ingredientsCount);

const pillsCount = (html.match(/class="product-notes-pills"/g) || []).length;
console.log('Total product-notes-pills in shop.html:', pillsCount);

const descCount = (html.match(/class="product-desc"/g) || []).length;
console.log('Total product-desc in shop.html:', descCount);

if (allFound && itemsCount === 18 && ingredientsCount === 18 && pillsCount === 18 && descCount === 18) {
  console.log('SUCCESS: All 18 cocktails verified with complete structure and information!');
} else {
  console.error('FAILURE: Verification counts do not match expected 18.');
  process.exit(1);
}

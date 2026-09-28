const fs = require('fs');

const cocktails = [
  {
    num: 1,
    id: "margarita",
    name: "MARGARITA",
    image: "assets/cocteles/margarita.jpg",
    abv: "18% ABV",
    price: "$38.00",
    desc: "Un clásico refrescante de tequila y cítricos, con un equilibrio perfecto entre acidez y dulzor.",
    tags: ["Citrus", "Fresh", "Smooth"],
    ingredients: "Tequila · Lima · Naranja · Agave"
  },
  {
    num: 2,
    id: "mojito",
    name: "MOJITO",
    image: "assets/cocteles/mojito.jpg",
    abv: "12% ABV",
    price: "$36.00",
    desc: "Refrescante y ligero, con ron, lima y el carácter aromático de la menta.",
    tags: ["Fresh", "Minty", "Refreshing"],
    ingredients: "Ron blanco · Lima · Menta · Azúcar"
  },
  {
    num: 3,
    id: "daiquiri",
    name: "DAIQUIRI",
    image: "assets/cocteles/daiquiri.jpg",
    abv: "15% ABV",
    price: "$36.00",
    desc: "Un clásico cubano limpio y elegante, donde el ron y la lima crean un balance perfectamente refrescante.",
    tags: ["Citrus", "Crisp", "Smooth"],
    ingredients: "Ron blanco · Lima · Azúcar"
  },
  {
    num: 4,
    id: "gin-tonic",
    name: "GIN &amp; TONIC",
    image: "assets/cocteles/gin-tonic.jpg",
    abv: "14% ABV",
    price: "$38.00",
    desc: "Limpio, aromático y refrescante, con notas botánicas y cítricas sobre una base de gin.",
    tags: ["Botanical", "Crisp", "Refreshing"],
    ingredients: "Gin · Tonic · Cítricos"
  },
  {
    num: 5,
    id: "paloma",
    name: "PALOMA",
    image: "assets/cocteles/paloma.jpg",
    abv: "15% ABV",
    price: "$38.00",
    desc: "Tequila y toronja se unen en un cóctel brillante, cítrico y ligeramente amargo.",
    tags: ["Citrus", "Bright", "Refreshing"],
    ingredients: "Tequila · Toronja · Lima · Sal"
  },
  {
    num: 6,
    id: "mimosa",
    name: "MIMOSA",
    image: "assets/cocteles/mimosa.jpg",
    abv: "11% ABV",
    price: "$34.00",
    desc: "La combinación perfecta de cítricos y burbujas, ligera, brillante y naturalmente refrescante.",
    tags: ["Citrus", "Sparkling", "Bright"],
    ingredients: "Jugo de naranja · Prosecco"
  },
  {
    num: 7,
    id: "moscow-mule",
    name: "MOSCOW MULE",
    image: "assets/cocteles/moscow-mule.jpg",
    abv: "14% ABV",
    price: "$38.00",
    desc: "Vodka, ginger beer y lima crean un cóctel intenso, fresco y ligeramente picante.",
    tags: ["Spicy", "Citrus", "Crisp"],
    ingredients: "Vodka · Ginger Beer · Lima"
  },
  {
    num: 8,
    id: "cosmopolitan",
    name: "COSMOPOLITAN",
    image: "assets/cocteles/cosmopolitan.jpg",
    abv: "18% ABV",
    price: "$38.00",
    desc: "Elegante y vibrante, con notas de cranberry, cítricos y un acabado ligeramente ácido.",
    tags: ["Fruity", "Citrus", "Elegant"],
    ingredients: "Vodka · Cranberry · Naranja · Lima"
  },
  {
    num: 9,
    id: "sex-on-the-beach",
    name: "SEX ON THE BEACH",
    image: "assets/cocteles/sex-on-the-beach.jpg",
    abv: "14% ABV",
    price: "$36.00",
    desc: "Tropical y frutal, combinando durazno, naranja y cranberry en un balance suave y refrescante.",
    tags: ["Fruity", "Tropical", "Smooth"],
    ingredients: "Vodka · Durazno · Naranja · Cranberry"
  },
  {
    num: 10,
    id: "pina-colada",
    name: "PIÑA COLADA",
    image: "assets/cocteles/pina-colada.jpg",
    abv: "15% ABV",
    price: "$38.00",
    desc: "Cremosa y tropical, con el equilibrio clásico entre piña, coco y ron.",
    tags: ["Tropical", "Creamy", "Smooth"],
    ingredients: "Ron blanco · Piña · Coco"
  },
  {
    num: 11,
    id: "blue-hawaii",
    name: "BLUE HAWAII",
    image: "assets/cocteles/blue-hawaii.jpg",
    abv: "16% ABV",
    price: "$38.00",
    desc: "Un cóctel tropical de vibrante color azul, con notas de piña, cítricos y ron.",
    tags: ["Tropical", "Citrus", "Bright"],
    ingredients: "Ron · Vodka · Blue Curaçao · Piña"
  },
  {
    num: 12,
    id: "malibu-bay-breeze",
    name: "MALIBU BAY BREEZE",
    image: "assets/cocteles/malibu-bay-breeze.jpg",
    abv: "14% ABV",
    price: "$36.00",
    desc: "Una mezcla tropical y frutal de coco, piña y cranberry con un acabado suave y refrescante.",
    tags: ["Tropical", "Fruity", "Smooth"],
    ingredients: "Malibu · Piña · Cranberry"
  },
  {
    num: 13,
    id: "negroni",
    name: "NEGRONI",
    image: "assets/cocteles/negroni.jpg",
    abv: "24% ABV",
    price: "$42.00",
    desc: "Intenso, equilibrado y sofisticado, con notas amargas, cítricas y herbales.",
    tags: ["Bitter", "Citrus", "Bold"],
    ingredients: "Gin · Campari · Vermouth rojo"
  },
  {
    num: 14,
    id: "old-fashioned",
    name: "OLD FASHIONED",
    image: "assets/cocteles/old-fashioned.jpg",
    abv: "28% ABV",
    price: "$42.00",
    desc: "Un clásico profundo y elegante, con whiskey, notas de naranja y un toque aromático de bitters.",
    tags: ["Rich", "Bold", "Smoky"],
    ingredients: "Whiskey · Bitters · Azúcar · Naranja"
  },
  {
    num: 15,
    id: "manhattan",
    name: "MANHATTAN",
    image: "assets/cocteles/manhattan.jpg",
    abv: "26% ABV",
    price: "$42.00",
    desc: "Elegante y profundo, con whiskey, vermouth dulce y delicadas notas especiadas.",
    tags: ["Rich", "Smooth", "Complex"],
    ingredients: "Rye Whiskey · Vermouth rojo · Bitters"
  },
  {
    num: 16,
    id: "classic-martini",
    name: "CLASSIC MARTINI",
    image: "assets/cocteles/classic-martini.jpg",
    abv: "26% ABV",
    price: "$42.00",
    desc: "Limpio, sofisticado y perfectamente equilibrado, con gin y dry vermouth.",
    tags: ["Crisp", "Dry", "Elegant"],
    ingredients: "Gin · Dry Vermouth · Limón"
  },
  {
    num: 17,
    id: "espresso-martini",
    name: "ESPRESSO MARTINI",
    image: "assets/cocteles/espresso-martini.jpg",
    abv: "20% ABV",
    price: "$40.00",
    desc: "Intenso y sedoso, con profundas notas de espresso y un acabado ligeramente dulce.",
    tags: ["Rich", "Smooth", "Bold"],
    ingredients: "Vodka · Decaf Espresso · Coffee Liqueur · Sugar"
  },
  {
    num: 18,
    id: "caipirinha",
    name: "CAIPIRINHA",
    image: "assets/cocteles/caipirinha.jpg",
    abv: "18% ABV",
    price: "$38.00",
    desc: "Un clásico brasileño vibrante y refrescante, con cachaça, lima y un toque de azúcar.",
    tags: ["Citrus", "Fresh", "Vibrant"],
    ingredients: "Cachaça · Lima · Azúcar"
  }
];

function generateCard(c) {
  const pills = c.tags.map(t => `            <span class="pill-note">${t}</span>`).join('\n');
  return `      <!-- ${c.num}. ${c.name} -->
      <article class="product-item">
        <div class="product-visual-box">
          <a href="shop.html">
            <img src="${c.image}" alt="Lucky Shaker ${c.name.replace('&amp;', '&')} 750ml" loading="lazy" decoding="async">
          </a>
          <span class="product-visual-badge">${c.abv}</span>
        </div>
        <div class="product-details">
          <div class="product-meta-row">
            <span class="product-type">750ML • READY TO POUR</span>
            <span class="product-price">${c.price}</span>
          </div>
          <h3 class="product-name"><a href="shop.html" style="color: inherit; text-decoration: none;">${c.name}</a></h3>
          <p class="product-desc">${c.desc}</p>
          <div class="product-notes-pills">
${pills}
          </div>
          <div class="product-ingredients-line">${c.ingredients}</div>
          <button class="btn btn-primary" onclick="addToCart('${c.id}')" aria-label="Add ${c.name.replace('&amp;', '&')} to Bag" style="margin-top: auto;">
            <span>ADD TO BAG</span>
            <svg class="btn-arrow" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M1 7h12M8 2l5 5-5 5"/>
            </svg>
          </button>
        </div>
      </article>`;
}

const allCardsHtml = cocktails.map(generateCard).join('\n\n');

let indexHtml = fs.readFileSync('index.html', 'utf8');

const startMarker = '<div class="products-catalog">';
const endMarker = '</div>\n  </section>';

const startIndex = indexHtml.indexOf(startMarker);
const endIndex = indexHtml.indexOf(endMarker, startIndex);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

const newSection = `${startMarker}\n      \n${allCardsHtml}\n\n    `;
indexHtml = indexHtml.substring(0, startIndex) + newSection + indexHtml.substring(endIndex);

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('Successfully updated index.html with all 18 cocktails and removed Whiskey Cream!');

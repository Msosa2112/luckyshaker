const fs = require('fs');
const html = fs.readFileSync('shop.html', 'utf8');

const catalog = [
  {
    name: 'MARGARITA',
    desc: 'Un clásico refrescante de tequila y cítricos, con un equilibrio perfecto entre acidez y dulzor.',
    tags: ['Citrus', 'Fresh', 'Smooth'],
    ingredients: 'Tequila · Lima · Naranja · Agave'
  },
  {
    name: 'MOJITO',
    desc: 'Refrescante y ligero, con ron, lima y el carácter aromático de la menta.',
    tags: ['Fresh', 'Minty', 'Refreshing'],
    ingredients: 'Ron blanco · Lima · Menta · Azúcar'
  },
  {
    name: 'DAIQUIRI',
    desc: 'Un clásico cubano limpio y elegante, donde el ron y la lima crean un balance perfectamente refrescante.',
    tags: ['Citrus', 'Crisp', 'Smooth'],
    ingredients: 'Ron blanco · Lima · Azúcar'
  },
  {
    name: 'GIN &amp; TONIC',
    desc: 'Limpio, aromático y refrescante, con notas botánicas y cítricas sobre una base de gin.',
    tags: ['Botanical', 'Crisp', 'Refreshing'],
    ingredients: 'Gin · Tonic · Cítricos'
  },
  {
    name: 'PALOMA',
    desc: 'Tequila y toronja se unen en un cóctel brillante, cítrico y ligeramente amargo.',
    tags: ['Citrus', 'Bright', 'Refreshing'],
    ingredients: 'Tequila · Toronja · Lima · Sal'
  },
  {
    name: 'MIMOSA',
    desc: 'La combinación perfecta de cítricos y burbujas, ligera, brillante y naturalmente refrescante.',
    tags: ['Citrus', 'Sparkling', 'Bright'],
    ingredients: 'Jugo de naranja · Prosecco'
  },
  {
    name: 'MOSCOW MULE',
    desc: 'Vodka, ginger beer y lima crean un cóctel intenso, fresco y ligeramente picante.',
    tags: ['Spicy', 'Citrus', 'Crisp'],
    ingredients: 'Vodka · Ginger Beer · Lima'
  },
  {
    name: 'COSMOPOLITAN',
    desc: 'Elegante y vibrante, con notas de cranberry, cítricos y un acabado ligeramente ácido.',
    tags: ['Fruity', 'Citrus', 'Elegant'],
    ingredients: 'Vodka · Cranberry · Naranja · Lima'
  },
  {
    name: 'SEX ON THE BEACH',
    desc: 'Tropical y frutal, combinando durazno, naranja y cranberry en un balance suave y refrescante.',
    tags: ['Fruity', 'Tropical', 'Smooth'],
    ingredients: 'Vodka · Durazno · Naranja · Cranberry'
  },
  {
    name: 'PIÑA COLADA',
    desc: 'Cremosa y tropical, con el equilibrio clásico entre piña, coco y ron.',
    tags: ['Tropical', 'Creamy', 'Smooth'],
    ingredients: 'Ron blanco · Piña · Coco'
  },
  {
    name: 'BLUE HAWAII',
    desc: 'Un cóctel tropical de vibrante color azul, con notas de piña, cítricos y ron.',
    tags: ['Tropical', 'Citrus', 'Bright'],
    ingredients: 'Ron · Vodka · Blue Curaçao · Piña'
  },
  {
    name: 'MALIBU BAY BREEZE',
    desc: 'Una mezcla tropical y frutal de coco, piña y cranberry con un acabado suave y refrescante.',
    tags: ['Tropical', 'Fruity', 'Smooth'],
    ingredients: 'Malibu · Piña · Cranberry'
  },
  {
    name: 'NEGRONI',
    desc: 'Intenso, equilibrado y sofisticado, con notas amargas, cítricas y herbales.',
    tags: ['Bitter', 'Citrus', 'Bold'],
    ingredients: 'Gin · Campari · Vermouth rojo'
  },
  {
    name: 'OLD FASHIONED',
    desc: 'Un clásico profundo y elegante, con whiskey, notas de naranja y un toque aromático de bitters.',
    tags: ['Rich', 'Bold', 'Smoky'],
    ingredients: 'Whiskey · Bitters · Azúcar · Naranja'
  },
  {
    name: 'MANHATTAN',
    desc: 'Elegante y profundo, con whiskey, vermouth dulce y delicadas notas especiadas.',
    tags: ['Rich', 'Smooth', 'Complex'],
    ingredients: 'Rye Whiskey · Vermouth rojo · Bitters'
  },
  {
    name: 'CLASSIC MARTINI',
    desc: 'Limpio, sofisticado y perfectamente equilibrado, con gin y dry vermouth.',
    tags: ['Crisp', 'Dry', 'Elegant'],
    ingredients: 'Gin · Dry Vermouth · Limón'
  },
  {
    name: 'ESPRESSO MARTINI',
    desc: 'Intenso y sedoso, con profundas notas de espresso y un acabado ligeramente dulce.',
    tags: ['Rich', 'Smooth', 'Bold'],
    ingredients: 'Vodka · Decaf Espresso · Coffee Liqueur · Sugar'
  },
  {
    name: 'CAIPIRINHA',
    desc: 'Un clásico brasileño vibrante y refrescante, con cachaça, lima y un toque de azúcar.',
    tags: ['Citrus', 'Fresh', 'Vibrant'],
    ingredients: 'Cachaça · Lima · Azúcar'
  }
];

let errors = [];

catalog.forEach((item, idx) => {
  const num = idx + 1;
  if (!html.includes(item.name)) errors.push(`[#${num} ${item.name}] Name not found in shop.html`);
  if (!html.includes(item.desc)) errors.push(`[#${num} ${item.name}] Description mismatch: "${item.desc}"`);
  for (const tag of item.tags) {
    if (!html.includes(`<span class="pill-note">${tag}</span>`)) {
      errors.push(`[#${num} ${item.name}] Tag pill missing: "${tag}"`);
    }
  }
  if (!html.includes(`<div class="product-ingredients-line">${item.ingredients}</div>`)) {
    errors.push(`[#${num} ${item.name}] Ingredients line mismatch: "${item.ingredients}"`);
  }
});

if (errors.length === 0) {
  console.log('PERFECT! 100% of all 18 cocktails have exact name, description, 3 flavor tags, and main ingredients line!');
} else {
  console.error('Errors found:\n' + errors.join('\n'));
  process.exit(1);
}

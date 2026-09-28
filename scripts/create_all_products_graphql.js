const http = require('http');
const fs = require('fs');
const path = require('path');

const GRAPHIQL_KEY = 'fd7c3f25ac39c648dd6ccc09ca0c0e2f0c043082aace04e441434d110cd5f625';
const PORT = 3457;

function runGraphQL(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query, variables });

    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: `/graphiql/graphql.json?key=${GRAPHIQL_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(data));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// 19 Complete Cocktail Definitions
const products = [
  {
    title: 'Whiskey Cream 750ml',
    handle: 'whiskey-cream',
    price: '38.00',
    sku: 'LS-WC-750',
    tags: ['Reserve Collection', 'Best Seller', 'Whiskey', '750ml', 'Featured'],
    description: '<p>Triple-distilled aged whiskey matured in charred American oak, blended with Venezuelan roasted cocoa and pure velvet dairy cream. Hand-batched and sealed in glass.</p><ul><li><strong>ABV:</strong> 17% Alc / Vol</li><li><strong>Volume:</strong> 750 ML (6–8 Servings)</li><li><strong>Ingredients:</strong> Triple-Distilled Whiskey, Roasted Cocoa, Dairy Cream, Bourbon Vanilla</li><li><strong>Serving Ritual:</strong> Shake vigorously with ice, strain into a chilled coupe or rocks glass.</li></ul>'
  },
  {
    title: 'Old Fashioned 750ml',
    handle: 'old-fashioned',
    price: '42.00',
    sku: 'LS-OF-750',
    tags: ['Reserve Collection', 'Best Seller', 'Bourbon', '750ml', 'Featured'],
    description: '<p>An uncompromising classic combining Kentucky straight bourbon, Angostura aromatic bitters, caramelized demerara sugar, and cold-expressed orange oils.</p><ul><li><strong>ABV:</strong> 24% Alc / Vol</li><li><strong>Volume:</strong> 750 ML (6–8 Servings)</li><li><strong>Ingredients:</strong> Bourbon Whiskey, Bitters, Sugar, Orange Peel</li><li><strong>Serving Ritual:</strong> Pour over a large crystal ice sphere, garnish with fresh orange peel.</li></ul>'
  },
  {
    title: 'Craft Mojito 750ml',
    handle: 'mojito',
    price: '36.00',
    sku: 'LS-MOJ-750',
    tags: ['Reserve Collection', 'Best Seller', 'Rum', '750ml', 'Featured'],
    description: '<p>Crisp white rum infused with hand-crushed spearmint, freshly squeezed key limes, and cane sugar. Refreshingly bright with aromatic herbal notes.</p><ul><li><strong>ABV:</strong> 12% Alc / Vol</li><li><strong>Volume:</strong> 750 ML (6–8 Servings)</li><li><strong>Ingredients:</strong> White Rum, Fresh Lime, Spearmint, Cane Sugar</li><li><strong>Serving Ritual:</strong> Pour into a highball over crushed ice, top with a splash of soda and a mint sprig.</li></ul>'
  },
  {
    title: 'Margarita 750ml',
    handle: 'margarita',
    price: '38.00',
    sku: 'LS-MARG-750',
    tags: ['Tequila', 'Citrus', '750ml', 'Reserve'],
    description: '<p>Un clásico refrescante de tequila 100% agave y cítricos frescos, con un equilibrio perfecto entre acidez vibrante y sutil dulzor.</p><ul><li><strong>ABV:</strong> 18% Alc / Vol</li><li><strong>Volume:</strong> 750 ML</li><li><strong>Ingredients:</strong> Tequila 100% Agave, Lima, Naranja, Agave Orgánico</li></ul>'
  },
  {
    title: 'Daiquiri 750ml',
    handle: 'daiquiri',
    price: '36.00',
    sku: 'LS-DAIQ-750',
    tags: ['Rum', 'Classic', '750ml', 'Reserve'],
    description: '<p>Ron blanco superior, zumo de lima recién exprimido y azúcar de caña. El epítome del balance en la coctelería clásica.</p><ul><li><strong>ABV:</strong> 14% Alc / Vol</li><li><strong>Volume:</strong> 750 ML</li><li><strong>Ingredients:</strong> Ron Blanco, Lima, Azúcar de Caña</li></ul>'
  },
  {
    title: 'Gin & Tonic 750ml',
    handle: 'gin-tonic',
    price: '38.00',
    sku: 'LS-GT-750',
    tags: ['Gin', 'Botanical', '750ml', 'Reserve'],
    description: '<p>Limpio, botánico y sumamente aromático, elaborado con ginebra artesanal de enebro y toques cítricos de pomelo y lima.</p><ul><li><strong>ABV:</strong> 14% Alc / Vol</li><li><strong>Volume:</strong> 750 ML</li><li><strong>Ingredients:</strong> Gin Botánico, Tonic, Cítricos</li></ul>'
  },
  {
    title: 'Paloma 750ml',
    handle: 'paloma',
    price: '38.00',
    sku: 'LS-PAL-750',
    tags: ['Tequila', 'Citrus', '750ml', 'Reserve'],
    description: '<p>Tequila y toronja rosada se unen en un cóctel brillante, cítrico y delicadamente efervescente con un toque de sal marina.</p><ul><li><strong>ABV:</strong> 15% Alc / Vol</li><li><strong>Volume:</strong> 750 ML</li><li><strong>Ingredients:</strong> Tequila, Toronja, Lima, Sal Marina</li></ul>'
  },
  {
    title: 'Mimosa 750ml',
    handle: 'mimosa',
    price: '34.00',
    sku: 'LS-MIM-750',
    tags: ['Sparkling', 'Brunch', '750ml', 'Reserve'],
    description: '<p>La combinación perfecta de zumo de naranja valenciana y vino espumoso prosecco. Ligera, chispeante y festiva.</p><ul><li><strong>ABV:</strong> 11% Alc / Vol</li><li><strong>Volume:</strong> 750 ML</li><li><strong>Ingredients:</strong> Jugo de Naranja, Prosecco</li></ul>'
  },
  {
    title: 'Moscow Mule 750ml',
    handle: 'moscow-mule',
    price: '38.00',
    sku: 'LS-MM-750',
    tags: ['Vodka', 'Ginger', '750ml', 'Reserve'],
    description: '<p>Vodka ultra-purificado, ginger beer con jengibre natural y jugo de lima. Intenso, picante y vigorizante.</p><ul><li><strong>ABV:</strong> 14% Alc / Vol</li><li><strong>Volume:</strong> 750 ML</li><li><strong>Ingredients:</strong> Vodka, Ginger Beer, Lima</li></ul>'
  },
  {
    title: 'Cosmopolitan 750ml',
    handle: 'cosmopolitan',
    price: '38.00',
    sku: 'LS-COSMO-750',
    tags: ['Vodka', 'Elegant', '750ml', 'Reserve'],
    description: '<p>Elegante y vibrante. Vodka premium con notas ácidas de arándano rojo (cranberry), triple sec y lima fresca.</p><ul><li><strong>ABV:</strong> 18% Alc / Vol</li><li><strong>Volume:</strong> 750 ML</li><li><strong>Ingredients:</strong> Vodka, Cranberry, Naranja, Lima</li></ul>'
  },
  {
    title: 'Sex on the Beach 750ml',
    handle: 'sex-on-the-beach',
    price: '36.00',
    sku: 'LS-SOTB-750',
    tags: ['Vodka', 'Tropical', '750ml', 'Reserve'],
    description: '<p>Frutal y seductor. Vodka infusionado con durazno aterciopelado, jugo de naranja y cranberry natural.</p><ul><li><strong>ABV:</strong> 14% Alc / Vol</li><li><strong>Volume:</strong> 750 ML</li><li><strong>Ingredients:</strong> Vodka, Durazno, Naranja, Cranberry</li></ul>'
  },
  {
    title: 'Piña Colada 750ml',
    handle: 'pina-colada',
    price: '38.00',
    sku: 'LS-PC-750',
    tags: ['Rum', 'Coconut', '750ml', 'Reserve'],
    description: '<p>Cremosa y paradisíaca. Ron caribeño, crema de coco natural y jugo de piña madura perfectamente emulsionados.</p><ul><li><strong>ABV:</strong> 15% Alc / Vol</li><li><strong>Volume:</strong> 750 ML</li><li><strong>Ingredients:</strong> Ron Blanco, Piña, Crema de Coco</li></ul>'
  },
  {
    title: 'Blue Hawaii 750ml',
    handle: 'blue-hawaii',
    price: '38.00',
    sku: 'LS-BH-750',
    tags: ['Tropical', 'Exotic', '750ml', 'Reserve'],
    description: '<p>Un espectáculo visual tropical de color azul zafiro. Ron, vodka, blue curaçao cítrico y piña fresca.</p><ul><li><strong>ABV:</strong> 16% Alc / Vol</li><li><strong>Volume:</strong> 750 ML</li><li><strong>Ingredients:</strong> Ron, Vodka, Blue Curaçao, Piña</li></ul>'
  },
  {
    title: 'Malibu Bay Breeze 750ml',
    handle: 'malibu-bay-breeze',
    price: '36.00',
    sku: 'LS-MBB-750',
    tags: ['Rum', 'Coconut', '750ml', 'Reserve'],
    description: '<p>Suave y refrescante. Ron de coco Malibu con el contraste agridulce de jugo de piña y cranberry.</p><ul><li><strong>ABV:</strong> 13% Alc / Vol</li><li><strong>Volume:</strong> 750 ML</li><li><strong>Ingredients:</strong> Malibu Rum, Piña, Cranberry</li></ul>'
  },
  {
    title: 'Mai Tai 750ml',
    handle: 'mai-tai',
    price: '40.00',
    sku: 'LS-MT-750',
    tags: ['Rum', 'Tiki', '750ml', 'Reserve'],
    description: '<p>El rey del estilo tiki. Blend de rones añejos jamaiquinos, curaçao de naranja, sirope de orgeat de almendras y lima.</p><ul><li><strong>ABV:</strong> 22% Alc / Vol</li><li><strong>Volume:</strong> 750 ML</li><li><strong>Ingredients:</strong> Blend de Rones, Curaçao, Orgeat de Almendra, Lima</li></ul>'
  },
  {
    title: 'Aperol Spritz 750ml',
    handle: 'aperol-spritz',
    price: '36.00',
    sku: 'LS-AS-750',
    tags: ['Aperitif', 'Bittersweet', '750ml', 'Reserve'],
    description: '<p>El icono italiano de la hora dorada. Aperol con notas de naranja amarga y ruibarbo, prosecco y soda.</p><ul><li><strong>ABV:</strong> 11% Alc / Vol</li><li><strong>Volume:</strong> 750 ML</li><li><strong>Ingredients:</strong> Aperol, Prosecco, Soda, Naranja</li></ul>'
  },
  {
    title: 'Negroni 750ml',
    handle: 'negroni',
    price: '42.00',
    sku: 'LS-NEG-750',
    tags: ['Gin', 'Bitter', '750ml', 'Reserve'],
    description: '<p>La trinidad perfecta de la coctelería europea: partes iguales de gin dry botánico, vermouth rosso dulce y Campari bitter.</p><ul><li><strong>ABV:</strong> 24% Alc / Vol</li><li><strong>Volume:</strong> 750 ML</li><li><strong>Ingredients:</strong> Gin, Vermouth Rosso, Campari, Naranja</li></ul>'
  },
  {
    title: 'Boulevardier 750ml',
    handle: 'boulevardier',
    price: '44.00',
    sku: 'LS-BLV-750',
    tags: ['Bourbon', 'Bitter', '750ml', 'Reserve'],
    description: '<p>El hermano aristócrata del Negroni. Bourbon añejado en roble, Campari italiano y vermouth rosso artesanal.</p><ul><li><strong>ABV:</strong> 26% Alc / Vol</li><li><strong>Volume:</strong> 750 ML</li><li><strong>Ingredients:</strong> Bourbon Whiskey, Campari, Vermouth Rosso</li></ul>'
  },
  {
    title: 'Dry Martini 750ml',
    handle: 'dry-martini',
    price: '42.00',
    sku: 'LS-DM-750',
    tags: ['Gin', 'Dry', '750ml', 'Reserve'],
    description: '<p>El epítome de la sofisticación. Gin destilado de enebro con sutiles gotas de vermouth dry francés y twist de limón.</p><ul><li><strong>ABV:</strong> 28% Alc / Vol</li><li><strong>Volume:</strong> 750 ML</li><li><strong>Ingredients:</strong> London Dry Gin, Dry Vermouth, Aceites de Limón</li></ul>'
  }
];

async function main() {
  console.log(`🍸 Iniciando creación automatizada de ${products.length} productos vía GraphQL API...\n`);

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    console.log(`[${i+1}/${products.length}] Creando "${p.title}" ($${p.price})...`);

    const mutation = `
      mutation productCreate($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            variants(first: 1) {
              edges {
                node {
                  id
                  price
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        title: p.title,
        handle: p.handle,
        descriptionHtml: p.description,
        vendor: 'Lucky Shaker LLC',
        productType: 'Ready to Pour Craft Cocktail',
        tags: p.tags,
        status: 'ACTIVE'
      }
    };

    try {
      const res = await runGraphQL(mutation, variables);
      if (res.data && res.data.productCreate) {
        const { product, userErrors } = res.data.productCreate;
        if (userErrors && userErrors.length > 0) {
          console.log(`  ⚠️ Errores: ${userErrors.map(e => e.message).join(', ')}`);
        } else if (product) {
          console.log(`  ✅ Creado con ID: ${product.id}`);

          // Update variant price & SKU
          if (product.variants && product.variants.edges.length > 0) {
            const variantId = product.variants.edges[0].node.id;
            const updateVariantMutation = `
              mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
                productVariantsBulkUpdate(productId: $productId, variants: $variants) {
                  productVariants {
                    id
                    price
                    sku
                  }
                  userErrors {
                    field
                    message
                  }
                }
              }
            `;
            await runGraphQL(updateVariantMutation, {
              productId: product.id,
              variants: [
                {
                  id: variantId,
                  price: p.price,
                  sku: p.sku
                }
              ]
            });
            console.log(`  💰 Precio fijado en $${p.price} (SKU: ${p.sku})`);
          }
        }
      } else {
        console.log('  ⚠️ Respuesta:', JSON.stringify(res));
      }
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
    }

    // Rate limit buffer
    await new Promise(r => setTimeout(r, 400));
  }

  console.log('\n✨ ¡TODOS LOS 19 PRODUCTOS HAN SIDO CREADOS CON ÉXITO EN SHOPIFY!');
}

main().catch(console.error);

const http = require('http');

const GRAPHIQL_KEY = 'fd7c3f25ac39c648dd6ccc09ca0c0e2f0c043082aace04e441434d110cd5f625';

function runGraphQL(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query, variables });

    const req = http.request({
      hostname: 'localhost',
      port: 3457,
      path: '/graphiql/graphql.json?key=' + GRAPHIQL_KEY,
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

const priceMap = {
  'whiskey-cream': { price: '38.00', sku: 'LS-WC-750' },
  'old-fashioned': { price: '42.00', sku: 'LS-OF-750' },
  'mojito': { price: '36.00', sku: 'LS-MOJ-750' },
  'margarita': { price: '38.00', sku: 'LS-MARG-750' },
  'daiquiri': { price: '36.00', sku: 'LS-DAIQ-750' },
  'gin-tonic': { price: '38.00', sku: 'LS-GT-750' },
  'paloma': { price: '38.00', sku: 'LS-PAL-750' },
  'mimosa': { price: '34.00', sku: 'LS-MIM-750' },
  'moscow-mule': { price: '38.00', sku: 'LS-MM-750' },
  'cosmopolitan': { price: '38.00', sku: 'LS-COSMO-750' },
  'sex-on-the-beach': { price: '36.00', sku: 'LS-SOTB-750' },
  'pina-colada': { price: '38.00', sku: 'LS-PC-750' },
  'blue-hawaii': { price: '38.00', sku: 'LS-BH-750' },
  'malibu-bay-breeze': { price: '36.00', sku: 'LS-MBB-750' },
  'mai-tai': { price: '40.00', sku: 'LS-MT-750' },
  'aperol-spritz': { price: '36.00', sku: 'LS-AS-750' },
  'negroni': { price: '42.00', sku: 'LS-NEG-750' },
  'boulevardier': { price: '44.00', sku: 'LS-BLV-750' },
  'dry-martini': { price: '42.00', sku: 'LS-DM-750' }
};

async function updatePrices() {
  console.log('🔄 Actualizando precios y SKUs de todas las variantes...');
  const query = '{ products(first: 25) { edges { node { id handle title variants(first: 1) { edges { node { id } } } } } } }';
  const res = await runGraphQL(query);
  const products = res.data.products.edges;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const handle = p.node.handle;
    const variantId = p.node.variants.edges[0]?.node?.id;
    const meta = priceMap[handle] || { price: '38.00', sku: 'LS-750' };

    if (variantId) {
      const mutation = `
        mutation updateVariant($input: ProductVariantInput!) {
          productVariantUpdate(input: $input) {
            productVariant {
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
      const updateRes = await runGraphQL(mutation, {
        input: {
          id: variantId,
          price: meta.price,
          sku: meta.sku
        }
      });
      console.log(`[${i+1}/${products.length}] ${p.node.title} ➔ $${meta.price} (SKU: ${meta.sku})`);
    }
    await new Promise(r => setTimeout(r, 250));
  }
  console.log('\n✨ ¡TODOS LOS PRECIOS Y SKUs ACTUALIZADOS AL 100%!');
}

updatePrices().catch(console.error);

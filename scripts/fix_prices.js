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
  'whiskey-cream': '38.00',
  'old-fashioned': '42.00',
  'mojito': '36.00',
  'margarita': '38.00',
  'daiquiri': '36.00',
  'gin-tonic': '38.00',
  'paloma': '38.00',
  'mimosa': '34.00',
  'moscow-mule': '38.00',
  'cosmopolitan': '38.00',
  'sex-on-the-beach': '36.00',
  'pina-colada': '38.00',
  'blue-hawaii': '38.00',
  'malibu-bay-breeze': '36.00',
  'mai-tai': '40.00',
  'aperol-spritz': '36.00',
  'negroni': '42.00',
  'boulevardier': '44.00',
  'dry-martini': '42.00'
};

async function fixPrices() {
  const query = '{ products(first: 25) { edges { node { id handle title variants(first: 1) { edges { node { id price } } } } } } }';
  const res = await runGraphQL(query);
  const products = res.data.products.edges;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const prodId = p.node.id;
    const handle = p.node.handle;
    const vId = p.node.variants.edges[0]?.node?.id;
    const price = priceMap[handle] || '38.00';

    const mutation = `
      mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
          productVariants {
            id
            price
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const updateRes = await runGraphQL(mutation, {
      productId: prodId,
      variants: [
        {
          id: vId,
          price: price
        }
      ]
    });

    console.log(`[${i+1}/${products.length}] ${p.node.title} ➔ $${price}`, updateRes.data?.productVariantsBulkUpdate?.userErrors?.length ? updateRes.data.productVariantsBulkUpdate.userErrors : '✅ OK');
    await new Promise(r => setTimeout(r, 200));
  }
  console.log('\n✨ ¡TODOS LOS PRECIOS HAN SIDO FIJADOS CORRECTAMENTE!');
}

fixPrices().catch(console.error);

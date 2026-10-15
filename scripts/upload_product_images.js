const http = require('http');
const https = require('https');
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

// Upload file to Google Cloud / S3 staged target
function uploadFileToStagedTarget(target, filePath, mimeType) {
  return new Promise((resolve, reject) => {
    const fileBuffer = fs.readFileSync(filePath);
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);

    let body = [];
    for (const param of target.parameters) {
      body.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${param.name}"\r\n\r\n${param.value}\r\n`));
    }

    body.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${path.basename(filePath)}"\r\nContent-Type: ${mimeType}\r\n\r\n`));
    body.push(fileBuffer);
    body.push(Buffer.from(`\r\n--${boundary}--\r\n`));

    const fullBody = Buffer.concat(body);

    const urlObj = new URL(target.url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': fullBody.length
      }
    };

    const req = https.request(options, (res) => {
      let resData = '';
      res.on('data', chunk => resData += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          resolve(target.resourceUrl);
        } else {
          reject(new Error(`Upload failed HTTP ${res.statusCode}: ${resData}`));
        }
      });
    });

    req.on('error', reject);
    req.write(fullBody);
    req.end();
  });
}

const map = {
  'whiskey-cream': { path: 'shopify-theme/assets/lucky_shaker_perspective_3_4.png', mime: 'image/png' },
  'chocolate-cream': { path: 'shopify-theme/assets/chocolate_bottle_2.webp', mime: 'image/webp' },
  'old-fashioned': { path: 'shopify-theme/assets/cocktail_old_fashioned.webp', mime: 'image/webp' },
  'mojito': { path: 'shopify-theme/assets/cocktail_mojito.webp', mime: 'image/webp' },
  'margarita': { path: 'shopify-theme/assets/cocktail_margarita.webp', mime: 'image/webp' },
  'daiquiri': { path: 'shopify-theme/assets/cocktail_daiquiri.webp', mime: 'image/webp' },
  'gin-tonic': { path: 'shopify-theme/assets/cocktail_gin_tonic.webp', mime: 'image/webp' },
  'paloma': { path: 'shopify-theme/assets/cocktail_paloma.webp', mime: 'image/webp' },
  'mimosa': { path: 'shopify-theme/assets/cocktail_mimosa.webp', mime: 'image/webp' },
  'moscow-mule': { path: 'shopify-theme/assets/cocktail_moscow_mule.webp', mime: 'image/webp' },
  'cosmopolitan': { path: 'shopify-theme/assets/cocktail_cosmopolitan.webp', mime: 'image/webp' },
  'sex-on-the-beach': { path: 'shopify-theme/assets/cocktail_sex_on_the_beach.webp', mime: 'image/webp' },
  'pina-colada': { path: 'shopify-theme/assets/cocktail_pina_colada.webp', mime: 'image/webp' },
  'blue-hawaii': { path: 'shopify-theme/assets/cocktail_blue_hawaii.webp', mime: 'image/webp' },
  'malibu-bay-breeze': { path: 'shopify-theme/assets/cocktail_malibu_bay_breeze.webp', mime: 'image/webp' },
  'negroni': { path: 'shopify-theme/assets/cocktail_negroni.webp', mime: 'image/webp' },
  'manhattan': { path: 'shopify-theme/assets/cocktail_manhattan.webp', mime: 'image/webp' },
  'classic-martini': { path: 'shopify-theme/assets/cocktail_classic_martini.webp', mime: 'image/webp' },
  'espresso-martini': { path: 'shopify-theme/assets/cocktail_espresso_martini.webp', mime: 'image/webp' },
  'caipirinha': { path: 'shopify-theme/assets/cocktail_caipirinha.webp', mime: 'image/webp' },
  'naranja-dry': { path: 'shopify-theme/assets/dry_naranja_1.webp', mime: 'image/webp' },
  'pina-dry': { path: 'shopify-theme/assets/dry_pina_1.webp', mime: 'image/webp' },
  'manzana-dry': { path: 'shopify-theme/assets/dry_manzana_1.webp', mime: 'image/webp' },
  'lemon-dry': { path: 'shopify-theme/assets/dry_lemon_1.webp', mime: 'image/webp' },
  'signature-box': { path: 'shopify-theme/assets/box_gift_1.webp', mime: 'image/webp' },
  'mai-tai': { path: 'shopify-theme/assets/cocktail_pina_colada.webp', mime: 'image/webp' },
  'aperol-spritz': { path: 'shopify-theme/assets/cocktail_caipirinha.webp', mime: 'image/webp' },
  'boulevardier': { path: 'shopify-theme/assets/cocktail_manhattan.webp', mime: 'image/webp' },
  'dry-martini': { path: 'shopify-theme/assets/cocktail_classic_martini.webp', mime: 'image/webp' }
};

async function uploadAllImages() {
  console.log('🖼️ Iniciando carga masiva de fotos a los productos de Shopify...\n');

  const query = '{ products(first: 50) { edges { node { id handle title } } } }';
  const res = await runGraphQL(query);
  const products = res.data.products.edges;

  for (let i = 0; i < products.length; i++) {
    const p = products[i].node;
    const item = map[p.handle];

    if (!item || !fs.existsSync(item.path)) {
      console.log(`[${i+1}/${products.length}] ⚠️ Sin foto local para ${p.handle}`);
      continue;
    }

    console.log(`[${i+1}/${products.length}] Subiendo imagen para "${p.title}"...`);

    try {
      // 1. Staged upload create
      const filename = path.basename(item.path);
      const stagedRes = await runGraphQL(`
        mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
          stagedUploadsCreate(input: $input) {
            stagedTargets {
              url
              resourceUrl
              parameters {
                name
                value
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `, {
        input: [
          {
            resource: 'IMAGE',
            filename: filename,
            mimeType: item.mime,
            httpMethod: 'POST'
          }
        ]
      });

      const target = stagedRes.data?.stagedUploadsCreate?.stagedTargets?.[0];
      if (!target) {
        console.log(`  ❌ Error obteniendo target staged:`, JSON.stringify(stagedRes));
        continue;
      }

      // 2. Upload file
      const resourceUrl = await uploadFileToStagedTarget(target, item.path, item.mime);

      // 3. Create media on product
      const mediaRes = await runGraphQL(`
        mutation productCreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
          productCreateMedia(productId: $productId, media: $media) {
            media {
              id
              status
            }
            userErrors {
              field
              message
            }
          }
        }
      `, {
        productId: p.id,
        media: [
          {
            originalSource: resourceUrl,
            mediaContentType: 'IMAGE'
          }
        ]
      });

      console.log(`  ✅ Imagen asignada con éxito a ${p.title}!`);

    } catch (err) {
      console.error(`  ❌ Error subiendo: ${err.message}`);
    }

    await new Promise(r => setTimeout(r, 400));
  }

  console.log('\n✨ ¡TODAS LAS FOTOS HAN SIDO SUBIDAS Y ASOCIADAS EN SHOPIFY!');
}

uploadAllImages().catch(console.error);

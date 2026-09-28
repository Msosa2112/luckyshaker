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
  'whiskey-cream': { path: 'renders/lucky_shaker_perspective_3_4.png', mime: 'image/png' },
  'old-fashioned': { path: 'Media/cocteles/Old Fashioned.jpg', mime: 'image/jpeg' },
  'mojito': { path: 'Media/cocteles/Mojito_cocktail_product_catalog_…_4K_20260927012856.jpg', mime: 'image/jpeg' },
  'margarita': { path: 'Media/cocteles/Margarita.jpg', mime: 'image/jpeg' },
  'daiquiri': { path: 'Media/cocteles/Daiquiri.jpg', mime: 'image/jpeg' },
  'gin-tonic': { path: 'Media/cocteles/Gin & tonic.jpg', mime: 'image/jpeg' },
  'paloma': { path: 'Media/cocteles/Paloma.jpg', mime: 'image/jpeg' },
  'mimosa': { path: 'Media/cocteles/Mimosa.jpg', mime: 'image/jpeg' },
  'moscow-mule': { path: 'Media/cocteles/Moscow Mule.jpg', mime: 'image/jpeg' },
  'cosmopolitan': { path: 'Media/cocteles/Cosmopolitan.jpg', mime: 'image/jpeg' },
  'sex-on-the-beach': { path: 'Media/cocteles/Sex on the Beach.jpg', mime: 'image/jpeg' },
  'pina-colada': { path: 'Media/cocteles/Piña Colada.jpg', mime: 'image/jpeg' },
  'blue-hawaii': { path: 'Media/cocteles/Blue Hawaii.jpg', mime: 'image/jpeg' },
  'malibu-bay-breeze': { path: 'Media/cocteles/Malibu By Breeze.jpg', mime: 'image/jpeg' },
  'mai-tai': { path: 'Media/cocteles/Mai Tai.jpg', mime: 'image/jpeg' },
  'aperol-spritz': { path: 'Media/cocteles/Caipiriña.jpg', mime: 'image/jpeg' },
  'negroni': { path: 'Media/cocteles/Negroni.jpg', mime: 'image/jpeg' },
  'boulevardier': { path: 'Media/cocteles/Manhattan.jpg', mime: 'image/jpeg' },
  'dry-martini': { path: 'Media/cocteles/Espresso Martini.jpg', mime: 'image/jpeg' }
};

async function uploadAllImages() {
  console.log('🖼️ Iniciando carga masiva de fotos a los productos de Shopify...\n');

  const query = '{ products(first: 25) { edges { node { id handle title } } } }';
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

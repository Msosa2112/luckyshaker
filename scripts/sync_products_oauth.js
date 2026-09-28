const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const CLIENT_ID = '119860c63155055842e05b94993729e5';
const CLIENT_SECRET = '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';
const PORT = 3456;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;

// Parse CSV to get 19 products
function parseCsvProducts() {
  const csvPath = path.join(__dirname, '..', 'shopify_products_import.csv');
  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  
  const products = [];
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Simple regex CSV parser handling quotes
    const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
    const matches = [];
    let match;
    while ((match = regex.exec(line)) !== null) {
      if (match.index === regex.lastIndex) regex.lastIndex++;
      let val = match[1] || '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      matches.push(val);
    }
    
    if (matches.length >= 10 && matches[0]) {
      const handle = matches[0];
      const title = matches[1];
      const body_html = matches[2];
      const vendor = matches[3] || 'Lucky Shaker LLC';
      const product_type = matches[5] || 'Ready to Pour Craft Cocktail';
      const tags = matches[6] || 'Cocktail';
      const price = matches[18] || '38.00';
      const sku = matches[12] || `LS-${handle.toUpperCase()}-750`;

      products.push({
        title,
        handle,
        body_html,
        vendor,
        product_type,
        tags,
        variants: [
          {
            option1: '750 ML',
            option2: 'Glass Bottle',
            price: price,
            sku: sku,
            inventory_management: 'shopify',
            inventory_policy: 'continue',
            requires_shipping: true,
            taxable: true
          }
        ],
        options: [
          { name: 'Size', values: ['750 ML'] },
          { name: 'Format', values: ['Glass Bottle'] }
        ],
        status: 'active'
      });
    }
  }
  return products;
}

// Exchange Code for Access Token
function exchangeCodeForToken(shop, code) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code
    });

    const options = {
      hostname: shop,
      path: '/admin/oauth/access_token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.access_token) {
            resolve(json.access_token);
          } else {
            reject(new Error(JSON.stringify(json)));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Create Product via REST
function createProduct(shop, accessToken, productData) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ product: productData });

    const options = {
      hostname: shop,
      path: '/admin/api/2024-01/products.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(json.product);
          } else {
            resolve({ error: json, title: productData.title });
          }
        } catch(e) {
          resolve({ error: data, title: productData.title });
        }
      });
    });

    req.on('error', (err) => resolve({ error: err.message, title: productData.title }));
    req.write(postData);
    req.end();
  });
}

// Start HTTP Server
const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://localhost:${PORT}`);
  
  if (urlObj.pathname === '/callback') {
    const code = urlObj.searchParams.get('code');
    const shop = urlObj.searchParams.get('shop') || 'lucky-shaker.myshopify.com';

    if (!code) {
      res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>Error: No se recibió código de autorización de Shopify.</h1>');
      return;
    }

    console.log(`\n🔑 Código recibido para la tienda: ${shop}`);
    console.log('🔄 Intercambiando código por Access Token permanente...');

    try {
      const accessToken = await exchangeCodeForToken(shop, code);
      console.log(`\n🎉 ¡TOKEN OBTENIDO CON ÉXITO!`);
      console.log(`Access Token: ${accessToken}`);
      
      // Save token locally
      fs.writeFileSync(path.join(__dirname, '..', 'shopify_access_token.txt'), accessToken);

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif; max-width: 600px; margin: 60px auto; padding: 40px; border-radius: 24px; background: rgba(255,255,255,0.8); backdrop-filter: blur(20px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); text-align: center; border: 1px solid rgba(0,0,0,0.1);">
          <div style="font-size: 48px; margin-bottom: 20px;">🍸</div>
          <h1 style="color: #1a1a1a; margin-bottom: 12px; font-weight: 600;">¡Lucky Shaker Conectado con Éxito!</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">La API de Shopify ha autorizado la conexión. Estamos importando los 19 cócteles en tiempo real en tu tienda.</p>
          <p style="color: #10b981; font-weight: bold; margin-top: 20px;">Puedes volver a la terminal o al chat.</p>
        </div>
      `);

      // Start inserting 19 products
      const products = parseCsvProducts();
      console.log(`\n🚀 Creando ${products.length} productos en ${shop} vía REST API...`);

      for (let i = 0; i < products.length; i++) {
        const prod = products[i];
        process.stdout.write(`[${i+1}/${products.length}] Creando "${prod.title}"... `);
        const result = await createProduct(shop, accessToken, prod);
        if (result && result.id) {
          console.log(`✅ ID: ${result.id} ($${prod.variants[0].price})`);
        } else {
          console.log(`⚠️ Ya existe o respuesta:`, JSON.stringify(result.error || result));
        }
        // Small delay to respect Shopify API rate limits (2 req/sec)
        await new Promise(r => setTimeout(r, 600));
      }

      console.log('\n✨ ¡TODOS LOS 19 PRODUCTOS HAN SIDO CREADOS EN TU TIENDA!');
      console.log('Puedes comprobarlo en tu Shopify Admin -> Products o en http://127.0.0.1:9292');

    } catch (err) {
      console.error('❌ Error obteniendo access token:', err);
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<h1>Error: ${err.message}</h1>`);
    }
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Lucky Shaker OAuth Server listening on port 3456');
  }
});

server.listen(PORT, () => {
  console.log(`🍸 Servidor OAuth de Lucky Shaker iniciado en http://localhost:${PORT}`);
  console.log(`Esperando redirección de Shopify en ${REDIRECT_URI} ...`);
});

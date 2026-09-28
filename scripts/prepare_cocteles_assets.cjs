const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = path.join(__dirname, '..', 'assets', 'cocteles');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const map = [
  { name: 'margarita.jpg', src: 'Media/cocteles/Margarita.jpg' },
  { name: 'mojito.jpg', src: 'Media/cocteles/Mojito_cocktail_product_catalog_…_4K_20260927012856.jpg' },
  { name: 'daiquiri.jpg', src: 'Media/cocteles/Daiquiri.jpg' },
  { name: 'gin-tonic.jpg', src: 'Media/cocteles/Gin & tonic.jpg' },
  { name: 'paloma.jpg', src: 'Media/cocteles/Paloma.jpg' },
  { name: 'mimosa.jpg', src: 'Media/cocteles/Mimosa.jpg' },
  { name: 'moscow-mule.jpg', src: 'Media/cocteles/Moscow Mule.jpg' },
  { name: 'cosmopolitan.jpg', src: 'Media/cocteles/Cosmopolitan.jpg' },
  { name: 'sex-on-the-beach.jpg', src: 'Media/cocteles/Sex on the Beach.jpg' },
  { name: 'pina-colada.jpg', src: 'Media/cocteles/Piña Colada.jpg' },
  { name: 'blue-hawaii.jpg', src: 'Media/cocteles/Blue Hawaii.jpg' },
  { name: 'malibu-bay-breeze.jpg', src: 'Media/cocteles/Malibu By Breeze.jpg' },
  { name: 'negroni.jpg', src: 'Media/cocteles/Negroni.jpg' },
  { name: 'old-fashioned.jpg', src: 'Media/cocteles/Old Fashioned.jpg' },
  { name: 'manhattan.jpg', src: 'Media/cocteles/Manhattan.jpg' },
  { name: 'classic-martini.jpg', src: 'Media/cocteles/Daiquiri.jpg' },
  { name: 'espresso-martini.jpg', src: 'Media/cocteles/Espresso Martini.jpg' },
  { name: 'caipirinha.jpg', src: 'Media/cocteles/Caipiriña.jpg' }
];

for (const item of map) {
  const destPath = path.join(targetDir, item.name);
  const srcPath = path.join(__dirname, '..', item.src);
  if (fs.existsSync(srcPath)) {
    try {
      execSync(`ffmpeg -y -i "${srcPath}" -vf "scale=800:800:force_original_aspect_ratio=decrease,pad=800:800:(ow-iw)/2:(oh-ih)/2:color=white" -q:v 2 "${destPath}"`, { stdio: 'ignore' });
      console.log(`Generated: ${item.name} (${fs.statSync(destPath).size} bytes)`);
    } catch (e) {
      console.error(`Failed ${item.name}:`, e.message);
    }
  } else {
    console.warn(`Source not found: ${srcPath}`);
  }
}

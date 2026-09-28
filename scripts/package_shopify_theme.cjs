const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const shopifyThemeDir = path.join(rootDir, 'shopify-theme');
const assetsDir = path.join(shopifyThemeDir, 'assets');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

console.log('Building Shopify theme assets...');

// 1. Combine CSS
const styleCss = fs.readFileSync(path.join(rootDir, 'css', 'style.css'), 'utf8');
const pagesCss = fs.readFileSync(path.join(rootDir, 'css', 'pages.css'), 'utf8');

const combinedCss = `/* ==========================================================================
   LUCKY SHAKER BARTENDER — SHOPIFY THEME MASTER CSS
   Auto-compiled from css/style.css and css/pages.css
   ========================================================================== */

${styleCss}

/* ==========================================================================
   PAGE-SPECIFIC EXTENSIONS
   ========================================================================== */
${pagesCss}
`;

fs.writeFileSync(path.join(assetsDir, 'lucky-shaker.css'), combinedCss, 'utf8');
console.log('Wrote updated lucky-shaker.css (' + Buffer.byteLength(combinedCss, 'utf8') + ' bytes)');

// 2. Copy posters to assets/
const postersDir = path.join(rootDir, 'assets', 'posters');
if (fs.existsSync(postersDir)) {
  fs.readdirSync(postersDir).forEach(file => {
    const src = path.join(postersDir, file);
    const dest = path.join(assetsDir, file);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
      console.log(`Copied poster: ${file}`);
    }
  });
}

// 3. Copy cocktail images to assets/
const coctelesDir = path.join(rootDir, 'assets', 'cocteles');
if (fs.existsSync(coctelesDir)) {
  fs.readdirSync(coctelesDir).forEach(file => {
    const src = path.join(coctelesDir, file);
    const dest = path.join(assetsDir, file);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
      console.log(`Copied cocktail img: ${file}`);
    }
  });
}

// 4. Copy essential image assets
const assetFilesToCopy = [
  'lucky_shaker_glass_icon.png',
  'lucky_shaker_logo_light_theme.png',
  'logo_lucky_shaker.svg',
  'by_katherin_crop.png',
  'katherin_isolated.png'
];

assetFilesToCopy.forEach(file => {
  const src = path.join(rootDir, 'assets', file);
  const dest = path.join(assetsDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied assets/${file} -> shopify-theme/assets/${file}`);
  }
});

// 4.6 Copy WebP sequence frames
const frameMappings = [
  { folder: 'assets/frames/whiskey_scroll', prefix: 'frame-wc-' },
  { folder: 'assets/frames/whiskey_scroll_mobile', prefix: 'frame-wc-m-' },
  { folder: 'assets/frames/old_fashioned_desktop', prefix: 'frame-of-' },
  { folder: 'assets/frames/old_fashioned_mobile', prefix: 'frame-of-m-' },
  { folder: 'assets/frames/mojito_desktop', prefix: 'frame-mojito-' },
  { folder: 'assets/frames/mojito_mobile', prefix: 'frame-mojito-m-' }
];

let totalFramesCopied = 0;
frameMappings.forEach(m => {
  const folderPath = path.join(rootDir, m.folder);
  if (fs.existsSync(folderPath)) {
    const files = fs.readdirSync(folderPath);
    files.forEach(file => {
      const numMatch = file.match(/(\d+)\.webp$/);
      if (numMatch) {
        const destName = m.prefix + numMatch[1] + '.webp';
        fs.copyFileSync(path.join(folderPath, file), path.join(assetsDir, destName));
        totalFramesCopied++;
      }
    });
  }
});
console.log(`Copied ${totalFramesCopied} WebP sequence frames into shopify-theme/assets/`);

// 5. Create zip package via staging directory
const zipPath = path.join(rootDir, 'lucky-shaker-shopify-theme.zip');
const tempStagingDir = path.join(rootDir, '.theme_staging');

if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

if (fs.existsSync(tempStagingDir)) {
  fs.rmSync(tempStagingDir, { recursive: true, force: true });
}

try {
  console.log('Staging files for compression...');
  fs.cpSync(shopifyThemeDir, tempStagingDir, { recursive: true });

  console.log('Packaging zip with PowerShell Compress-Archive...');
  const psCmd = `Compress-Archive -Path '${tempStagingDir}\\*' -DestinationPath '${zipPath}' -Force`;
  execSync(`powershell -NoProfile -Command "${psCmd}"`, { stdio: 'inherit' });
  console.log(`Successfully created ${zipPath}`);
  
  // Cleanup staging
  fs.rmSync(tempStagingDir, { recursive: true, force: true });
} catch (e) {
  console.error('Error creating zip:', e);
}

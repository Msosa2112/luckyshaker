const fs = require('fs');

let svg = fs.readFileSync('Media/LOGO LUCKY SHAKER.svg', 'utf8');

// Remove external stylesheet reference
svg = svg.replace(/<\?xml-stylesheet[^>]*\?>\s*/g, '');

// Insert defs with style right after <svg ...>
const styleDef = '<defs><style type="text/css">.fil0 { fill: #CD156A; } .fil1 { fill: #201E1E; } .fil2 { fill: #201E1E; fill-rule: nonzero; }</style></defs>';
svg = svg.replace(/(<svg[^>]*>)/i, '$1\n  ' + styleDef);

fs.writeFileSync('assets/logo_lucky_shaker.svg', svg, 'utf8');
console.log('Saved assets/logo_lucky_shaker.svg successfully!');

// White text version for dark backdrops
let whiteSvg = svg.replace('.fil1 { fill: #201E1E; } .fil2 { fill: #201E1E; fill-rule: nonzero; }', '.fil1 { fill: #FFFFFF; } .fil2 { fill: #FFFFFF; fill-rule: nonzero; }');
whiteSvg = whiteSvg.replace('.fil0 { fill: #CD156A; }', '.fil0 { fill: #E82B7D; }');
fs.writeFileSync('assets/logo_lucky_shaker_white.svg', whiteSvg, 'utf8');
console.log('Saved assets/logo_lucky_shaker_white.svg successfully!');

// Also copy original SVG and CSS into assets
fs.copyFileSync('Media/LOGO LUCKY SHAKER.svg', 'assets/LOGO LUCKY SHAKER.svg');
fs.copyFileSync('Media/LOGO LUCKY SHAKER.css', 'assets/LOGO LUCKY SHAKER.css');
console.log('Copied raw Media files to assets/ as well!');

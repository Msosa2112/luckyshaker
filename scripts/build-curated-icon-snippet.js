const fs = require('fs');

const fileContent = fs.readFileSync('lib/cojeev/lucide-icon-data.ts', 'utf8');
const startToken = 'const pack:Record<string,[string,Record<string,string>][]>=';
const startIdx = fileContent.indexOf(startToken);
const jsonStart = startIdx + startToken.length;
const endToken = ';\nexport function getLucideIcon';
const endIdx = fileContent.indexOf(endToken, jsonStart);
const jsonString = endIdx === -1 ? fileContent.slice(jsonStart).replace(/;[\s\S]*$/, '') : fileContent.slice(jsonStart, endIdx);

const lucide = JSON.parse(jsonString);

// Additional Cojeev additions & aliases
lucide['shopping-bag'] = [
  ['path', { d: 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z' }],
  ['path', { d: 'M3 6h18' }],
  ['path', { d: 'M16 10a4 4 0 0 1-8 0' }]
];
lucide['close'] = [
  ['path', { d: 'M18 6 6 18' }],
  ['path', { d: 'm6 6 12 12' }]
];
lucide['filter'] = [
  ['path', { d: 'M3 4h18l-7 8v7l-4 2v-9L3 4Z' }]
];
lucide['circle-help'] = [
  ['circle', { cx: '12', cy: '12', r: '10' }],
  ['path', { d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' }],
  ['line', { x1: '12', x2: '12.01', y1: '17', y2: '17' }]
];
lucide['alert-triangle'] = [
  ['path', { d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z' }],
  ['line', { x1: '12', x2: '12', y1: '9', y2: '13' }],
  ['line', { x1: '12', x2: '12.01', y1: '17', y2: '17' }]
];
lucide['sliders'] = [
  ['line', { x1: '4', x2: '4', y1: '21', y2: '14' }],
  ['line', { x1: '4', x2: '4', y1: '10', y2: '3' }],
  ['line', { x1: '12', x2: '12', y1: '21', y2: '12' }],
  ['line', { x1: '12', x2: '12', y1: '8', y2: '3' }],
  ['line', { x1: '20', x2: '20', y1: '21', y2: '16' }],
  ['line', { x1: '20', x2: '20', y1: '12', y2: '3' }],
  ['line', { x1: '1', x2: '7', y1: '14', y2: '14' }],
  ['line', { x1: '9', x2: '15', y1: '8', y2: '8' }],
  ['line', { x1: '17', x2: '23', y1: '16', y2: '16' }]
];
lucide['bar-chart-3'] = [
  ['line', { x1: '12', x2: '12', y1: '20', y2: '10' }],
  ['line', { x1: '18', x2: '18', y1: '20', y2: '4' }],
  ['line', { x1: '6', x2: '6', y1: '20', y2: '16' }]
];

const curatedList = [
  'shopping-bag', 'shopping-cart', 'x', 'close', 'menu', 'search',
  'arrow-right', 'arrow-left', 'arrow-up', 'arrow-down', 'arrow-up-right',
  'chevron-right', 'chevron-left', 'chevron-up', 'chevron-down',
  'check', 'circle-check', 'plus', 'minus', 'trash-2', 'trash',
  'shield-check', 'shield', 'lock', 'package', 'truck',
  'sparkles', 'sparkle', 'star', 'award', 'crown', 'gem', 'flame',
  'wine', 'glass-water', 'party-popper', 'heart',
  'calendar', 'clock', 'timer',
  'mail', 'phone', 'map-pin', 'instagram', 'message-circle', 'send', 'share-2',
  'credit-card', 'dollar-sign', 'tag', 'gift', 'wallet',
  'info', 'circle-help', 'triangle-alert', 'alert-triangle', 'loader', 'refresh-cw',
  'eye', 'eye-off', 'filter', 'sliders', 'settings', 'copy', 'external-link',
  'download', 'upload', 'user', 'users', 'user-plus', 'play', 'pause', 'volume-2', 'volume-x',
  'globe', 'compass', 'leaf', 'camera', 'bookmark', 'code', 'database', 'layout-grid',
  'smartphone', 'monitor', 'sun', 'moon', 'zap', 'trending-up', 'trending-down', 'bar-chart-3'
];

const uniqueIcons = Array.from(new Set(curatedList));

function renderSvgChildren(nodes) {
  return nodes.map(([tag, attrs]) => {
    const attrStr = Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ');
    if (tag === 'line' || tag === 'circle' || tag === 'polyline' || tag === 'polygon' || tag === 'rect' || tag === 'path' || tag === 'ellipse') {
      return `<${tag} ${attrStr} />`;
    }
    return `<${tag} ${attrStr}></${tag}>`;
  }).join('');
}

const liquidCases = [];
uniqueIcons.forEach(name => {
  const nodes = lucide[name];
  if (nodes) {
    liquidCases.push(`  {% when '${name}' %}\n    ${renderSvgChildren(nodes)}`);
  }
});

const liquidSnippet = `{% comment %}
  Lucky Shaker / Cojeev Luxury Icons
  Usage: {% render 'icon', name: 'shopping-bag', size: 20, class: 'nav-cart-icon' %}
{% endcomment %}
{%- assign icon_size = size | default: 20 -%}
{%- assign icon_stroke = stroke_width | default: 1.8 -%}
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="{{ icon_size }}"
  height="{{ icon_size }}"
  viewBox="0 0 24 24"
  fill="{{ fill | default: 'none' }}"
  stroke="{{ stroke | default: 'currentColor' }}"
  stroke-width="{{ icon_stroke }}"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="cojeev-icon cojeev-icon-{{ name }}{% if class %} {{ class }}{% endif %}"
  aria-hidden="true"
  focusable="false"
  {{ attributes }}
>
{%- case name -%}
${liquidCases.join('\n')}
  {%- else -%}
    <!-- Icon {{ name }} not matched in curated pack -->
{%- endcase -%}
</svg>
`;

fs.writeFileSync('shopify-theme/snippets/icon.liquid', liquidSnippet, 'utf8');
const stat = fs.statSync('shopify-theme/snippets/icon.liquid');
console.log(`Successfully generated shopify-theme/snippets/icon.liquid with ${uniqueIcons.length} icons (${(stat.size / 1024).toFixed(2)} KB)!`);

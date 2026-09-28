const fs = require('fs');

const fileContent = fs.readFileSync('lib/cojeev/lucide-icon-data.ts', 'utf8');
const startToken = 'const pack:Record<string,[string,Record<string,string>][]>=';
const startIdx = fileContent.indexOf(startToken);
if (startIdx === -1) {
  console.error('startToken not found');
  process.exit(1);
}

const jsonStart = startIdx + startToken.length;
const endToken = ';\nexport function getLucideIcon';
const endIdx = fileContent.indexOf(endToken, jsonStart);
const jsonString = endIdx === -1 ? fileContent.slice(jsonStart).replace(/;[\s\S]*$/, '') : fileContent.slice(jsonStart, endIdx);

const lucide = JSON.parse(jsonString);

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
for (const [name, nodes] of Object.entries(lucide)) {
  liquidCases.push(`  {% when '${name}' %}\n    ${renderSvgChildren(nodes)}`);
}

const liquidSnippet = `{% comment %}
  Cojeev / Lucide Icon Snippet
  Usage: {% render 'icon', name: 'shopping-bag', class: 'custom-class', size: 20 %}
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
    <!-- Icon {{ name }} not found -->
{%- endcase -%}
</svg>
`;

fs.writeFileSync('shopify-theme/snippets/icon.liquid', liquidSnippet, 'utf8');
console.log(`Successfully generated shopify-theme/snippets/icon.liquid with ${Object.keys(lucide).length} icons!`);

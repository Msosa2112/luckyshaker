const fs = require('fs');

function replaceFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    console.log('Skipping non-existent:', filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = 0;
  for (const { from, to } of replacements) {
    if (content.includes(from)) {
      content = content.replace(from, to);
      changed++;
    } else {
      console.warn(`Pattern not found in ${filePath}:`, from.slice(0, 50));
    }
  }
  if (changed > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${changed} icons in ${filePath}`);
  }
}

// 1. home-brand-story.liquid
replaceFile('shopify-theme/sections/home-brand-story.liquid', [
  {
    from: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 7h12M8 2l5 5-5 5"/>
            </svg>`,
    to: `{% render 'icon', name: 'arrow-right', size: 14, stroke_width: 2 %}`
  },
  {
    from: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>`,
    to: `{% render 'icon', name: 'sparkles', size: 22, stroke_width: 1.8 %}`
  },
  {
    from: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>`,
    to: `{% render 'icon', name: 'shield-check', size: 22, stroke_width: 1.8 %}`
  },
  {
    from: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>`,
    to: `{% render 'icon', name: 'award', size: 22, stroke_width: 1.8 %}`
  }
]);

// 2. home-final-cta.liquid
replaceFile('shopify-theme/sections/home-final-cta.liquid', [
  {
    from: `<svg class="btn-arrow" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M1 7h12M8 2l5 5-5 5"/>
      </svg>`,
    to: `{% render 'icon', name: 'arrow-right', size: 14, class: 'btn-arrow', stroke_width: 1.8 %}`
  }
]);

// 3. main-footer.liquid
replaceFile('shopify-theme/sections/main-footer.liquid', [
  {
    from: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>`,
    to: `{% render 'icon', name: 'arrow-right', size: 14, stroke_width: 2 %}`
  }
]);

// 4. main-page-contact.liquid
replaceFile('shopify-theme/sections/main-page-contact.liquid', [
  {
    from: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>`,
    to: `{% render 'icon', name: 'mail', size: 20, stroke_width: 1.8 %}`
  },
  {
    from: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>`,
    to: `{% render 'icon', name: 'phone', size: 20, stroke_width: 1.8 %}`
  },
  {
    from: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>`,
    to: `{% render 'icon', name: 'map-pin', size: 20, stroke_width: 1.8 %}`
  },
  {
    from: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>`,
    to: `{% render 'icon', name: 'clock', size: 20, stroke_width: 1.8 %}`
  },
  {
    from: `<svg class="btn-arrow" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M1 7h12M8 2l5 5-5 5"/>
          </svg>`,
    to: `{% render 'icon', name: 'arrow-right', size: 14, class: 'btn-arrow', stroke_width: 1.8 %}`
  }
]);

// 5. event-hero.liquid
replaceFile('shopify-theme/sections/event-hero.liquid', [
  {
    from: `<svg class="btn-arrow" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 7h12M8 2l5 5-5 5"/>
        </svg>`,
    to: `{% render 'icon', name: 'arrow-right', size: 14, class: 'btn-arrow', stroke_width: 2 %}`
  },
  {
    from: `<svg class="btn-arrow" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" style="margin-left: 0.35rem;">
          <path d="M1 7h12M8 2l5 5-5 5"/>
        </svg>`,
    to: `{% render 'icon', name: 'arrow-right', size: 14, class: 'btn-arrow', stroke_width: 1.8, style: 'margin-left: 0.35rem;' %}`
  },
  {
    from: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E82B7D" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    to: `{% render 'icon', name: 'shield-check', size: 18, stroke: '#E82B7D', stroke_width: 2 %}`
  },
  {
    from: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E82B7D" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    to: `{% render 'icon', name: 'clock', size: 18, stroke: '#E82B7D', stroke_width: 2 %}`
  },
  {
    from: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E82B7D" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
    to: `{% render 'icon', name: 'star', size: 18, stroke: '#E82B7D', stroke_width: 2 %}`
  }
]);

// 6. event-booking-form.liquid
replaceFile('shopify-theme/sections/event-booking-form.liquid', [
  {
    from: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    to: `{% render 'icon', name: 'circle-check', size: 24, stroke: '#10B981', stroke_width: 2.5 %}`
  },
  {
    from: `<svg class="btn-arrow" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 7h12M8 2l5 5-5 5"/></svg>`,
    to: `{% render 'icon', name: 'arrow-right', size: 14, class: 'btn-arrow', stroke_width: 2 %}`
  },
  {
    from: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    to: `{% render 'icon', name: 'shield-check', size: 15, stroke: '#10B981', stroke_width: 2.2 %}`
  }
]);

console.log('Update finished!');

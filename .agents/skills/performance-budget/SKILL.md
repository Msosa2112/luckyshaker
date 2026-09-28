---
name: performance-budget
description: Core Web Vitals optimization, Largest Contentful Paint (LCP < 1.2s), Cumulative Layout Shift (CLS 0), Interaction to Next Paint (INP < 50ms), asset priority hints, and content-visibility.
metadata:
  priority: 8
  pathPatterns:
    - "**/*.html"
    - "**/*.css"
    - "**/*.js"
---

# Performance Budget & Core Web Vitals

Architectural standards for instant loading, silky responsiveness, and zero visual layout shifts.

## 1. Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: $< 1.2\text{s}$ on 4G networks.
  - Priority hint on initial hero frame: `<link rel="preload" as="image" href="..." fetchpriority="high">`
- **CLS (Cumulative Layout Shift)**: $0.000$ (Zero shift).
  - Explicit aspect ratios on all visual containers (`aspect-ratio: 4 / 5;`, `aspect-ratio: 16 / 9;`).
  - Reserve height for sticky navigation bars and pinned viewport stacks.
- **INP (Interaction to Next Paint)**: $< 50\text{ms}$.
  - Offload long tasks from input handlers; use `requestAnimationFrame` for scroll/draw orchestration.

## 2. Rendering Optimizations
- **`content-visibility: auto;`**: Apply to non-critical below-the-fold sections (`#shop`, `#story`, `footer`):
  ```css
  .shop-section,
  .brand-story-section,
  .luxury-footer {
    content-visibility: auto;
    contain-intrinsic-size: 1000px;
  }
  ```
- **Asynchronous Image Decoding**:
  ```html
  <img src="..." loading="lazy" decoding="async" alt="...">
  ```

## 3. Font Loading Strategy
- Preconnect to Google Fonts:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  ```
- Use `display=swap` parameter on font URLs to avoid FOIT (Flash of Invisible Text).

---
name: design-tokens-typography
description: Luxury fluid typography, editorial layout scales, optical letter-spacing (tracking), font pairing (serif + display + UI sans), and chromatic text hierarchy.
metadata:
  priority: 8
  pathPatterns:
    - "**/*.css"
---

# Design Tokens: Luxury Editorial Typography

Systems and mathematics for high-fashion, premium spirit, and editorial digital typography.

## 1. The Tri-Typeface Pairing System
- **The Brand Monument (Title / Monogram)**:
  - Font: `Cinzel`, `Didot`, or `Bodoni`
  - Characteristics: High-contrast serifs, classical Roman proportions, all-caps authority.
  - Optical Tracking: Wide tracking (`0.10em` to `0.22em`), line-height: `0.95` to `1.05`.
- **The Editorial Accent (Subtitle / Eyebrow)**:
  - Font: `Playfair Display`, `Cormorant Garamond`, italic.
  - Characteristics: Sensual italics, calligraphic terminals, warm human touch.
- **The Functional Architecture (UI / Body / Specs)**:
  - Font: `Plus Jakarta Sans`, `Inter`, `SF Pro Display`.
  - Characteristics: High legibility at small sizes (10px–14px), tabular numbers for pricing/ABV.

## 2. Dynamic Fluid Scale (`clamp()`)
Never use fixed pixel typography for major headlines. Use mathematical fluid clamps:
```css
/* Monumental Headline */
--font-size-hero: clamp(2.4rem, 6vw + 1rem, 5.5rem);

/* Editorial Subheadline */
--font-size-display: clamp(1.25rem, 2.5vw, 2.25rem);

/* Body Editorial */
--font-size-body: clamp(0.875rem, 1vw + 0.1rem, 1.0625rem);

/* Technical Micro-Copy (Specs / ABV / Origin) */
--font-size-micro: clamp(0.625rem, 0.5vw + 0.35rem, 0.75rem);
```

## 3. Optical Spacing Rules
1. **Uppercase Headlines Require Tracking**:
   Any all-caps text (`text-transform: uppercase`) MUST have `letter-spacing: 0.12em` to `0.24em`. Zero tracking on uppercase looks crowded and amateur.
2. **Body Text Requires Negative or Tight Tracking**:
   At sizes $> 16px$, sans-serif body text benefits from `-0.01em` to `-0.02em` tracking for tighter cohesion.
3. **Contrast Ratios**:
   - Primary text: Obsidian / Charcoal (`#121316`) on Alabaster (`#FAFAFC`) = Contrast ratio $> 15:1$ (exceeds WCAG AAA).
   - Muted technical copy: `#747888` = Contrast ratio $> 4.8:1$.

---
name: glassmorphism-advanced
description: High-fidelity frosted glass effects, transparent layered surfaces, specular highlights, and chromatic glassmorphic UI. Covers backdrop-filter, multi-tier blur, subtle borders, ambient gradient orbs, and dark/light mode glass contrast.
metadata:
  priority: 8
  pathPatterns:
    - "**/*.css"
    - "**/*.html"
    - "**/*.jsx"
    - "**/*.tsx"
  promptSignals:
    phrases:
      - "glassmorphism"
      - "glassmorfismo"
      - "frosted glass"
      - "vidrio esmerilado"
      - "glass card"
      - "glass UI"
      - "backdrop-blur"
retrieval:
  aliases:
    - glassmorphism-advanced
    - glassmorfismo
    - frosted-glass
    - luxury-glass
  intents:
    - apply glassmorphism
    - poner todo glassmorfismo
    - frosted glass UI
    - modern glass cards
---

# Glassmorphism Advanced Design System

High-fidelity frosted glass design system for luxury digital interfaces, editorial portfolios, and modern web applications.

## Core Visual Architecture (The 4 Layers of Glass)

True glassmorphism is never a single flat semi-transparent layer. It is a 4-tier optical composite:

1. **Layer 0 — Ambient Depth Foundation (Gradients & Fluid Lights)**:
   - Underlying vibrant gradients, radial glows, or moving imagery that provide the light rays to be refracted.
   - Example: Liquid radial glows, amber/gold whiskey accents, orbs blurred at 60px–100px.

2. **Layer 1 — Refraction & Optical Blur (`backdrop-filter`)**:
   - `backdrop-filter: blur(16px)` to `blur(32px)` (always pair with `-webkit-backdrop-filter`).
   - Essential rule: NEVER use blur alone without a tint, otherwise it's invisible.

3. **Layer 2 — Translucent Glass Surface & Specular Highlights**:
   - Ultra-refined semi-transparent background:
     - Dark Glass: `rgba(14, 15, 20, 0.65)` to `rgba(22, 24, 32, 0.75)`
     - Warm Luxury Glass: `rgba(32, 24, 18, 0.60)` with amber undertones
     - Pure Frosted Glass: `rgba(255, 255, 255, 0.08)` to `rgba(255, 255, 255, 0.16)`
   - Dual-border or inset highlight (light entering the glass bevel):
     - `border: 1px solid rgba(255, 255, 255, 0.18)`
     - `box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.25), 0 20px 50px rgba(0, 0, 0, 0.4)`

4. **Layer 3 — Chromatic Glow & Colored Shadow**:
   - Soft, colored drop shadow that mimics light passing through tinted glass:
     - Gold/Amber Glass: `box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45), 0 0 35px rgba(212, 175, 55, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.3)`
     - Rose/Pink Glass: `box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45), 0 0 35px rgba(232, 43, 125, 0.20)`

---

## Standard CSS Glass Utility Classes

```css
/* Base Glass Surface */
.glass-surface {
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 16px 40px rgba(0, 0, 0, 0.35);
}

/* Luxury Dark Obsidian Glass */
.glass-dark-luxe {
  background: rgba(14, 15, 20, 0.70);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(212, 175, 55, 0.25);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15), 
              0 20px 50px rgba(0, 0, 0, 0.5), 
              0 0 30px rgba(212, 175, 55, 0.12);
}

/* Warm Velvet Cream Glass (Whiskey / Artisan) */
.glass-cream-luxe {
  background: rgba(26, 22, 18, 0.75);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border: 1px solid rgba(245, 230, 204, 0.28);
  box-shadow: inset 0 1px 2px rgba(245, 230, 204, 0.3),
              0 24px 60px rgba(0, 0, 0, 0.45),
              0 0 35px rgba(198, 142, 60, 0.16);
}

/* Interactive Hover Lift for Glass Elements */
.glass-interactive {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              background 0.35s ease,
              border-color 0.35s ease,
              box-shadow 0.35s ease;
}

.glass-interactive:hover {
  transform: translateY(-4px) scale(1.01);
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.35);
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.4),
              0 28px 65px rgba(0, 0, 0, 0.5),
              0 0 40px rgba(212, 175, 55, 0.25);
}
```

---
name: liquid-glass
description: Implement Apple's Liquid Glass design language using .glassEffect() API paradigms, fluid morphing transitions, interactive glass, tinted surfaces, and modern glass-based UI effects.
---

# Liquid Glass Design

Implement Apple's Liquid Glass design language using the modern `.glassEffect()` API and web-equivalent multi-tier glass physics.

## When to Use

- User wants glass/blur effects on views
- User asks about Liquid Glass or modern Apple design
- User needs transparent, interactive UI elements
- User wants morphing transitions between views

## Quick Start (SwiftUI & Web Mappings)

### Basic Glass Effect
- **SwiftUI**: `.glassEffect()` (Capsule shape by default)
- **Web/CSS**:
  ```css
  .glass-effect {
    background: rgba(255, 255, 255, 0.65);
    -webkit-backdrop-filter: blur(28px) saturate(190%) contrast(105%);
    backdrop-filter: blur(28px) saturate(190%) contrast(105%);
    border: 1px solid rgba(255, 255, 255, 0.45);
    box-shadow: 
      inset 0 1px 1px 0 rgba(255, 255, 255, 0.8),
      inset 0 -1px 1px 0 rgba(0, 0, 0, 0.05),
      0 12px 36px -8px rgba(0, 0, 0, 0.08);
    border-radius: 9999px; /* .capsule by default */
  }
  ```

### Custom Shape
- `.capsule` (default: border-radius: 9999px)
- `.rect(cornerRadius: CGFloat)` (border-radius: 16px to 24px)
- `.circle` (border-radius: 50%)

### Interactive Glass
- **SwiftUI**: `.glassEffect(.regular.interactive())`
- **Web/CSS**:
  ```css
  .glass-interactive {
    transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1),
                background-color 0.25s ease,
                box-shadow 0.35s ease;
    cursor: pointer;
  }
  .glass-interactive:hover {
    transform: translateY(-2px) scale(1.015);
    background: rgba(255, 255, 255, 0.78);
    box-shadow: 
      inset 0 1px 2px 0 rgba(255, 255, 255, 0.95),
      0 18px 42px -6px rgba(0, 0, 0, 0.12);
  }
  .glass-interactive:active {
    transform: translateY(0) scale(0.985);
  }
  ```

### Tinted Glass
- **SwiftUI**: `.glassEffect(.regular.tint(.orange))` / `.tint(.blue)`
- **Web/CSS**:
  ```css
  .glass-tint-gold {
    background: linear-gradient(135deg, rgba(240, 180, 41, 0.18), rgba(255, 255, 255, 0.55));
    border-color: rgba(240, 180, 41, 0.35);
    box-shadow: 
      inset 0 1px 1.5px rgba(255, 255, 255, 0.85),
      0 16px 36px -6px rgba(212, 149, 10, 0.22);
  }
  .glass-tint-dark {
    background: linear-gradient(135deg, rgba(20, 24, 33, 0.78), rgba(10, 12, 18, 0.88));
    -webkit-backdrop-filter: blur(32px) saturate(200%);
    backdrop-filter: blur(32px) saturate(200%);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 
      inset 0 1px 1px 0 rgba(255, 255, 255, 0.25),
      0 20px 48px -10px rgba(0, 0, 0, 0.45);
  }
  ```

## Multiple Glass Effects & Container

### GlassEffectContainer
When using multiple glass elements, wrap them in a container that coordinates:
- Smooth blending between elements
- Fluid spacing
- Unified backdrop rendering
- Spring morphing transitions

```css
.glass-container {
  display: flex;
  gap: var(--glass-spacing, 1.25rem);
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  -webkit-backdrop-filter: blur(40px) saturate(190%);
  backdrop-filter: blur(40px) saturate(190%);
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}
```

## Button Styles
- **Glass Button** (`.button-glass`): Subtle translucent pill, spring response.
- **Glass Prominent Button** (`.button-glass-prominent`): Richly tinted, high-contrast specular bevel, glowing drop shadow.

## Key Rules of Apple Liquid Glass:
1. **Never flat opacity**: Must always pair with `backdrop-filter: blur(...) saturate(...)`.
2. **Double specular boundary**: High-key light at the top edge (`inset 0 1px ... rgba(255,255,255,...)`), dark falloff at the bottom edge.
3. **Smooth organic curves**: Apple continuous rounded corners (`border-radius: 18px - 32px` or `9999px` capsule).
4. **Spring physics**: Smooth Apple-like easing (`cubic-bezier(0.25, 1, 0.5, 1)` or `cubic-bezier(0.16, 1, 0.3, 1)`).
5. **Light refraction harmony**: Tinted shadows that mirror the accent color of the element rather than plain black shadows.

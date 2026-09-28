---
name: interactive-states
description: Advanced micro-states for interactive components, elastic spring curves, focus-visible luxury rings, pressed tactile depth, and magnetic micro-feedback.
metadata:
  priority: 7
  pathPatterns:
    - "**/*.css"
    - "**/*.js"
---

# Interactive States Design System

Specifications for tactile, responsive micro-states across desktop and mobile browsers.

## 1. The 5 Core States
Every interactive component must declare intentional behavior across:
1. **Default / Idle**: Resting elevation, subtle border definition, crisp typography.
2. **Hover (Desktop)**: Elevated specular rim light, inner accent shift (e.g. arrow nudge +4px), background luminance change.
3. **Active / Pressed**: Immediate tactile depth (`inset 0 2px 4px rgba(0,0,0,0.08)`), subtle luminance drop.
4. **Focus-Visible (Keyboard / A11y)**: Never suppress focus outlines! Provide a luxury custom focus ring:
   ```css
   :focus-visible {
     outline: 2px solid var(--accent-pink);
     outline-offset: 3px;
     box-shadow: 0 0 12px var(--accent-pink-glow);
   }
   ```
5. **Disabled**: Reduced opacity (`0.45`), `pointer-events: none`, neutral border.

## 2. Spring Curves Over Linear Transitions
Replace mechanical `ease` or `linear` transitions with organic spring physics:
- **Fast Interactive Spring**: `cubic-bezier(0.25, 1, 0.5, 1)` (smooth, decisive, no vibrating)
- **Playful Overshoot Spring (Badges/Pills)**: `cubic-bezier(0.34, 1.56, 0.64, 1)` (slight bounce and settling)
- **Tactile Release**: Active to idle transition should be faster (`0.12s`) than hover entry (`0.28s - 0.38s`).

## 3. Cursor & Pointer Discipline
- Only truly clickable elements (links, buttons, interactive pills) receive `cursor: pointer;`.
- Informational badges, card surfaces, and text receive `cursor: default;` to prevent misleading affordances.

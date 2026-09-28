---
name: apple-human-interface
description: Apple Human Interface Guidelines (HIG) standards for web interfaces, continuous squircle smoothing, ergonomic 44pt touch targets, sensory depth layering, and tactile clarity.
metadata:
  priority: 8
  pathPatterns:
    - "**/*.css"
    - "**/*.html"
---

# Apple Human Interface Guidelines (HIG) for Web

Principles of elegance, tactile direct manipulation, and continuous curvature from Apple's design language.

## 1. Continuous Curvature (Squircles vs. Rounding)
Standard CSS `border-radius: 20px` creates a circular arc with noticeable tangent points where the straight line meets the circle. Apple interfaces use a **continuous superellipse (squircle)**:
- In CSS, achieve this feeling through generous radii (`border-radius: 24px` to `32px` on cards, `9999px` on capsules) paired with soft specular border bevels.
- Avoid mixing sharp 4px corners with 24px rounded cards. Maintain consistent geometric rhythm across all cards and controls.

## 2. Touch Ergonomics (Minimum 44×44pt Hit Targets)
- Every interactive element (buttons, drawer triggers, quantity toggles, close buttons) must have an effective touch target area of at least **44×44 CSS pixels** on mobile.
- If visual size is smaller (e.g. a 24px icon), expand the hit target using padding or an invisible pseudo-element `::after` with `min-width: 44px; min-height: 44px;`.

## 3. Depth & Layering Hierarchy
Depth conveys relationship and importance without clutter:
- **Level 0 (Canvas Base)**: Pure neutral background (`#FAFAFC`).
- **Level 1 (Content Island / Card)**: Translucent glass surface floating above base with soft multi-tier shadow.
- **Level 2 (Active Control / Floating HUD)**: Pinned capsule or floating indicator with high-key specular rim light (`inset 0 1.5px 2px rgba(255,255,255,1)`).
- **Level 3 (Modal / Drawer / Notification)**: Overlaid with backdrop blur (`backdrop-filter: blur(28px)`) and focused drop shadow.

## 4. Tactile Feedback without Layout Disruption
- Respect the user's cursor / touch point.
- Provide visual feedback immediately upon contact (change in background luminance or specular bevel intensity).
- Never allow a pressed state to move or resize adjacent elements.

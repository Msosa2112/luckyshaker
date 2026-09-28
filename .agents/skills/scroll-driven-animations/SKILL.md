---
name: scroll-driven-animations
description: Advanced scroll-driven cinematic transformations, continuous timeline scrub, kinematic pinning, multi-plane depth parallax, and zero-jank frame choreography.
metadata:
  priority: 7
  pathPatterns:
    - "**/*.css"
    - "**/*.js"
    - "**/*.html"
---

# Scroll-Driven Animations Design System

Architecture and guidelines for building seamless, high-framerate, scroll-controlled web experiences.

## 1. Single Continuous Timeline Mapping
- Never hijack the scroll wheel with artificial `window.scrollTo` locks or step jumps.
- Maintain ONE master scroll distance (e.g. `850vh` for multi-act scenes) and map total progress $p \in [0.0, 1.0]$.
- Derive sub-scenes and transitions strictly as monotonic segments:
  - Scene A: $p \in [0.0, p_1]$
  - Transition A $\to$ B: $p \in [p_1, p_2]$ (fluid co-planar slide/crossfade)
  - Scene B: $p \in [p_2, p_3]$
  - Transition B $\to$ C: $p \in [p_3, p_4]$
  - Scene C: $p \in [p_4, 1.0]$

## 2. Pinned Viewport Architecture
- Keep the rendering viewport pinned using `position: sticky; top: 0; width: 100%; height: 100vh; height: 100dvh;`.
- Prevent horizontal scrollbars using `overflow-x: clip;` on `html, body`.
- Never translate the viewport out of place while scrubbing acts.

## 3. Kinetic Smoothing & Physics (Lerp Engine)
- Use bidirectional requestAnimationFrame interpolation:
  $$p_{\text{current}} = p_{\text{current}} + (p_{\text{target}} - p_{\text{current}}) \times \lambda$$
  where $\lambda \in [0.08, 0.14]$ produces tactile hydraulic weight without sluggish lag.

## 4. Multi-Plane Parallax Depth
- Split scene components into distinct Z-planes:
  - Plane -1: Ambient background glows, drifting particle meshes (`transform: scale(1.05) translateZ(...)`)
  - Plane 0: Primary subject (Bottle / 3D Canvas / Video)
  - Plane 1: Atmosphere flares, lighting sweeps, specular highlights
  - Plane 2: Editorial glass cards and interactive actions
- Move deeper planes at fractional rates ($\times 0.35$ to $\times 0.65$) relative to foreground cards for spatial immersion.

## 5. CSS Scroll-Timeline & Will-Change Hygiene
- Apply `will-change: transform, opacity;` ONLY to active elements during the transition range.
- Clear `will-change` once settled to conserve GPU memory.
- Always provide immediate fallback for `prefers-reduced-motion`.

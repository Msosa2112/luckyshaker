---
name: gsap-timelines
description: Production-grade GSAP 3 and ScrollTrigger orchestration, scrubbed timelines, micro-choreography, split-text kinematics, and bidirectional state synchronization.
metadata:
  priority: 7
  pathPatterns:
    - "**/*.js"
    - "**/*.css"
---

# GSAP Timelines & ScrollTrigger Architecture

Best practices for cinematic web experiences powered by GreenSock Animation Platform.

## 1. Zero-Conflict Coexistence
- Synchronize GSAP animations with master requestAnimationFrame loops by leveraging `gsap.ticker` or direct timeline progress scrubbing:
  ```javascript
  masterTimeline.progress(currentSmoothProgress);
  ```
- Avoid competing timeline triggers that attempt to mutate the same CSS transforms simultaneously.

## 2. Bidirectional Scrubbing
- Always construct timelines that scrub identically in reverse.
- Never use non-reversible mutations (such as permanent DOM removals or uncurried timeouts) inside scrubbed timelines.
- Cleanly bind timeline endpoints with numeric labels:
  ```javascript
  tl.addLabel("mojito", 0.0)
    .addLabel("transition-1", 0.3)
    .addLabel("old-fashioned", 0.45)
    .addLabel("transition-2", 0.65)
    .addLabel("whiskey-cream", 0.8);
  ```

## 3. High-Performance Properties
- Animate only composite-friendly properties:
  - `x`, `y`, `scale`, `rotation`, `opacity`, `transformOrigin`
- Never animate layout-triggering properties (`width`, `height`, `top`, `left`, `margin`, `padding`).

## 4. Mobile Hardware Acceleration
- Use `force3D: true` on GPU layers during active scrubbing.
- Set `lazy: true` when reading layout geometry before timeline initialization to prevent forced synchronous layouts (layout thrashing).

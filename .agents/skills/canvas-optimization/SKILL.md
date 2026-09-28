---
name: canvas-optimization
description: High-performance 60fps HTML5 Canvas rendering for scroll-driven WebP sequences, bitmap caching, OffscreenCanvas, garbage collection reduction, and responsive devicePixelRatio scaling.
metadata:
  priority: 8
  pathPatterns:
    - "**/*.js"
    - "**/*.html"
---

# Canvas Optimization: 60FPS Sequence Engine

Patterns and engineering techniques for zero-jank frame-scrubbed canvas sequences.

## 1. Frame Caching Strategy
- Preload and store decoded `HTMLImageElement` or `ImageBitmap` objects in an in-memory `Map()`.
- Decode images off the main thread when possible via `img.decode()` or `createImageBitmap(blob)`.
- Never create new `new Image()` instances on each scroll event or animation frame; this triggers severe browser Garbage Collection (GC) pauses resulting in dropped frames.

## 2. Dynamic High-DPI Scaling (devicePixelRatio)
- Synchronize internal canvas bitmap dimensions with screen backing pixels:
  ```javascript
  const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 to save GPU VRAM
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  ```
- Recalculate on `resize` with debouncing, not inside the render loop.

## 3. Aspect Ratio "Cover" Math
To ensure image frames fill the canvas without stretching or distortion:
```javascript
function drawImageCover(ctx, img, canvasWidth, canvasHeight) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = canvasWidth / canvasHeight;
  let renderW, renderH, offsetX, offsetY;

  if (canvasRatio > imgRatio) {
    renderW = canvasWidth;
    renderH = canvasWidth / imgRatio;
    offsetX = 0;
    offsetY = (canvasHeight - renderH) / 2;
  } else {
    renderW = canvasHeight * imgRatio;
    renderH = canvasHeight;
    offsetX = (canvasWidth - renderW) / 2;
    offsetY = 0;
  }

  ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
}
```

## 4. Draw Call Minimization
- Store the last rendered frame index (`displayedFrame`).
- If `targetFrame === displayedFrame` and no resize occurred, **skip `ctx.drawImage` completely**. Avoid redundant paint work.

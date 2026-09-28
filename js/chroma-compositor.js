/**
 * LUCKY SHAKER — REAL-TIME WEBGL CHROMA-KEY COMPOSITOR
 * 
 * Professional GPU-accelerated video chroma-key removal with:
 * - YCbCr Chrominance Euclidean Distance Keying (independent of luminance)
 * - Hermite smoothstep edge matte with customizable threshold & softness
 * - VFX-Grade Blue Spill Suppression (eliminates blue halos on glass, satin ribbon & labels)
 * - Zero CPU pixel loops — executes 100% in WebGL fragment shader at 60fps
 * - Preserves fine ribbon borders, transparent glass base, and crisp typography
 */

class ChromaCompositor {
  constructor(options = {}) {
    this.canvas = options.canvas || document.createElement("canvas");
    this.video = options.video || null;
    
    // Chroma Calibration for Electric Blue #008CFF / Sampled Video
    // Key color in Cb, Cr space (normalized YCbCr)
    this.keyCb = options.keyCb !== undefined ? options.keyCb : 0.2184;
    this.keyCr = options.keyCr !== undefined ? options.keyCr : -0.2132;
    
    // Matte parameters calibrated for Whiskey Cream product video
    this.threshold = options.threshold !== undefined ? options.threshold : 0.085;
    this.softness = options.softness !== undefined ? options.softness : 0.065;
    this.spill = options.spill !== undefined ? options.spill : 0.95;
    
    // Modes: 0 = Composited (Transparent), 1 = Alpha Matte Mask (B&W), 2 = Raw Video
    this.mode = options.mode !== undefined ? options.mode : 0;
    this.choke = options.choke !== undefined ? options.choke : 0.65;
    
    this.gl = null;
    this.program = null;
    this.texture = null;
    this.isRunning = false;
    this.rafId = null;
    
    this.initWebGL();
  }

  initWebGL() {
    const gl = this.canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
      preserveDrawingBuffer: false
    }) || this.canvas.getContext("experimental-webgl", {
      alpha: true,
      premultipliedAlpha: false
    });

    if (!gl) {
      console.error("WebGL not supported for ChromaCompositor.");
      return;
    }
    this.gl = gl;

    // Vertex Shader: Fullscreen quad
    const vsSource = `
      attribute vec2 aPosition;
      attribute vec2 aUv;
      varying vec2 vUv;
      void main() {
        vUv = aUv;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    // Fragment Shader: VFX-Grade YCbCr Keyer with Dual Cyan/Blue Despill & Anti-Halo Morphological Choke
    const fsSource = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform vec2 uTexelSize;
      uniform vec2 uKeyChroma;
      uniform float uThreshold;
      uniform float uSoftness;
      uniform float uSpill;
      uniform float uChoke;
      uniform int uMode; // 0=Composite, 1=Matte, 2=Raw

      // High-precision chrominance distance & matte extraction
      float calcAlpha(vec4 col) {
        float cb = -0.168736 * col.r - 0.331264 * col.g + 0.5 * col.b;
        float cr =  0.5 * col.r - 0.418688 * col.g - 0.081312 * col.b;
        float dist = distance(vec2(cb, cr), uKeyChroma);
        return smoothstep(uThreshold, uThreshold + uSoftness, dist);
      }

      void main() {
        vec4 src = texture2D(uTexture, vUv);
        
        if (uMode == 2) {
          // Raw video pass-through
          gl_FragColor = src;
          return;
        }

        // 1. Center alpha from chrominance distance
        float aCenter = calcAlpha(src);

        // 2. Sub-Pixel Anti-Halo Morphological Choke (samples 4 cross-neighbors)
        // Completely tucks away the 1-2 pixel compression boundary fringe from 4:2:0 video subsampling
        float aUp    = calcAlpha(texture2D(uTexture, vUv + vec2(0.0, uTexelSize.y)));
        float aDown  = calcAlpha(texture2D(uTexture, vUv - vec2(0.0, uTexelSize.y)));
        float aLeft  = calcAlpha(texture2D(uTexture, vUv - vec2(uTexelSize.x, 0.0)));
        float aRight = calcAlpha(texture2D(uTexture, vUv + vec2(uTexelSize.x, 0.0)));
        
        float aMin = min(min(aUp, aDown), min(aLeft, aRight));
        float alpha = mix(aCenter, aMin, uChoke);

        if (uMode == 1) {
          // Output Alpha Matte as visual black & white mask
          gl_FragColor = vec4(vec3(alpha), 1.0);
          return;
        }

        // 3. VFX-Grade Dual Cyan/Blue Despill Tailored for #008CFF
        // Screen #008CFF has R=0, G=140, B=255.
        // Contamination is both Blue (B) and Cyan (G elevated relative to R).
        // Target B is bounded by R and natural G
        float targetB = min(src.r, max(src.r * 0.8, src.g * 0.9));
        float excessB = max(0.0, src.b - targetB);
        
        // Green contamination from electric blue screen
        float excessG = max(0.0, src.g - src.r);

        vec3 color = src.rgb;
        color.b -= excessB * uSpill;
        color.g -= excessG * (uSpill * 0.85);

        gl_FragColor = vec4(color, alpha);
      }
    `;

    this.program = this.createProgram(vsSource, fsSource);
    gl.useProgram(this.program);

    // Quad geometry: 2 triangles covering [-1, 1]
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]);
    const uvs = new Float32Array([
      0, 1,
      1, 1,
      0, 0,
      0, 0,
      1, 1,
      1, 0
    ]);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(this.program, "aPosition");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
    const aUv = gl.getAttribLocation(this.program, "aUv");
    gl.enableVertexAttribArray(aUv);
    gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);

    // Create Video Texture
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Cache Uniform Locations
    this.uniforms = {
      uTexelSize: gl.getUniformLocation(this.program, "uTexelSize"),
      uKeyChroma: gl.getUniformLocation(this.program, "uKeyChroma"),
      uThreshold: gl.getUniformLocation(this.program, "uThreshold"),
      uSoftness: gl.getUniformLocation(this.program, "uSoftness"),
      uSpill: gl.getUniformLocation(this.program, "uSpill"),
      uChoke: gl.getUniformLocation(this.program, "uChoke"),
      uMode: gl.getUniformLocation(this.program, "uMode")
    };

    this.updateUniforms();
  }

  createShader(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  createProgram(vsSource, fsSource) {
    const gl = this.gl;
    const vs = this.createShader(gl.VERTEX_SHADER, vsSource);
    const fs = this.createShader(gl.FRAGMENT_SHADER, fsSource);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(prog));
      gl.deleteProgram(prog);
      return null;
    }
    return prog;
  }

  setVideo(video) {
    this.video = video;
    if (video.videoWidth && video.videoHeight) {
      this.resizeCanvas(video.videoWidth, video.videoHeight);
    } else {
      video.addEventListener("loadedmetadata", () => {
        this.resizeCanvas(video.videoWidth, video.videoHeight);
      }, { once: true });
    }
  }

  resizeCanvas(width, height) {
    if (!this.canvas) return;
    this.canvas.width = width;
    this.canvas.height = height;
    if (this.gl) {
      this.gl.viewport(0, 0, width, height);
      this.updateUniforms();
    }
  }

  updateUniforms() {
    if (!this.gl || !this.program) return;
    const gl = this.gl;
    gl.useProgram(this.program);
    
    // Texel size for sub-pixel anti-halo edge choke
    const tw = this.canvas.width || 1920;
    const th = this.canvas.height || 1080;
    gl.uniform2f(this.uniforms.uTexelSize, 1.0 / tw, 1.0 / th);

    gl.uniform2f(this.uniforms.uKeyChroma, this.keyCb, this.keyCr);
    gl.uniform1f(this.uniforms.uThreshold, this.threshold);
    gl.uniform1f(this.uniforms.uSoftness, this.softness);
    gl.uniform1f(this.uniforms.uSpill, this.spill);
    gl.uniform1f(this.uniforms.uChoke, this.choke);
    gl.uniform1i(this.uniforms.uMode, this.mode);
  }

  setThreshold(val) {
    this.threshold = parseFloat(val);
    this.updateUniforms();
    this.renderFrame();
  }

  setSoftness(val) {
    this.softness = parseFloat(val);
    this.updateUniforms();
    this.renderFrame();
  }

  setSpill(val) {
    this.spill = parseFloat(val);
    this.updateUniforms();
    this.renderFrame();
  }

  setChoke(val) {
    this.choke = parseFloat(val);
    this.updateUniforms();
    this.renderFrame();
  }

  setMode(val) {
    this.mode = parseInt(val, 10);
    this.updateUniforms();
    this.renderFrame();
  }

  renderFrame() {
    const gl = this.gl;
    const video = this.video;
    if (!gl || !video || video.readyState < 2) return;

    // Upload video frame to GPU texture
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);

    // Clear with zero alpha
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw full-screen chroma-keyed quad
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  startLoop() {
    if (this.isRunning) return;
    this.isRunning = true;

    const loop = () => {
      if (!this.isRunning) return;
      this.renderFrame();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stopLoop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  destroy() {
    this.stopLoop();
    if (this.gl && this.texture) {
      this.gl.deleteTexture(this.texture);
    }
  }
}

// Export for browser global
window.ChromaCompositor = ChromaCompositor;

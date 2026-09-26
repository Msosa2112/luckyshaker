/**
 * Lucky Shaker — Whiskey Cream by Katherin
 * Interactive 3D Showcase & Shopify Scroll-Driven Engine
 */

(function () {
  'use strict';

  // --- 1. Scene & Engine Setup ---
  const container = document.getElementById('canvas-container');
  const canvas = document.getElementById('webgl-canvas');

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0c, 0.4);

  const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.05, 50);
  camera.position.set(0, 0.14, 0.88);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Orbit Controls (for interactive mode)
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.set(0, 0.13, 0);
  controls.minDistance = 0.35;
  controls.maxDistance = 1.8;
  controls.maxPolarAngle = Math.PI / 2 + 0.05;
  controls.enabled = false; // Disabled by default in scroll mode

  // --- 2. Lighting Setup (Commercial Studio PBR) ---
  const lightsGroup = new THREE.Group();
  scene.add(lightsGroup);

  // Soft Ambient
  const ambientLight = new THREE.AmbientLight(0xfff8f0, 0.4);
  lightsGroup.add(ambientLight);

  // Key Light (Large soft area, front-left)
  const keyLight = new THREE.DirectionalLight(0xfffaed, 2.2);
  keyLight.position.set(0.6, 0.8, 0.7);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.bias = -0.0001;
  lightsGroup.add(keyLight);

  // Fill Light (Soft cool, front-right)
  const fillLight = new THREE.DirectionalLight(0xe8f0ff, 1.1);
  fillLight.position.set(-0.7, 0.5, 0.6);
  lightsGroup.add(fillLight);

  // Rim Lights (Dual back-rims for glass refraction outline)
  const rimLightLeft = new THREE.DirectionalLight(0xffe8dc, 2.0);
  rimLightLeft.position.set(0.6, 0.3, -0.7);
  lightsGroup.add(rimLightLeft);

  const rimLightRight = new THREE.DirectionalLight(0xffe8dc, 2.0);
  rimLightRight.position.set(-0.6, 0.3, -0.7);
  lightsGroup.add(rimLightRight);

  // Top Light (For Cap & Bow highlights)
  const topLight = new THREE.DirectionalLight(0xfffaee, 1.2);
  topLight.position.set(0, 1.2, 0.1);
  lightsGroup.add(topLight);

  // Soft Studio Ground Mirror
  const groundGeo = new THREE.PlaneGeometry(5, 5);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x070709,
    roughness: 0.25,
    metalness: 0.1
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.001;
  ground.receiveShadow = true;
  scene.add(ground);

  // --- 3. Atmospheric Cream Droplets & Bokeh (Requirement 11) ---
  const particlesGroup = new THREE.Group();
  scene.add(particlesGroup);

  const particleCount = 45;
  const particleGeo = new THREE.SphereGeometry(1, 16, 16);
  const particleMat = new THREE.MeshPhysicalMaterial({
    color: 0xF5ECDC, // Silky warm cream
    roughness: 0.15,
    metalness: 0.05,
    transmission: 0.4,
    ior: 1.35
  });

  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    const mesh = new THREE.Mesh(particleGeo, particleMat);
    const scale = 0.0015 + Math.random() * 0.0045; // 1.5mm to 6mm droplets
    mesh.scale.set(scale, scale, scale);

    const radius = 0.12 + Math.random() * 0.25;
    const theta = Math.random() * Math.PI * 2;
    const y = -0.02 + Math.random() * 0.32;

    mesh.position.set(radius * Math.cos(theta), y, radius * Math.sin(theta));
    mesh.userData = {
      baseY: y,
      speed: 0.4 + Math.random() * 0.8,
      wobbleSpeed: 1.0 + Math.random() * 2.0,
      phase: Math.random() * Math.PI * 2
    };

    particlesGroup.add(mesh);
    particles.push(mesh);
  }

  // --- 4. Load 3D Asset ---
  let productRig = null;
  let isModelLoaded = false;

  const textureLoader = new THREE.TextureLoader();
  const labelDiff = textureLoader.load('../assets/label_diffuse.png');
  const labelMet = textureLoader.load('../assets/label_metallic.png');
  const labelRough = textureLoader.load('../assets/label_roughness.png');
  const labelAlpha = textureLoader.load('../assets/label_alpha.png');
  const labelBump = textureLoader.load('../assets/label_bump.png');

  const neckDiff = textureLoader.load('../assets/neck_sleeve_diffuse.png');
  const neckMet = textureLoader.load('../assets/neck_sleeve_metallic.png');
  const neckRough = textureLoader.load('../assets/neck_sleeve_roughness.png');

  [labelDiff, neckDiff].forEach(t => {
    t.encoding = THREE.sRGBEncoding;
    t.flipY = false;
  });
  [labelMet, labelRough, labelAlpha, labelBump, neckMet, neckRough].forEach(t => {
    t.flipY = false;
  });

  const gltfLoader = new THREE.GLTFLoader();
  const modelUrl = '../assets/lucky_shaker_whiskey_cream.glb';

  gltfLoader.load(
    modelUrl,
    function (gltf) {
      productRig = gltf.scene;
      scene.add(productRig);

      // Enhance materials for WebGL PBR fidelity
      productRig.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          const name = child.name.toLowerCase();

          // Glass Bottle: Flint glass with transmission
          if (name.includes('glass')) {
            child.material = new THREE.MeshPhysicalMaterial({
              color: 0xffffff,
              transmission: 0.98,
              opacity: 1,
              transparent: true,
              ior: 1.517,
              roughness: 0.012,
              metalness: 0.0,
              thickness: 0.045
            });
          }
          // Whiskey Cream Liquid: Subsurface cream look
          else if (name.includes('liquid')) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xE8DC4, // Warm Irish cream
              roughness: 0.03,
              metalness: 0.0
            });
          }
          // Front Label: Original immutable artwork + gold metallic
          else if (name.includes('label')) {
            child.material = new THREE.MeshStandardMaterial({
              map: labelDiff,
              metalnessMap: labelMet,
              roughnessMap: labelRough,
              alphaMap: labelAlpha,
              bumpMap: labelBump,
              bumpScale: 0.001,
              transparent: true,
              metalness: 0.95,
              roughness: 0.35
            });
          }
          // Gold Cap
          else if (name.includes('cap')) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xD6B56B,
              metalness: 0.98,
              roughness: 0.22
            });
          }
          // Neck Sleeve: Red foil + gold Katherin calligraphy
          else if (name.includes('sleeve')) {
            child.material = new THREE.MeshStandardMaterial({
              map: neckDiff,
              metalnessMap: neckMet,
              roughnessMap: neckRough,
              metalness: 0.85,
              roughness: 0.25
            });
          }
          // Red Satin Ribbon & Bow
          else if (name.includes('ribbon') || name.includes('knot') || name.includes('loop') || name.includes('tail') || name.includes('cube')) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xB30B24, // Deep ruby red satin
              roughness: 0.32,
              metalness: 0.08
            });
          }
        }
      });

      isModelLoaded = true;
      console.log('Lucky Shaker 3D asset successfully initialized.');
      updateScrollAnimation();
    },
    undefined,
    function (error) {
      console.error('Error loading 3D asset:', error);
    }
  );

  // --- 5. Scroll-Driven Engine (Requirement 10) ---
  // Stages:
  // 0.00 - 0.15 : Stage 0 - Hero portrait front view (9:16) with subtle floating
  // 0.15 - 0.35 : Stage 1 - Slow forward glide & vertical float toward camera
  // 0.35 - 0.50 : Stage 2 - Harmonious pause framing the neck capsule & red bow
  // 0.50 - 0.75 : Stage 3 - Controlled 110-degree rotation showing solid crystal heel & side profile
  // 0.75 - 0.90 : Stage 4 - Return to front-facing presentation
  // 0.90 - 1.00 : Stage 5 - Macro push-in focusing on "By Katherin" original gold label

  let currentScrollProgress = 0;
  let targetScrollProgress = 0;
  let isOrbitMode = false;
  let floatAnimationEnabled = true;

  function onScroll() {
    if (isOrbitMode) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    targetScrollProgress = Math.min(Math.max(window.scrollY / docHeight, 0), 1);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // Story chapter indicators
  const trackerFill = document.getElementById('tracker-fill');
  const stepDots = document.querySelectorAll('.step-dot');
  const storyCards = document.querySelectorAll('.story-card');

  function updateScrollAnimation() {
    if (!productRig || isOrbitMode) return;

    // Smooth lerp interpolation
    currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.08;
    const p = currentScrollProgress;

    // Update progress tracker UI
    if (trackerFill) trackerFill.style.height = `${p * 100}%`;
    const activeStep = Math.min(Math.floor(p * 6), 5);
    stepDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeStep);
    });

    // Default transforms
    let posX = 0, posY = 0, posZ = 0;
    let rotX = 0, rotY = 0, rotZ = 0;
    let camY = 0.14, camZ = 0.88, camTargetY = 0.13;

    if (p <= 0.15) {
      // Stage 0: Hero 9:16 Full View
      const t = p / 0.15;
      posX = 0;
      posY = 0;
      posZ = 0;
      rotY = 0;
      camZ = 0.88;
      camY = 0.14;
    } else if (p <= 0.35) {
      // Stage 1: Slow movement towards camera + slight vertical movement
      const t = (p - 0.15) / 0.20;
      const ease = t * t * (3 - 2 * t);
      posX = 0;
      posY = 0.005 * ease;
      posZ = 0.05 * ease;
      rotY = 0;
      camZ = 0.88 - 0.08 * ease;
      camY = 0.14;
    } else if (p <= 0.50) {
      // Stage 2: Brief pause framing neck & ribbon
      const t = (p - 0.35) / 0.15;
      posX = 0;
      posY = 0.005;
      posZ = 0.05;
      rotY = 0;
      camZ = 0.80;
      camY = 0.14;
    } else if (p <= 0.75) {
      // Stage 3: Controlled rotation approx 105–110 degrees
      const t = (p - 0.50) / 0.25;
      const ease = t * t * (3 - 2 * t);
      posX = 0;
      posY = 0.005 - 0.002 * ease;
      posZ = 0.05 - 0.02 * ease;
      rotY = ease * (105 * (Math.PI / 180));
      camZ = 0.80 + 0.04 * ease;
      camY = 0.14;
    } else if (p <= 0.90) {
      // Stage 4: Return to front-facing position
      const t = (p - 0.75) / 0.15;
      const ease = t * t * (3 - 2 * t);
      posX = 0;
      posY = 0.003 - 0.003 * ease;
      posZ = 0.03 - 0.03 * ease;
      rotY = (1.0 - ease) * (105 * (Math.PI / 180));
      camZ = 0.84 - 0.04 * ease;
      camY = 0.14;
    } else {
      // Stage 5: Slow cinematic push-in onto original gold label
      const t = (p - 0.90) / 0.10;
      const ease = t * t * (3 - 2 * t);
      posX = 0;
      posY = 0;
      posZ = 0.04 * ease;
      rotY = 0;
      camZ = 0.80 - 0.28 * ease; // Macro framing on label
      camY = 0.14 - 0.04 * ease; // Centers on "LUCKY SHAKER By Katherin"
      camTargetY = 0.13 - 0.04 * ease;
    }

    // Apply transforms to product rig
    productRig.position.set(posX, posY, posZ);
    productRig.rotation.set(rotX, rotY, rotZ);

    // Apply camera positioning
    camera.position.set(0, camY, camZ);
    camera.lookAt(0, camTargetY, 0);
  }

  // --- 6. Interactive Mode & UI Controls ---
  const btnScroll = document.getElementById('btn-mode-scroll');
  const btnOrbit = document.getElementById('btn-mode-orbit');
  const btnToggleFrame = document.getElementById('btn-toggle-frame');
  const aspectFrame = document.getElementById('aspect-frame');
  const btnSnapshot = document.getElementById('btn-snapshot');

  // Mode Toggles
  btnScroll.addEventListener('click', () => {
    isOrbitMode = false;
    btnScroll.classList.add('active');
    btnOrbit.classList.remove('active');
    document.body.className = 'mode-scroll';
    controls.enabled = false;
    updateScrollAnimation();
  });

  btnOrbit.addEventListener('click', () => {
    isOrbitMode = true;
    btnOrbit.classList.add('active');
    btnScroll.classList.remove('active');
    document.body.className = 'mode-orbit';
    controls.enabled = true;
    controls.reset();
  });

  // 9:16 Aspect Ratio Frame Toggle
  btnToggleFrame.addEventListener('click', () => {
    aspectFrame.classList.toggle('active');
    btnToggleFrame.classList.toggle('active');
  });

  // Camera Presets (Dock)
  const camButtons = document.querySelectorAll('[data-cam]');
  camButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      camButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const preset = btn.getAttribute('data-cam');
      applyCameraPreset(preset);
    });
  });

  function applyCameraPreset(preset) {
    if (!productRig) return;
    let targetPos = new THREE.Vector3(0, 0.14, 0.88);
    let targetLook = new THREE.Vector3(0, 0.13, 0);

    if (preset === 'hero') {
      targetPos.set(0, 0.14, 0.88);
      targetLook.set(0, 0.13, 0);
      productRig.rotation.set(0, 0, 0);
    } else if (preset === 'cap') {
      targetPos.set(0, 0.22, 0.42);
      targetLook.set(0, 0.20, 0);
      productRig.rotation.set(0, 0, 0);
    } else if (preset === 'label') {
      targetPos.set(0, 0.09, 0.38);
      targetLook.set(0, 0.09, 0);
      productRig.rotation.set(0, 0, 0);
    } else if (preset === 'base') {
      targetPos.set(0.25, 0.06, 0.42);
      targetLook.set(0, 0.02, 0);
      productRig.rotation.set(0, Math.PI / 4, 0);
    }

    new TWEEN.Tween(camera.position)
      .to({ x: targetPos.x, y: targetPos.y, z: targetPos.z }, 800)
      .easing(TWEEN.Easing.Cubic.Out)
      .start();

    new TWEEN.Tween(controls.target)
      .to({ x: targetLook.x, y: targetLook.y, z: targetLook.z }, 800)
      .easing(TWEEN.Easing.Cubic.Out)
      .start();
  }

  // Lighting Presets (Dock)
  const lightButtons = document.querySelectorAll('[data-light]');
  lightButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      lightButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-light');
      applyLightingPreset(mode);
    });
  });

  function applyLightingPreset(mode) {
    if (mode === 'studio') {
      keyLight.color.setHex(0xfffaed);
      keyLight.intensity = 2.2;
      fillLight.intensity = 1.1;
      rimLightLeft.intensity = 2.0;
      rimLightRight.intensity = 2.0;
      ambientLight.intensity = 0.4;
    } else if (mode === 'warm') {
      keyLight.color.setHex(0xffdfa8);
      keyLight.intensity = 2.5;
      fillLight.intensity = 0.8;
      rimLightLeft.intensity = 2.4;
      rimLightRight.intensity = 2.4;
      ambientLight.intensity = 0.3;
    } else if (mode === 'dramatic') {
      keyLight.intensity = 1.2;
      fillLight.intensity = 0.3;
      rimLightLeft.intensity = 3.5;
      rimLightRight.intensity = 3.5;
      ambientLight.intensity = 0.15;
    }
  }

  // Toggles for particles and floating physics
  const btnParticles = document.getElementById('btn-toggle-particles');
  btnParticles.addEventListener('click', () => {
    particlesGroup.visible = !particlesGroup.visible;
    btnParticles.classList.toggle('active', particlesGroup.visible);
    btnParticles.textContent = particlesGroup.visible ? 'Cream Droplets ON' : 'Cream Droplets OFF';
  });

  const btnFloat = document.getElementById('btn-toggle-float');
  btnFloat.addEventListener('click', () => {
    floatAnimationEnabled = !floatAnimationEnabled;
    btnFloat.classList.toggle('active', floatAnimationEnabled);
    btnFloat.textContent = floatAnimationEnabled ? 'Floating Float ON' : 'Floating Float OFF';
  });

  // Snapshot Tool (Download 4K / HD Product Still)
  btnSnapshot.addEventListener('click', () => {
    const originalPixelRatio = renderer.getPixelRatio();
    // Render at crisp 2x resolution
    renderer.setPixelRatio(2.5);
    renderer.render(scene, camera);

    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'lucky_shaker_whiskey_cream_hero_3d.png';
    link.href = dataURL;
    link.click();

    renderer.setPixelRatio(originalPixelRatio);
  });

  // Click on Chapter dots to jump
  stepDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const step = parseInt(dot.getAttribute('data-step'), 10);
      const card = document.getElementById(`card-${step}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- 7. Main Animation Loop ---
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    TWEEN.update();

    if (isOrbitMode) {
      controls.update();
    } else {
      updateScrollAnimation();
    }

    // Subtle floating bobbing physics (idle micro-movement)
    if (productRig && floatAnimationEnabled) {
      const floatY = Math.sin(elapsedTime * 1.5) * 0.0025;
      const floatTilt = Math.sin(elapsedTime * 1.0) * 0.005;
      productRig.position.y += floatY;
      productRig.rotation.z = floatTilt;
    }

    // Animate Cream Droplets (Requirement 11)
    if (particlesGroup.visible) {
      particles.forEach(p => {
        p.position.y = p.userData.baseY + Math.sin(elapsedTime * p.userData.wobbleSpeed + p.userData.phase) * 0.012;
        p.rotation.y += 0.01;
      });
      particlesGroup.rotation.y = elapsedTime * 0.04;
    }

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

})();

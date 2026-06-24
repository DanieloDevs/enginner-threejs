import * as THREE from 'three';

let scene, camera, renderer, particles, connections, material;
let mouseX = 0, mouseY = 0;
let scrollY = 0;
let initialized = false;
let animationId = null;
let clock;

export function initScene3D() {
  const container = document.getElementById('three-container');
  const fallback = document.getElementById('three-fallback');
  if (!container) return;

  const isMobile = window.innerWidth < 768;
  const isLowPerf = isMobile || !checkWebGL();

  if (isLowPerf) {
    if (fallback) fallback.classList.add('fallback-active');
    return;
  }

  if (fallback) fallback.classList.remove('fallback-active');

  const width = container.clientWidth;
  const height = container.clientHeight;

  clock = new THREE.Clock();

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 28;

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: !isMobile,
    powerPreference: 'low-power',
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // ── Particle system ──
  const count = isMobile ? 1000 : 3000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  const palette = [
    new THREE.Color('#6F4E9C'),
    new THREE.Color('#8B5FBF'),
    new THREE.Color('#e6397f'),
    new THREE.Color('#41e2c2'),
    new THREE.Color('#9b6dff'),
    new THREE.Color('#4A2D6E'),
  ];

  for (let i = 0; i < count; i++) {
    const radius = 8 + Math.random() * 14;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);

    const color = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = color.r * (0.7 + Math.random() * 0.3);
    colors[i * 3 + 1] = color.g * (0.7 + Math.random() * 0.3);
    colors[i * 3 + 2] = color.b * (0.7 + Math.random() * 0.3);

    sizes[i] = 0.06 + Math.random() * 0.2;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // Custom sprite texture (soft circle)
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.3, 'rgba(255,255,255,0.8)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);
  const sprite = new THREE.CanvasTexture(canvas);

  material = new THREE.PointsMaterial({
    size: 0.35,
    map: sprite,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    depthWrite: false,
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // ── Connection lines (between nearby particles) ──
  const connectionGeo = new THREE.BufferGeometry();
  const connectionPositions = [];
  const connectionColors = [];

  const posAttr = geometry.attributes.position;
  for (let i = 0; i < count; i += 3) {
    for (let j = i + 3; j < Math.min(i + 30, count); j += 3) {
      const dx = posAttr.array[i * 3] - posAttr.array[j * 3];
      const dy = posAttr.array[i * 3 + 1] - posAttr.array[j * 3 + 1];
      const dz = posAttr.array[i * 3 + 2] - posAttr.array[j * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < 4.5 && Math.random() > 0.92) {
        connectionPositions.push(
          posAttr.array[i * 3], posAttr.array[i * 3 + 1], posAttr.array[i * 3 + 2],
          posAttr.array[j * 3], posAttr.array[j * 3 + 1], posAttr.array[j * 3 + 2]
        );
        const c = palette[Math.floor(Math.random() * palette.length)];
        for (let k = 0; k < 2; k++) {
          connectionColors.push(c.r * 0.4, c.g * 0.4, c.b * 0.4);
        }
      }
    }
  }

  if (connectionPositions.length) {
    connectionGeo.setAttribute('position', new THREE.Float32BufferAttribute(connectionPositions, 3));
    connectionGeo.setAttribute('color', new THREE.Float32BufferAttribute(connectionColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });

    connections = new THREE.LineSegments(connectionGeo, lineMat);
    scene.add(connections);
  }

  // ── Glow core ──
  const glowGeo = new THREE.SphereGeometry(0.8, 16, 16);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x6F4E9C,
    transparent: true,
    opacity: 0.15,
  });
  const glowCore = new THREE.Mesh(glowGeo, glowMat);
  scene.add(glowCore);

  // ── Events ──
  document.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });

  initialized = true;
  animate();
}

function onMouseMove(e) {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
}

function onScroll() {
  scrollY = window.scrollY / (document.body.scrollHeight - window.innerHeight);
}

function onResize() {
  const container = document.getElementById('three-container');
  if (!container || !camera || !renderer) return;
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

function animate() {
  if (!initialized) return;
  animationId = requestAnimationFrame(animate);

  const t = clock.getElapsedTime();

  if (particles) {
    // Slow base rotation
    particles.rotation.y += 0.0015;
    particles.rotation.x = Math.sin(t * 0.1) * 0.05;

    // Mouse reaction
    particles.rotation.y += mouseX * 0.005;
    particles.rotation.x += mouseY * 0.004;

    // Scroll reaction — scale + drift
    const scale = 1 + scrollY * 0.4;
    particles.scale.set(scale, scale, scale);

    material.opacity = 0.35 + (1 - scrollY) * 0.6;
    material.size = 0.2 + (1 - scrollY) * 0.25;

    // Pulse
    const pulse = 1 + Math.sin(t * 0.5) * 0.02;
    particles.scale.multiplyScalar(pulse);
  }

  if (connections) {
    connections.rotation.copy(particles.rotation);
    connections.material.opacity = 0.1 + (1 - scrollY) * 0.2;
  }

  renderer.render(scene, camera);
}

function checkWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

export function destroyScene3D() {
  initialized = false;
  if (animationId) cancelAnimationFrame(animationId);
  if (renderer) {
    renderer.dispose();
    renderer.domElement.remove();
  }
  if (particles) {
    particles.geometry.dispose();
    particles.material.dispose();
  }
  if (connections) {
    connections.geometry.dispose();
    connections.material.dispose();
  }
  document.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onResize);
}

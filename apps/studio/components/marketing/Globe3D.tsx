'use client';

import { useEffect, useRef } from 'react';

/**
 * A live WebGL "aurora globe": a glowing point-cloud sphere wrapped in a faint wire lattice,
 * slowly auto-rotating with subtle mouse parallax. Amber surface points over a violet lattice,
 * echoing the two-tone Aurora palette. Three.js is imported lazily inside the effect so it
 * code-splits to the client and never enters the server bundle. Reduced-motion → a static frame.
 */
export function Globe3D({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let raf = 0;
    let disposed = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let cleanup: (() => void) | null = null;

    (async () => {
      const THREE = await import('three');
      if (disposed || !mount) return;

      const reduce =
        typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

      const width = mount.clientWidth || 480;
      const height = mount.clientHeight || 480;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 4.6;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const globe = new THREE.Group();
      scene.add(globe);

      const R = 1.6;

      // ── Surface point cloud (fibonacci sphere) ─────────────────────────────
      const COUNT = 6500;
      const positions = new Float32Array(COUNT * 3);
      const colors = new Float32Array(COUNT * 3);
      const warm = new THREE.Color(0xff9a3d); // amber
      const hot = new THREE.Color(0xffd9a0); // bright core points
      const cool = new THREE.Color(0x7c5cff); // occasional violet
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < COUNT; i++) {
        const y = 1 - (i / (COUNT - 1)) * 2; // 1 → -1
        const rad = Math.sqrt(1 - y * y);
        const theta = golden * i;
        const x = Math.cos(theta) * rad;
        const z = Math.sin(theta) * rad;
        positions[i * 3] = x * R;
        positions[i * 3 + 1] = y * R;
        positions[i * 3 + 2] = z * R;

        // Mostly amber, a few bright, a rare violet, banded brighter near the equator.
        const t = (i * 2654435761) % 100;
        const c = t < 4 ? cool : t < 16 ? hot : warm;
        const equator = 0.55 + 0.45 * (1 - Math.abs(y));
        colors[i * 3] = c.r * equator;
        colors[i * 3 + 1] = c.g * equator;
        colors[i * 3 + 2] = c.b * equator;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const pMat = new THREE.PointsMaterial({
        size: 0.032,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });
      globe.add(new THREE.Points(pGeo, pMat));

      // ── Wire lattice (structure) ───────────────────────────────────────────
      const wireGeo = new THREE.SphereGeometry(R * 0.985, 40, 26);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x5b4bd0,
        wireframe: true,
        transparent: true,
        opacity: 0.09,
      });
      globe.add(new THREE.Mesh(wireGeo, wireMat));

      // ── Inner fill so the far side doesn't show through as clutter ─────────
      const coreGeo = new THREE.SphereGeometry(R * 0.965, 48, 32);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x0b0b16, transparent: true, opacity: 0.92 });
      globe.add(new THREE.Mesh(coreGeo, coreMat));

      // ── Atmosphere rim glow (additive back-lit shell) ──────────────────────
      const atmoGeo = new THREE.SphereGeometry(R * 1.18, 48, 32);
      const atmoMat = new THREE.ShaderMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { uColor: { value: new THREE.Color(0xff8a3d) } },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          uniform vec3 uColor;
          void main() {
            float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
            gl_FragColor = vec4(uColor, 1.0) * intensity;
          }
        `,
      });
      scene.add(new THREE.Mesh(atmoGeo, atmoMat));

      globe.rotation.x = 0.32;
      globe.rotation.z = 0.08;

      // ── Interaction: subtle mouse parallax ─────────────────────────────────
      let targetX = 0;
      let targetY = 0;
      function onPointer(e: PointerEvent) {
        const r = mount!.getBoundingClientRect();
        targetX = ((e.clientX - r.left) / r.width - 0.5) * 0.5;
        targetY = ((e.clientY - r.top) / r.height - 0.5) * 0.4;
      }
      window.addEventListener('pointermove', onPointer);

      function render() {
        if (!reduce) globe.rotation.y += 0.0016;
        globe.rotation.x += (0.32 + targetY - globe.rotation.x) * 0.05;
        camera.position.x += (targetX * 1.2 - camera.position.x) * 0.05;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      }

      function loop() {
        render();
        raf = requestAnimationFrame(loop);
      }
      if (reduce) {
        render();
      } else {
        loop();
      }

      // ── Resize ─────────────────────────────────────────────────────────────
      const ro = new ResizeObserver(() => {
        const w = mount.clientWidth || width;
        const h = mount.clientHeight || height;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      });
      ro.observe(mount);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('pointermove', onPointer);
        ro.disconnect();
        renderer.dispose();
        pGeo.dispose();
        pMat.dispose();
        wireGeo.dispose();
        wireMat.dispose();
        coreGeo.dispose();
        coreMat.dispose();
        atmoGeo.dispose();
        atmoMat.dispose();
        if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      };
    })();

    return () => {
      disposed = true;
      if (cleanup) cleanup();
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden />;
}

export default Globe3D;

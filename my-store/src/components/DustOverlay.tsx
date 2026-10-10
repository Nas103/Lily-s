"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const COUNT = 560;
const COLOR: [number, number, number] = [0xe8 / 255, 0xa1 / 255, 0x0c / 255];

const VERT = `
uniform float uProgress;
uniform float uTime;
uniform float uPixelRatio;
uniform vec2 uResolution;
uniform vec4 uRect;
attribute float aDelay;
attribute float aSize;
attribute float aSeed;
varying float vAlpha;
void main() {
  float dur = max(1.0 - aDelay, 0.001);
  float t = clamp((uProgress - aDelay) / dur, 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);
  vec2 target = position.xy;
  vec2 start = target + vec2(0.0, 0.85);
  vec2 uv = mix(start, target, t);
  uv.x += sin(uTime * 0.5 + aSeed * 20.0) * 0.025 * t;
  uv.y += cos(uTime * 0.4 + aSeed * 12.0) * 0.012 * t;
  vec2 pixel = uRect.xy + uv * uRect.zw;
  vec2 clip = vec2(pixel.x / uResolution.x * 2.0 - 1.0, 1.0 - pixel.y / uResolution.y * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
  float edge = smoothstep(0.0, 0.12, uv.y) * (1.0 - smoothstep(0.88, 1.0, uv.y));
  edge *= smoothstep(0.0, 0.06, uv.x) * (1.0 - smoothstep(0.94, 1.0, uv.x));
  gl_PointSize = aSize * uPixelRatio * (0.5 + 0.5 * t);
  vAlpha = t * edge * (0.3 + 0.5 * fract(aSeed * 7.3));
}
`;

const FRAG = `
precision mediump float;
uniform vec3 uColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  float alpha = a * vAlpha * 0.5;
  if (alpha < 0.004) discard;
  gl_FragColor = vec4(uColor, alpha);
}
`;

type Scene = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.Camera;
  material: THREE.ShaderMaterial;
  geometry: THREE.BufferGeometry;
  observer: ResizeObserver;
};

export default function DustOverlay({ activeEl }: { activeEl: HTMLElement | null }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const activeRef = useRef<HTMLElement | null>(null);
  const startRef = useRef<(() => void) | null>(null);
  const flow = useRef({
    progress: 0,
    target: 0,
    raf: 0,
    time: 0,
    lastEl: null as HTMLElement | null,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const f = flow.current;

    if (activeEl && !sceneRef.current) {
      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      } catch {
        return;
      }
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      const scene = new THREE.Scene();
      const camera = new THREE.Camera();

      const positions = new Float32Array(COUNT * 3);
      const delays = new Float32Array(COUNT);
      const sizes = new Float32Array(COUNT);
      const seeds = new Float32Array(COUNT);
      for (let i = 0; i < COUNT; i++) {
        positions[i * 3] = 0.06 + Math.random() * 0.88;
        positions[i * 3 + 1] = 0.06 + Math.random() * 0.88;
        positions[i * 3 + 2] = 0;
        delays[i] = Math.random() * 0.7;
        sizes[i] = 2 + Math.random() * 5;
        seeds[i] = Math.random();
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("aDelay", new THREE.BufferAttribute(delays, 1));
      geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

      const material = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.NormalBlending,
        uniforms: {
          uProgress: { value: 0 },
          uTime: { value: 0 },
          uPixelRatio: { value: 1 },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uRect: { value: new THREE.Vector4(0, 0, 0, 0) },
          uColor: { value: new THREE.Vector3(...COLOR) },
        },
      });

      const points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      scene.add(points);

      const resize = () => {
        const w = canvas.clientWidth || 1;
        const h = canvas.clientHeight || 1;
        const pr = Math.min(window.devicePixelRatio || 1, 2);
        renderer.setPixelRatio(pr);
        renderer.setSize(w, h, false);
        material.uniforms.uPixelRatio.value = pr;
        material.uniforms.uResolution.value.set(w, h);
      };

      const tick = () => {
        const s = sceneRef.current;
        if (!s || !canvasRef.current) {
          f.raf = 0;
          return;
        }
        const dt = 1 / 60;
        f.time += dt;
        if (f.progress !== f.target) {
          const dir = f.target > f.progress ? 1 : -1;
          const speed = dir > 0 ? 1 / 3.6 : 1 / 1.1;
          f.progress = Math.min(1, Math.max(0, f.progress + dir * speed * dt));
        }

        const el = activeRef.current ?? f.lastEl;
        if (el) {
          const c = canvasRef.current.getBoundingClientRect();
          const r = el.getBoundingClientRect();
          s.material.uniforms.uRect.value.set(
            r.left - c.left,
            r.top - c.top,
            r.width,
            r.height
          );
        }
        s.material.uniforms.uProgress.value = f.progress;
        s.material.uniforms.uTime.value = f.time;
        s.renderer.render(s.scene, s.camera);

        const keep = f.progress !== f.target || activeRef.current !== null;
        f.raf = keep ? requestAnimationFrame(tick) : 0;
      };

      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(canvas);

      sceneRef.current = { renderer, scene, camera, material, geometry, observer };
      startRef.current = () => {
        if (!f.raf) f.raf = requestAnimationFrame(tick);
      };
    }

    activeRef.current = activeEl;
    if (activeEl) {
      if (f.lastEl !== activeEl) {
        f.progress = 0;
        f.lastEl = activeEl;
      }
      f.target = 1;
    } else {
      f.target = 0;
    }
    startRef.current?.();
  }, [activeEl]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(flow.current.raf);
      const s = sceneRef.current;
      if (s) {
        s.observer.disconnect();
        s.geometry.dispose();
        s.material.dispose();
        s.renderer.dispose();
        s.renderer.forceContextLoss();
        sceneRef.current = null;
      }
      startRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
    />
  );
}
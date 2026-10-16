'use client';

import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { isSmallScreen } from '@/lib/smallScreen';

type FluxLinesDirection = 'up' | 'down' | 'left' | 'right';

export interface FluxLinesProps {
  colors?: string[];
  backgroundColor?: string;
  speed?: number;
  glow?: number;
  lineWidth?: number;
  rimWidth?: number;
  scale?: number;
  turbulence?: number;
  fluidity?: number;
  sharpness?: number;
  shimmer?: number;
  fade?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  mouseRadius?: number;
  clickSwirl?: boolean;
  noiseFreq?: number;
  noiseAmp?: number;
  flowDirection?: FluxLinesDirection;
  intro?: boolean;
  lightMode?: boolean;
  className?: string;
}

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;

uniform vec2  iResolution;
uniform float iTime;
uniform vec3  uColor0;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform vec3  uColor5;
uniform vec3  uColor6;
uniform vec3  uColor7;
uniform int   uColorCount;
uniform vec3  uBackgroundColor;
uniform float uSpeed;
uniform float uGlow;
uniform float uLineWidth;
uniform float uRimWidth;
uniform float uScale;
uniform float uTurbulence;
uniform float uFluidity;
uniform float uSharpness;
uniform float uShimmer;
uniform float uFade;
uniform float uOpacity;
uniform vec2  uMouse;
uniform float uMouseStrength;
uniform float uMouseRadius;
uniform bool  uEnableMouse;
uniform float uNoiseFreq;
uniform float uNoiseAmp;
uniform vec2  uFlowDir;
uniform float uIntro;
uniform float uSwirl;

out vec4 fragColor;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

vec3 getColor(int i) {
  if (i <= 0) return uColor0;
  if (i == 1) return uColor1;
  if (i == 2) return uColor2;
  if (i == 3) return uColor3;
  if (i == 4) return uColor4;
  if (i == 5) return uColor5;
  if (i == 6) return uColor6;
  return uColor7;
}

vec3 palette(float h) {
  h = clamp(h, 0.0, 1.0);
  float scaled = h * float(max(uColorCount - 1, 1));
  int idx = int(floor(scaled));
  float t = fract(scaled);
  return mix(getColor(idx), getColor(idx + 1), t);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
  vec2 p = uv * uScale;

  float ang = uSwirl * 1.6;
  float cs = cos(ang);
  float sn = sin(ang);
  p = mat2(cs, -sn, sn, cs) * p;

  vec2 flow = p + uFlowDir * iTime * uSpeed;

  float n1 = noise(flow * uNoiseFreq + iTime * 0.05);
  float n2 = noise(flow * uNoiseFreq * 2.0 - iTime * 0.03);
  vec2 warp = vec2(n1 - 0.5, n2 - 0.5) * uTurbulence * uNoiseAmp;
  vec2 q = flow + warp * (1.0 + uFluidity * 2.0);

  float d  = abs(sin(q.x * 1.2 + q.y * 0.8));
  float d2 = abs(sin(q.y * 1.7 - q.x * 0.9));

  float base = smoothstep(uLineWidth, 0.0, d);
  float rim  = smoothstep(uLineWidth + uRimWidth, uLineWidth, d);
  float rim2 = smoothstep(uLineWidth + uRimWidth, uLineWidth, d2);

  float energy = base + rim * 0.5 + rim2 * 0.35;
  energy = pow(clamp(energy, 0.0, 1.0), uSharpness);

  float shimmer = 0.5 + 0.5 * sin(q.x * 3.0 + q.y * 3.0 + iTime * 2.0);
  energy *= mix(1.0, shimmer, uShimmer);

  float h = fract(q.x * 0.15 + q.y * 0.1 + iTime * 0.02);
  vec3 col = palette(h);

  if (uEnableMouse) {
    vec2 m = (uMouse - 0.5) * 2.0 * uScale;
    float md = length(p - m);
    energy += smoothstep(uMouseRadius * uScale, 0.0, md) * uMouseStrength;
  }

  float vig = smoothstep(1.2, 0.2, length(uv) * uFade);
  energy *= mix(1.0, clamp(vig, 0.0, 1.0), 0.8);
  energy *= uIntro;
  energy *= uOpacity;

  vec3 glowCol = col * energy * uGlow;
  vec3 outCol = mix(uBackgroundColor, col, clamp(energy, 0.0, 1.0));
  outCol += glowCol * 0.5;

  fragColor = vec4(clamp(outCol, 0.0, 1.0), 1.0);
}
`;

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
};

const directionVector = (dir: FluxLinesDirection): [number, number] => {
  switch (dir) {
    case 'up':
      return [0, -1];
    case 'down':
      return [0, 1];
    case 'left':
      return [-1, 0];
    case 'right':
      return [1, 0];
    default:
      return [0, 1];
  }
};

const MAX_COLORS = 8;

const FluxLines: React.FC<FluxLinesProps> = ({
  colors = ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
  backgroundColor,
  speed = 0.5,
  glow = 2,
  lineWidth = 1,
  rimWidth = 0.2,
  scale = 1.6,
  turbulence = 1,
  fluidity = 0.1,
  sharpness = 2.5,
  shimmer = 1.5,
  fade = 1,
  opacity = 1,
  mouseInteraction = true,
  mouseStrength = 1,
  mouseRadius = 0.35,
  clickSwirl = true,
  noiseFreq = 0.3,
  noiseAmp = 1,
  flowDirection = 'down',
  intro = true,
  lightMode = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const programRef = useRef<InstanceType<typeof Program> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      webgl: 2,
      alpha: false,
      premultipliedAlpha: false,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, isSmallScreen() ? 1 : 2),
    });

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);
    const canvas = gl.canvas;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uColor0: { value: new Float32Array([1, 1, 1]) },
        uColor1: { value: new Float32Array([1, 1, 1]) },
        uColor2: { value: new Float32Array([1, 1, 1]) },
        uColor3: { value: new Float32Array([1, 1, 1]) },
        uColor4: { value: new Float32Array([1, 1, 1]) },
        uColor5: { value: new Float32Array([1, 1, 1]) },
        uColor6: { value: new Float32Array([1, 1, 1]) },
        uColor7: { value: new Float32Array([1, 1, 1]) },
        uColorCount: { value: 3 },
        uBackgroundColor: { value: new Float32Array([0, 0, 0]) },
        uSpeed: { value: 0.5 },
        uGlow: { value: 2 },
        uLineWidth: { value: 1 },
        uRimWidth: { value: 0.2 },
        uScale: { value: 1.6 },
        uTurbulence: { value: 1 },
        uFluidity: { value: 0.1 },
        uSharpness: { value: 2.5 },
        uShimmer: { value: 1.5 },
        uFade: { value: 1 },
        uOpacity: { value: 1 },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uMouseStrength: { value: 1 },
        uMouseRadius: { value: 0.35 },
        uEnableMouse: { value: true },
        uNoiseFreq: { value: 0.3 },
        uNoiseAmp: { value: 1 },
        uFlowDir: { value: new Float32Array([0, 1]) },
        uIntro: { value: 0 },
        uSwirl: { value: 0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    programRef.current = program;

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      renderer.setSize(w, h);
      const res = program.uniforms.iResolution.value as Float32Array;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
      renderer.render({ scene: mesh });
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    const targetMouse: [number, number] = [0.5, 0.5];
    const currentMouse: [number, number] = [0.5, 0.5];

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouse[0] = (e.clientX - rect.left) / rect.width;
      targetMouse[1] = 1.0 - (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let swirl = 0;
    let swirlTarget = 0;
    const handleClick = () => {
      swirlTarget = 1;
    };
    if (clickSwirl) window.addEventListener('pointerdown', handleClick);

    let raf = 0;
    const start = performance.now();
    const INTRO_MS = 1200;
    let introStart = start;

    const loop = (t: number) => {
      program.uniforms.iTime.value = (t - start) * 0.001;

      currentMouse[0] += 0.06 * (targetMouse[0] - currentMouse[0]);
      currentMouse[1] += 0.06 * (targetMouse[1] - currentMouse[1]);
      const m = program.uniforms.uMouse.value as Float32Array;
      m[0] = currentMouse[0];
      m[1] = currentMouse[1];

      swirl += 0.08 * (swirlTarget - swirl);
      swirlTarget *= 0.94;
      program.uniforms.uSwirl.value = swirl;

      program.uniforms.uIntro.value = intro ? Math.min(1, (t - introStart) / INTRO_MS) : 1;

      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };

    let isVisible = true;
    let isPageVisible = !document.hidden;
    const tryStart = () => {
      if (isVisible && isPageVisible && raf === 0) {
        introStart = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    const tryStop = () => {
      if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) tryStart();
        else tryStop();
      },
      { threshold: 0 }
    );
    io.observe(container);

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) tryStart();
      else tryStop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    tryStart();

    return () => {
      tryStop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('mousemove', handleMouseMove);
      if (clickSwirl) window.removeEventListener('pointerdown', handleClick);
      programRef.current = null;
      if (canvas.parentNode === container) container.removeChild(canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [clickSwirl, intro]);

  useEffect(() => {
    const program = programRef.current;
    if (!program) return;
    const u = program.uniforms;

    u.uSpeed.value = speed;
    u.uGlow.value = glow;
    u.uLineWidth.value = lineWidth;
    u.uRimWidth.value = rimWidth;
    u.uScale.value = scale;
    u.uTurbulence.value = turbulence;
    u.uFluidity.value = fluidity;
    u.uSharpness.value = sharpness;
    u.uShimmer.value = shimmer;
    u.uFade.value = fade;
    u.uOpacity.value = opacity;
    u.uMouseStrength.value = mouseStrength;
    u.uMouseRadius.value = mouseRadius;
    u.uEnableMouse.value = mouseInteraction;
    u.uNoiseFreq.value = noiseFreq;
    u.uNoiseAmp.value = noiseAmp;

    const bg = hexToRgb(backgroundColor ?? (lightMode ? '#ffffff' : '#000000'));
    const bgc = u.uBackgroundColor.value as Float32Array;
    bgc[0] = bg[0];
    bgc[1] = bg[1];
    bgc[2] = bg[2];

    const dir = directionVector(flowDirection);
    const fd = u.uFlowDir.value as Float32Array;
    fd[0] = dir[0];
    fd[1] = dir[1];

    const list = colors.slice(0, MAX_COLORS);
    const keys = ['uColor0', 'uColor1', 'uColor2', 'uColor3', 'uColor4', 'uColor5', 'uColor6', 'uColor7'];
    keys.forEach((key, i) => {
      const rgb = hexToRgb(list[i] ?? list[list.length - 1] ?? '#ffffff');
      const target = u[key].value as Float32Array;
      target[0] = rgb[0];
      target[1] = rgb[1];
      target[2] = rgb[2];
    });
    u.uColorCount.value = Math.max(1, list.length);
  }, [
    colors,
    backgroundColor,
    speed,
    glow,
    lineWidth,
    rimWidth,
    scale,
    turbulence,
    fluidity,
    sharpness,
    shimmer,
    fade,
    opacity,
    mouseInteraction,
    mouseStrength,
    mouseRadius,
    noiseFreq,
    noiseAmp,
    flowDirection,
    lightMode,
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden ${className}`.trim()}
    />
  );
};

export default FluxLines;

import { useCallback, useRef } from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import { useFocusEffect } from 'expo-router';

export type MoltenMetalColorMode = 'molten' | 'ember' | 'frost';

export interface MoltenMetalGLProps {
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
  scale?: number;
  detail?: number;
  glow?: number;
  coreSize?: number;
  swirl?: number;
  fold?: number;
  blackPoint?: number;
  brightness?: number;
  colorMode?: MoltenMetalColorMode;
  grain?: boolean;
  grainIntensity?: number;
  opacity?: number;
  style?: StyleProp<ViewStyle>;
}

const vertexSrc = `attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentSrc = `precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uScale;
uniform float uDetail;
uniform float uGlow;
uniform float uCoreSize;
uniform float uSwirl;
uniform float uFold;
uniform float uBlackPoint;
uniform float uBrightness;
uniform float uColorMode;
uniform float uGrainIntensity;
uniform float uOpacity;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

void main() {
  float time = iTime * uSpeed;
  vec2 p = uScale * ((gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y) - 0.5;

  vec2 i = p;
  float c = 0.0;
  float r = length(p + vec2(sin(time), sin(time * 0.3 + 5.0)) * 0.5);
  float d = length(p);
  float rot = d + time + p.x * uSwirl;

  float cosRot = cos(rot);
  mat2 warp = mat2(cos(rot - sin(time / 5.0)), sin(rot), -sin(cosRot - time), cosRot) * uFold;
  float glowCore = uGlow * uCoreSize;

  for (float n = 0.0; n < 8.0; n++) {
    if (n >= uDetail) break;
    p *= warp;
    float t = r - time / (n + 3.0);
    i -= p + vec2(cos(t - i.x - r) + sin(t + i.y), sin(t - i.y) + cos(t + i.x) + r);
    c += glowCore / length(vec2(sin(i.x + t), cos(i.y + t)));
  }

  c /= 6.0;

  float intensity = max(c - uBlackPoint, 0.0) * uBrightness;
  float g = clamp(intensity, 0.0, 1.0);

  float mid = 0.5;
  if (uColorMode > 1.5) {
    mid = 0.65;
  } else if (uColorMode > 0.5) {
    mid = 0.35;
  }

  vec3 col = mix(uColor1, uColor2, smoothstep(0.0, mid, g));
  col = mix(col, uColor3, smoothstep(mid, 1.0, g));

  float gr = fract(sin(dot(gl_FragCoord.xy + iTime, vec2(12.9898, 78.233))) * 43758.5453);
  float a = clamp(g + (gr - 0.5) * uGrainIntensity, 0.0, 1.0) * uOpacity;

  gl_FragColor = vec4(col * a, a);
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

const colorModeToFloat = (mode: MoltenMetalColorMode): number =>
  mode === 'ember' ? 1 : mode === 'frost' ? 2 : 0;

export default function MoltenMetalGL({
  color1 = '#4a2e0a',
  color2 = '#f5b301',
  color3 = '#fff7e6',
  speed = 0.3,
  scale = 4,
  detail = 3,
  glow = 1.5,
  coreSize = 0.12,
  swirl = 1,
  fold = -0.2,
  blackPoint = 0.04,
  brightness = 1.25,
  colorMode = 'molten',
  grain = true,
  grainIntensity = 0.04,
  opacity = 0.95,
  style,
}: MoltenMetalGLProps) {
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const startRef = useRef<() => void>(() => {});
  const stopRef = useRef<() => void>(() => {});

  const onContextCreate = useCallback(
    (gl: ExpoWebGLRenderingContext) => {
      const vs = gl.createShader(gl.VERTEX_SHADER)!;
      gl.shaderSource(vs, vertexSrc);
      gl.compileShader(vs);

      const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
      gl.shaderSource(fs, fragmentSrc);
      gl.compileShader(fs);

      if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        console.warn('MoltenMetalGL fragment shader error:', gl.getShaderInfoLog(fs));
      }

      const program = gl.createProgram()!;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.useProgram(program);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW
      );
      const positionLoc = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

      const u = {
        iResolution: gl.getUniformLocation(program, 'iResolution'),
        iTime: gl.getUniformLocation(program, 'iTime'),
        uSpeed: gl.getUniformLocation(program, 'uSpeed'),
        uScale: gl.getUniformLocation(program, 'uScale'),
        uDetail: gl.getUniformLocation(program, 'uDetail'),
        uGlow: gl.getUniformLocation(program, 'uGlow'),
        uCoreSize: gl.getUniformLocation(program, 'uCoreSize'),
        uSwirl: gl.getUniformLocation(program, 'uSwirl'),
        uFold: gl.getUniformLocation(program, 'uFold'),
        uBlackPoint: gl.getUniformLocation(program, 'uBlackPoint'),
        uBrightness: gl.getUniformLocation(program, 'uBrightness'),
        uColorMode: gl.getUniformLocation(program, 'uColorMode'),
        uGrainIntensity: gl.getUniformLocation(program, 'uGrainIntensity'),
        uOpacity: gl.getUniformLocation(program, 'uOpacity'),
        uColor1: gl.getUniformLocation(program, 'uColor1'),
        uColor2: gl.getUniformLocation(program, 'uColor2'),
        uColor3: gl.getUniformLocation(program, 'uColor3'),
      };

      const c1 = hexToRgb(color1);
      const c2 = hexToRgb(color2);
      const c3 = hexToRgb(color3);

      gl.uniform1f(u.uSpeed, speed);
      gl.uniform1f(u.uScale, scale);
      gl.uniform1f(u.uDetail, detail);
      gl.uniform1f(u.uGlow, glow);
      gl.uniform1f(u.uCoreSize, Math.max(coreSize, 0.001));
      gl.uniform1f(u.uSwirl, swirl);
      gl.uniform1f(u.uFold, fold);
      gl.uniform1f(u.uBlackPoint, blackPoint);
      gl.uniform1f(u.uBrightness, brightness);
      gl.uniform1f(u.uColorMode, colorModeToFloat(colorMode));
      gl.uniform1f(u.uGrainIntensity, grain ? grainIntensity : 0);
      gl.uniform1f(u.uOpacity, opacity);
      gl.uniform3f(u.uColor1, c1[0], c1[1], c1[2]);
      gl.uniform3f(u.uColor2, c2[0], c2[1], c2[2]);
      gl.uniform3f(u.uColor3, c3[0], c3[1], c3[2]);

      gl.clearColor(0, 0, 0, 1);

      const t0 = Date.now();
      const loop = () => {
        if (!runningRef.current) return;
        const t = (Date.now() - t0) / 1000;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.uniform2f(u.iResolution, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.uniform1f(u.iTime, t);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.endFrameEXP();
        rafRef.current = requestAnimationFrame(loop);
      };

      startRef.current = () => {
        if (runningRef.current) return;
        runningRef.current = true;
        rafRef.current = requestAnimationFrame(loop);
      };
      stopRef.current = () => {
        runningRef.current = false;
        if (rafRef.current != null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      };

      startRef.current();
    },
    [
      color1,
      color2,
      color3,
      speed,
      scale,
      detail,
      glow,
      coreSize,
      swirl,
      fold,
      blackPoint,
      brightness,
      colorMode,
      grain,
      grainIntensity,
      opacity,
    ]
  );

  useFocusEffect(
    useCallback(() => {
      startRef.current();
      return () => stopRef.current();
    }, [])
  );

  return (
    <GLView
      style={[StyleSheet.absoluteFill, style]}
      onContextCreate={onContextCreate}
    />
  );
}
"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

export type HorizonBloomHandle = {
  bloom: (x?: number, strength?: number) => void;
  replay: () => void;
};

export type HorizonBloomProps = {
  colors?: [string, string];
  backgroundColor?: string;
  horizon?: number;
  curvature?: number;
  tilt?: number;
  sunPosition?: number;
  sunrise?: number;
  spread?: number;
  atmosphere?: number;
  thickness?: number;
  rim?: number;
  flare?: number;
  airglow?: number;
  clouds?: number;
  stars?: number;
  aurora?: number;
  autoAurora?: boolean;
  speed?: number;
  drift?: number;
  parallax?: number;
  bloom?: number;
  grain?: number;
  interactive?: boolean;
  intro?: boolean;
  paused?: boolean;
  dpr?: number;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

type RGB = [number, number, number];

const DEFAULTS = {
  colors: ["#F5B301", "#180D02"] as [string, string],
  backgroundColor: "transparent",
  horizon: 0.72,
  curvature: 1,
  tilt: 0,
  sunPosition: 0.15,
  sunrise: 1,
  spread: 0.4,
  atmosphere: 1,
  thickness: 1,
  rim: 1,
  flare: 1,
  airglow: 0.5,
  clouds: 0.5,
  stars: 0.5,
  aurora: 1,
  autoAurora: false,
  speed: 0.5,
  drift: 0.5,
  parallax: 0.5,
  bloom: 0.5,
  grain: 0.25,
  interactive: true,
  intro: true,
  paused: false,
  dpr: 2,
};

type ResolvedProps = { [K in keyof typeof DEFAULTS]: (typeof DEFAULTS)[K] };

const resolve = (o: HorizonBloomProps): ResolvedProps => {
  const out = { ...DEFAULTS } as ResolvedProps;
  for (const k of Object.keys(DEFAULTS) as Array<keyof typeof DEFAULTS>) {
    const v = o[k] as (typeof DEFAULTS)[keyof typeof DEFAULTS] | undefined;
    if (v !== undefined) (out as Record<string, unknown>)[k] = v;
  }
  return out;
};

const AURORA_SECONDS = 3.4;
const INTRO_SECONDS = 1.9;
const NOISE_TILE = 128;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const hexToRgb = (hex: string): RGB => {
  let h = hex.trim().replace("#", "");
  if (h.length === 3 || h.length === 4)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  if (h.length !== 6 || /[^0-9a-f]/i.test(h)) return [245, 179, 1];
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const mixRgb = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

const rgba = (c: RGB, a: number) =>
  `rgba(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(c[2])}, ${Math.max(
    0,
    Math.min(1, a)
  )})`;

type Star = { x: number; y: number; r: number; phase: number; rate: number };
type AuroraEvent = { x: number; born: number; strength: number };

type Scene = {
  w: number;
  h: number;
  stars: Star[];
  auroras: AuroraEvent[];
  wallT: number;
  t: number;
  introT: number;
  nextAuto: number;
  ptrX: number;
  ptrY: number;
  curX: number;
  curY: number;
  visible: boolean;
  dirty: boolean;
  reduced: boolean;
  noise: CanvasPattern | null;
};

const makeScene = (): Scene => ({
  w: 0,
  h: 0,
  stars: [],
  auroras: [],
  wallT: 0,
  t: 0,
  introT: 0,
  nextAuto: 1.6,
  ptrX: 0,
  ptrY: 0,
  curX: 0,
  curY: 0,
  visible: true,
  dirty: true,
  reduced: false,
  noise: null,
});

const makeStars = (w: number, h: number, horizonY: number): Star[] => {
  const count = Math.min(180, Math.max(40, Math.round((w * horizonY) / 5200)));
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * Math.max(1, horizonY),
      r: 0.4 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
      rate: 0.6 + Math.random() * 2.2,
    });
  }
  return stars;
};

const makeNoise = (
  ctx: CanvasRenderingContext2D
): CanvasPattern | null => {
  const tile = document.createElement("canvas");
  tile.width = NOISE_TILE;
  tile.height = NOISE_TILE;
  const tctx = tile.getContext("2d");
  if (!tctx) return null;
  const img = tctx.createImageData(NOISE_TILE, NOISE_TILE);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 88 + Math.random() * 80;
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  tctx.putImageData(img, 0, 0);
  return ctx.createPattern(tile, "repeat");
};

function HorizonBloom(
  props: HorizonBloomProps,
  ref: React.ForwardedRef<HorizonBloomHandle>
) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const propsRef = useRef<HorizonBloomProps>(props);
  const sceneRef = useRef<Scene | null>(null);
  const bloomFn = useRef<((x?: number, strength?: number) => void) | null>(null);
  const replayFn = useRef<(() => void) | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      bloom: (x?: number, strength?: number) => bloomFn.current?.(x, strength),
      replay: () => replayFn.current?.(),
    }),
    []
  );

  useEffect(() => {
    propsRef.current = props;
    if (sceneRef.current) sceneRef.current.dirty = true;
  });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scene = makeScene();
    sceneRef.current = scene;
    if (!scene.noise) scene.noise = makeNoise(ctx);

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    scene.reduced = reducedQuery.matches;
    const onReduced = () => {
      scene.reduced = reducedQuery.matches;
      scene.dirty = true;
    };
    reducedQuery.addEventListener("change", onReduced);

    const spawn = (x: number, strength: number) => {
      scene.auroras.push({
        x: clamp01(x),
        born: scene.wallT,
        strength: Math.max(0.2, Math.min(2, strength)),
      });
      if (scene.auroras.length > 6) scene.auroras.shift();
      scene.dirty = true;
    };
    bloomFn.current = (x?: number, strength?: number) =>
      spawn(x ?? 0.5, strength ?? 1);
    replayFn.current = () => {
      scene.introT = 0;
      scene.dirty = true;
    };

    const onPointerMove = (e: PointerEvent) => {
      const p = propsRef.current ?? DEFAULTS;
      if (p.interactive === false || scene.reduced) return;
      const rect = wrapper.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      scene.ptrX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      scene.ptrY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    const onPointerLeave = () => {
      scene.ptrX = 0;
      scene.ptrY = 0;
    };
    const onPointerDown = (e: PointerEvent) => {
      const p = propsRef.current ?? DEFAULTS;
      if (p.interactive === false || scene.reduced) return;
      const target = e.target;
      if (target !== canvas && target !== wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      if (!rect.width) return;
      spawn((e.clientX - rect.left) / rect.width, 1);
    };
    wrapper.addEventListener("pointermove", onPointerMove);
    wrapper.addEventListener("pointerleave", onPointerLeave);
    wrapper.addEventListener("pointerdown", onPointerDown);

    const ro = new ResizeObserver(() => {
      const rect = wrapper.getBoundingClientRect();
      scene.w = Math.max(1, Math.round(rect.width));
      scene.h = Math.max(1, Math.round(rect.height));
      const y0 = scene.h * (propsRef.current.horizon ?? DEFAULTS.horizon);
      scene.stars = makeStars(scene.w, scene.h, y0);
      scene.dirty = true;
    });
    ro.observe(wrapper);

    const io = new IntersectionObserver(
      (entries) => {
        scene.visible = entries[0]?.isIntersecting ?? true;
        if (scene.visible) scene.dirty = true;
      },
      { rootMargin: "120px" }
    );
    io.observe(wrapper);

    const resizeBacking = (dprCap: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      const bw = Math.max(1, Math.round(scene.w * dpr));
      const bh = Math.max(1, Math.round(scene.h * dpr));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
        return dpr;
      }
      return dpr;
    };

    const draw = () => {
      const p = resolve(propsRef.current);
      const w = scene.w;
      const h = scene.h;
      if (w < 2 || h < 2) return;

      const dpr = resizeBacking(p.dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, w, h);

      if (p.backgroundColor && p.backgroundColor !== "transparent") {
        ctx.fillStyle = p.backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }

      const warm = hexToRgb(p.colors[0]);
      const cool = hexToRgb(p.colors[1]);
      const black: RGB = [0, 0, 0];
      const bronze: RGB = mixRgb(cool, warm, 0.38);
      const deep: RGB = mixRgb(cool, warm, 0.12);
      const shine: RGB = mixRgb(warm, [255, 255, 255], 0.72);

      const introProgress = scene.reduced || !p.intro
        ? 1
        : easeOut(clamp01(scene.introT / INTRO_SECONDS));
      const sunAmt = p.sunrise * introProgress;

      const halfW = w / 2;
      const theta = (Math.PI / 2) * clamp01(p.curvature) * 0.97;
      const radius = theta > 0.0015 ? halfW / Math.sin(theta) : Number.POSITIVE_INFINITY;
      const y0 = h * p.horizon;
      const curveY = (x: number) => {
        if (!Number.isFinite(radius)) return y0;
        const dx = Math.min(Math.abs(x - halfW), halfW);
        const inner = radius * radius - dx * dx;
        return y0 + radius - Math.sqrt(inner > 0 ? inner : 0);
      };

      const pts: Array<[number, number]> = [];
      const step = Math.max(4, Math.ceil(w / 220));
      for (let x = 0; x <= w; x += step) pts.push([x, curveY(x)]);
      pts.push([w, curveY(w)]);

      const skyPath = new Path2D();
      skyPath.moveTo(0, 0);
      skyPath.lineTo(w, 0);
      skyPath.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
      for (let i = pts.length - 1; i >= 0; i--) skyPath.lineTo(pts[i][0], pts[i][1]);
      skyPath.closePath();

      const curvePath = new Path2D();
      curvePath.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) curvePath.lineTo(pts[i][0], pts[i][1]);

      const planetPath = new Path2D();
      planetPath.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) planetPath.lineTo(pts[i][0], pts[i][1]);
      planetPath.lineTo(w, h);
      planetPath.lineTo(0, h);
      planetPath.closePath();

      const drift =
        Math.sin(scene.t * 0.07 * Math.max(0.05, p.drift * 2)) *
        p.drift *
        0.22;
      const sunX = halfW + (p.sunPosition + drift) * halfW;
      const sunY = curveY(sunX);

      ctx.save();

      if (p.interactive !== false && !scene.reduced) {
        const amt = p.parallax * w * 0.014;
        ctx.translate(scene.curX * amt, scene.curY * amt * 0.6);
      }

      if (p.tilt) {
        const rad = (p.tilt * Math.PI) / 180;
        const cover =
          1 +
          Math.abs(Math.sin(rad)) *
            (Math.max(w, h) / Math.max(1, Math.min(w, h)) - 1);
        ctx.translate(w / 2, h / 2);
        ctx.rotate(rad);
        ctx.scale(cover, cover);
        ctx.translate(-w / 2, -h / 2);
      }

      // ---- sky ----
      ctx.save();
      ctx.clip(skyPath);

      const skyBottom = Math.max(y0 + 1, h);
      const skyGrad = ctx.createLinearGradient(0, 0, 0, skyBottom);
      skyGrad.addColorStop(0, rgba(cool, 1));
      skyGrad.addColorStop(0.42, rgba(mixRgb(cool, warm, 0.16), 1));
      skyGrad.addColorStop(0.68, rgba(mixRgb(cool, warm, 0.4), 1));
      skyGrad.addColorStop(0.86, rgba(mixRgb(cool, warm, 0.72), 1));
      skyGrad.addColorStop(1, rgba(warm, 1));
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // stars
      if (p.stars > 0) {
        const starAlpha = p.stars * Math.min(1, introProgress * 1.6);
        ctx.globalCompositeOperation = "lighter";
        for (const s of scene.stars) {
          const tw = 0.45 + 0.55 * Math.sin(scene.t * s.rate + s.phase);
          const a = starAlpha * tw * 0.8;
          if (a <= 0.01) continue;
          ctx.fillStyle = rgba(mixRgb(warm, [255, 255, 255], 0.55), a);
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
      }

      ctx.globalCompositeOperation = "lighter";

      // airglow: a faint second band floating above the atmosphere
      if (p.airglow > 0 && introProgress > 0.15) {
        const lift = h * 0.035 + p.thickness * h * 0.03;
        const airPath = new Path2D();
        for (let i = 0; i < pts.length; i++) {
          const x = pts[i][0];
          const y = pts[i][1] - lift;
          if (i === 0) airPath.moveTo(x, y);
          else airPath.lineTo(x, y);
        }
        const airA = p.airglow * introProgress * 0.3;
        ctx.strokeStyle = rgba(warm, airA * 0.6);
        ctx.lineWidth = Math.max(1, h * 0.004);
        ctx.stroke(airPath);
        ctx.strokeStyle = rgba(warm, airA);
        ctx.lineWidth = Math.max(0.8, h * 0.0018);
        ctx.stroke(airPath);
      }

      // atmosphere glow hugging the edge, molten gold at the horizon
      const layers = 8;
      for (let i = 0; i < layers; i++) {
        const f = i / (layers - 1);
        const lw = p.thickness * h * (0.008 + f * 0.11);
        const a = p.atmosphere * introProgress * 0.3 * Math.pow(1 - f, 1.6);
        if (a <= 0.004) continue;
        ctx.strokeStyle = rgba(mixRgb(warm, shine, 0.25 * f), a);
        ctx.lineWidth = lw;
        ctx.stroke(curvePath);
      }
      // hot specular core line at the edge
      ctx.strokeStyle = rgba(mixRgb(shine, warm, 0.2), Math.min(1, 0.85 * p.atmosphere * introProgress));
      ctx.lineWidth = Math.max(0.8, h * 0.0016);
      ctx.stroke(curvePath);

      // sun bloom + flare
      const spreadW = Math.max(w * 0.05, p.spread * w);
      if (sunAmt > 0.005) {
        const gR = spreadW * 1.7;
        const g = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, gR);
        g.addColorStop(0, rgba(warm, 0.5 * sunAmt * p.atmosphere));
        g.addColorStop(0.3, rgba(warm, 0.2 * sunAmt));
        g.addColorStop(1, rgba(warm, 0));
        ctx.fillStyle = g;
        ctx.fillRect(sunX - gR, sunY - gR, gR * 2, gR * 2);

        const fR = Math.max(3, h * 0.02);
        const fg = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, fR);
        fg.addColorStop(0, rgba(mixRgb(warm, [255, 255, 255], 0.65), 0.9 * p.flare * sunAmt));
        fg.addColorStop(1, rgba(warm, 0));
        ctx.fillStyle = fg;
        ctx.fillRect(sunX - fR, sunY - fR, fR * 2, fR * 2);
      }

      // rim light spreading along the edge from the sun
      if (p.rim > 0 && sunAmt > 0.005) {
        const half = Math.max(w * 0.08, spreadW * 2.2);
        const lg = ctx.createLinearGradient(sunX - half, 0, sunX + half, 0);
        lg.addColorStop(0, rgba(warm, 0));
        lg.addColorStop(0.5, rgba(mixRgb(warm, [255, 255, 255], 0.35), p.rim * sunAmt * 0.95));
        lg.addColorStop(1, rgba(warm, 0));
        ctx.strokeStyle = lg;
        ctx.lineWidth = Math.max(1.3, h * 0.004);
        ctx.stroke(curvePath);
      }

      // aurora curtains
      if (p.aurora > 0) {
        for (const ev of scene.auroras) {
          const age = (scene.wallT - ev.born) / AURORA_SECONDS;
          if (age < 0 || age > 1) continue;
          const env = age < 0.16 ? age / 0.16 : 1 - (age - 0.16) / 0.84;
          const amt = p.aurora * ev.strength * env;
          if (amt <= 0.004) continue;
          const cx = ev.x * w;
          const rays = 4;
          const height = h * (0.2 + 0.22 * ev.strength);
          for (let i = 0; i < rays; i++) {
            const off = (i - (rays - 1) / 2) * w * 0.02;
            const x0 = cx + off;
            const yBot = curveY(x0);
            const segs = 16;
            const rayPath = new Path2D();
            rayPath.moveTo(x0, yBot);
            for (let s2 = 1; s2 <= segs; s2++) {
              const f2 = s2 / segs;
              const y = yBot - f2 * height;
              const wob =
                Math.sin(f2 * 5 + scene.t * 2.6 + i * 1.7 + ev.x * 7) *
                w *
                0.014 *
                f2;
              rayPath.lineTo(x0 + wob, y);
            }
            const rg = ctx.createLinearGradient(x0, yBot, x0, yBot - height);
            rg.addColorStop(0, rgba(warm, 0.45 * amt));
            rg.addColorStop(0.55, rgba(mixRgb(warm, cool, 0.45), 0.22 * amt));
            rg.addColorStop(1, rgba(mixRgb(warm, cool, 0.8), 0));
            ctx.strokeStyle = rg;
            ctx.lineWidth = w * 0.011;
            ctx.lineCap = "round";
            ctx.stroke(rayPath);
          }
        }
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.restore(); // end sky clip

      // ---- planet body ----
      ctx.save();
      ctx.clip(planetPath);
      const bodyGrad = ctx.createLinearGradient(0, y0, 0, h);
      bodyGrad.addColorStop(0, rgba(mixRgb(shine, warm, 0.35), 1));
      bodyGrad.addColorStop(0.06, rgba(mixRgb(shine, warm, 0.6), 1));
      bodyGrad.addColorStop(0.16, rgba(warm, 1));
      bodyGrad.addColorStop(0.34, rgba(mixRgb(warm, bronze, 0.5), 1));
      bodyGrad.addColorStop(0.56, rgba(bronze, 0.95));
      bodyGrad.addColorStop(0.78, rgba(mixRgb(cool, black, 0.6), 0.98));
      bodyGrad.addColorStop(1, rgba(black, 1));
      ctx.fillStyle = bodyGrad;
      ctx.fillRect(0, 0, w, h);

      // molten gold flows down the planet skin just below the horizon edge
      const flowGrad = ctx.createLinearGradient(0, y0, 0, y0 + h * 0.2);
      flowGrad.addColorStop(0, rgba(mixRgb(shine, warm, 0.2), 0.95));
      flowGrad.addColorStop(0.18, rgba(mixRgb(warm, bronze, 0.45), 0.55));
      flowGrad.addColorStop(0.45, rgba(bronze, 0.3));
      flowGrad.addColorStop(1, rgba(deep, 0));
      for (const fw of [h * 0.06, h * 0.12]) {
        ctx.strokeStyle = flowGrad;
        ctx.lineWidth = fw;
        ctx.stroke(curvePath);
      }

      ctx.globalCompositeOperation = "lighter";

      // light spilling onto the near surface
      if (sunAmt > 0.005) {
        const r = Math.max(w * 0.1, spreadW * 1.3);
        const pg = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, r);
        pg.addColorStop(0, rgba(warm, 0.22 * sunAmt));
        pg.addColorStop(1, rgba(warm, 0));
        ctx.fillStyle = pg;
        ctx.fillRect(sunX - r, sunY, r * 2, r);
      }

      // cloud tops catching the light below the horizon
      if (p.clouds > 0 && sunAmt > 0.005) {
        for (let i = 0; i < 5; i++) {
          const seed = i * 1.618;
          const cx =
            sunX + Math.sin(seed * 3.1 + ev_seedOffset(scene.t, i)) * w * (0.06 + i * 0.05);
          const cy = curveY(cx) + h * (0.012 + (i % 3) * 0.012);
          const r = Math.max(6, h * (0.02 + (i % 3) * 0.012));
          const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
          cg.addColorStop(0, rgba(mixRgb(warm, [255, 240, 210], 0.35), 0.3 * p.clouds * sunAmt));
          cg.addColorStop(1, rgba(warm, 0));
          ctx.fillStyle = cg;
          ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
        }
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.restore(); // end planet clip

      // ---- soft bloom over everything ----
      if (p.bloom > 0 && sunAmt > 0.005) {
        ctx.globalCompositeOperation = "lighter";
        const bR = Math.max(w * 0.12, spreadW * 2.1);
        const bg = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, bR);
        bg.addColorStop(0, rgba(warm, 0.16 * p.bloom * sunAmt));
        bg.addColorStop(1, rgba(warm, 0));
        ctx.fillStyle = bg;
        ctx.fillRect(sunX - bR, sunY - bR, bR * 2, bR * 2);
        ctx.globalCompositeOperation = "source-over";
      }

      // ---- film grain ----
      if (p.grain > 0 && scene.noise) {
        ctx.save();
        ctx.globalCompositeOperation = "overlay";
        ctx.globalAlpha = Math.min(0.45, p.grain * 0.55);
        const ox = -Math.floor(Math.random() * NOISE_TILE);
        const oy = -Math.floor(Math.random() * NOISE_TILE);
        ctx.translate(ox, oy);
        ctx.fillStyle = scene.noise;
        ctx.fillRect(0, 0, w + NOISE_TILE, h + NOISE_TILE);
        ctx.restore();
      }

      ctx.restore(); // parallax / tilt
    };

    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const p = resolve(propsRef.current);
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;

      if (!scene.visible) return;

      const animate = !p.paused && !scene.reduced;

      if (animate) {
        scene.wallT += dt;
        scene.t += dt * Math.max(0, p.speed);
        scene.introT += dt;

        scene.curX += (scene.ptrX - scene.curX) * Math.min(1, dt * 5);
        scene.curY += (scene.ptrY - scene.curY) * Math.min(1, dt * 5);

        if (p.autoAurora && scene.wallT >= scene.nextAuto) {
          scene.nextAuto = scene.wallT + 4 + Math.random() * 3.5;
          scene.auroras.push({
            x: 0.15 + Math.random() * 0.7,
            born: scene.wallT,
            strength: 0.7 + Math.random() * 0.5,
          });
        }

        scene.auroras = scene.auroras.filter(
          (e) => scene.wallT - e.born <= AURORA_SECONDS
        );

        draw();
        return;
      }

      if (scene.dirty) {
        scene.dirty = false;
        draw();
      }
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      reducedQuery.removeEventListener("change", onReduced);
      wrapper.removeEventListener("pointermove", onPointerMove);
      wrapper.removeEventListener("pointerleave", onPointerLeave);
      wrapper.removeEventListener("pointerdown", onPointerDown);
      bloomFn.current = null;
      replayFn.current = null;
      sceneRef.current = null;
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={props.className}
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: 320,
        width: "100%",
        height: "100%",
        ...props.style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
      {props.children ? (
        <div style={{ position: "absolute", inset: 0 }}>
          {props.children}
        </div>
      ) : null}
    </div>
  );
}

function ev_seedOffset(t: number, i: number) {
  return t * (0.35 + i * 0.11);
}

export default forwardRef(HorizonBloom);

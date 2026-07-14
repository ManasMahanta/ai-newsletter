"use client";

import { useEffect, useRef } from "react";

// Hero particle field: pure chaos at the top of the page that resolves into
// a clean sine wave as the visitor scrolls — the brand story ("we find the
// signal in the noise") acted out by the pixels themselves.

type Particle = {
  x: number; // 0..1 across the canvas
  noiseY: number; // 0..1 random vertical home
  drift: number; // per-particle wander speed
  phase: number; // wander phase offset
  size: number;
  alpha: number;
};

const COUNT = 130;
const WAVE_CYCLES = 2.4;

export default function SignalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random(),
      noiseY: Math.random(),
      drift: 0.3 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2,
      size: 1 + Math.random() * 1.8,
      alpha: 0.25 + Math.random() * 0.55,
    }));

    let width = 0;
    let height = 0;
    let raf = 0;
    let mouseX = 0.5;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const waveY = (x01: number, t: number) =>
      height * 0.55 +
      Math.sin(x01 * Math.PI * 2 * WAVE_CYCLES + t * 0.8) *
        height *
        0.16 *
        (0.9 + 0.1 * Math.sin(t * 0.37));

    const draw = (now: number) => {
      const t = now / 1000;
      // "Order" rises from 15% to 100% over the first ~450px of scroll:
      // the further you scroll, the more the noise locks onto the signal.
      const order = reduceMotion
        ? 1
        : Math.min(1, 0.15 + window.scrollY / 450);

      ctx.clearRect(0, 0, width, height);

      // The signal line itself, fading in as order takes hold.
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const x01 = i / 120;
        const y = waveY(x01, t) + (mouseX - 0.5) * 12;
        if (i === 0) ctx.moveTo(x01 * width, y);
        else ctx.lineTo(x01 * width, y);
      }
      ctx.strokeStyle = dark
        ? `rgba(129, 140, 248, ${0.45 * order})`
        : `rgba(79, 70, 229, ${0.35 * order})`;
      ctx.lineWidth = 1.6;
      ctx.shadowColor = dark
        ? "rgba(129, 140, 248, 0.8)"
        : "rgba(99, 102, 241, 0.5)";
      ctx.shadowBlur = 14 * order;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Particles: blend each dot between its wandering "noise" position
      // and its slot on the wave, weighted by the current order.
      for (const p of particles) {
        const wander =
          Math.sin(t * p.drift + p.phase) * 0.5 +
          Math.sin(t * p.drift * 0.63 + p.phase * 2.1) * 0.5;
        const noisePos = (p.noiseY + wander * 0.18) * height;
        const target = waveY(p.x, t) + (mouseX - 0.5) * 12;
        const y = noisePos + (target - noisePos) * order;
        const settled = order * (1 - Math.abs(noisePos - target) / height);

        ctx.beginPath();
        ctx.arc(p.x * width, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = dark
          ? `rgba(${165 - settled * 40}, ${180 - settled * 40}, 248, ${p.alpha})`
          : `rgba(${99 - settled * 20}, ${102 - settled * 30}, 241, ${p.alpha * 0.8})`;
        ctx.fill();
      }

      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    const onMouse = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth;
    };

    resize();
    window.addEventListener("resize", resize);
    if (reduceMotion) {
      draw(0); // single static frame: the resolved signal
    } else {
      window.addEventListener("mousemove", onMouse, { passive: true });
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

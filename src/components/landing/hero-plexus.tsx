"use client";

import { useEffect, useRef } from "react";

/** Atmósfera de datos; se re-tiñe con --brand-primary (igual idea que Frig). */
export function HeroPlexus({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const mouse = { x: -9999, y: -9999 };
    let t = 0;

    let palette = ["212, 160, 23", "232, 184, 74", "154, 163, 178", "255, 217, 128"];

    function retint() {
      const hex = getComputedStyle(document.documentElement).getPropertyValue("--brand-primary").trim();
      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!m) return;
      const r = parseInt(m[1], 16);
      const g = parseInt(m[2], 16);
      const b = parseInt(m[3], 16);
      palette = [
        `${r}, ${g}, ${b}`,
        `${Math.min(255, r + 40)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 20)}`,
        `154, 163, 178`,
        `${Math.min(255, r + 60)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 40)}`,
      ];
    }
    retint();

    type Cell = { x: number; y: number; heat: number; phase: number };
    let cells: Cell[] = [];

    function layout() {
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = 28;
      cells = [];
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          cells.push({ x, y, heat: 0, phase: Math.random() * Math.PI * 2 });
        }
      }
    }

    function onMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function frame() {
      t += 0.016;
      ctx!.clearRect(0, 0, w, h);
      for (const c of cells) {
        const dx = c.x - mouse.x;
        const dy = c.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        const target = dist < 120 ? 1 - dist / 120 : 0;
        c.heat += (target - c.heat) * 0.12;
        const pulse = 0.12 + 0.08 * Math.sin(t * 0.8 + c.phase) + c.heat * 0.7;
        const size = 2 + c.heat * 3;
        const color = palette[Math.floor((c.heat * (palette.length - 1)))];
        ctx!.fillStyle = `rgba(${color}, ${pulse})`;
        ctx!.fillRect(c.x - size / 2, c.y - size / 2, size, size);
      }
      raf = requestAnimationFrame(frame);
    }

    layout();
    window.addEventListener("resize", layout);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", layout);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className={className}
      aria-hidden
      style={{ width: "100%", height: "100%" }}
    />
  );
}

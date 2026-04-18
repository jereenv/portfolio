"use client";

import { useCallback, useEffect, useState } from "react";

const CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const COLORS = ["#6366f1", "#a855f7", "#ec4899", "#06b6d4", "#f59e0b"];

type Particle = {
  id: number;
  dx: number;
  dy: number;
  rot: number;
  size: number;
  color: string;
};

export function KonamiConfetti() {
  const [particles, setParticles] = useState<Particle[]>([]);

  const burst = useCallback(() => {
    const batch = Array.from({ length: 80 }, (_, i) => ({
      id: Date.now() + i,
      dx: (Math.random() - 0.5) * 800,
      dy: -(Math.random() * 500 + 300),
      rot: (Math.random() - 0.5) * 1080,
      size: Math.random() * 6 + 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    setParticles((prev) => [...prev, ...batch]);
    const ids = new Set(batch.map((b) => b.id));
    window.setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !ids.has(p.id)));
    }, 3000);
  }, []);

  useEffect(() => {
    let idx = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key;
      const expected = CODE[idx];
      const matches =
        expected.length === 1
          ? key.toLowerCase() === expected
          : key === expected;
      if (matches) {
        idx++;
        if (idx === CODE.length) {
          idx = 0;
          burst();
        }
      } else {
        idx = key === CODE[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [burst]);

  if (particles.length === 0) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-sm"
          style={
            {
              width: `${p.size}px`,
              height: `${p.size * 0.4}px`,
              backgroundColor: p.color,
              animation: `confetti 3s cubic-bezier(.2,.4,.2,1) forwards`,
              ["--dx" as string]: `${p.dx}px`,
              ["--dy" as string]: `${p.dy}px`,
              ["--rot" as string]: `${p.rot}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

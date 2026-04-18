"use client";

import { cn } from "@/lib/utils";
import { useInView } from "framer-motion";
import { Database, TrendingUp, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const STYLES = [
  {
    icon: Database,
    iconClass: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    glow: "hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.45)]",
  },
  {
    icon: Zap,
    iconClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    glow: "hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.45)]",
  },
  {
    icon: TrendingUp,
    iconClass: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    glow: "hover:shadow-[0_0_30px_-5px_rgba(236,72,153,0.45)]",
  },
];

interface StatCardProps {
  value: string;
  label: string;
  index: number;
}

function parseNumeric(value: string): { num: number; suffix: string } | null {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return null;
  return { num: parseInt(match[1], 10), suffix: match[2] };
}

function useCounter(target: string, inView: boolean, duration = 900) {
  const [display, setDisplay] = useState(() => {
    const parsed = parseNumeric(target);
    return parsed ? `0${parsed.suffix}` : target;
  });

  useEffect(() => {
    const parsed = parseNumeric(target);
    if (!parsed) {
      setDisplay(target);
      return;
    }
    if (!inView) return;

    const start = performance.now();
    let raf = 0;
    let last = -1;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(parsed.num * eased);
      if (current !== last) {
        last = current;
        setDisplay(`${current}${parsed.suffix}`);
      }
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return display;
}

export function StatCard({ value, label, index }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const display = useCounter(value, inView);
  const style = STYLES[index % STYLES.length];
  const Icon = style.icon;

  return (
    <div
      ref={ref}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/60 bg-background/40 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:bg-background/60",
        style.glow
      )}
    >
      <div
        className={cn(
          "mb-3 flex size-8 items-center justify-center rounded-lg border transition-transform group-hover:scale-110",
          style.iconClass
        )}
      >
        <Icon className="size-4" />
      </div>
      <div className="bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-xl font-bold tabular-nums text-transparent sm:text-2xl">
        {display}
      </div>
      <div className="mt-1 text-[10px] leading-tight text-muted-foreground sm:text-xs">
        {label}
      </div>
    </div>
  );
}

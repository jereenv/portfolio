"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface CardSpotlightProps {
  children: React.ReactNode;
  className?: string;
}

export function CardSpotlight({ children, className }: CardSpotlightProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn(
        "group/spotlight relative rounded-xl",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-xl",
        "before:bg-[radial-gradient(360px_circle_at_var(--mx,_-100px)_var(--my,_-100px),_rgba(168,85,247,0.18),_transparent_60%)]",
        "before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
        className
      )}
    >
      {children}
    </div>
  );
}

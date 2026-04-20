"use client";

import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PanelProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
  span?: string;
  live?: boolean;
  delay?: number;
}

export function Panel({
  title,
  subtitle,
  icon,
  className,
  contentClassName,
  children,
  span,
  live,
  delay = 0,
}: PanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-md border border-white/[0.06] bg-[#0b0f1a]/80 backdrop-blur-sm transition-colors hover:border-cyan-500/30",
        span,
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-white/[0.05] px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          {icon && (
            <span className="flex size-4 shrink-0 items-center justify-center text-cyan-400/80">
              {icon}
            </span>
          )}
          <span className="truncate font-mono text-[11px] uppercase tracking-wider text-slate-400">
            {title}
          </span>
          {subtitle && (
            <span className="hidden truncate text-[10px] text-slate-600 sm:inline">
              · {subtitle}
            </span>
          )}
          {live && (
            <span className="relative ml-1 flex size-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
          )}
        </div>
        <MoreHorizontal className="size-3 text-slate-600 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className={cn("flex-1 p-4", contentClassName)}>{children}</div>
    </motion.div>
  );
}

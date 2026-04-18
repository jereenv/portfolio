"use client";

import { useEffect, useState } from "react";

function formatSFTime() {
  return new Date().toLocaleTimeString("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function LiveTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(formatSFTime());
    const t = setInterval(() => setTime(formatSFTime()), 15_000);
    return () => clearInterval(t);
  }, []);

  if (!time) return null;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
        <span className="relative inline-flex size-1.5 rounded-full bg-cyan-500" />
      </span>
      <span className="tabular-nums">{time}</span>
      <span className="opacity-60">local</span>
    </span>
  );
}

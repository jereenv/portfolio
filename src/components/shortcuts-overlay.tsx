"use client";

import { useEffect, useState } from "react";

const SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ["⌘", "K"], label: "Open command palette" },
  { keys: ["/"], label: "Open command palette" },
  { keys: ["?"], label: "Show this help" },
  { keys: ["Esc"], label: "Close any overlay" },
  {
    keys: ["↑", "↑", "↓", "↓", "←", "→", "←", "→", "B", "A"],
    label: "A little surprise",
  },
];

export function ShortcutsOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (e.key === "?" && !isTyping) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm animate-in fade-in"
      />
      <div className="fixed left-1/2 top-[20vh] z-[70] w-[90vw] max-w-md -translate-x-1/2">
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-background/95 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
          <div className="border-b border-border/60 px-5 py-3">
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Keyboard shortcuts
            </h2>
          </div>
          <ul className="divide-y divide-border/40">
            {SHORTCUTS.map((s) => (
              <li
                key={s.label}
                className="flex items-center justify-between gap-4 px-5 py-3 text-sm"
              >
                <span className="text-muted-foreground">{s.label}</span>
                <div className="flex items-center gap-1">
                  {s.keys.map((k, i) => (
                    <kbd
                      key={i}
                      className="inline-flex min-w-[20px] items-center justify-center rounded border border-border/60 bg-background/60 px-1 py-0.5 text-[10px] font-mono text-foreground"
                    >
                      {k}
                    </kbd>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

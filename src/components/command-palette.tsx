"use client";

import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import {
  Briefcase,
  Command as CommandIcon,
  Copy,
  GraduationCap,
  Home,
  Info,
  Link2,
  Mail,
  Moon,
  Search,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type Action = {
  id: string;
  label: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  group: "Navigate" | "Links" | "Actions";
  run: () => void | Promise<void>;
  keywords?: string;
};

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  const actions = useMemo<Action[]>(() => {
    const copyUrl = async () => {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    };
    return [
      {
        id: "nav-hero",
        label: "Go to top",
        icon: Home,
        group: "Navigate",
        run: () => window.scrollTo({ top: 0, behavior: "smooth" }),
        keywords: "home hero top intro",
      },
      {
        id: "nav-now",
        label: "Now",
        icon: Sparkles,
        group: "Navigate",
        run: () => scrollToSection("now"),
        keywords: "current status updates",
      },
      {
        id: "nav-about",
        label: "About",
        icon: Info,
        group: "Navigate",
        run: () => scrollToSection("about"),
        keywords: "summary bio",
      },
      {
        id: "nav-work",
        label: "Work Experience",
        icon: Briefcase,
        group: "Navigate",
        run: () => scrollToSection("work"),
        keywords: "jobs roles career",
      },
      {
        id: "nav-education",
        label: "Education",
        icon: GraduationCap,
        group: "Navigate",
        run: () => scrollToSection("education"),
        keywords: "school degree university",
      },
      {
        id: "nav-contact",
        label: "Contact",
        icon: Mail,
        group: "Navigate",
        run: () => scrollToSection("contact"),
        keywords: "connect reach out",
      },
      ...Object.entries(DATA.contact.social).map(([name, s]) => ({
        id: `social-${name}`,
        label: `Open ${s.name}`,
        hint: s.url.replace(/^https?:\/\//, ""),
        icon: s.icon,
        group: "Links" as const,
        run: () => window.open(s.url, "_blank", "noopener,noreferrer"),
        keywords: s.name.toLowerCase(),
      })),
      {
        id: "copy-url",
        label: copied ? "Copied!" : "Copy site URL",
        icon: Copy,
        group: "Actions",
        run: copyUrl,
        keywords: "share link",
      },
      {
        id: "open-resume-site",
        label: "Open jereenvalsson.com",
        icon: Link2,
        group: "Actions",
        run: () =>
          window.open(
            "https://jereenvalsson.com",
            "_blank",
            "noopener,noreferrer"
          ),
      },
      {
        id: "toggle-theme",
        label:
          theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        icon: theme === "dark" ? Sun : Moon,
        group: "Actions",
        run: () => setTheme(theme === "dark" ? "light" : "dark"),
        keywords: "theme mode color",
      },
    ];
  }, [theme, setTheme, copied]);

  const filtered = useMemo(() => {
    if (!query.trim()) return actions;
    const q = query.toLowerCase();
    return actions.filter((a) =>
      `${a.label} ${a.keywords ?? ""} ${a.group}`.toLowerCase().includes(q)
    );
  }, [query, actions]);

  const groups = useMemo(() => {
    const acc: Record<string, Action[]> = {};
    filtered.forEach((a) => {
      acc[a.group] = acc[a.group] ?? [];
      acc[a.group].push(a);
    });
    return acc;
  }, [filtered]);

  const flat = useMemo(() => Object.values(groups).flat(), [groups]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !isTyping && !open) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const item = listRef.current?.querySelector<HTMLElement>(
      `[data-idx="${active}"]`
    );
    item?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  if (!open) return <Trigger onOpen={() => setOpen(true)} />;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const a = flat[active];
      if (!a) return;
      void a.run();
      if (a.id !== "toggle-theme" && a.id !== "copy-url") setOpen(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm animate-in fade-in"
      />
      <div className="fixed left-1/2 top-[15vh] z-[70] w-[92vw] max-w-xl -translate-x-1/2">
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-background/95 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
            <Search className="size-4 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search commands, sections, links…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden items-center gap-1 rounded border border-border/60 bg-background/40 px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline-flex">
              esc
            </kbd>
          </div>
          <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
            {flat.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No results for &ldquo;{query}&rdquo;
              </div>
            )}
            {Object.entries(groups).map(([group, items]) => (
              <div key={group} className="mb-2 last:mb-0">
                <div className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group}
                </div>
                {items.map((a) => {
                  const idx = flat.indexOf(a);
                  const isActive = idx === active;
                  const Icon = a.icon;
                  return (
                    <button
                      key={a.id}
                      data-idx={idx}
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => {
                        void a.run();
                        if (a.id !== "toggle-theme" && a.id !== "copy-url")
                          setOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        isActive
                          ? "bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="flex-1 truncate">{a.label}</span>
                      {a.hint && (
                        <span className="hidden truncate text-xs text-muted-foreground/60 sm:inline">
                          {a.hint}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-border/60 px-3 py-2 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <Key>↑</Key>
              <Key>↓</Key>
              <span>navigate</span>
              <Key>↵</Key>
              <span>select</span>
            </div>
            <div className="flex items-center gap-1">
              <CommandIcon className="size-3" />
              <span>K</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex size-4 items-center justify-center rounded border border-border/60 bg-background/40 text-[9px]">
      {children}
    </kbd>
  );
}

function Trigger({ onOpen }: { onOpen: () => void }) {
  const [mac, setMac] = useState(true);
  useEffect(() => {
    setMac(navigator.platform.toLowerCase().includes("mac"));
  }, []);
  return (
    <button
      onClick={onOpen}
      aria-label="Open command palette"
      className="group fixed right-4 top-4 z-30 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-md transition-all hover:border-border hover:text-foreground hover:shadow-[0_0_20px_-6px_rgba(168,85,247,0.5)]"
    >
      <Zap className="size-3 text-purple-400" />
      <span>Quick nav</span>
      <kbd className="inline-flex items-center gap-0.5 rounded border border-border/60 bg-background/60 px-1 py-0.5 text-[9px] font-mono">
        {mac ? "⌘" : "Ctrl"}K
      </kbd>
    </button>
  );
}

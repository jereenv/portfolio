"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";
import Markdown from "react-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { LiveTime } from "@/components/live-time";
import { Panel } from "@/components/panel";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Cpu,
  Database,
  GitBranch,
  Globe,
  GraduationCap,
  Layers,
  LineChart,
  MapPin,
  Network,
  Radio,
  RefreshCw,
  Send,
  Server,
  Terminal,
  Zap,
} from "lucide-react";

const HeroScene = dynamic(
  () => import("@/components/hero-scene").then((m) => ({ default: m.HeroScene })),
  { ssr: false }
);

const SkillsScene = dynamic(
  () => import("@/components/skills-scene").then((m) => ({ default: m.SkillsScene })),
  { ssr: false }
);

// Merged from DATA.skills + DATA.work[].badges, deduped, categorized.
// Every item appears in either his resume skills list or a job badge.
const STACK: Array<{ label: string; category: "lang" | "infra" | "data" | "frontend" }> = [
  // Languages
  { label: "Go", category: "lang" },
  { label: "Python", category: "lang" },
  { label: "TypeScript", category: "lang" },
  { label: "Rust", category: "lang" },
  { label: "C++", category: "lang" },
  { label: "Java", category: "lang" },
  { label: "Node.js", category: "lang" },
  // Infra / Cloud
  { label: "Kubernetes", category: "infra" },
  { label: "Docker", category: "infra" },
  { label: "AWS", category: "infra" },
  { label: "EKS", category: "infra" },
  { label: "Lambda", category: "infra" },
  { label: "ArgoCD", category: "infra" },
  { label: "Prometheus", category: "infra" },
  // Data / Messaging
  { label: "Kafka", category: "data" },
  { label: "PostgreSQL", category: "data" },
  { label: "DynamoDB", category: "data" },
  { label: "BigQuery", category: "data" },
  { label: "Snowflake", category: "data" },
  { label: "Spark", category: "data" },
  { label: "SNS", category: "data" },
  { label: "gRPC", category: "data" },
  // Frontend
  { label: "React", category: "frontend" },
  { label: "Next.js", category: "frontend" },
];

// ─── Data transforms ────────────────────────────────────────────────
// "Running processes" — what I'm working on / focused on, styled like `ps aux`
const PROCESSES = [
  { pid: "0001", state: "running", cpu: "42.0", cmd: "backend-engineer @grafana-labs", color: "emerald" },
  { pid: "0002", state: "running", cpu: "18.3", cmd: "learning kafka-internals --deep", color: "cyan" },
  { pid: "0003", state: "running", cpu: "11.7", cmd: "distributed-tracing --study", color: "cyan" },
  { pid: "0004", state: "running", cpu: "09.1", cmd: "telemetry-pipelines --observe", color: "cyan" },
  { pid: "0005", state: "sleeping", cpu: "02.2", cmd: "side-projects --backlog", color: "slate" },
  { pid: "0006", state: "running", cpu: "00.4", cmd: "jereenvalsson.com --serve", color: "purple" },
];

const COLOR_MAP: Record<string, string> = {
  emerald: "text-emerald-400",
  cyan: "text-cyan-400",
  purple: "text-purple-400",
  slate: "text-slate-500",
};

// ─── Small viz components ────────────────────────────────────────────
function Sparkline({ points, color = "#22d3ee", className }: { points: number[]; color?: string; className?: string }) {
  const w = 140;
  const h = 32;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const toPath = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / range) * (h - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const area = `${toPath} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={cn("h-8 w-full", className)} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#grad-${color.replace("#", "")})`} />
      <path d={toPath} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function StatTile({
  label,
  value,
  sub,
  sparkPoints,
  sparkColor,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  sparkPoints?: number[];
  sparkColor?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className="my-2">
        <div className="bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          {value}
        </div>
        {sub && <div className="mt-0.5 text-[11px] text-slate-500">{sub}</div>}
      </div>
      {sparkPoints && <Sparkline points={sparkPoints} color={sparkColor} />}
    </div>
  );
}

export default function Page() {
  const yearsOfExperience = "3+";
  const companyCount = DATA.work.length;
  const stackSize = STACK.length;

  return (
    <main className="min-h-screen bg-[#060609] text-slate-100">
      {/* ─── Dashboard top strip ───────────────────────────────── */}
      <div className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#050507]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-2 text-[11px] font-mono text-slate-500">
          <Terminal className="size-3 text-cyan-500/80" />
          <span className="flex items-center gap-1.5">
            <span className="text-slate-600">~/</span>
            <span className="text-slate-300">dashboards</span>
            <ChevronRight className="size-3 text-slate-700" />
            <span className="text-cyan-300">jereenvalsson</span>
          </span>
          <span className="hidden flex-1 md:block" />
          <span className="hidden items-center gap-1.5 md:flex">
            <RefreshCw className="size-3" style={{ animation: "spin 6s linear infinite" }} />
            <span>refresh: 5s</span>
          </span>
          <span className="hidden items-center gap-1.5 md:flex">
            <span>range:</span>
            <span className="text-slate-300">Last 27y</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-emerald-400">healthy</span>
          </span>
        </div>
      </div>

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section id="hero" className="relative flex h-[calc(100dvh-36px)] items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(34,211,238,0.1)_0%,transparent_60%),radial-gradient(ellipse_at_85%_60%,rgba(168,85,247,0.1)_0%,transparent_50%)]" />
        <HeroScene />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
          <div className="flex flex-col-reverse items-center gap-10 md:flex-row md:justify-between">
            <div className="flex flex-col gap-5 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-2 md:justify-start"
              >
                <Link
                  href={DATA.currentRole.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 font-mono text-[11px] text-emerald-400 backdrop-blur-sm transition-colors hover:border-emerald-500/50"
                >
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                  </span>
                  online @ {DATA.currentRole.company}
                </Link>
                <LiveTime />
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-slate-400">
                  <MapPin className="size-3" />
                  {DATA.location}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08 }}
                className="text-5xl font-bold tracking-tight sm:text-6xl xl:text-7xl"
              >
                <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                  Hi, I&apos;m {DATA.name.split(" ")[0]}
                </span>{" "}
                <span className="animate-wave inline-block">👋</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.16 }}
                className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500"
              >
                &gt; software engineer · systems &amp; scale
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.24 }}
                className="max-w-md text-sm text-slate-400 md:text-base"
              >
                Good backends are invisible. I make them fast too. Mostly{" "}
                <span className="font-medium text-cyan-400">Go</span>,{" "}
                <span className="font-medium text-blue-400">Python</span>, and{" "}
                <span className="font-medium text-orange-400">AWS</span>.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.32 }}
                className="flex flex-wrap items-center justify-center gap-3 md:justify-start"
              >
                <Link
                  href={DATA.contact.social.GitHub.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-200 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/10"
                >
                  <Icons.github className="size-4" />
                  GitHub
                </Link>
                <Link
                  href={DATA.contact.social.LinkedIn.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-cyan-500/40 bg-cyan-500/10 px-3 text-sm font-medium text-cyan-300 backdrop-blur-sm transition-colors hover:border-cyan-500/60 hover:bg-cyan-500/20"
                >
                  <Icons.linkedin className="size-4" />
                  LinkedIn
                </Link>
                <a
                  href="#dashboard"
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-slate-500 hover:text-slate-300"
                >
                  view dashboard <ChevronDown className="size-3" />
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-cyan-500/30 via-purple-500/20 to-pink-500/15 blur-3xl" />
                <div className="relative rounded-full bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 p-[3px] shadow-[0_0_100px_-8px_rgba(34,211,238,0.7)]">
                  <Avatar className="size-52 border-4 border-[#060609] sm:size-72">
                    <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                    <AvatarFallback className="bg-[#0d0d20] text-4xl text-slate-300">
                      {DATA.initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-slate-600"
        >
          <span>scroll</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="size-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── DASHBOARD GRID ─────────────────────────────────────── */}
      <div id="dashboard" className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6">
        <div className="grid grid-cols-12 gap-3">
          {/* Row 1: 5 stat tiles */}
          <Panel
            title="current shift"
            span="col-span-12 md:col-span-4"
            icon={<Radio className="size-3" />}
            live
            delay={0}
          >
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-semibold text-slate-100">{DATA.currentRole.company}</span>
                <span className="font-mono text-[10px] text-slate-500">SWE</span>
              </div>
              <div className="font-mono text-[11px] text-slate-500">
                since Dec 2025 · {DATA.location}
              </div>
              <Sparkline points={[4, 6, 5, 8, 7, 9, 12, 14, 13, 16, 18, 22]} color="#10b981" />
            </div>
          </Panel>

          <Panel title="uptime" span="col-span-6 md:col-span-2" icon={<Zap className="size-3" />} delay={0.05}>
            <StatTile
              label="in backend"
              value={yearsOfExperience}
              sub="years"
              sparkPoints={[2, 3, 2, 4, 5, 7, 6, 8, 9, 11, 12, 14]}
              sparkColor="#22d3ee"
            />
          </Panel>

          <Panel title="deploys" span="col-span-6 md:col-span-2" icon={<Server className="size-3" />} delay={0.1}>
            <StatTile
              label="companies"
              value={String(companyCount)}
              sub="shipped at"
              sparkPoints={[1, 1, 2, 2, 3, 3, 4, 4, 5]}
              sparkColor="#a855f7"
            />
          </Panel>

          <Panel title="stack size" span="col-span-6 md:col-span-2" icon={<Layers className="size-3" />} delay={0.15}>
            <StatTile
              label="languages + tools"
              value={`${stackSize}+`}
              sub="in the toolbox"
              sparkPoints={[3, 5, 6, 8, 9, 11, 12, 11, 12]}
              sparkColor="#ec4899"
            />
          </Panel>

          <Panel title="role" span="col-span-6 md:col-span-2" icon={<Network className="size-3" />} delay={0.2}>
            <StatTile
              label="title"
              value="SWE"
              sub="systems · scale · latency"
              sparkPoints={[5, 6, 8, 7, 9, 11, 10, 13, 15]}
              sparkColor="#f59e0b"
            />
          </Panel>

          {/* Row 2: About + Achievements */}
          <Panel
            title="about.md"
            span="col-span-12 lg:col-span-8"
            icon={<Terminal className="size-3" />}
            delay={0.1}
          >
            <div className="text-sm leading-relaxed text-slate-400">
              <Markdown
                components={{
                  strong: ({ children }) => (
                    <strong className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-bold text-transparent">
                      {children}
                    </strong>
                  ),
                  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                }}
              >
                {DATA.summary}
              </Markdown>
            </div>
          </Panel>

          <Panel
            title="key achievements"
            subtitle="pinned metrics"
            span="col-span-12 lg:col-span-4"
            icon={<LineChart className="size-3" />}
            delay={0.15}
          >
            <div className="space-y-3">
              {DATA.highlights.map((h) => (
                <div
                  key={h.label}
                  className="rounded-md border border-white/[0.05] bg-white/[0.02] p-3 transition-colors hover:border-cyan-500/30"
                >
                  <div className="bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-2xl font-bold text-transparent">
                    {h.value}
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-400">{h.label}</div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Row 3: Career timeline */}
          <Panel
            title="career timeline"
            subtitle="$ git log --author=jereen"
            span="col-span-12"
            icon={<GitBranch className="size-3" />}
            delay={0.1}
          >
            <div className="relative">
              <div className="absolute bottom-4 left-[31px] top-4 w-px bg-gradient-to-b from-cyan-500/50 via-purple-500/30 to-transparent" />
              <div className="flex flex-col">
                {DATA.work.map((job, i) => (
                  <div
                    key={job.company + job.start}
                    className={cn(
                      "relative flex items-start gap-4 py-4",
                      i < DATA.work.length - 1 && "border-b border-white/[0.04]"
                    )}
                  >
                    {/* Big company logo tile */}
                    <div className="relative z-10 flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-2 shadow-[0_0_20px_-8px_rgba(34,211,238,0.4)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={job.logoUrl} alt={job.company} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <Link
                          href={job.href ?? "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="text-base font-semibold text-slate-100 transition-colors hover:text-cyan-400"
                        >
                          {job.company}
                        </Link>
                        <span className="font-mono text-[11px] text-slate-500">
                          {job.start} → {job.end ?? "present"}
                        </span>
                      </div>
                      <div className="text-sm text-slate-400">
                        {job.title} <span className="text-slate-600">· {job.location}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {job.badges.map((badge) => (
                          <Badge
                            key={badge}
                            variant="secondary"
                            className="border border-white/10 bg-white/[0.03] px-2 py-0 font-mono text-[10px] text-slate-400"
                          >
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          {/* Row 4: Stack graph */}
          <Panel
            title="stack graph"
            subtitle={`${STACK.length} nodes · rotating`}
            span="col-span-12"
            icon={<Cpu className="size-3" />}
            contentClassName="p-0"
            delay={0.1}
          >
            <div className="relative h-[460px] w-full">
              <SkillsScene skills={STACK} />
              {/* Category legend */}
              <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-wider">
                <span className="flex items-center gap-1.5 rounded border border-white/5 bg-black/40 px-2 py-0.5 backdrop-blur-sm">
                  <span className="size-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                  <span className="text-cyan-300/80">languages</span>
                </span>
                <span className="flex items-center gap-1.5 rounded border border-white/5 bg-black/40 px-2 py-0.5 backdrop-blur-sm">
                  <span className="size-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                  <span className="text-purple-300/80">infra</span>
                </span>
                <span className="flex items-center gap-1.5 rounded border border-white/5 bg-black/40 px-2 py-0.5 backdrop-blur-sm">
                  <span className="size-1.5 rounded-full bg-pink-400 shadow-[0_0_6px_rgba(236,72,153,0.8)]" />
                  <span className="text-pink-300/80">data</span>
                </span>
                <span className="flex items-center gap-1.5 rounded border border-white/5 bg-black/40 px-2 py-0.5 backdrop-blur-sm">
                  <span className="size-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                  <span className="text-amber-300/80">frontend</span>
                </span>
              </div>
            </div>
          </Panel>

          {/* Row 5: Running processes + Education */}
          <Panel
            title="running processes"
            subtitle="$ ps aux | grep jereen"
            span="col-span-12 lg:col-span-7"
            icon={<Terminal className="size-3" />}
            live
            delay={0.1}
          >
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-[12px]">
                <thead>
                  <tr className="border-b border-white/[0.05] text-[10px] uppercase text-slate-600">
                    <th className="py-2 pr-3 text-left font-normal">pid</th>
                    <th className="py-2 pr-3 text-left font-normal">state</th>
                    <th className="py-2 pr-3 text-right font-normal">cpu</th>
                    <th className="py-2 text-left font-normal">command</th>
                  </tr>
                </thead>
                <tbody>
                  {PROCESSES.map((p) => (
                    <tr key={p.pid} className="border-b border-white/[0.03] last:border-0">
                      <td className="py-2 pr-3 text-slate-600">{p.pid}</td>
                      <td className={cn("py-2 pr-3", COLOR_MAP[p.color])}>{p.state}</td>
                      <td className="py-2 pr-3 text-right text-slate-500">{p.cpu}%</td>
                      <td className="py-2 text-slate-300">{p.cmd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel
            title="education"
            span="col-span-12 lg:col-span-5"
            icon={<GraduationCap className="size-3" />}
            delay={0.15}
          >
            <div className="space-y-3">
              {DATA.education.map((edu) => (
                <Link
                  key={edu.school}
                  href={edu.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-md border border-white/[0.05] bg-white/[0.02] p-3 transition-colors hover:border-purple-500/30"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded bg-white/10 p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={edu.logoUrl} alt={edu.school} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="truncate text-sm font-semibold text-slate-100">
                          {edu.school}
                        </div>
                        <div className="shrink-0 font-mono text-[10px] text-slate-500">
                          {edu.start}–{edu.end}
                        </div>
                      </div>
                      <div className="text-xs text-slate-400">{edu.degree}</div>
                      {edu.coursework && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {edu.coursework.map((c) => (
                            <span
                              key={c}
                              className="rounded border border-white/[0.06] bg-white/[0.02] px-1.5 py-0 font-mono text-[9px] text-slate-500"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Panel>

          {/* Row 6: Now + Connect */}
          <Panel
            title="now.log"
            subtitle={`updated ${DATA.now.updatedOn}`}
            span="col-span-12 lg:col-span-7"
            icon={<Database className="size-3" />}
            delay={0.1}
          >
            <div className="space-y-2 font-mono text-[12px]">
              {DATA.now.items.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="shrink-0 text-amber-500/70">[INFO]</span>
                  <span className="text-slate-300">{item}</span>
                </div>
              ))}
              <div className="flex gap-3">
                <span className="shrink-0 text-emerald-500/70">[OK]</span>
                <span className="text-slate-500">no production incidents to report</span>
              </div>
              <div className="flex gap-3">
                <span className="shrink-0 text-cyan-500/70">[DEBUG]</span>
                <span className="text-slate-500">you&apos;re reading this on a portfolio that styles itself like Grafana — yes, on purpose</span>
              </div>
            </div>
          </Panel>

          <Panel
            title="connect"
            subtitle="say hi"
            span="col-span-12 lg:col-span-5"
            icon={<Send className="size-3" />}
            delay={0.15}
          >
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Always up for chatting about distributed systems, interesting infra
                problems, or just saying hi.
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href={DATA.contact.social.GitHub.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <span className="flex items-center gap-2 text-sm">
                    <Icons.github className="size-4 text-slate-400" />
                    <span className="text-slate-300">GitHub</span>
                    <span className="font-mono text-[10px] text-slate-600">@jereenv</span>
                  </span>
                  <ChevronRight className="size-3 text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-300" />
                </Link>
                <Link
                  href={DATA.contact.social.LinkedIn.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-md border border-cyan-500/30 bg-cyan-500/[0.05] px-3 py-2 transition-colors hover:border-cyan-500/50 hover:bg-cyan-500/[0.1]"
                >
                  <span className="flex items-center gap-2 text-sm">
                    <Icons.linkedin className="size-4 text-cyan-400" />
                    <span className="text-cyan-200">LinkedIn</span>
                    <span className="font-mono text-[10px] text-cyan-500/60">/in/jereenvalsson</span>
                  </span>
                  <ChevronRight className="size-3 text-cyan-500/60 transition-transform group-hover:translate-x-0.5 group-hover:text-cyan-300" />
                </Link>
                <Link
                  href={DATA.locationLink}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <span className="flex items-center gap-2 text-sm">
                    <Globe className="size-4 text-slate-400" />
                    <span className="text-slate-300">{DATA.location}</span>
                    <span className="font-mono text-[10px] text-slate-600">UTC−8</span>
                  </span>
                  <ChevronRight className="size-3 text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-300" />
                </Link>
              </div>
            </div>
          </Panel>
        </div>

        {/* Dashboard footer */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.05] pt-4 font-mono text-[10px] text-slate-600">
          <span>dashboard.jereenvalsson · v1.0</span>
          <span className="flex items-center gap-3">
            <span>built with next.js · three.js · tailwind</span>
            <span className="inline-flex items-center rounded border border-white/10 bg-white/5 px-1 py-0.5">⌘K</span>
          </span>
        </div>
      </div>
    </main>
  );
}

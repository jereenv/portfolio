import { CardSpotlight } from "@/components/card-spotlight";
import { LiveTime } from "@/components/live-time";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { ResumeCard } from "@/components/resume-card";
import { StatCard } from "@/components/stat-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import Link from "next/link";
import Markdown from "react-markdown";

const BLUR_FADE_DELAY = 0.04;

export default function Page() {
  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10">
      <section id="hero">
        <CardSpotlight className="mx-auto w-full max-w-2xl space-y-6">
          <div className="gap-4 flex justify-between items-center">
            <div className="flex-col flex flex-1 space-y-3">
              <BlurFade delay={BLUR_FADE_DELAY}>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={DATA.currentRole.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-xs text-emerald-700 backdrop-blur-sm transition-colors hover:border-emerald-500/60 dark:text-emerald-300"
                  >
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-emerald-500 animate-pulse-dot" />
                    </span>
                    Currently @ {DATA.currentRole.company}
                  </Link>
                  <Link
                    href={DATA.locationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm transition-colors hover:border-border hover:text-foreground"
                  >
                    <MapPin className="size-3" />
                    {DATA.location}
                  </Link>
                  <LiveTime />
                </div>
              </BlurFade>
              <BlurFadeText
                delay={BLUR_FADE_DELAY * 1.5}
                className="animate-shimmer bg-gradient-to-r from-foreground via-purple-400 to-foreground bg-clip-text text-transparent text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                yOffset={8}
                text={`Hi, I'm ${DATA.name.split(" ")[0]} 👋`}
              />
              <BlurFade delay={BLUR_FADE_DELAY * 2}>
                <p className="max-w-[600px] text-sm text-muted-foreground md:text-base">
                  I build backend infrastructure you don&apos;t notice — until
                  it&apos;s fast. Mostly{" "}
                  <span className="bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text font-medium text-transparent">
                    Go
                  </span>
                  ,{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text font-medium text-transparent">
                    Python
                  </span>
                  , and{" "}
                  <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text font-medium text-transparent">
                    AWS
                  </span>
                  .
                </p>
              </BlurFade>
            </div>
            <BlurFade delay={BLUR_FADE_DELAY}>
              <div className="rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[2px] shadow-[0_0_40px_-10px_rgba(168,85,247,0.6)]">
                <Avatar className="size-28 sm:size-36 border-4 border-background">
                  <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                  <AvatarFallback>{DATA.initials}</AvatarFallback>
                </Avatar>
              </div>
            </BlurFade>
          </div>
        </CardSpotlight>
      </section>

      <section id="now">
        <BlurFade delay={BLUR_FADE_DELAY * 2.5}>
          <div className="relative rounded-xl border border-border/60 bg-background/40 p-5 backdrop-blur-sm">
            <div className="absolute -inset-px -z-10 rounded-xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-60 blur" />
            <div className="mb-3 flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-amber-500" />
              </span>
              <h2 className="text-xl font-bold">Now</h2>
              <span className="text-xs text-muted-foreground">
                · updated {DATA.now.updatedOn}
              </span>
            </div>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {DATA.now.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[7px] inline-block size-1 shrink-0 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </BlurFade>
      </section>

      <section id="about">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <h2 className="text-xl font-bold">About</h2>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <div className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert mt-2">
            <Markdown
              components={{
                strong: ({ children }) => (
                  <strong className="bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 bg-clip-text font-bold text-transparent">
                    {children}
                  </strong>
                ),
              }}
            >
              {DATA.summary}
            </Markdown>
          </div>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 5}>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {DATA.highlights.map((h, i) => (
              <StatCard
                key={h.label}
                value={h.value}
                label={h.label}
                index={i}
              />
            ))}
          </div>
        </BlurFade>
      </section>

      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 6}>
            <h2 className="text-xl font-bold">Work Experience</h2>
          </BlurFade>
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-8 left-[23px] top-8 w-px bg-gradient-to-b from-emerald-400/60 via-purple-500/30 to-transparent"
            />
            <div className="flex flex-col gap-y-3">
              {DATA.work.map((work, id) => (
                <BlurFade
                  key={work.company}
                  delay={BLUR_FADE_DELAY * 7 + id * 0.05}
                  className="relative"
                >
                  {id === 0 && (
                    <span
                      aria-hidden
                      className="absolute left-[19px] top-[19px] z-10 flex size-2.5"
                    >
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                    </span>
                  )}
                  <ResumeCard
                    key={work.company}
                    logoUrl={work.logoUrl}
                    altText={work.company}
                    title={work.company}
                    subtitle={work.title}
                    href={work.href}
                    badges={work.badges}
                    period={`${work.start} - ${work.end ?? "Present"}`}
                    description={work.description}
                  />
                </BlurFade>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="education">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 8}>
            <h2 className="text-xl font-bold">Education</h2>
          </BlurFade>
          {DATA.education.map((education, id) => (
            <BlurFade
              key={education.school}
              delay={BLUR_FADE_DELAY * 9 + id * 0.05}
            >
              <ResumeCard
                key={education.school}
                href={education.href}
                logoUrl={education.logoUrl}
                altText={education.school}
                title={education.school}
                subtitle={education.degree}
                badges={education.coursework}
                period={`${education.start} - ${education.end}`}
              />
            </BlurFade>
          ))}
        </div>
      </section>

      <section id="contact" className="pb-12">
        <div className="grid items-center justify-center gap-4 text-center w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 11}>
            <div className="space-y-3">
              <div className="inline-block rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-3 py-1 text-sm text-white">
                Contact
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                Let&apos;s Connect
              </h2>
              <p className="mx-auto max-w-[500px] text-muted-foreground text-sm md:text-base">
                Always up for chatting about distributed systems, interesting
                infra problems, or just saying hi.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href={DATA.contact.social.GitHub.url}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "gap-2 bg-background/40 backdrop-blur-sm"
                  )}
                >
                  <DATA.contact.social.GitHub.icon className="size-4" />
                  GitHub
                </Link>
                <Link
                  href={DATA.contact.social.LinkedIn.url}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "gap-2 bg-background/40 backdrop-blur-sm"
                  )}
                >
                  <DATA.contact.social.LinkedIn.icon className="size-4" />
                  LinkedIn
                </Link>
              </div>
            </div>
          </BlurFade>
        </div>
        <BlurFade delay={BLUR_FADE_DELAY * 12}>
          <p className="mx-auto max-w-[500px] pt-8 text-center text-[10px] text-muted-foreground/60">
            Built with{" "}
            <Link
              href="https://nextjs.org"
              target="_blank"
              rel="noreferrer"
              className="underline-offset-2 hover:text-foreground hover:underline"
            >
              Next.js
            </Link>
            ,{" "}
            <Link
              href="https://tailwindcss.com"
              target="_blank"
              rel="noreferrer"
              className="underline-offset-2 hover:text-foreground hover:underline"
            >
              Tailwind
            </Link>
            , and a{" "}
            <kbd className="inline-flex items-center gap-0.5 rounded border border-border/60 bg-background/40 px-1 py-0.5 text-[9px] font-mono">
              ⌘K
            </kbd>{" "}
            obsession.
          </p>
        </BlurFade>
      </section>
    </main>
  );
}

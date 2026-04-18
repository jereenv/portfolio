import { MapPin } from "lucide-react";

const STOPS = [
  { city: "Hyderabad", country: "IN", label: "Amazon", dates: "2022" },
  { city: "Pune", country: "IN", label: "ZS Associates", dates: "2022–23" },
  { city: "Tempe", country: "US", label: "ASU · Tau Xyz", dates: "2023–25" },
  {
    city: "San Francisco",
    country: "US",
    label: "Sigma · Grafana",
    dates: "2025–",
  },
];

export function Journey() {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-5 backdrop-blur-sm">
      <div className="mb-5 flex items-center gap-2">
        <MapPin className="size-4 text-purple-400" />
        <h2 className="text-sm font-bold uppercase tracking-wider">Journey</h2>
      </div>
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute left-3 right-3 top-[5px] h-px bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-pink-500/50"
        />
        <ol className="grid grid-cols-4 gap-1 sm:gap-3">
          {STOPS.map((s, i) => (
            <li key={s.city} className="flex flex-col items-center text-center">
              <span
                className="relative z-10 inline-flex size-2.5 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 ring-4 ring-background"
                aria-hidden
              />
              <div className="mt-2 text-[11px] font-semibold sm:text-xs">
                {s.city}
                <span className="ml-1 text-muted-foreground/60">
                  {s.country}
                </span>
              </div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-0.5 text-[10px] tabular-nums text-muted-foreground/60">
                {s.dates}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

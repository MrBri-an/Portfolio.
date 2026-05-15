import { BarChart3, CheckCircle2, Home, Sparkles, Smartphone } from "lucide-react";

import { cn } from "@/lib/utils";
import type { FeaturedProject, ProjectVisual } from "@/data/portfolio";

type ProjectMockupProps = {
  variant: FeaturedProject["mockup"];
  compact?: boolean;
  className?: string;
  visual?: ProjectVisual;
};

const variantStyles = {
  nestfind: {
    shell: "from-emerald-500/18 via-background to-amber-400/16",
    accent: "bg-emerald-400",
    label: "Verified marketplace",
  },
  automation: {
    shell: "from-cyan-400/16 via-background to-orange-400/14",
    accent: "bg-cyan-400",
    label: "Automation command center",
  },
  mobile: {
    shell: "from-rose-400/14 via-background to-teal-400/16",
    accent: "bg-rose-400",
    label: "Mobile MVP system",
  },
  evaluation: {
    shell: "from-violet-400/15 via-background to-lime-400/14",
    accent: "bg-violet-400",
    label: "AI quality workflow",
  },
  analytics: {
    shell: "from-sky-400/15 via-background to-yellow-400/16",
    accent: "bg-yellow-400",
    label: "Business analytics",
  },
} satisfies Record<FeaturedProject["mockup"], { shell: string; accent: string; label: string }>;

export function ProjectMockup({ variant, compact = false, className, visual }: ProjectMockupProps) {
  const style = variantStyles[variant];

  if (compact && visual) {
    return <CompactProjectMockup style={style} visual={visual} className={className} />;
  }

  if (variant === "mobile") {
    return (
      <div
        role="img"
        aria-label={style.label}
        className={cn(
          "relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br p-4 shadow-2xl shadow-black/20",
          style.shell,
          compact ? "min-h-[260px]" : "min-h-[360px]",
          className,
        )}
      >
        <div className="absolute inset-x-8 top-6 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="mx-auto flex h-full max-w-[210px] flex-col rounded-[2rem] border border-white/15 bg-background/90 p-3 shadow-2xl">
          <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-foreground/15" />
          <div className="rounded-3xl bg-foreground p-4 text-background">
            <Smartphone className="mb-8 h-6 w-6 text-primary" />
            <p className="text-xs uppercase tracking-[0.2em] text-background/60">MVP launch</p>
            <p className="mt-2 font-[var(--font-jakarta)] text-2xl font-semibold">Build. Test. Iterate.</p>
          </div>
          <div className="mt-4 grid gap-3">
            {["Onboarding", "Auth flow", "User dashboard"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                <span className={cn("h-2.5 w-2.5 rounded-full", style.accent)} />
                <span className="text-xs font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={style.label}
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br p-4 shadow-2xl shadow-black/20",
        style.shell,
        compact ? "min-h-[240px]" : "min-h-[360px]",
        className,
      )}
    >
      <div className="rounded-2xl border border-white/10 bg-background/78 p-3 backdrop-blur">
        <div className="mb-4 flex items-center justify-between border-b border-border/70 pb-3">
          <div className="flex items-center gap-2">
            <span className={cn("h-3 w-3 rounded-full", style.accent)} />
            <span className="text-xs font-semibold text-muted-foreground">{style.label}</span>
          </div>
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-foreground/20" />
            <span className="h-2 w-2 rounded-full bg-foreground/20" />
            <span className="h-2 w-2 rounded-full bg-foreground/20" />
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3">
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Current focus</p>
                  <p className="font-[var(--font-jakarta)] text-xl font-semibold">
                    {variant === "nestfind"
                      ? "Direct property search"
                      : variant === "automation"
                        ? "Workflow health"
                        : variant === "evaluation"
                          ? "Prompt quality"
                          : "Revenue insight"}
                  </p>
                </div>
                {variant === "nestfind" ? (
                  <Home className="h-5 w-5 text-primary" />
                ) : variant === "automation" ? (
                  <Sparkles className="h-5 w-5 text-primary" />
                ) : variant === "evaluation" ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <BarChart3 className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[72, 45, 88].map((height, index) => (
                  <div key={height} className="flex h-24 items-end rounded-xl bg-muted p-2">
                    <div
                      className={cn("w-full rounded-lg", index === 1 ? "bg-primary/55" : style.accent)}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {["Live", "Reviewed"].map((item) => (
                <div key={item} className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-2xl font-semibold">{item === "Live" ? "24" : "96%"}</p>
                  <p className="text-xs text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-2xl border border-border bg-card p-3">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold">Weekly trend</p>
                  <p className="text-[11px] text-muted-foreground">Live business signal</p>
                </div>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                  +18%
                </span>
              </div>
              <MiniLineChart />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-card p-3">
                <p className="text-xs font-semibold">Conversion</p>
                <MiniDonut />
                <p className="mt-1 text-center text-[11px] text-muted-foreground">64% healthy</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-3">
                <p className="text-xs font-semibold">Throughput</p>
                <MiniBars accentClass={style.accent} />
                <p className="mt-1 text-[11px] text-muted-foreground">Tasks closed</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold">Operational insight</p>
                <span className="text-[11px] text-primary">Ready</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["$42k", "1.8k", "94%"].map((value) => (
                  <div key={value} className="rounded-xl bg-muted p-2 text-center">
                    <p className="text-sm font-semibold">{value}</p>
                    <p className="text-[10px] text-muted-foreground">metric</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompactProjectMockup({
  style,
  visual,
  className,
}: {
  style: (typeof variantStyles)[FeaturedProject["mockup"]];
  visual: ProjectVisual;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={visual.label}
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br p-4 shadow-2xl shadow-black/20",
        style.shell,
        className,
      )}
    >
      <div className="flex h-full min-h-[280px] flex-col rounded-2xl border border-white/10 bg-background/78 p-4 backdrop-blur">
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className={cn("h-3 w-3 shrink-0 rounded-full", style.accent)} />
            <span className="truncate text-xs font-semibold text-muted-foreground">{visual.label}</span>
          </div>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
            {visual.trend}
          </span>
        </div>

        <div className="mt-4 grid gap-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Current focus</p>
            <div className="mt-2 flex items-center justify-between gap-4">
              <p className="font-[var(--font-jakarta)] text-2xl font-semibold leading-tight">
                {visual.focus}
              </p>
              <BarChart3 className="h-5 w-5 shrink-0 text-primary" />
            </div>
            <div className="mt-5 grid grid-cols-4 gap-2">
              {visual.bars.map((height, index) => (
                <div key={`${height}-${index}`} className="flex h-20 items-end rounded-xl bg-muted p-1.5">
                  <span
                    className={cn("w-full rounded-lg", index === 1 ? "bg-primary/55" : style.accent)}
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {visual.stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border bg-card p-3">
                <p className="text-xl font-semibold">{stat.value}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-auto rounded-2xl border border-border bg-card p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold">Operational signal</p>
              <span className="text-[11px] text-primary">Live</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <span className={cn("block h-full w-[72%] rounded-full", style.accent)} />
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">{visual.insight}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniLineChart() {
  return (
    <svg viewBox="0 0 220 86" className="h-24 w-full text-primary" aria-hidden="true">
      <defs>
        <linearGradient id="line-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[18, 38, 58, 78].map((y) => (
        <line key={y} x1="0" x2="220" y1={y} y2={y} stroke="currentColor" strokeOpacity="0.08" />
      ))}
      <path
        d="M4 70 C28 48 42 62 62 42 C82 20 100 42 120 34 C145 24 154 58 178 32 C196 14 206 22 216 12 L216 86 L4 86 Z"
        fill="url(#line-fill)"
      />
      <path
        d="M4 70 C28 48 42 62 62 42 C82 20 100 42 120 34 C145 24 154 58 178 32 C196 14 206 22 216 12"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="4"
      />
      {[62, 120, 178, 216].map((x, index) => (
        <circle key={x} cx={x} cy={[42, 34, 32, 12][index]} r="4" fill="currentColor" />
      ))}
    </svg>
  );
}

function MiniDonut() {
  return (
    <svg viewBox="0 0 80 80" className="mx-auto mt-2 h-20 w-20 text-primary" aria-hidden="true">
      <circle cx="40" cy="40" r="28" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="10" />
      <circle
        cx="40"
        cy="40"
        r="28"
        fill="none"
        stroke="currentColor"
        strokeDasharray="112 176"
        strokeLinecap="round"
        strokeWidth="10"
        transform="rotate(-90 40 40)"
      />
      <text x="40" y="45" textAnchor="middle" className="fill-foreground text-sm font-semibold">
        64%
      </text>
    </svg>
  );
}

function MiniBars({ accentClass }: { accentClass: string }) {
  return (
    <div className="mt-4 flex h-16 items-end gap-1.5">
      {[42, 68, 52, 82, 74, 96].map((height) => (
        <span
          key={height}
          className={cn("w-full rounded-t-md", accentClass)}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}

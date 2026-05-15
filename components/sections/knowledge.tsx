import { Gauge, LockKeyhole, RefreshCw, UsersRound } from "lucide-react";

import { AnimatedContainer } from "@/components/portfolio/animated-container";
import { SectionHeading } from "@/components/portfolio/section-heading";

const items = [
  {
    icon: RefreshCw,
    title: "Modern tools, practical execution",
    text: "I keep up with AI trends, developer tooling, automation patterns, and product practices, then apply only what makes the product stronger.",
  },
  {
    icon: LockKeyhole,
    title: "Security and reliability awareness",
    text: "I think about authentication, data handling, validation, permissions, and maintainability before they become expensive problems.",
  },
  {
    icon: Gauge,
    title: "Performance and usability",
    text: "Fast loading, responsive layouts, accessible contrast, readable flows, and clear information architecture are part of the build quality.",
  },
  {
    icon: UsersRound,
    title: "Market-focused product thinking",
    text: "I connect features to users, workflows, revenue potential, and adoption instead of treating software as isolated screens.",
  },
];

export function Knowledge() {
  return (
    <section className="relative overflow-hidden border-b border-border py-24">
      <div className="portfolio-grid absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="absolute right-6 top-12 hidden rounded-2xl border border-border bg-card/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary shadow-xl shadow-black/10 backdrop-blur float-slower lg:block" aria-hidden="true">
        Tools to outcomes
      </div>
      <div className="absolute bottom-16 left-8 hidden rounded-2xl border border-border bg-card/70 px-4 py-3 text-sm text-muted-foreground shadow-xl shadow-black/10 backdrop-blur float-slow lg:block" aria-hidden="true">
        Practical judgment, clean execution
      </div>
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <AnimatedContainer>
          <SectionHeading
            eyebrow="Always building. Always learning."
            title="Staying ahead of the technology curve without losing sight of the business problem."
            description="AI is powerful, but judgment still matters. I use modern tools to speed up execution while keeping product decisions grounded in users, constraints, and outcomes."
          />
        </AnimatedContainer>
        <div className="grid gap-5 sm:grid-cols-2">
          {items.map((item, index) => (
            <AnimatedContainer key={item.title} delay={index * 0.05}>
              <div
                className={`shine-sweep h-full rounded-[1.5rem] border border-border bg-card/70 p-6 shadow-lg shadow-black/5 transition duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 ${
                  index % 2 === 0 ? "float-slow" : "float-slower"
                }`}
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-[var(--font-jakarta)] text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{item.text}</p>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </section>
  );
}

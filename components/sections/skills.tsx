import { Code2, Database, Layers3, PenTool, Rocket, Sparkles, Smartphone } from "lucide-react";

import { AnimatedContainer } from "@/components/portfolio/animated-container";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { skills } from "@/data/portfolio";

const skillIcons = {
  Frontend: Code2,
  Mobile: Smartphone,
  "Backend / Database": Database,
  "AI / Automation": Sparkles,
  "Product / Business": Rocket,
  Tools: PenTool,
};

export function Skills() {
  return (
    <section id="skills" className="relative overflow-hidden border-b border-border py-24">
      <div className="portfolio-grid absolute inset-0 opacity-35" aria-hidden="true" />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedContainer>
          <SectionHeading
            eyebrow="Skills"
            title="A modern toolkit for building products that are usable, maintainable, and commercially useful."
          />
        </AnimatedContainer>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, index) => (
            <AnimatedContainer key={group.category} delay={index * 0.04}>
              <div className="group h-full rounded-[1.5rem] border border-border bg-card/75 p-6 shadow-lg shadow-black/5 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary transition group-hover:scale-110">
                      {(() => {
                        const Icon = skillIcons[group.category as keyof typeof skillIcons] ?? Layers3;
                        return <Icon className="h-5 w-5" />;
                      })()}
                    </span>
                    <h3 className="font-[var(--font-jakarta)] text-xl font-semibold">{group.category}</h3>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">{group.items.length} tools</span>
                </div>
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full bg-primary transition-all duration-700 group-hover:w-full"
                    style={{ width: `${62 + index * 5}%` }}
                  />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span key={skill} className="rounded-full border border-border bg-background px-3 py-2 text-sm text-muted-foreground transition duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </section>
  );
}

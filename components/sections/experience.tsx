import { BriefcaseBusiness } from "lucide-react";

import { AnimatedContainer } from "@/components/portfolio/animated-container";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { experience } from "@/data/portfolio";

export function Experience() {
  return (
    <section id="experience" className="border-b border-border py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedContainer>
          <SectionHeading
            eyebrow="Experience"
            title="Practical roles across AI quality, product builds, web apps, mobile MVPs, dashboards, and automation."
          />
        </AnimatedContainer>
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {experience.map((item, index) => (
            <AnimatedContainer key={item.role} delay={index * 0.06}>
              <article className="h-full rounded-[1.5rem] border border-border bg-card/70 p-6 shadow-lg shadow-black/5">
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
                    <BriefcaseBusiness className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-[var(--font-jakarta)] text-xl font-semibold">{item.role}</h3>
                    <p className="mt-2 leading-7 text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold">Responsibilities</p>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {item.responsibilities.map((responsibility) => (
                        <li key={responsibility}>{responsibility}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Tools used</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.tools.map((tool) => (
                        <span key={tool} className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-6 rounded-2xl border border-border bg-background/70 p-4 text-sm leading-6 text-muted-foreground">
                  {item.impact}
                </p>
              </article>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </section>
  );
}

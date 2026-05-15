import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

import { AnimatedContainer } from "@/components/portfolio/animated-container";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { processSteps } from "@/data/portfolio";

export function Process() {
  return (
    <section id="process" className="relative overflow-hidden border-b border-border py-24">
      <div className="portfolio-grid absolute inset-0 opacity-35" aria-hidden="true" />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedContainer>
          <SectionHeading
            eyebrow="How I work"
            title="An organized product process from business goal to shipped improvement."
            description="I keep the work clear, scoped, and outcome-driven so clients and teams know what is being built, why it matters, and how it will be tested."
          />
        </AnimatedContainer>
        <div className="relative mt-12">
          <div className="absolute left-5 top-10 hidden h-px w-[calc(100%-2.5rem)] bg-gradient-to-r from-primary/60 via-border to-primary/30 xl:block" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
          {processSteps.map((step, index) => (
            <AnimatedContainer key={step} delay={index * 0.04}>
              <div className={`group relative h-full rounded-[1.5rem] border border-border bg-card/75 p-5 shadow-lg shadow-black/5 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 ${index % 2 === 0 ? "float-slow" : "float-slower"}`}>
                <div className="shine-sweep absolute inset-0 rounded-[1.5rem]" />
                <div className="relative z-10">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl border border-primary/30 bg-primary/10 text-sm font-semibold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 font-[var(--font-jakarta)] text-lg font-semibold">{step}</h3>
                  <p className="mt-4 text-xs leading-5 text-muted-foreground">
                    {index === 0
                      ? "Clarify the outcome before choosing tools."
                      : index === 1
                        ? "Shape the smallest useful version."
                        : index === 2
                          ? "Prioritize what proves value fastest."
                          : index === 3
                            ? "Design flows users can understand."
                            : index === 4
                              ? "Build with clean, reusable structure."
                              : index === 5
                                ? "Test behavior, polish, and edge cases."
                                : "Release, learn, and improve."}
                  </p>
                  <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-primary">
                    {index === processSteps.length - 1 ? <CheckCircle2 className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                    {index === processSteps.length - 1 ? "Ready to iterate" : "Clear next step"}
                  </div>
                </div>
                {index < processSteps.length - 1 ? (
                  <ArrowRight className="absolute -right-3 top-9 z-20 hidden h-5 w-5 rounded-full border border-border bg-background p-1 text-primary xl:block" />
                ) : null}
              </div>
            </AnimatedContainer>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}

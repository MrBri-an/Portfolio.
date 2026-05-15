import { CheckCircle2, Sparkles } from "lucide-react";

import { AnimatedContainer } from "@/components/portfolio/animated-container";
import { HeroMobileCtas } from "@/components/portfolio/hero-mobile-ctas";
import { HeroVisual } from "@/components/portfolio/hero-visual";
import { trustIndicators } from "@/data/portfolio";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden border-b border-border">
      <div className="portfolio-grid pointer-events-none absolute inset-0 opacity-55" aria-hidden="true" />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
        <AnimatedContainer className="relative z-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-sm text-muted-foreground shadow-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            Computer scientist. AI-focused builder. Product-minded developer.
          </div>
          <h1 className="font-[var(--font-jakarta)] text-4xl font-semibold leading-[1.04] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Building intelligent digital products that solve real business problems.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-xl">
            I design and build AI-powered tools, web apps, mobile apps, MVPs, dashboards,
            automations, and scalable software experiences for startups, businesses, and modern teams.
          </p>
          <HeroMobileCtas />
          <div className="mt-8 flex flex-wrap gap-2">
            {trustIndicators.map((item) => (
              <span key={item} className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-2 text-xs font-medium text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                {item}
              </span>
            ))}
          </div>
        </AnimatedContainer>

        <AnimatedContainer delay={0.12} className="relative">
          <HeroVisual />
        </AnimatedContainer>
      </div>
    </section>
  );
}

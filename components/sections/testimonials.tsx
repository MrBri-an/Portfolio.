import Image from "next/image";
import { Quote, Sparkles, Star } from "lucide-react";

import { AnimatedContainer } from "@/components/portfolio/animated-container";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { testimonials } from "@/data/portfolio";

export function Testimonials() {
  return (
    <section id="testimonials" className="relative overflow-hidden border-b border-border py-24">
      <div className="portfolio-grid absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedContainer>
          <SectionHeading
            eyebrow="Testimonials"
            title="Outcome-focused feedback from people who value clear product execution."
            description="The strongest work earns trust through clarity, useful decisions, and delivery that connects software to real business progress."
          />
        </AnimatedContainer>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <AnimatedContainer key={testimonial.name} delay={index * 0.06}>
              <figure className="group relative h-full overflow-hidden rounded-[1.75rem] border border-border bg-card/75 p-6 shadow-lg shadow-black/5 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-amber-300 to-transparent opacity-80" />
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-border bg-background shadow-lg">
                      <Image
                        src={testimonial.avatar}
                        alt={`${testimonial.name} testimonial portrait`}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <figcaption>
                      <p className="font-[var(--font-jakarta)] text-base font-semibold">{testimonial.name}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{testimonial.role}</p>
                    </figcaption>
                  </div>
                  <Quote className="h-7 w-7 shrink-0 text-primary transition duration-300 group-hover:rotate-6" />
                </div>

                <div className="mt-6 flex gap-1 text-amber-300" aria-label="Five star testimonial">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                <blockquote className="mt-5 font-[var(--font-jakarta)] text-xl font-medium leading-8 tracking-tight text-foreground">
                  {testimonial.quote}
                </blockquote>

                <div className="mt-7 flex items-center gap-3 rounded-2xl border border-border bg-background/70 p-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Proof point</p>
                    <p className="text-sm text-muted-foreground">{testimonial.metric}</p>
                  </div>
                </div>
              </figure>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </section>
  );
}

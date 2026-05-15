import Image from "next/image";
import { BrainCircuit, Code2, Rocket, Workflow } from "lucide-react";

import { AnimatedContainer } from "@/components/portfolio/animated-container";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { profile } from "@/data/portfolio";

const points = [
  {
    icon: BrainCircuit,
    title: "AI fluency with engineering judgment",
    text: "I use modern AI tools intelligently while relying on structured thinking, evaluation discipline, and practical product sense.",
  },
  {
    icon: Code2,
    title: "Full-stack product execution",
    text: "I can move from interface design to APIs, authentication, database structure, dashboards, and deployable web experiences.",
  },
  {
    icon: Workflow,
    title: "Automation for business value",
    text: "I look for repetitive workflows, unclear handoffs, and data gaps that software can turn into faster operations.",
  },
  {
    icon: Rocket,
    title: "MVPs that can grow",
    text: "I build early products with enough discipline to validate quickly without trapping the business in throwaway code.",
  },
];

export function About() {
  return (
    <section id="about" className="border-b border-border py-24">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <AnimatedContainer>
          <SectionHeading
            eyebrow="About"
            title="A technology builder who connects software decisions to business outcomes."
            description="I am a computer scientist and product-focused builder combining software development, AI, automation, and UX thinking to create useful digital products."
          />
          <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-2xl shadow-black/10">
            <div className="relative aspect-[4/3]">
              <Image
                src={profile.avatar}
                alt={`${profile.name} portrait`}
                fill
                sizes="(min-width: 1024px) 420px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 rounded-2xl border border-white/15 bg-black/45 px-4 py-3 text-white backdrop-blur">
                <p className="font-[var(--font-jakarta)] text-xl font-semibold">{profile.name}</p>
                <p className="text-sm text-white/75">AI-focused software and product builder</p>
              </div>
            </div>
          </div>
        </AnimatedContainer>

        <div className="grid gap-5 sm:grid-cols-2">
          {points.map((point, index) => (
            <AnimatedContainer
              key={point.title}
              delay={index * 0.06}
              className="rounded-[1.5rem] border border-border bg-card/70 p-6 shadow-lg shadow-black/5"
            >
              <point.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-5 font-[var(--font-jakarta)] text-xl font-semibold">{point.title}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{point.text}</p>
            </AnimatedContainer>
          ))}
        </div>
      </div>
      <AnimatedContainer className="mx-auto mt-12 max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="rounded-[1.75rem] border border-border bg-card/70 p-6 text-lg leading-9 text-muted-foreground shadow-lg shadow-black/5">
          I care about products that are useful, secure, scalable, and easy to use. I stay close to
          modern frameworks, AI trends, software practices, and product development patterns so I can
          help teams move from a rough idea to a working MVP, then toward production-ready execution.
        </p>
      </AnimatedContainer>
    </section>
  );
}

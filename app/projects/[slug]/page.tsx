import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { ZoomableImage } from "@/components/portfolio/zoomable-image";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { featuredProjects } from "@/data/portfolio";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return featuredProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = featuredProjects.find((item) => item.slug === slug);

  if (!project) {
    return {};
  }

  return {
    title: `${project.title} Case Study | Brian Dara`,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = featuredProjects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="border-b border-border">
      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
        <div>
          <Link
            href="/#projects"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to projects
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">{project.category}</p>
          <h1 className="mt-4 font-[var(--font-jakarta)] text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">{project.caseStudy.overview}</p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-black/20 lg:min-h-[460px]">
          <ZoomableImage
            src={project.image.src}
            alt={project.image.alt}
            title={project.title}
            sizes="(min-width: 1024px) 620px, 100vw"
            fit="cover"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <div className="pointer-events-none absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/45 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
            Case study display
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: "Problem", text: project.problem },
            { title: "Goal", text: project.caseStudy.goal },
            { title: "My role", text: project.caseStudy.role },
          ].map((item) => (
            <article key={item.title} className="rounded-[1.5rem] border border-border bg-card/70 p-6 shadow-lg shadow-black/5">
              <h2 className="font-[var(--font-jakarta)] text-xl font-semibold">{item.title}</h2>
              <p className="mt-3 leading-7 text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="Case study"
            title="Process, decisions, and business value."
            description="This template is built to show judgment, tradeoffs, and outcome thinking rather than only screenshots."
          />
          <div className="grid gap-6">
            <CaseStudyBlock title="Process" items={project.caseStudy.process} />
            <CaseStudyBlock title="Key features" items={project.features} />
            <CaseStudyBlock title="Tech stack" items={project.tools} />
            <CaseStudyBlock title="Challenges" items={project.caseStudy.challenges} />
            <article className="rounded-[1.5rem] border border-border bg-card/70 p-6 shadow-lg shadow-black/5">
              <h2 className="font-[var(--font-jakarta)] text-2xl font-semibold">Solution</h2>
              <p className="mt-4 leading-8 text-muted-foreground">{project.caseStudy.solution}</p>
            </article>
            <article className="rounded-[1.5rem] border border-border bg-card/70 p-6 shadow-lg shadow-black/5">
              <h2 className="font-[var(--font-jakarta)] text-2xl font-semibold">Result or expected impact</h2>
              <p className="mt-4 leading-8 text-muted-foreground">{project.caseStudy.result}</p>
            </article>
            <article className="rounded-[1.5rem] border border-border bg-card/70 p-6 shadow-lg shadow-black/5">
              <h2 className="font-[var(--font-jakarta)] text-2xl font-semibold">Lessons learned</h2>
              <p className="mt-4 leading-8 text-muted-foreground">{project.caseStudy.lessons}</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

function CaseStudyBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-[1.5rem] border border-border bg-card/70 p-6 shadow-lg shadow-black/5">
      <h2 className="font-[var(--font-jakarta)] text-2xl font-semibold">{title}</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item} className="flex gap-3 rounded-2xl border border-border bg-background/70 p-4 text-sm leading-6 text-muted-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

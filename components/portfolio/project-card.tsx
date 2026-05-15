import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import { ZoomableImage } from "@/components/portfolio/zoomable-image";
import type { FeaturedProject } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { ProjectMockup } from "@/components/portfolio/project-mockup";

type ProjectCardProps = {
  project: FeaturedProject;
  featured?: boolean;
};

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-[1.75rem] border border-border/80 bg-card/70 shadow-xl shadow-black/5 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10",
        featured && "grid lg:grid-cols-[1.05fr_0.95fr]",
      )}
    >
      {project.image ? (
        <div className={cn("relative aspect-[4/3] overflow-hidden bg-black/20", featured && "lg:min-h-[420px]")}>
          <ZoomableImage
            src={project.image.src}
            alt={project.image.alt}
            title={project.title}
            sizes={featured ? "(min-width: 1024px) 620px, 100vw" : "(min-width: 1024px) 420px, 100vw"}
            className="bg-black/20"
            fit="cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="pointer-events-none absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/45 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
            Client MVP display
          </div>
        </div>
      ) : (
        <ProjectMockup
          variant={project.mockup}
          compact={!featured}
          className={cn("rounded-none border-0 shadow-none", featured && "min-h-[420px]")}
        />
      )}
      <div className="flex flex-col p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          {project.category}
        </p>
        <h3 className="mt-3 font-[var(--font-jakarta)] text-2xl font-semibold tracking-tight">
          {project.title}
        </h3>
        <p className="mt-4 leading-7 text-muted-foreground">{project.summary}</p>

        <div className="mt-6 rounded-2xl border border-border bg-background/60 p-4">
          <p className="text-sm font-semibold">Problem solved</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{project.problem}</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {project.features.slice(0, featured ? 6 : 4).map((feature) => (
            <div key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tools.slice(0, 6).map((tool) => (
            <span key={tool} className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
              {tool}
            </span>
          ))}
        </div>

        <p className="mt-6 text-sm leading-6 text-muted-foreground">{project.impact}</p>

        <Link
          href={`/projects/${project.slug}`}
          className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          View Case Study
          <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}

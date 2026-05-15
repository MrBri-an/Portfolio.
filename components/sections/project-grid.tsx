import { ArrowUpRight } from "lucide-react";

import { AnimatedContainer } from "@/components/portfolio/animated-container";
import { ProjectMockup } from "@/components/portfolio/project-mockup";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { ZoomableImage } from "@/components/portfolio/zoomable-image";
import { additionalProjects } from "@/data/portfolio";

export function ProjectGrid() {
  return (
    <section id="all-projects" className="scroll-mt-24 border-b border-border py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedContainer>
          <SectionHeading
            eyebrow="Project range"
            title="More product concepts that show breadth across AI, SaaS, mobile, commerce, and internal tools."
            description="The portfolio is intentionally business-focused: marketplaces, dashboards, automation tools, AI workflows, and systems that help teams operate better."
          />
        </AnimatedContainer>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {additionalProjects.map((project, index) => (
            <AnimatedContainer key={project.title} delay={(index % 6) * 0.04}>
              <article className="group h-full overflow-hidden rounded-[1.5rem] border border-border bg-card/70 shadow-lg shadow-black/5 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
                {"image" in project ? (
                  <div className="relative h-[340px] overflow-hidden bg-gradient-to-br from-violet-500/10 via-background to-sky-400/10 md:h-[380px]">
                    <ZoomableImage
                      src={project.image.src}
                      alt={project.image.alt}
                      title={project.title}
                      sizes="(min-width: 1280px) 380px, (min-width: 768px) 50vw, 100vw"
                      className="bg-transparent p-3"
                      fit="contain"
                    />
                  </div>
                ) : (
                  <ProjectMockup
                    variant={project.mockup}
                    compact
                    visual={project.visual}
                    className="min-h-[320px] rounded-none border-0 shadow-none"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{project.category}</p>
                      <h3 className="mt-3 font-[var(--font-jakarta)] text-xl font-semibold">{project.title}</h3>
                    </div>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-background transition group-hover:bg-primary group-hover:text-primary-foreground">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-4 leading-7 text-muted-foreground">{project.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </section>
  );
}

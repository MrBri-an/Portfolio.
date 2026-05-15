import { AnimatedContainer } from "@/components/portfolio/animated-container";
import { ProjectCard } from "@/components/portfolio/project-card";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { featuredProjects } from "@/data/portfolio";

export function FeaturedProjects() {
  return (
    <section id="projects" className="scroll-mt-24 border-b border-border py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedContainer>
          <SectionHeading
            eyebrow="Featured projects"
            title="Case-study style work built around real product and business needs."
            description="Each project is framed around the problem, the product decisions, the technical direction, and the expected business impact."
          />
        </AnimatedContainer>
        <div className="mt-12 grid gap-8">
          {featuredProjects.map((project, index) => (
            <AnimatedContainer key={project.slug} delay={index * 0.05}>
              <ProjectCard project={project} featured />
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </section>
  );
}

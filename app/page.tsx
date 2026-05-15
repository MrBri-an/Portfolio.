import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Hero } from "@/components/sections/hero";
import { Knowledge } from "@/components/sections/knowledge";
import { Process } from "@/components/sections/process";
import { ProjectGrid } from "@/components/sections/project-grid";
import { Skills } from "@/components/sections/skills";
import { Testimonials } from "@/components/sections/testimonials";
import { WorkShowcase } from "@/components/sections/work-showcase";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <WorkShowcase />
      <FeaturedProjects />
      <ProjectGrid />
      <Experience />
      <Skills />
      <Process />
      <Knowledge />
      <Testimonials />
      <Contact />
    </main>
  );
}

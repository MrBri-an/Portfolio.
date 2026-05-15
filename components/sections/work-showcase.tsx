"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { ZoomableImage } from "@/components/portfolio/zoomable-image";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { workShowcase } from "@/data/portfolio";

export function WorkShowcase() {
  return (
    <section id="work-showcase" className="scroll-mt-24 border-b border-border py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
        >
          <SectionHeading
            eyebrow="Visual work"
            title="Product interfaces that feel tangible, polished, and ready to discuss."
            description="A lively snapshot of mobile apps, dashboards, marketplaces, SaaS tools, fintech products, healthcare systems, and business platforms."
          />
          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:text-primary"
            >
              Open all case studies
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="#all-projects"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:text-primary"
            >
              Browse more project concepts
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
        >
          {workShowcase.map((item, index) => (
            <motion.article
              key={item.title}
              className={`group relative overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-xl shadow-black/10 ${
                index === 2 || index === 9 ? "md:col-span-2 md:row-span-2" : ""
              }`}
              variants={{
                hidden: { opacity: 0, y: 24, scale: 0.98 },
                show: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
            >
              <div className={index === 2 || index === 9 ? "relative aspect-[4/3] md:h-full md:min-h-[540px]" : "relative aspect-[4/3]"}>
                <ZoomableImage
                  src={item.src}
                  alt={item.alt}
                  title={item.title}
                  sizes={index === 2 || index === 9 ? "(min-width: 1024px) 640px, 100vw" : "(min-width: 1024px) 320px, 100vw"}
                  className="bg-black/20"
                  fit="cover"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/18 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 text-white">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">{item.category}</p>
                    <h3 className="mt-2 font-[var(--font-jakarta)] text-xl font-semibold">{item.title}</h3>
                  </div>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 backdrop-blur transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

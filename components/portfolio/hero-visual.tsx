"use client";

import { motion } from "framer-motion";
import { BarChart3, CheckCircle2, Sparkles, Workflow } from "lucide-react";

import { ZoomableImage } from "@/components/portfolio/zoomable-image";
import { workShowcase } from "@/data/portfolio";

export function HeroVisual() {
  const featured = workShowcase[9];
  const floating = [workShowcase[0], workShowcase[4], workShowcase[7]];

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-card/60 p-3 shadow-2xl shadow-black/25 sm:rounded-[2rem]">
      <motion.div
        className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl"
        animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-12 right-8 h-40 w-40 rounded-full bg-amber-400/15 blur-3xl"
        animate={{ y: [0, -18, 0], opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="relative overflow-hidden rounded-[1.25rem] border border-border bg-background sm:rounded-[1.6rem]"
        initial={{ opacity: 0, rotateX: 8, y: 18 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative aspect-[4/3] sm:aspect-[16/10]">
          <ZoomableImage
            src={featured.src}
            alt={featured.alt}
            title={featured.title}
            sizes="(min-width: 1024px) 620px, 100vw"
            className="bg-black/20"
            fit="cover"
            priority
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
        <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/20 bg-black/45 px-3 py-2 text-xs font-semibold text-white backdrop-blur sm:left-5 sm:top-5 sm:px-4">
          Live product visuals
        </div>
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 hidden gap-3 sm:grid sm:grid-cols-3 lg:bottom-5 lg:left-5 lg:right-5">
          {[
            { icon: Workflow, label: "MVP systems" },
            { icon: BarChart3, label: "Dashboards" },
            { icon: CheckCircle2, label: "Business tools" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/15 bg-black/45 p-3 text-white backdrop-blur">
              <item.icon className="mb-2 h-4 w-4 text-primary" />
              <p className="text-sm font-semibold">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="mt-3 grid grid-cols-3 gap-3 lg:hidden">
        {floating.map((item, index) => (
          <div
            key={item.title}
            className={`overflow-hidden rounded-2xl border border-border bg-background/80 shadow-lg shadow-black/15 ${
              index % 2 === 0 ? "float-slow" : "float-slower"
            }`}
          >
            <div className="relative aspect-[4/3]">
              <ZoomableImage
                src={item.src}
                alt={item.alt}
                title={item.title}
                sizes="33vw"
                fit="cover"
              />
            </div>
            <p className="truncate px-2 py-2 text-[11px] font-semibold">{item.title}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-3 sm:hidden">
        {[
          { icon: Workflow, label: "MVP systems" },
          { icon: BarChart3, label: "Dashboards" },
          { icon: CheckCircle2, label: "Business tools" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-border bg-background/70 p-3">
            <item.icon className="h-4 w-4 text-primary" />
            <p className="text-sm font-semibold">{item.label}</p>
          </div>
        ))}
      </div>

      {floating.map((item, index) => (
        <motion.div
          key={item.title}
          className="absolute hidden w-36 overflow-hidden rounded-2xl border border-white/15 bg-card shadow-2xl shadow-black/25 lg:block"
          style={{
            top: index === 0 ? 28 : index === 1 ? 158 : 300,
            right: index === 1 ? 18 : index === 2 ? 90 : 44,
          }}
          animate={{ y: [0, index % 2 === 0 ? -10 : 10, 0] }}
          transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative aspect-[4/3]">
            <ZoomableImage src={item.src} alt={item.alt} title={item.title} sizes="144px" fit="cover" />
          </div>
          <div className="p-3">
            <p className="line-clamp-1 text-xs font-semibold">{item.title}</p>
            <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">{item.category}</p>
          </div>
        </motion.div>
      ))}

      <motion.div
        className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur sm:absolute sm:-bottom-2 sm:left-5 sm:mt-0"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold">Realistic product displays</p>
          <p className="text-xs text-muted-foreground">Animated, polished, business-ready</p>
        </div>
      </motion.div>
    </div>
  );
}

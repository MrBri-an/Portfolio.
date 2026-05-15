import type { Metadata } from "next";
import { Images, Sparkles } from "lucide-react";

import { AnimatedContainer } from "@/components/portfolio/animated-container";
import { BackHomeButton } from "@/components/portfolio/back-home-button";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { ZoomableImage } from "@/components/portfolio/zoomable-image";
import { galleryItems } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Gallery | Brian Dara Portfolio",
  description:
    "A visual gallery of Brian Dara's product interfaces, MVP concepts, dashboards, mobile apps, and business-focused software work.",
};

export default function GalleryPage() {
  const featured = galleryItems.slice(0, 6);
  const rest = galleryItems.slice(6);

  return (
    <main className="border-b border-border">
      <section className="relative overflow-hidden border-b border-border py-20">
        <div className="portfolio-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <AnimatedContainer>
            <BackHomeButton />
            <SectionHeading
              eyebrow="Gallery"
              title="A visual library of product systems, dashboards, apps, and MVP work."
              description="Browse the interface concepts and product visuals in one place. Tap any image to open a clear large preview."
            />
          </AnimatedContainer>

          <AnimatedContainer delay={0.1} className="relative">
            <div className="grid gap-4 sm:grid-cols-2">
              {featured.slice(0, 4).map((item, index) => (
                <div
                  key={item.title}
                  className={`relative overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-xl shadow-black/10 ${
                    index === 0 ? "sm:row-span-2" : ""
                  }`}
                >
                  <div className={index === 0 ? "relative aspect-[4/5] h-full" : "relative aspect-[4/3]"}>
                    <ZoomableImage
                      src={item.src}
                      alt={item.alt}
                      title={item.title}
                      sizes="(min-width: 1024px) 360px, 100vw"
                      fit="cover"
                      priority={index === 0}
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <div className="pointer-events-none absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">{item.category}</p>
                    <h2 className="mt-1 font-[var(--font-jakarta)] text-lg font-semibold">{item.title}</h2>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedContainer>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">All work</p>
              <h2 className="mt-3 font-[var(--font-jakarta)] text-3xl font-semibold tracking-tight sm:text-4xl">
                Product visuals and project screens
              </h2>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
              <Images className="h-4 w-4 text-primary" />
              {galleryItems.length} visuals
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((item, index) => (
              <AnimatedContainer key={item.title} delay={(index % 6) * 0.03}>
                <article className="group overflow-hidden rounded-[1.5rem] border border-border bg-card/75 shadow-lg shadow-black/5 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
                  <div className="relative aspect-[4/3]">
                    <ZoomableImage
                      src={item.src}
                      alt={item.alt}
                      title={item.title}
                      sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                      fit="cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{item.category}</p>
                        <h3 className="mt-2 font-[var(--font-jakarta)] text-xl font-semibold">{item.title}</h3>
                      </div>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-background transition group-hover:bg-primary group-hover:text-primary-foreground">
                        <Sparkles className="h-4 w-4" />
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{item.type}</p>
                  </div>
                </article>
              </AnimatedContainer>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

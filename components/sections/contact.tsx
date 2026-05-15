"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, Send, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";

import { AnimatedContainer } from "@/components/portfolio/animated-container";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { profile } from "@/data/portfolio";

export function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const projectType = String(formData.get("projectType") ?? "");
    const budget = String(formData.get("budget") ?? "");
    const message = String(formData.get("message") ?? "");
    const subject = encodeURIComponent(`Portfolio inquiry from ${name || "a visitor"}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        `Project type: ${projectType}`,
        `Budget range: ${budget}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    );

    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <section id="contact" className="relative overflow-hidden py-24">
      <div className="portfolio-grid absolute inset-0 opacity-35" aria-hidden="true" />
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <AnimatedContainer>
          <SectionHeading
            eyebrow="Contact"
            title="Let's build something useful."
            description="Have an idea, workflow, dashboard, mobile app, AI tool, or MVP that needs clear execution? Send the details and I will help shape the next practical step."
          />
          <a
            href={`mailto:${profile.email}`}
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:text-primary"
          >
            <Mail className="h-4 w-4" />
            {profile.email}
          </a>
          <a
            href={profile.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="ml-0 mt-3 inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:text-primary sm:ml-3 sm:mt-8"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
          <p className="mt-4 text-sm text-muted-foreground">{profile.location}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              ["Fast scope", "Clear build direction"],
              ["MVP-ready", "Practical delivery plan"],
              ["Business-first", "Useful software outcomes"],
            ].map(([label, text], index) => (
              <div key={label} className={`rounded-2xl border border-border bg-card/70 p-4 shadow-lg shadow-black/5 ${index === 1 ? "float-slower" : "float-slow"}`}>
                <p className="text-sm font-semibold">{label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </AnimatedContainer>

        <AnimatedContainer delay={0.1}>
          <motion.form
            onSubmit={handleSubmit}
            className="shine-sweep relative rounded-[1.75rem] border border-border bg-card/85 p-6 shadow-2xl shadow-black/10 backdrop-blur sm:p-8"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/65 p-4">
              <div>
                <p className="text-sm font-semibold">Project intake</p>
                <p className="mt-1 text-xs text-muted-foreground">Your message opens directly in email, already addressed.</p>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Name
                <Input name="name" placeholder="Your name" required autoComplete="name" className="transition focus-visible:scale-[1.01]" />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Email
                <Input name="email" type="email" placeholder="you@example.com" required autoComplete="email" className="transition focus-visible:scale-[1.01]" />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Project type
                <select
                  name="projectType"
                  required
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm text-foreground ring-offset-background transition focus-visible:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select a project type</option>
                  <option>AI tool or automation</option>
                  <option>Web app or dashboard</option>
                  <option>Mobile app MVP</option>
                  <option>Marketplace or SaaS</option>
                  <option>Product strategy</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Budget range
                <select
                  name="budget"
                  required
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm text-foreground ring-offset-background transition focus-visible:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select a range</option>
                  <option>Exploring scope</option>
                  <option>$500 - $1,500</option>
                  <option>$1,500 - $5,000</option>
                  <option>$5,000+</option>
                </select>
              </label>
            </div>
            <label className="mt-5 grid gap-2 text-sm font-medium">
              Message
              <Textarea name="message" placeholder="Tell me what you want to build, the business goal, and any timeline you have in mind." required className="transition focus-visible:scale-[1.01]" />
            </label>
            <Button type="submit" size="lg" className="mt-6 w-full rounded-full sm:w-auto">
              Start the conversation
              <Send className="ml-2 h-4 w-4" />
            </Button>
            {sent ? (
              <p className="mt-4 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm text-primary">
                Thanks. Your email app should open with the message addressed to {profile.email}.
              </p>
            ) : null}
          </motion.form>
        </AnimatedContainer>
      </div>
    </section>
  );
}

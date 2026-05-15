import Link from "next/link";

import { AvatarMark } from "@/components/portfolio/avatar-mark";
import { profile } from "@/data/portfolio";

const footerLinks = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "Skills", href: "/#skills" },
  { label: "Process", href: "/#process" },
  { label: "Contact", href: "https://wa.me/2349050551807", external: true },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <AvatarMark />
            <div>
              <p className="font-[var(--font-jakarta)] font-semibold">{profile.name}</p>
              <p className="text-sm text-muted-foreground">{profile.title}</p>
            </div>
          </div>
          <p className="mt-5 max-w-md leading-7 text-muted-foreground">
            Building practical AI-powered tools, web and mobile apps, dashboards, automations,
            and product-focused systems for modern businesses.
          </p>
          <p className="mt-5 text-sm text-muted-foreground">Built with care and precision.</p>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold">Quick links</p>
          <div className="grid gap-3">
            {footerLinks.map((link) => (
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted-foreground transition hover:text-foreground"
                >
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} href={link.href} className="text-sm text-muted-foreground transition hover:text-foreground">
                  {link.label}
                </Link>
              )
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold">Connect</p>
          <div className="grid gap-3">
            {profile.socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-muted-foreground transition hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        Copyright {new Date().getFullYear()} {profile.name}. All rights reserved.
      </div>
    </footer>
  );
}

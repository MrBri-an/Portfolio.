import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ThemeProvider } from "@/components/theme/theme-provider";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brian Dara — AI & Software Developer Portfolio",
  description:
    "Portfolio of an AI-focused software developer building web apps, mobile apps, MVPs, dashboards, automation systems, and business-focused digital products.",
  keywords: [
    "AI developer",
    "software developer",
    "web developer",
    "mobile app developer",
    "React developer",
    "Next.js developer",
    "prompt engineer",
    "AI evaluator",
    "MVP builder",
    "dashboard developer",
    "automation developer",
  ],
  authors: [{ name: "Brian Dara" }],
  openGraph: {
    title: "Brian Dara — AI & Software Developer Portfolio",
    description:
      "AI-focused software developer building web apps, mobile apps, MVPs, dashboards, automation systems, and business-focused digital products.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jakarta.variable} h-full`}
    >
      <body className="min-h-full font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="min-h-screen">
            <Header />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

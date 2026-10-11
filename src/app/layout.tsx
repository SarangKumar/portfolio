import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { projects } from "@/data/projects";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sarang Kumar",
    template: "%s · Sarang Kumar",
  },
  description: "Portfolio of Sarang Kumar, software engineer.",
};

const headerProjects = projects.map((project) => ({
  slug: project.slug,
  title: project.title,
  summary: project.summary,
}));

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader projects={headerProjects} />
        <main id="content" className="flex-1 py-12 sm:py-16">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}

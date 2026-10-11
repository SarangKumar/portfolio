import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Quote, Sparkle } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "About",
  description: "Background, working style and interests.",
};

export default function AboutPage() {
  return (
    <div className="app-container flex flex-col gap-14">
      <PageHeader
        eyebrow={profile.headline ?? undefined}
        title="About"
        description={profile.summary ?? undefined}
      />

      <section
        className="fade-up grid gap-8 lg:grid-cols-[1.4fr_1fr]"
        style={{ "--delay": "180ms" } as React.CSSProperties}
      >
        <div className="flex flex-col gap-3">
          <h2 className="section-title">Background</h2>
          <p className="text-muted-foreground max-w-prose leading-relaxed">
            {profile.background}
          </p>
          <Link
            href="/experience"
            className="text-primary mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-medium"
          >
            Full work history &amp; education
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <blockquote className="border-primary/40 bg-card lift relative flex flex-col gap-3 rounded-xl border-l-2 p-6">
          <Quote className="text-primary/50 size-6" aria-hidden />
          <p className="text-foreground/90 text-sm leading-relaxed italic">
            {profile.philosophy}
          </p>
          <span className="meta not-italic">How I work</span>
        </blockquote>
      </section>

      <section
        className="fade-up flex flex-col gap-4"
        style={{ "--delay": "260ms" } as React.CSSProperties}
      >
        <h2 className="section-title">Interests</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {profile.interests.map((interest, index) => (
            <div
              key={interest}
              className="lift fade-up border-border bg-card/60 flex items-center gap-3 rounded-lg border p-4"
              style={
                { "--delay": `${320 + index * 60}ms` } as React.CSSProperties
              }
            >
              <Sparkle className="text-primary size-4 shrink-0" />
              <span className="text-sm leading-snug">{interest}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

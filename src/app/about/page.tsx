import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import {
  TypographyBlockquote,
  TypographyMuted,
  TypographyP,
} from "@/components/ui/typography";
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
          <TypographyP className="text-muted-foreground max-w-prose">
            {profile.background}
          </TypographyP>
          <Link
            href="/experience"
            className="text-primary mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-medium"
          >
            Full work history &amp; education
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="border-border bg-card lift rounded-xl border p-6">
          <TypographyBlockquote className="text-foreground/90 border-primary text-sm">
            {profile.philosophy}
          </TypographyBlockquote>
          <TypographyMuted className="mt-3">How I work</TypographyMuted>
        </div>
      </section>

      <section
        className="fade-up flex flex-col gap-4"
        style={{ "--delay": "260ms" } as React.CSSProperties}
      >
        <h2 className="section-title">Interests</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {profile.interests.map((interest, index) => (
            <li
              key={interest}
              className="lift fade-up border-border bg-card/60 rounded-lg border p-4 text-sm leading-snug"
              style={
                { "--delay": `${320 + index * 60}ms` } as React.CSSProperties
              }
            >
              {interest}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

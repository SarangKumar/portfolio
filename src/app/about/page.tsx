import type { Metadata } from "next";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import { PageHeader } from "@/components/site/page-header";
import { profile } from "@/data/profile";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "About",
  description: "Background, working style and interests.",
};

export default function AboutPage() {
  return (
    <div className="app-container flex flex-col gap-12">
      <PageHeader
        eyebrow={profile.headline ?? undefined}
        title="About"
        description={profile.summary ?? undefined}
      />

      <section
        className="fade-up flex flex-col gap-4"
        style={{ "--delay": "180ms" } as React.CSSProperties}
      >
        <h2 className="section-title">Background</h2>
        <p className="text-muted-foreground max-w-3xl leading-relaxed">
          {profile.background}
        </p>
      </section>

      <Separator />

      <section
        className="fade-up flex flex-col gap-4"
        style={{ "--delay": "240ms" } as React.CSSProperties}
      >
        <h2 className="section-title">How I work</h2>
        <p className="text-muted-foreground max-w-3xl leading-relaxed">
          {profile.philosophy}
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <Marker variant="separator">Interests</Marker>
        <ul className="grid gap-3 sm:grid-cols-2">
          {profile.interests.map((interest, index) => (
            <li
              key={interest}
              className="fade-up flex items-center gap-3 text-sm"
              style={
                { "--delay": `${300 + index * 60}ms` } as React.CSSProperties
              }
            >
              <MarkerIcon>
                <span className="bg-primary size-1.5 rounded-full" />
              </MarkerIcon>
              <MarkerContent>{interest}</MarkerContent>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

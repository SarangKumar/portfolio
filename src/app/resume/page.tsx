import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { ArrowUpRight, Download } from "lucide-react";
import { Monogram } from "@/components/site/monogram";
import { PageHeader } from "@/components/site/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyMuted, TypographyP } from "@/components/ui/typography";
import { contactProfile } from "@/data/contact";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { resumes } from "@/data/resumes";
import { skills } from "@/data/skills";

export const metadata: Metadata = {
  title: "Resume",
  description: "Highlights, preview, and download.",
};

const accentVars = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
] as const;

/** `fileSrc` is a public/ path (e.g. "/resumes/foo.pdf"); public/ maps
 * directly onto disk, so this is a legitimate existence check rather than a
 * network request. Keeps the page honest if the PDF hasn't been uploaded. */
function resumeFileExists(fileSrc: string | null): boolean {
  if (!fileSrc) return false;
  return existsSync(join(process.cwd(), "public", fileSrc.replace(/^\//, "")));
}

function formatUpdated(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default function ResumePage() {
  const defaultResume =
    resumes.find((resume) => resume.isDefault) ?? resumes[0];
  const fileExists = defaultResume
    ? resumeFileExists(defaultResume.fileSrc)
    : false;
  const updated = defaultResume ? formatUpdated(defaultResume.updatedAt) : null;

  const focusSkills = profile.focusSkillIds
    .map((id) => skills.find((skill) => skill.id === id))
    .filter((skill) => skill !== undefined);

  // Live, real work — a resume with nowhere to click through is just a PDF.
  const proofOfWork = projects.filter((project) => project.demoUrl).slice(0, 2);

  return (
    <div className="app-container flex flex-col gap-14">
      <PageHeader
        eyebrow={profile.headline ?? undefined}
        title="Resume"
        description="The short version is below. The long version is the PDF."
      >
        <div
          className="fade-up flex items-center gap-3 pt-2"
          style={{ "--delay": "180ms" } as React.CSSProperties}
        >
          <Monogram />
          <TypographyP className="text-muted-foreground text-sm">
            {profile.displayName}
            {contactProfile.email ? ` · ${contactProfile.email}` : ""}
          </TypographyP>
        </div>
      </PageHeader>

      {profile.highlights.length > 0 ? (
        <section
          className="fade-up grid grid-cols-2 gap-4 sm:grid-cols-4"
          style={{ "--delay": "240ms" } as React.CSSProperties}
        >
          {profile.highlights.map((highlight, index) => (
            <div
              key={highlight.label}
              className="lift border-border bg-card/60 relative overflow-hidden rounded-lg border p-4"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-0.5"
                style={{ background: accentVars[index % accentVars.length] }}
              />
              <p className="text-2xl font-bold tracking-tight sm:text-3xl">
                {highlight.value}
              </p>
              <p className="text-muted-foreground mt-1 text-xs leading-snug">
                {highlight.label}
              </p>
            </div>
          ))}
        </section>
      ) : null}

      {focusSkills.length > 0 ? (
        <section
          className="fade-up flex flex-wrap gap-2"
          style={{ "--delay": "300ms" } as React.CSSProperties}
        >
          {focusSkills.map((skill) => (
            <Badge key={skill.id} variant="secondary" className="font-normal">
              {skill.name}
            </Badge>
          ))}
        </section>
      ) : null}

      {proofOfWork.length > 0 ? (
        <section
          className="fade-up flex flex-col gap-3"
          style={{ "--delay": "340ms" } as React.CSSProperties}
        >
          <span className="meta uppercase tracking-wide">Proof of work</span>
          <div className="grid gap-3 sm:grid-cols-2">
            {proofOfWork.map((project) => (
              <a
                key={project.id}
                href={project.demoUrl ?? undefined}
                target="_blank"
                rel="noreferrer"
                className="lift border-border bg-card/60 group flex items-center justify-between gap-3 rounded-lg border p-4"
              >
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{project.title}</span>
                  <span className="text-muted-foreground text-xs">
                    {project.summary}
                  </span>
                </span>
                <ArrowUpRight className="text-muted-foreground group-hover:text-primary size-4 shrink-0 transition-colors" />
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {defaultResume ? (
        <Card className="lift fade-up max-w-3xl">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-base">{defaultResume.label}</CardTitle>
              {defaultResume.isDefault ? (
                <Badge className="font-normal">Default</Badge>
              ) : null}
              {updated ? (
                <TypographyMuted className="ml-auto text-xs">
                  Updated {updated}
                </TypographyMuted>
              ) : null}
            </div>
            {defaultResume.overview ? (
              <TypographyP className="text-muted-foreground text-sm">
                {defaultResume.overview}
              </TypographyP>
            ) : null}
          </CardHeader>
          <CardContent className="gap-4">
            {fileExists && defaultResume.fileSrc ? (
              <>
                <div className="border-border overflow-hidden rounded-lg border">
                  <object
                    data={defaultResume.fileSrc}
                    type="application/pdf"
                    className="aspect-[1/1.35] w-full"
                    aria-label={`${defaultResume.label} preview`}
                  >
                    <div className="bg-muted flex aspect-[1/1.35] w-full items-center justify-center p-6 text-center">
                      <TypographyMuted>
                        Your browser can&apos;t preview PDFs inline.{" "}
                        <a
                          href={defaultResume.fileSrc}
                          className="text-primary underline underline-offset-2"
                        >
                          Open it directly
                        </a>
                        .
                      </TypographyMuted>
                    </div>
                  </object>
                </div>
                <a
                  href={defaultResume.fileSrc}
                  download={defaultResume.fileName ?? true}
                  className={buttonVariants({ size: "lg", className: "w-fit" })}
                >
                  <Download /> Download PDF
                </a>
              </>
            ) : (
              <TypographyMuted>The PDF is not uploaded yet.</TypographyMuted>
            )}
          </CardContent>
        </Card>
      ) : (
        <TypographyMuted>No resume published yet.</TypographyMuted>
      )}
    </div>
  );
}

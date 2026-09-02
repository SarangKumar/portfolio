import type { ProjectItem } from "@/data/projects";
import { absoluteUrl } from "@/lib/url";

type ProjectJsonLdProps = {
  project: ProjectItem;
  canonicalUrl: string;
};

export function ProjectJsonLd({ project, canonicalUrl }: ProjectJsonLdProps) {
  const sameAs = [project.githubUrl, project.demoUrl].filter(
    (value): value is string => Boolean(value),
  );

  const data = {
    "@context": "https://schema.org",
    "@type": project.githubUrl ? "SoftwareSourceCode" : "CreativeWork",
    name: project.title,
    description: project.summary,
    url: canonicalUrl,
    ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(project.technologies.length > 0
      ? { keywords: project.technologies.join(", ") }
      : {}),
    ...(project.media[0] && project.media[0].kind !== "video"
      ? {
          image: project.media[0].src.startsWith("http")
            ? project.media[0].src
            : absoluteUrl(project.media[0].src),
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

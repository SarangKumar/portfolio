import type { ProjectItem } from "@/data/projects";
import { JsonLd } from "@/components/seo/json-ld";
import { creativeWorkJsonLd } from "@/lib/seo";

type ProjectJsonLdProps = {
  project: ProjectItem;
  canonicalUrl: string;
};

export function ProjectJsonLd({ project, canonicalUrl }: ProjectJsonLdProps) {
  return <JsonLd data={creativeWorkJsonLd(project, canonicalUrl)} />;
}

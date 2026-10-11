import { ExternalLink, GitBranch } from "lucide-react";
import { TrackedExternalLink } from "@/analytics/tracked-external-link";
import { buttonVariants } from "@/components/ui/button";
import { getExternalAnchorProps } from "@/lib/href";

type ProjectLinksProps = {
  githubUrl: string | null;
  demoUrl: string | null;
  sourceLabel: string;
  demoLabel: string;
};

export function ProjectLinks({
  githubUrl,
  demoUrl,
  sourceLabel,
  demoLabel,
}: ProjectLinksProps) {
  if (!githubUrl && !demoUrl) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {githubUrl ? (
        <TrackedExternalLink
          href={githubUrl}
          className={buttonVariants({ variant: "outline", size: "sm" })}
          {...getExternalAnchorProps(githubUrl)}
        >
          <GitBranch />
          {sourceLabel}
        </TrackedExternalLink>
      ) : null}
      {demoUrl ? (
        <a
          href={demoUrl}
          className={buttonVariants({ variant: "default", size: "sm" })}
          {...getExternalAnchorProps(demoUrl)}
        >
          <ExternalLink />
          {demoLabel}
        </a>
      ) : null}
    </div>
  );
}

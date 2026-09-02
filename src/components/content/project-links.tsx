import { ExternalLink, GitBranch } from "lucide-react";
import {
  buttonClassName,
  buttonSizes,
  buttonVariants,
} from "@/components/ui/button";
import { cn } from "@/lib/cn";
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
        <a
          href={githubUrl}
          className={cn(
            buttonClassName.base,
            buttonVariants.outline,
            buttonSizes.sm,
          )}
          {...getExternalAnchorProps(githubUrl)}
        >
          <GitBranch />
          {sourceLabel}
        </a>
      ) : null}
      {demoUrl ? (
        <a
          href={demoUrl}
          className={cn(
            buttonClassName.base,
            buttonVariants.primary,
            buttonSizes.sm,
          )}
          {...getExternalAnchorProps(demoUrl)}
        >
          <ExternalLink />
          {demoLabel}
        </a>
      ) : null}
    </div>
  );
}

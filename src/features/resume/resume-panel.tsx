"use client";

import { useEffect, useState } from "react";
import { analyticsEvents, trackResumeEvent } from "@/analytics/events";
import { ContentPlaceholder } from "@/components/content/content-placeholder";
import {
  buttonClassName,
  buttonSizes,
  buttonVariants,
} from "@/components/ui/button";
import type { ResumeVersion } from "@/data/resumes";
import { cn } from "@/lib/cn";
import { defaultResume } from "@/lib/resume";

type ResumePanelCopy = {
  versions: string;
  preview: string;
  previewUnavailable: string;
  download: string;
  downloadUnavailable: string;
};

type ResumePanelProps = {
  versions: readonly ResumeVersion[];
  copy: ResumePanelCopy;
};

export function ResumePanel({ versions, copy }: ResumePanelProps) {
  const initial = defaultResume(versions);
  const [selectedId, setSelectedId] = useState(initial?.id ?? "");
  const selected =
    versions.find((item) => item.id === selectedId) ?? initial ?? null;

  useEffect(() => {
    const current = defaultResume(versions);

    if (current) {
      trackResumeEvent(analyticsEvents.resumeView, current.id);
    }
  }, [versions]);

  if (!selected) {
    return null;
  }

  return (
    <div className="stack-default">
      {selected.overview ? (
        <p className="max-w-prose type-body text-muted-foreground">
          {selected.overview}
        </p>
      ) : null}

      {versions.length > 1 ? (
        <div
          role="group"
          aria-label={copy.versions}
          className="flex flex-wrap gap-1"
        >
          {versions.map((version) => (
            <button
              key={version.id}
              type="button"
              aria-pressed={version.id === selected.id}
              className={cn(
                "rounded-sm border px-2 py-1 type-small transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
                version.id === selected.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-transparent text-foreground hover:bg-muted",
              )}
              onClick={() => {
                setSelectedId(version.id);
                trackResumeEvent(analyticsEvents.resumeView, version.id);
              }}
            >
              {version.label}
            </button>
          ))}
        </div>
      ) : null}

      <ResumePreview version={selected} copy={copy} />

      {selected.fileSrc ? (
        <a
          href={selected.fileSrc}
          download={selected.fileName ?? true}
          className={cn(
            buttonClassName.base,
            buttonVariants.primary,
            buttonSizes.sm,
            "w-fit",
          )}
          onClick={() =>
            trackResumeEvent(analyticsEvents.resumeDownload, selected.id)
          }
        >
          {copy.download}
        </a>
      ) : (
        <ContentPlaceholder>{copy.downloadUnavailable}</ContentPlaceholder>
      )}
    </div>
  );
}

function ResumePreview({
  version,
  copy,
}: {
  version: ResumeVersion;
  copy: ResumePanelCopy;
}) {
  if (!version.previewSrc || !version.previewKind) {
    return <ContentPlaceholder>{copy.previewUnavailable}</ContentPlaceholder>;
  }

  if (version.previewKind === "pdf") {
    return (
      <iframe
        title={copy.preview}
        src={version.previewSrc}
        className="h-[28rem] w-full rounded-md border border-border bg-muted"
        onLoad={() =>
          trackResumeEvent(analyticsEvents.resumePreview, version.id)
        }
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={version.previewSrc}
      alt={copy.preview}
      className="w-full rounded-md border border-border bg-muted"
      onLoad={() => trackResumeEvent(analyticsEvents.resumePreview, version.id)}
    />
  );
}

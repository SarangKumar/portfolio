"use client";

import { useState } from "react";
import {
  archiveProjectAction,
  publishProjectAction,
  unpublishProjectAction,
} from "@/cms/projects/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { PublicationStatus } from "@/content/status";

export type ProjectStatusCopy = {
  publish: string;
  unpublish: string;
  archive: string;
  archiveConfirm: string;
  archiveHint: string;
  cancel: string;
};

type ProjectStatusControlsProps = {
  projectKey: string;
  status: PublicationStatus;
  copy: ProjectStatusCopy;
};

export function ProjectStatusControls({
  projectKey,
  status,
  copy,
}: ProjectStatusControlsProps) {
  const [confirmingArchive, setConfirmingArchive] = useState(false);

  return (
    <Card className="stack-compact">
      <div className="flex flex-wrap gap-2">
        {status !== "published" ? (
          <form action={publishProjectAction}>
            <input type="hidden" name="key" value={projectKey} />
            <Button type="submit" size="sm">
              {copy.publish}
            </Button>
          </form>
        ) : (
          <form action={unpublishProjectAction}>
            <input type="hidden" name="key" value={projectKey} />
            <Button type="submit" size="sm" variant="outline">
              {copy.unpublish}
            </Button>
          </form>
        )}
        {status !== "archived" && !confirmingArchive ? (
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={() => setConfirmingArchive(true)}
          >
            {copy.archive}
          </Button>
        ) : null}
      </div>
      {confirmingArchive ? (
        <form action={archiveProjectAction} className="stack-compact">
          <input type="hidden" name="key" value={projectKey} />
          <p className="type-small text-muted-foreground">{copy.archiveHint}</p>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" size="sm" variant="destructive">
              {copy.archiveConfirm}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setConfirmingArchive(false)}
            >
              {copy.cancel}
            </Button>
          </div>
        </form>
      ) : null}
    </Card>
  );
}

"use client";

import { useState } from "react";
import {
  archiveJobApplicationAction,
  changeJobApplicationStatusAction,
} from "@/career/applications/actions";
import {
  jobApplicationStatuses,
  type JobApplicationStatus,
} from "@/career/applications/status";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { ApplicationActionCopy } from "@/features/admin/applications/application-tracker-copy";

const selectClassName = cn(
  "h-7 max-w-40 rounded-sm border border-input bg-background px-1.5 type-small text-foreground",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

type ApplicationRowActionsProps = {
  applicationKey: string;
  status: JobApplicationStatus;
  returnTo: string;
  autoFocusStatus: boolean;
  showStatusSelect?: boolean;
  copy: ApplicationActionCopy;
};

export function ApplicationRowActions({
  applicationKey,
  status,
  returnTo,
  autoFocusStatus,
  showStatusSelect = true,
  copy,
}: ApplicationRowActionsProps) {
  const [confirmingArchive, setConfirmingArchive] = useState(false);

  return (
    <div className="flex flex-col items-stretch gap-1 sm:items-end">
      {showStatusSelect ? (
        <form
          action={changeJobApplicationStatusAction}
          className="flex items-center gap-1"
        >
          <input type="hidden" name="key" value={applicationKey} />
          <input type="hidden" name="from" value={returnTo} />
          <label className="sr-only" htmlFor={`status-${applicationKey}`}>
            {copy.changeStatus}
          </label>
          <select
            id={`status-${applicationKey}`}
            name="status"
            defaultValue={status}
            autoFocus={autoFocusStatus}
            aria-label={copy.changeStatus}
            className={selectClassName}
            onChange={(event) => event.currentTarget.form?.requestSubmit()}
          >
            {jobApplicationStatuses.map((value) => (
              <option key={value} value={value}>
                {copy.statusLabel[value]}
              </option>
            ))}
          </select>
          <Button type="submit" size="sm" variant="ghost" className="sr-only">
            {copy.changeStatus}
          </Button>
        </form>
      ) : null}
      {confirmingArchive ? (
        <form action={archiveJobApplicationAction} className="stack-compact">
          <input type="hidden" name="key" value={applicationKey} />
          <input type="hidden" name="from" value={returnTo} />
          <p className="max-w-48 type-metadata text-muted-foreground">
            {copy.archiveHint}
          </p>
          <div className="flex flex-wrap gap-1">
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
      ) : (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setConfirmingArchive(true)}
        >
          {copy.archive}
        </Button>
      )}
    </div>
  );
}

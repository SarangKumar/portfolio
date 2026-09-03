"use client";

import { useState } from "react";
import { changeJobApplicationStatusAction } from "@/career/applications/actions";
import {
  jobApplicationStatuses,
  type JobApplicationStatus,
} from "@/career/applications/status";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";
import { AdminField } from "@/features/admin/admin-field";

const selectClassName = cn(
  "h-8 max-w-56 rounded-sm border border-input bg-background px-1.5 type-small text-foreground",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

export type ApplicationStatusFormCopy = {
  changeStatus: string;
  saveStatus: string;
  rejectionReason: string;
  rejectionReasonHint: string;
  note: string;
  statusLabel: Record<JobApplicationStatus, string>;
};

type ApplicationStatusChangeFormProps = {
  applicationKey: string;
  status: JobApplicationStatus;
  returnTo: string;
  autoFocusStatus: boolean;
  copy: ApplicationStatusFormCopy;
};

export function ApplicationStatusChangeForm({
  applicationKey,
  status,
  returnTo,
  autoFocusStatus,
  copy,
}: ApplicationStatusChangeFormProps) {
  const [selected, setSelected] = useState<JobApplicationStatus>(status);
  const showRejectionReason = selected === "rejected";

  return (
    <form action={changeJobApplicationStatusAction} className="stack-compact">
      <input type="hidden" name="key" value={applicationKey} />
      <input type="hidden" name="from" value={returnTo} />
      <AdminField
        id={`detail-status-${applicationKey}`}
        label={copy.changeStatus}
      >
        <select
          id={`detail-status-${applicationKey}`}
          name="status"
          value={selected}
          autoFocus={autoFocusStatus}
          className={selectClassName}
          onChange={(event) =>
            setSelected(event.currentTarget.value as JobApplicationStatus)
          }
        >
          {jobApplicationStatuses.map((value) => (
            <option key={value} value={value}>
              {copy.statusLabel[value]}
            </option>
          ))}
        </select>
      </AdminField>
      {showRejectionReason ? (
        <AdminField
          id={`rejection-${applicationKey}`}
          label={copy.rejectionReason}
          hint={copy.rejectionReasonHint}
        >
          <Textarea
            id={`rejection-${applicationKey}`}
            name="rejectionReason"
            rows={3}
            aria-describedby={`rejection-${applicationKey}-hint`}
          />
        </AdminField>
      ) : null}
      <AdminField id={`note-${applicationKey}`} label={copy.note}>
        <Textarea id={`note-${applicationKey}`} name="note" rows={2} />
      </AdminField>
      <Button type="submit" size="sm">
        {copy.saveStatus}
      </Button>
    </form>
  );
}

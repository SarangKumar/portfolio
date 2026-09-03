import { formatApplicationTimestamp } from "@/career/applications/query";
import type { JobApplicationStatusHistoryRecord } from "@/career/applications/types";
import { Badge } from "@/components/ui/badge";
import { ApplicationStatusBadge } from "@/features/admin/applications/application-status-badge";
import type { ApplicationDetailCopy } from "@/features/admin/applications/application-detail-copy";

type ApplicationStatusHistoryProps = {
  entries: readonly JobApplicationStatusHistoryRecord[];
  viewerIdentityId: string;
  viewerEmail: string;
  copy: ApplicationDetailCopy;
};

function actorLabel(
  entry: JobApplicationStatusHistoryRecord,
  viewerIdentityId: string,
  viewerEmail: string,
): string {
  if (entry.changedByIdentityId === viewerIdentityId) {
    return viewerEmail;
  }

  return entry.changedByIdentityId;
}

export function ApplicationStatusHistory({
  entries,
  viewerIdentityId,
  viewerEmail,
  copy,
}: ApplicationStatusHistoryProps) {
  if (entries.length === 0) {
    return (
      <p className="type-small text-muted-foreground" role="status">
        {copy.historyEmpty}
      </p>
    );
  }

  return (
    <div className="stack-compact">
      <p className="type-metadata text-muted-foreground">
        {copy.statusHistoryHint}
      </p>
      <ol className="stack-compact border-l border-border pl-3">
        {entries.map((entry, index) => {
          const current = index === 0;

          return (
            <li key={entry.key} className="stack-compact">
              <div className="flex flex-wrap items-center gap-1.5">
                {entry.previousStatus ? (
                  <ApplicationStatusBadge
                    status={entry.previousStatus}
                    labels={copy.statusLabel}
                  />
                ) : (
                  <Badge variant="outline">{copy.initialStatus}</Badge>
                )}
                <span
                  aria-hidden
                  className="type-metadata text-muted-foreground"
                >
                  →
                </span>
                <ApplicationStatusBadge
                  status={entry.newStatus}
                  labels={copy.statusLabel}
                />
                {current ? (
                  <Badge variant="outline">{copy.statusCurrent}</Badge>
                ) : null}
              </div>
              <p className="type-metadata text-muted-foreground">
                <time dateTime={entry.changedAt}>
                  {formatApplicationTimestamp(entry.changedAt)}
                </time>
              </p>
              <p className="type-metadata text-muted-foreground">
                {copy.changedBy}{" "}
                {actorLabel(entry, viewerIdentityId, viewerEmail)}
              </p>
              {entry.reason ? (
                <p className="type-small">
                  <span className="type-metadata text-muted-foreground">
                    {copy.reason}:{" "}
                  </span>
                  {entry.reason}
                </p>
              ) : null}
              {entry.note ? (
                <p className="type-small">
                  <span className="type-metadata text-muted-foreground">
                    {copy.note}:{" "}
                  </span>
                  {entry.note}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

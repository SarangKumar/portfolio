import NextLink from "next/link";
import {
  applicationDetailHref,
  applicationEditHref,
  applicationTrackerHasFilters,
  applicationTrackerHref,
  formatApplicationDate,
  type ApplicationTrackerState,
} from "@/career/applications/query";
import type {
  JobApplicationSortField,
  JobApplicationSummary,
} from "@/career/applications/types";
import { cn } from "@/lib/cn";
import {
  ApplicationPriorityBadge,
  ApplicationStatusBadge,
} from "@/features/admin/applications/application-status-badge";
import { ApplicationRowActions } from "@/features/admin/applications/application-row-actions";
import type { ApplicationTrackerCopy } from "@/features/admin/applications/application-tracker-copy";

type ApplicationTableProps = {
  items: readonly JobApplicationSummary[];
  state: ApplicationTrackerState;
  returnTo: string;
  copy: ApplicationTrackerCopy;
};

const columns: {
  field: JobApplicationSortField;
  label: (copy: ApplicationTrackerCopy) => string;
}[] = [
  { field: "company", label: (copy) => copy.company },
  { field: "role", label: (copy) => copy.role },
  { field: "status", label: (copy) => copy.status },
  { field: "location", label: (copy) => copy.location },
  { field: "appliedAt", label: (copy) => copy.applied },
  { field: "priority", label: (copy) => copy.priority },
  { field: "nextActionAt", label: (copy) => copy.nextAction },
];

function sortHref(
  state: ApplicationTrackerState,
  field: JobApplicationSortField,
): string {
  const same = state.sort === field;
  return applicationTrackerHref(state, {
    sort: field,
    dir: same && state.dir === "asc" ? "desc" : "asc",
    page: 1,
    open: "",
    edit: "",
  });
}

function SortHeader({
  field,
  state,
  copy,
  children,
}: {
  field: JobApplicationSortField;
  state: ApplicationTrackerState;
  copy: ApplicationTrackerCopy;
  children: string;
}) {
  const active = state.sort === field;
  const ariaSort = active
    ? state.dir === "asc"
      ? "ascending"
      : "descending"
    : "none";

  return (
    <th scope="col" aria-sort={ariaSort} className="px-2 py-1.5 text-left">
      <NextLink
        href={sortHref(state, field)}
        className="inline-flex items-center gap-1 type-label text-muted-foreground hover:text-foreground"
      >
        {children}
        <span className="sr-only">{copy.sortBy(children)}</span>
        {active ? (
          <span aria-hidden className="text-primary">
            {state.dir === "asc" ? "↑" : "↓"}
          </span>
        ) : null}
      </NextLink>
    </th>
  );
}

function ApplicationRowLinks({
  item,
  state,
  copy,
}: {
  item: JobApplicationSummary;
  state: ApplicationTrackerState;
  copy: ApplicationTrackerCopy;
}) {
  const from = applicationTrackerHref(state, { open: "", edit: "" });

  return (
    <div className="flex flex-wrap gap-2">
      <NextLink
        href={applicationDetailHref(item.key, { from })}
        className="type-small font-medium text-foreground underline-offset-2 hover:underline"
      >
        {copy.open}
      </NextLink>
      <NextLink
        href={applicationEditHref(item.key, { from })}
        className="type-small font-medium text-foreground underline-offset-2 hover:underline"
      >
        {copy.edit}
      </NextLink>
    </div>
  );
}

function NextActionCell({
  item,
  copy,
}: {
  item: JobApplicationSummary;
  copy: ApplicationTrackerCopy;
}) {
  return (
    <div className="min-w-0">
      <p className="truncate type-small">{item.nextAction ?? copy.emDash}</p>
      <p className="type-metadata">
        {formatApplicationDate(item.nextActionAt)}
      </p>
    </div>
  );
}

export function ApplicationTable({
  items,
  state,
  returnTo,
  copy,
}: ApplicationTableProps) {
  if (items.length === 0) {
    return (
      <p className="type-small text-muted-foreground" role="status">
        {applicationTrackerHasFilters(state) ? copy.emptyFiltered : copy.empty}
      </p>
    );
  }

  return (
    <div className="stack-compact">
      <ul className="stack-compact md:hidden">
        {items.map((item) => {
          const highlighted = state.open === item.key;

          return (
            <li
              key={item.key}
              id={`application-${item.key}`}
              className={cn(
                "border border-border bg-card p-3 stack-compact",
                highlighted && "ring-1 ring-ring",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate type-small font-medium">
                    {item.company}
                  </p>
                  <p className="truncate type-metadata">{item.role}</p>
                </div>
                <ApplicationStatusBadge
                  status={item.status}
                  labels={copy.statusLabel}
                />
              </div>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-1 type-small">
                <div>
                  <dt className="type-metadata">{copy.location}</dt>
                  <dd>{item.location ?? copy.emDash}</dd>
                </div>
                <div>
                  <dt className="type-metadata">{copy.applied}</dt>
                  <dd>{formatApplicationDate(item.appliedAt)}</dd>
                </div>
                <div>
                  <dt className="type-metadata">{copy.priority}</dt>
                  <dd>
                    <ApplicationPriorityBadge
                      priority={item.priority}
                      labels={copy.priorityLabel}
                    />
                  </dd>
                </div>
                <div>
                  <dt className="type-metadata">{copy.nextAction}</dt>
                  <dd>
                    <NextActionCell item={item} copy={copy} />
                  </dd>
                </div>
              </dl>
              <ApplicationRowLinks item={item} state={state} copy={copy} />
              <ApplicationRowActions
                applicationKey={item.key}
                status={item.status}
                returnTo={returnTo}
                autoFocusStatus={state.edit === item.key}
                copy={copy}
              />
            </li>
          );
        })}
      </ul>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[56rem] border-collapse type-small">
          <thead className="border-b border-border">
            <tr>
              {columns.map((column) => (
                <SortHeader
                  key={column.field}
                  field={column.field}
                  state={state}
                  copy={copy}
                >
                  {column.label(copy)}
                </SortHeader>
              ))}
              <th
                scope="col"
                className="px-2 py-1.5 text-left type-label text-muted-foreground"
              >
                {copy.actions}
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const highlighted = state.open === item.key;

              return (
                <tr
                  key={item.key}
                  id={`application-${item.key}`}
                  className={cn(
                    "border-b border-border hover:bg-muted/40",
                    "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
                    highlighted && "bg-muted/60",
                  )}
                >
                  <td className="px-2 py-2 font-medium">{item.company}</td>
                  <td className="max-w-48 truncate px-2 py-2">{item.role}</td>
                  <td className="px-2 py-2">
                    <ApplicationStatusBadge
                      status={item.status}
                      labels={copy.statusLabel}
                    />
                  </td>
                  <td className="px-2 py-2">{item.location ?? copy.emDash}</td>
                  <td className="px-2 py-2 type-metadata">
                    {formatApplicationDate(item.appliedAt)}
                  </td>
                  <td className="px-2 py-2">
                    <ApplicationPriorityBadge
                      priority={item.priority}
                      labels={copy.priorityLabel}
                    />
                  </td>
                  <td className="max-w-48 px-2 py-2">
                    <NextActionCell item={item} copy={copy} />
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex flex-col items-end gap-1">
                      <ApplicationRowLinks
                        item={item}
                        state={state}
                        copy={copy}
                      />
                      <ApplicationRowActions
                        applicationKey={item.key}
                        status={item.status}
                        returnTo={returnTo}
                        autoFocusStatus={state.edit === item.key}
                        copy={copy}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

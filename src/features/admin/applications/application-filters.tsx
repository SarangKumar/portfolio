import NextLink from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  buttonClassName,
  buttonSizes,
  buttonVariants,
} from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  APPLICATIONS_PATH,
  DEFAULT_APPLICATION_PAGE_SIZE,
  type ApplicationTrackerState,
} from "@/career/applications/query";
import {
  jobApplicationPriorities,
  jobApplicationStatuses,
} from "@/career/applications/status";
import type { ApplicationTrackerCopy } from "@/features/admin/applications/application-tracker-copy";

const selectClassName = cn(
  "h-8 w-full rounded-sm border border-input bg-background px-2 type-small text-foreground",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

type ApplicationFiltersProps = {
  state: ApplicationTrackerState;
  copy: ApplicationTrackerCopy;
};

export function ApplicationFilters({ state, copy }: ApplicationFiltersProps) {
  return (
    <form
      method="get"
      action={APPLICATIONS_PATH}
      className="grid gap-2 border border-border bg-card p-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      {state.sort !== "appliedAt" ? (
        <input type="hidden" name="sort" value={state.sort} />
      ) : null}
      {state.dir !== "desc" ? (
        <input type="hidden" name="dir" value={state.dir} />
      ) : null}
      {state.pageSize !== DEFAULT_APPLICATION_PAGE_SIZE ? (
        <input type="hidden" name="pageSize" value={state.pageSize} />
      ) : null}
      {state.includeArchived ? (
        <input type="hidden" name="archived" value="1" />
      ) : null}

      <label className="stack-compact">
        <span className="type-small font-medium">{copy.search}</span>
        <Input
          name="q"
          type="search"
          defaultValue={state.search}
          placeholder={copy.searchPlaceholder}
          maxLength={80}
        />
      </label>

      <label className="stack-compact">
        <span className="type-small font-medium">{copy.status}</span>
        <select
          name="status"
          defaultValue={state.status ?? ""}
          className={selectClassName}
        >
          <option value="">{copy.anyStatus}</option>
          {jobApplicationStatuses.map((status) => (
            <option key={status} value={status}>
              {copy.statusLabel[status]}
            </option>
          ))}
        </select>
      </label>

      <label className="stack-compact">
        <span className="type-small font-medium">{copy.company}</span>
        <Input name="company" defaultValue={state.company} maxLength={160} />
      </label>

      <label className="stack-compact">
        <span className="type-small font-medium">{copy.location}</span>
        <Input name="location" defaultValue={state.location} maxLength={160} />
      </label>

      <label className="stack-compact">
        <span className="type-small font-medium">{copy.priority}</span>
        <select
          name="priority"
          defaultValue={state.priority ?? ""}
          className={selectClassName}
        >
          <option value="">{copy.anyPriority}</option>
          {jobApplicationPriorities.map((priority) => (
            <option key={priority} value={priority}>
              {copy.priorityLabel[priority]}
            </option>
          ))}
        </select>
      </label>

      <label className="stack-compact">
        <span className="type-small font-medium">{copy.appliedFrom}</span>
        <Input
          name="appliedFrom"
          type="date"
          defaultValue={state.appliedFrom}
        />
      </label>

      <label className="stack-compact">
        <span className="type-small font-medium">{copy.appliedTo}</span>
        <Input name="appliedTo" type="date" defaultValue={state.appliedTo} />
      </label>

      <div className="flex flex-wrap items-end gap-2">
        <Button type="submit" size="sm">
          {copy.applyFilters}
        </Button>
        <NextLink
          href={APPLICATIONS_PATH}
          className={cn(
            buttonClassName.base,
            buttonVariants.ghost,
            buttonSizes.sm,
          )}
        >
          {copy.clearFilters}
        </NextLink>
      </div>
    </form>
  );
}

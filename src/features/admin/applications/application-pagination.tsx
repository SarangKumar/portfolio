import NextLink from "next/link";
import { applicationTrackerHref } from "@/career/applications/query";
import type { ApplicationTrackerState } from "@/career/applications/query";
import type { JobApplicationListPage } from "@/career/applications/types";
import type { ApplicationTrackerCopy } from "@/features/admin/applications/application-tracker-copy";

type ApplicationPaginationProps = {
  state: ApplicationTrackerState;
  page: JobApplicationListPage;
  copy: ApplicationTrackerCopy;
};

export function ApplicationPagination({
  state,
  page,
  copy,
}: ApplicationPaginationProps) {
  const pages = Math.max(1, Math.ceil(page.total / page.pageSize));

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2">
      <p className="type-metadata">
        {copy.results({ shown: page.items.length, total: page.total })}
      </p>
      <nav
        aria-label={copy.page({ page: page.page, pages })}
        className="flex items-center gap-2"
      >
        {page.page > 1 ? (
          <NextLink
            href={applicationTrackerHref(state, {
              page: page.page - 1,
              open: "",
              edit: "",
            })}
            className="type-small font-medium text-foreground underline-offset-2 hover:underline"
          >
            {copy.previous}
          </NextLink>
        ) : (
          <span className="type-small text-muted-foreground">
            {copy.previous}
          </span>
        )}
        <span className="type-metadata">
          {copy.page({ page: page.page, pages })}
        </span>
        {page.page < pages ? (
          <NextLink
            href={applicationTrackerHref(state, {
              page: page.page + 1,
              open: "",
              edit: "",
            })}
            className="type-small font-medium text-foreground underline-offset-2 hover:underline"
          >
            {copy.next}
          </NextLink>
        ) : (
          <span className="type-small text-muted-foreground">{copy.next}</span>
        )}
      </nav>
    </div>
  );
}

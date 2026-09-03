import { describe, expect, it } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import { ApplicationFilters } from "@/features/admin/applications/application-filters";
import { CreateApplicationLink } from "@/features/admin/applications/application-links";
import { ApplicationPagination } from "@/features/admin/applications/application-pagination";
import { ApplicationRowActions } from "@/features/admin/applications/application-row-actions";
import { ApplicationTable } from "@/features/admin/applications/application-table";
import type { ApplicationTrackerCopy } from "@/features/admin/applications/application-tracker-copy";
import { defaultApplicationTrackerState } from "@/career/applications/query";
import {
  jobApplicationPriorities,
  jobApplicationStatuses,
} from "@/career/applications/status";
import type { JobApplicationSummary } from "@/career/applications/types";

jest.mock("../../src/career/applications/actions", () => ({
  archiveJobApplicationAction: async () => undefined,
  changeJobApplicationStatusAction: async () => undefined,
}));

const copy: ApplicationTrackerCopy = {
  empty: "No applications yet.",
  emptyFiltered: "No applications match these filters.",
  search: "Search",
  searchPlaceholder: "Company, role, or recruiter",
  status: "Status",
  company: "Company",
  role: "Role",
  location: "Location",
  applied: "Applied",
  priority: "Priority",
  nextAction: "Next action",
  nextActionDate: "Due",
  actions: "Actions",
  anyStatus: "Any status",
  anyPriority: "Any priority",
  appliedFrom: "Applied from",
  appliedTo: "Applied to",
  applyFilters: "Apply filters",
  clearFilters: "Clear filters",
  open: "Open",
  edit: "Edit",
  archive: "Archive",
  archiveConfirm: "Archive application",
  archiveHint: "Archiving hides this row from the active tracker.",
  cancel: "Cancel",
  changeStatus: "Change status",
  sortBy: (column) => `Sort by ${column}`,
  sortedAsc: "sorted ascending",
  sortedDesc: "sorted descending",
  page: ({ page, pages }) => `Page ${page} of ${pages}`,
  previous: "Previous",
  next: "Next",
  results: ({ shown, total }) => `${shown} of ${total}`,
  emDash: "—",
  statusLabel: Object.fromEntries(
    jobApplicationStatuses.map((status) => [status, status]),
  ) as ApplicationTrackerCopy["statusLabel"],
  priorityLabel: Object.fromEntries(
    jobApplicationPriorities.map((priority) => [priority, priority]),
  ) as ApplicationTrackerCopy["priorityLabel"],
};

const row: JobApplicationSummary = {
  key: "app-acme",
  company: "Acme",
  role: "Staff Engineer",
  status: "applied",
  location: "Bengaluru",
  priority: "high",
  nextAction: "Complete OA",
  appliedAt: "2026-04-01T00:00:00.000Z",
  nextActionAt: "2026-04-08T00:00:00.000Z",
  archivedAt: null,
  updatedAt: "2026-04-01T00:00:00.000Z",
};

describe("application tracker UI", () => {
  it("renders an empty state and a filtered empty state", () => {
    const { rerender } = render(
      <ApplicationTable
        items={[]}
        state={defaultApplicationTrackerState()}
        returnTo="/admin/applications"
        copy={copy}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "No applications yet.",
    );

    rerender(
      <ApplicationTable
        items={[]}
        state={{ ...defaultApplicationTrackerState(), status: "oa" }}
        returnTo="/admin/applications"
        copy={copy}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "No applications match these filters.",
    );
  });

  it("renders compact rows with type-safe status and row actions", () => {
    render(
      <ApplicationTable
        items={[row]}
        state={defaultApplicationTrackerState()}
        returnTo="/admin/applications?q=acme"
        copy={copy}
      />,
    );

    expect(screen.getAllByText("Acme").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Staff Engineer").length).toBeGreaterThan(0);
    expect(screen.getAllByText("applied").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Open" })[0]).toHaveAttribute(
      "href",
      "/admin/applications/app-acme?from=%2Fadmin%2Fapplications",
    );
    expect(screen.getAllByRole("link", { name: "Edit" })[0]).toHaveAttribute(
      "href",
      "/admin/applications/app-acme/edit?from=%2Fadmin%2Fapplications",
    );
    expect(screen.getAllByLabelText("Change status")[0]).toHaveValue("applied");
    expect(
      screen.getAllByRole("button", { name: "Archive" }).length,
    ).toBeGreaterThan(0);
  });

  it("keeps filters in a GET form and can confirm archive", () => {
    render(
      <ApplicationFilters
        state={{
          ...defaultApplicationTrackerState(),
          search: "Jordan",
          status: "applied",
        }}
        copy={copy}
      />,
    );

    const form = document.querySelector("form");
    expect(form).toHaveAttribute("method", "get");
    expect(form).toHaveAttribute("action", "/admin/applications");
    expect(screen.getByRole("searchbox")).toHaveValue("Jordan");
    expect(screen.getByRole("link", { name: "Clear filters" })).toHaveAttribute(
      "href",
      "/admin/applications",
    );

    render(
      <ApplicationRowActions
        applicationKey="app-acme"
        status="applied"
        returnTo="/admin/applications"
        autoFocusStatus={false}
        copy={copy}
      />,
    );

    fireEvent.click(screen.getAllByRole("button", { name: "Archive" })[0]);
    expect(
      screen.getByRole("button", { name: "Archive application" }),
    ).toBeInTheDocument();
  });

  it("paginates with bookmarkable links", () => {
    render(
      <ApplicationPagination
        state={defaultApplicationTrackerState()}
        page={{
          items: [row],
          total: 26,
          page: 1,
          pageSize: 25,
        }}
        copy={copy}
      />,
    );

    expect(screen.getByText("1 of 26")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute(
      "href",
      "/admin/applications?page=2",
    );
  });
});

describe("application create link", () => {
  it("points at the new-application route", () => {
    render(
      <CreateApplicationLink
        href="/admin/applications/new"
        label="New application"
      />,
    );

    expect(
      screen.getByRole("link", { name: "New application" }),
    ).toHaveAttribute("href", "/admin/applications/new");
  });
});

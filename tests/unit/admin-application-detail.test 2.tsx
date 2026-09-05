import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { createAdminRecord } from "@/admin/directory";
import {
  createJobApplication,
  getJobApplication,
} from "@/career/applications/access";
import { createMemoryJobApplicationStore } from "@/career/applications/memory-store";
import { createJobApplicationService } from "@/career/applications/service";
import {
  jobApplicationPriorities,
  jobApplicationStatuses,
  workModes,
} from "@/career/applications/status";
import type {
  JobApplicationRecord,
  JobApplicationStatusHistoryRecord,
} from "@/career/applications/types";
import { ApplicationDetail } from "@/features/admin/applications/application-detail";
import type { ApplicationDetailCopy } from "@/features/admin/applications/application-detail-copy";
import { resolveApplicationDetailView } from "@/features/admin/applications/application-detail-view";

jest.mock("../../src/career/applications/actions", () => ({
  archiveJobApplicationAction: async () => undefined,
  changeJobApplicationStatusAction: async () => undefined,
}));

jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }: { children?: string }) => (
    <div data-testid="job-description">{children}</div>
  ),
}));

const copy: ApplicationDetailCopy = {
  back: "Back to applications",
  openJob: "Open job posting",
  edit: "Edit",
  archived: "Archived",
  information: "Application information",
  status: "Status",
  applied: "Applied",
  source: "Source",
  jobUrl: "Job URL",
  location: "Location",
  workMode: "Work mode",
  salary: "Salary / CTC",
  priority: "Priority",
  rejectionReason: "Rejection reason",
  jobDescription: "Job description",
  jobDescriptionEmpty: "No job description saved.",
  recruiter: "Recruiter and referral",
  recruiterName: "Recruiter",
  referral: "Referral",
  resume: "Resume",
  resumeEmpty: "No resume associated.",
  coverLetter: "Cover letter",
  coverLetterEmpty: "No cover letter associated.",
  notes: "Notes",
  notesEmpty: "No notes yet.",
  nextAction: "Next action",
  nextActionEmpty: "No next action scheduled.",
  due: "Due",
  interviews: "Interview rounds",
  interviewsEmpty: "No interview rounds recorded yet.",
  interviewsHint: "Interview tracking is summarized here only.",
  unscheduled: "Unscheduled",
  statusHistory: "Status history",
  statusHistoryHint: "Newest first. This log is append-only.",
  historyEmpty: "No status changes recorded.",
  historyUnavailable: "Status history could not be loaded.",
  statusCurrent: "Current",
  initialStatus: "Initial",
  changedBy: "Changed by",
  reason: "Reason",
  note: "Note",
  rejectionReasonHint:
    "Optional. Saved on the application and this history entry.",
  saveStatus: "Update status",
  updated: "Updated",
  created: "Created",
  refKey: "Reference",
  saved: "Saved.",
  emDash: "—",
  archive: "Archive",
  archiveConfirm: "Archive application",
  archiveHint: "Archiving hides this row from the active tracker.",
  cancel: "Cancel",
  changeStatus: "Change status",
  statusLabel: Object.fromEntries(
    jobApplicationStatuses.map((status) => [status, status]),
  ) as ApplicationDetailCopy["statusLabel"],
  priorityLabel: Object.fromEntries(
    jobApplicationPriorities.map((priority) => [priority, priority]),
  ) as ApplicationDetailCopy["priorityLabel"],
  workModeLabel: Object.fromEntries(
    workModes.map((mode) => [mode, mode]),
  ) as ApplicationDetailCopy["workModeLabel"],
};

const record: JobApplicationRecord = {
  key: "app-acme",
  ownerIdentityId: "owner-1",
  company: "Acme",
  companyKey: null,
  role: "Staff Engineer",
  jobUrl: "https://jobs.example.com/acme",
  location: "Bengaluru",
  workMode: "hybrid",
  jobDescription:
    "Build the career OS.\n\n<script>alert('xss')</script>\n\n**Required:** TypeScript",
  salaryAmount: 4500000,
  salaryCurrency: "INR",
  appliedAt: "2026-04-01T00:00:00.000Z",
  status: "applied",
  source: "LinkedIn",
  referral: "Ada",
  recruiter: "Jordan",
  resumeVersionKey: "resume-backend-2026",
  coverLetterKey: null,
  notes: "Follow up after OA.",
  priority: "high",
  nextAction: "Complete OA",
  nextActionAt: "2026-04-08T00:00:00.000Z",
  rejectionReason: null,
  archivedAt: null,
  interviewRounds: [
    {
      key: "round-oa",
      title: "Online assessment",
      sortOrder: 1,
      scheduledAt: "2026-04-10T00:00:00.000Z",
    },
  ],
  createdAt: "2026-03-28T00:00:00.000Z",
  updatedAt: "2026-04-02T00:00:00.000Z",
};

const history: JobApplicationStatusHistoryRecord[] = [
  {
    key: "app-acme-hist-1",
    applicationKey: "app-acme",
    ownerIdentityId: "owner-1",
    sequence: 1,
    previousStatus: null,
    newStatus: "applied",
    changedAt: "2026-03-28T00:00:00.000Z",
    changedByIdentityId: "owner-1",
    reason: null,
    note: null,
  },
];

function renderDetail(
  overrides: Partial<{
    history: readonly JobApplicationStatusHistoryRecord[];
    historyUnavailable: boolean;
  }> = {},
) {
  return render(
    <ApplicationDetail
      record={record}
      history={overrides.history ?? history}
      historyUnavailable={overrides.historyUnavailable ?? false}
      viewerIdentityId="owner-1"
      viewerEmail="owner@example.com"
      from="/admin/applications?q=acme"
      autoFocusStatus={false}
      saved={false}
      copy={copy}
    />,
  );
}

describe("application detail view resolution", () => {
  it("denies unauthorized access and hides other admins' records as not found", async () => {
    const owner = createAdminRecord("owner@example.com", "active");
    const peer = createAdminRecord("peer@example.com", "active");
    const service = createJobApplicationService({
      store: createMemoryJobApplicationStore(),
      now: () => new Date("2026-04-01T00:00:00.000Z"),
    });
    const created = await createJobApplication(
      { status: "allowed", admin: owner },
      service,
      {
        company: "Acme",
        companyKey: null,
        role: "Staff Engineer",
        jobUrl: null,
        location: null,
        workMode: "unspecified",
        jobDescription: "Private JD",
        salaryAmount: null,
        salaryCurrency: null,
        appliedAt: null,
        status: "applied",
        source: null,
        referral: null,
        recruiter: null,
        resumeVersionKey: null,
        coverLetterKey: null,
        notes: null,
        priority: "medium",
        nextAction: null,
        nextActionAt: null,
        rejectionReason: null,
      },
    );

    expect(created.ok).toBe(true);
    if (!created.ok) {
      return;
    }

    expect(
      resolveApplicationDetailView({ authorized: false, result: null }),
    ).toEqual({ kind: "denied" });
    expect(
      resolveApplicationDetailView({
        authorized: true,
        result: await getJobApplication(
          { status: "denied" },
          service,
          created.value.key,
        ),
      }),
    ).toEqual({ kind: "denied" });
    expect(
      resolveApplicationDetailView({
        authorized: true,
        result: await getJobApplication(
          { status: "allowed", admin: peer },
          service,
          created.value.key,
        ),
      }),
    ).toEqual({ kind: "notFound" });
    expect(
      resolveApplicationDetailView({
        authorized: true,
        result: await getJobApplication(
          { status: "allowed", admin: owner },
          service,
          "app-missing",
        ),
      }),
    ).toEqual({ kind: "notFound" });
    expect(
      resolveApplicationDetailView({
        authorized: true,
        result: { ok: false, code: "unavailable" },
      }),
    ).toEqual({ kind: "unavailable" });

    const ownerView = resolveApplicationDetailView({
      authorized: true,
      result: await getJobApplication(
        { status: "allowed", admin: owner },
        service,
        created.value.key,
      ),
    });
    expect(ownerView.kind).toBe("ready");
    if (ownerView.kind !== "ready") {
      return;
    }
    expect(ownerView.record.jobDescription).toBe("Private JD");
  });
});

describe("application detail UI", () => {
  it("renders private application fields, interview summary, and actions", () => {
    renderDetail();

    expect(
      screen.getByRole("heading", { level: 1, name: "Acme" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Staff Engineer")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("Bengaluru")).toBeInTheDocument();
    expect(screen.getByText("hybrid")).toBeInTheDocument();
    expect(screen.getByText("4500000 INR")).toBeInTheDocument();
    expect(screen.getByText("Jordan")).toBeInTheDocument();
    expect(screen.getByText("Ada")).toBeInTheDocument();
    expect(screen.getByText("resume-backend-2026")).toBeInTheDocument();
    expect(screen.getByText("No cover letter associated.")).toBeInTheDocument();
    expect(screen.getByText("Follow up after OA.")).toBeInTheDocument();
    expect(screen.getByText("Complete OA")).toBeInTheDocument();
    expect(screen.getByText("Online assessment")).toBeInTheDocument();
    expect(
      screen.getByText("Newest first. This log is append-only."),
    ).toBeInTheDocument();
    expect(screen.getByText("Initial")).toBeInTheDocument();
    expect(
      screen.getByText("Changed by owner@example.com"),
    ).toBeInTheDocument();
    expect(screen.getByText("2026-03-28T00:00:00.000Z")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to applications" }),
    ).toHaveAttribute("href", "/admin/applications?q=acme");
    expect(
      screen.getByRole("link", { name: "Open job posting" }),
    ).toHaveAttribute("href", "https://jobs.example.com/acme");
    expect(screen.getByRole("link", { name: "Edit" })).toHaveAttribute(
      "href",
      "/admin/applications/app-acme/edit?from=%2Fadmin%2Fapplications%3Fq%3Dacme",
    );
    expect(screen.getByLabelText("Change status")).toHaveValue("applied");
    expect(
      [...screen.getByLabelText("Change status").children].map(
        (option) => (option as HTMLOptionElement).value,
      ),
    ).toEqual([...jobApplicationStatuses]);
    expect(screen.getByRole("button", { name: "Archive" })).toBeInTheDocument();
  });

  it("renders job descriptions through markdown and does not execute HTML", () => {
    const { container } = render(
      <ApplicationDetail
        record={record}
        history={history}
        historyUnavailable={false}
        viewerIdentityId="owner-1"
        viewerEmail="owner@example.com"
        from="/admin/applications"
        autoFocusStatus={false}
        saved={false}
        copy={copy}
      />,
    );

    const description = screen.getByTestId("job-description");
    expect(description).toHaveTextContent("TypeScript");
    expect(description).toHaveTextContent("**Required:**");
    expect(container.querySelector("script")).toBeNull();
    expect(container.innerHTML.toLowerCase()).not.toContain("<script");
  });
});

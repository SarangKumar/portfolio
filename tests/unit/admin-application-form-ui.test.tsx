import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { jobApplicationToFormFields } from "@/career/applications/validation";
import {
  ApplicationFormFields,
  ApplicationFormSubmit,
} from "@/features/admin/applications/application-form-fields";
import type { ApplicationFormCopy } from "@/features/admin/applications/application-form-copy";
import {
  jobApplicationPriorities,
  jobApplicationStatuses,
  workModes,
} from "@/career/applications/status";

const formCopy: ApplicationFormCopy = {
  save: "Save",
  saving: "Saving…",
  saved: "Saved.",
  sections: {
    role: "Role",
    compensation: "Compensation",
    description: "Job description",
    sourcing: "Sourcing",
    documents: "Documents",
    followUp: "Follow-up",
  },
  fields: {
    company: "Company",
    role: "Role title",
    jobUrl: "Job URL",
    location: "Location",
    workMode: "Work mode",
    jobDescription: "Job description",
    jobDescriptionHint: "Paste the listing.",
    salaryAmount: "CTC / salary",
    salaryCurrency: "Currency",
    salaryCurrencyHint: "Three-letter code.",
    appliedAt: "Application date",
    status: "Status",
    source: "Source",
    referral: "Referral",
    recruiter: "Recruiter",
    resumeVersionKey: "Resume version key",
    resumeVersionKeyHint: "Optional key.",
    coverLetterKey: "Cover letter key",
    coverLetterKeyHint: "Optional key.",
    notes: "Notes",
    priority: "Priority",
    nextAction: "Next action",
    nextActionAt: "Next action date",
    rejectionReason: "Rejection reason",
  },
  errors: {
    required: "This field is required.",
    tooLong: "This value is too long.",
    invalidUrl: "Enter a valid http or https URL.",
    invalidDate: "Enter a valid date.",
    invalid: "This value is not valid.",
    incomplete: "Amount and currency are both required.",
    unauthorized: "You do not have permission to change this content.",
    notFound: "That record could not be found.",
    unavailable: "Application records could not be loaded.",
  },
  statusLabel: Object.fromEntries(
    jobApplicationStatuses.map((status) => [status, status]),
  ) as ApplicationFormCopy["statusLabel"],
  priorityLabel: Object.fromEntries(
    jobApplicationPriorities.map((priority) => [priority, priority]),
  ) as ApplicationFormCopy["priorityLabel"],
  workModeLabel: Object.fromEntries(
    workModes.map((mode) => [mode, mode]),
  ) as ApplicationFormCopy["workModeLabel"],
};

describe("application form fields", () => {
  it("shows field-level validation errors from the server", () => {
    render(
      <form>
        <ApplicationFormFields
          values={jobApplicationToFormFields()}
          fieldErrors={{
            company: "required",
            jobUrl: "invalidUrl",
            status: "invalid",
          }}
          pending={false}
          copy={formCopy}
        />
      </form>,
    );

    expect(screen.getByText("This field is required.")).toBeInTheDocument();
    expect(
      screen.getByText("Enter a valid http or https URL."),
    ).toBeInTheDocument();
    expect(screen.getByText("This value is not valid.")).toBeInTheDocument();
  });

  it("disables submit while a save is pending", () => {
    render(<ApplicationFormSubmit pending copy={formCopy} />);

    expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
  });

  it("keeps submit enabled when idle", () => {
    render(<ApplicationFormSubmit pending={false} copy={formCopy} />);

    expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();
  });
});

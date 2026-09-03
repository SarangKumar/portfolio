import { describe, expect, it } from "@jest/globals";
import { createAdminRecord } from "@/admin/directory";
import {
  createJobApplication,
  getJobApplication,
} from "@/career/applications/access";
import { createMemoryJobApplicationStore } from "@/career/applications/memory-store";
import { createJobApplicationService } from "@/career/applications/service";
import { persistJobApplicationWrite } from "@/career/applications/submit";
import type {
  JobApplicationRecord,
  JobApplicationWriteInput,
} from "@/career/applications/types";
import {
  jobApplicationToFormFields,
  readJobApplicationWriteForm,
  validateJobApplicationWriteInput,
  type JobApplicationWriteFields,
} from "@/career/applications/validation";
import { DatabaseError } from "@/db/errors";

const owner = createAdminRecord("owner@example.com", "active");
const allowed = { status: "allowed" as const, admin: owner };

const validFields: JobApplicationWriteFields = {
  company: "Acme",
  role: "Staff Engineer",
  status: "applied",
  jobUrl: "https://jobs.example.com/acme",
  location: "Bengaluru",
  workMode: "hybrid",
  jobDescription: "Build the career OS.",
  salaryAmount: "4500000",
  salaryCurrency: "inr",
  appliedAt: "2026-04-01",
  source: "LinkedIn",
  referral: "Ada",
  recruiter: "Jordan",
  resumeVersionKey: "resume-backend-2026",
  coverLetterKey: "",
  notes: "Follow up after OA.",
  priority: "high",
  nextAction: "Complete OA",
  nextActionAt: "2026-04-08",
  rejectionReason: "",
};

function formFrom(fields: JobApplicationWriteFields, key?: string): FormData {
  const form = new FormData();

  for (const [name, value] of Object.entries(fields)) {
    if (typeof value === "string") {
      form.set(name, value);
    }
  }

  if (key) {
    form.set("key", key);
  }

  return form;
}

function serviceWith(seed: JobApplicationRecord[] = []) {
  return createJobApplicationService({
    store: createMemoryJobApplicationStore(seed),
    now: () => new Date("2026-04-01T00:00:00.000Z"),
  });
}

function requireWrite(
  fields: JobApplicationWriteFields,
): JobApplicationWriteInput {
  const parsed = validateJobApplicationWriteInput(fields);

  if (!parsed.ok) {
    throw new Error(`expected valid write input: ${JSON.stringify(parsed)}`);
  }

  return parsed.value;
}

describe("job application form persistence", () => {
  it("creates an application from form data and persists it", async () => {
    const service = serviceWith();
    const result = await persistJobApplicationWrite({
      access: allowed,
      service,
      formData: formFrom(validFields),
      mode: "create",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    const stored = await getJobApplication(allowed, service, result.key);
    expect(stored.ok).toBe(true);
    if (!stored.ok) {
      return;
    }

    expect(stored.value).toMatchObject({
      company: "Acme",
      role: "Staff Engineer",
      status: "applied",
      jobUrl: "https://jobs.example.com/acme",
      salaryAmount: 4500000,
      salaryCurrency: "INR",
      resumeVersionKey: "resume-backend-2026",
      coverLetterKey: null,
      interviewRounds: [],
    });
  });

  it("updates an application without dropping interview rounds", async () => {
    const service = serviceWith();
    const created = await createJobApplication(
      allowed,
      service,
      requireWrite(validFields),
    );
    expect(created.ok).toBe(true);
    if (!created.ok) {
      return;
    }

    const withRound: JobApplicationRecord = {
      ...created.value,
      interviewRounds: [
        {
          key: "round-1",
          title: "OA",
          sortOrder: 1,
          scheduledAt: null,
        },
      ],
    };
    const seeded = serviceWith([withRound]);
    const result = await persistJobApplicationWrite({
      access: allowed,
      service: seeded,
      formData: formFrom(
        { ...validFields, role: "Principal Engineer", status: "oa" },
        withRound.key,
      ),
      mode: "update",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    const stored = await getJobApplication(allowed, seeded, withRound.key);
    expect(stored.ok).toBe(true);
    if (!stored.ok) {
      return;
    }

    expect(stored.value.role).toBe("Principal Engineer");
    expect(stored.value.status).toBe("oa");
    expect(stored.value.interviewRounds).toEqual(withRound.interviewRounds);
  });

  it("returns field errors for missing company, invalid URL, and invalid status", async () => {
    const service = serviceWith();
    const result = await persistJobApplicationWrite({
      access: allowed,
      service,
      formData: formFrom({
        ...validFields,
        company: "",
        jobUrl: "javascript:alert(1)",
        status: "phone_screen",
      }),
      mode: "create",
    });

    expect(result).toEqual({
      ok: false,
      state: {
        status: "error",
        code: "validation",
        fieldErrors: {
          company: "required",
          jobUrl: "invalidUrl",
          status: "invalid",
        },
      },
    });

    const listed = await service.list(owner, {});
    expect(listed).toMatchObject({ ok: true, value: { total: 0 } });
  });

  it("rejects unauthorized mutations without writing", async () => {
    const service = serviceWith();
    const result = await persistJobApplicationWrite({
      access: { status: "unauthenticated" },
      service,
      formData: formFrom(validFields),
      mode: "create",
    });

    expect(result).toEqual({
      ok: false,
      state: { status: "error", code: "unauthorized" },
    });
  });

  it("returns unavailable when the store fails", async () => {
    const inner = createMemoryJobApplicationStore();
    const service = createJobApplicationService({
      store: {
        list: (ownerIdentityId, query) => inner.list(ownerIdentityId, query),
        getByKey: (ownerIdentityId, key) =>
          inner.getByKey(ownerIdentityId, key),
        listStatusHistory: (ownerIdentityId, key) =>
          inner.listStatusHistory(ownerIdentityId, key),
        create: async () => {
          throw new DatabaseError("down");
        },
        update: (ownerIdentityId, key, patch) =>
          inner.update(ownerIdentityId, key, patch),
        applyStatusChange: (ownerIdentityId, key, patch) =>
          inner.applyStatusChange(ownerIdentityId, key, patch),
      },
      now: () => new Date("2026-04-01T00:00:00.000Z"),
    });

    const result = await persistJobApplicationWrite({
      access: allowed,
      service,
      formData: formFrom(validFields),
      mode: "create",
    });

    expect(result).toEqual({
      ok: false,
      state: { status: "error", code: "unavailable" },
    });
  });

  it("reads form fields without trusting extra keys", () => {
    const form = formFrom(validFields);
    form.set("companyKey", "should-not-bind");
    form.set("jobDescription", "Paste only.");

    expect(readJobApplicationWriteForm(form)).toMatchObject({
      company: "Acme",
      role: "Staff Engineer",
      jobDescription: "Paste only.",
    });
    expect(readJobApplicationWriteForm(form).companyKey).toBeUndefined();
    expect(
      jobApplicationToFormFields().status === "wishlist" &&
        jobApplicationToFormFields().priority === "medium",
    ).toBe(true);
  });
});

import { describe, expect, it } from "@jest/globals";
import { createAdminRecord } from "@/admin/directory";
import {
  archiveJobApplication,
  changeJobApplicationStatus,
  createJobApplication,
  getJobApplication,
  listJobApplications,
  updateJobApplication,
} from "@/career/applications/access";
import { createMemoryJobApplicationStore } from "@/career/applications/memory-store";
import { createJobApplicationService } from "@/career/applications/service";
import { jobApplicationStatuses } from "@/career/applications/status";
import type {
  JobApplicationRecord,
  JobApplicationWriteInput,
} from "@/career/applications/types";
import {
  validateJobApplicationWriteInput,
  type JobApplicationWriteFields,
} from "@/career/applications/validation";
import type { PublicContentSource } from "@/content/source";

const owner = createAdminRecord("owner@example.com", "active");
const peer = createAdminRecord("peer@example.com", "active");

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
  companyKey: "",
};

function requireWrite(
  fields: JobApplicationWriteFields,
): JobApplicationWriteInput {
  const parsed = validateJobApplicationWriteInput(fields);

  if (!parsed.ok) {
    throw new Error(`expected valid write input: ${JSON.stringify(parsed)}`);
  }

  return parsed.value;
}

function serviceWith(seed: JobApplicationRecord[] = []) {
  return createJobApplicationService({
    store: createMemoryJobApplicationStore(seed),
    now: () => new Date("2026-04-01T00:00:00.000Z"),
  });
}

describe("job application status model", () => {
  it("uses a closed set of pipeline statuses", () => {
    expect(jobApplicationStatuses).toEqual([
      "wishlist",
      "applied",
      "recruiter_contacted",
      "oa",
      "technical_1",
      "technical_2",
      "system_design",
      "managerial",
      "hr",
      "offer",
      "rejected",
      "withdrawn",
      "ghosted",
    ]);
  });
});

describe("job application validation", () => {
  it("accepts a complete application write", () => {
    expect(validateJobApplicationWriteInput(validFields)).toEqual({
      ok: true,
      value: {
        company: "Acme",
        companyKey: null,
        role: "Staff Engineer",
        jobUrl: "https://jobs.example.com/acme",
        location: "Bengaluru",
        workMode: "hybrid",
        jobDescription: "Build the career OS.",
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
      },
    });
  });

  it("requires role and status and rejects free-form statuses", () => {
    expect(
      validateJobApplicationWriteInput({ ...validFields, role: "" }),
    ).toMatchObject({
      ok: false,
      fieldErrors: { role: "required" },
    });
    expect(
      validateJobApplicationWriteInput({ ...validFields, status: "" }),
    ).toMatchObject({
      ok: false,
      fieldErrors: { status: "required" },
    });
    expect(
      validateJobApplicationWriteInput({
        ...validFields,
        status: "phone_screen",
      }),
    ).toMatchObject({
      ok: false,
      fieldErrors: { status: "invalid" },
    });
  });

  it("validates urls, dates, salary, and next-action pairing", () => {
    expect(
      validateJobApplicationWriteInput({
        ...validFields,
        jobUrl: "javascript:alert(1)",
      }),
    ).toMatchObject({
      ok: false,
      fieldErrors: { jobUrl: "invalidUrl" },
    });
    expect(
      validateJobApplicationWriteInput({
        ...validFields,
        appliedAt: "not-a-date",
      }),
    ).toMatchObject({
      ok: false,
      fieldErrors: { appliedAt: "invalidDate" },
    });
    expect(
      validateJobApplicationWriteInput({
        ...validFields,
        salaryAmount: "-1",
        salaryCurrency: "USD",
      }),
    ).toMatchObject({
      ok: false,
      fieldErrors: { salaryAmount: "invalid" },
    });
    expect(
      validateJobApplicationWriteInput({
        ...validFields,
        salaryAmount: "120000",
        salaryCurrency: "",
      }),
    ).toMatchObject({
      ok: false,
      fieldErrors: { salaryAmount: "incomplete", salaryCurrency: "incomplete" },
    });
    expect(
      validateJobApplicationWriteInput({
        ...validFields,
        nextAction: "Ping recruiter",
        nextActionAt: "",
      }),
    ).toMatchObject({
      ok: false,
      fieldErrors: { nextActionAt: "required" },
    });
  });

  it("allows a rejection reason without forcing rejected status", () => {
    const parsed = validateJobApplicationWriteInput({
      ...validFields,
      status: "wishlist",
      nextAction: "",
      nextActionAt: "",
      rejectionReason: "Closed the requisition",
    });

    expect(parsed).toMatchObject({
      ok: true,
      value: {
        status: "wishlist",
        rejectionReason: "Closed the requisition",
      },
    });
  });
});

describe("job application authorization and ownership", () => {
  it("blocks unauthenticated and denied access before any private operation", async () => {
    const service = serviceWith();
    const input = requireWrite(validFields);

    expect(
      await createJobApplication({ status: "unauthenticated" }, service, input),
    ).toEqual({ ok: false, code: "unauthorized" });
    expect(await listJobApplications({ status: "denied" }, service)).toEqual({
      ok: false,
      code: "unauthorized",
    });
    expect(
      await getJobApplication({ status: "denied" }, service, "app-missing"),
    ).toEqual({ ok: false, code: "unauthorized" });
    expect(
      await updateJobApplication(
        { status: "unauthenticated" },
        service,
        "app-missing",
        input,
      ),
    ).toEqual({ ok: false, code: "unauthorized" });
    expect(
      await archiveJobApplication({ status: "denied" }, service, "app-missing"),
    ).toEqual({ ok: false, code: "unauthorized" });
    expect(
      await changeJobApplicationStatus(
        { status: "unauthenticated" },
        service,
        "app-missing",
        "oa",
      ),
    ).toEqual({ ok: false, code: "unauthorized" });
  });

  it("scopes reads and writes to the owning admin identity", async () => {
    const service = serviceWith();
    const created = await createJobApplication(
      { status: "allowed", admin: owner },
      service,
      requireWrite(validFields),
    );

    expect(created.ok).toBe(true);
    if (!created.ok) {
      return;
    }

    expect(created.value.ownerIdentityId).toBe(owner.id);
    expect(created.value.interviewRounds).toEqual([]);

    const peerList = await listJobApplications(
      { status: "allowed", admin: peer },
      service,
    );
    expect(peerList).toEqual({
      ok: true,
      value: { items: [], total: 0, page: 1, pageSize: 25 },
    });

    const peerGet = await getJobApplication(
      { status: "allowed", admin: peer },
      service,
      created.value.key,
    );
    expect(peerGet).toEqual({ ok: false, code: "notFound" });

    const peerUpdate = await updateJobApplication(
      { status: "allowed", admin: peer },
      service,
      created.value.key,
      requireWrite({ ...validFields, role: "Hijacked" }),
    );
    expect(peerUpdate).toEqual({ ok: false, code: "notFound" });

    const ownerGet = await getJobApplication(
      { status: "allowed", admin: owner },
      service,
      created.value.key,
    );
    expect(ownerGet.ok).toBe(true);
    if (!ownerGet.ok) {
      return;
    }
    expect(ownerGet.value.role).toBe("Staff Engineer");
  });
});

describe("job application service", () => {
  it("creates, updates, filters, and archives without deleting", async () => {
    const service = serviceWith();
    const access = { status: "allowed" as const, admin: owner };
    const created = await createJobApplication(
      access,
      service,
      requireWrite(validFields),
    );
    const second = await createJobApplication(
      access,
      service,
      requireWrite({
        ...validFields,
        company: "Globex",
        status: "wishlist",
        nextAction: "",
        nextActionAt: "",
        appliedAt: "2026-03-01",
      }),
    );

    expect(created.ok && second.ok).toBe(true);
    if (!created.ok || !second.ok) {
      return;
    }

    const listed = await listJobApplications(access, service);
    expect(listed.ok).toBe(true);
    if (!listed.ok) {
      return;
    }
    expect(listed.value.items.map((item) => item.company)).toEqual([
      "Acme",
      "Globex",
    ]);

    const applied = await listJobApplications(access, service, {
      status: "applied",
    });
    expect(applied.ok).toBe(true);
    if (!applied.ok) {
      return;
    }
    expect(applied.value.items.map((item) => item.company)).toEqual(["Acme"]);

    const updated = await updateJobApplication(
      access,
      service,
      created.value.key,
      requireWrite({
        ...validFields,
        status: "rejected",
        rejectionReason: "Leveling mismatch",
        nextAction: "",
        nextActionAt: "",
      }),
    );
    expect(updated.ok).toBe(true);
    if (!updated.ok) {
      return;
    }
    expect(updated.value.status).toBe("rejected");
    expect(updated.value.rejectionReason).toBe("Leveling mismatch");
    expect(updated.value.coverLetterKey).toBeNull();

    const archived = await archiveJobApplication(
      access,
      service,
      created.value.key,
    );
    expect(archived.ok).toBe(true);
    if (!archived.ok) {
      return;
    }
    expect(archived.value.archivedAt).toBe("2026-04-01T00:00:00.000Z");
    expect(archived.value.status).toBe("rejected");

    const active = await listJobApplications(access, service);
    expect(active.ok).toBe(true);
    if (!active.ok) {
      return;
    }
    expect(active.value.items.map((item) => item.company)).toEqual(["Globex"]);

    const withArchived = await listJobApplications(access, service, {
      includeArchived: true,
      status: "rejected",
    });
    expect(withArchived.ok).toBe(true);
    if (!withArchived.ok) {
      return;
    }
    expect(withArchived.value.items.map((item) => item.key)).toEqual([
      created.value.key,
    ]);

    const stillReadable = await getJobApplication(
      access,
      service,
      created.value.key,
    );
    expect(stillReadable.ok).toBe(true);
  });

  it("searches, sorts, paginates, and changes status on the server", async () => {
    const service = serviceWith();
    const access = { status: "allowed" as const, admin: owner };

    await createJobApplication(
      access,
      service,
      requireWrite({
        ...validFields,
        company: "Acme",
        role: "Staff Engineer",
        recruiter: "Jordan",
        appliedAt: "2026-04-02",
        nextAction: "",
        nextActionAt: "",
      }),
    );
    await createJobApplication(
      access,
      service,
      requireWrite({
        ...validFields,
        company: "Globex",
        role: "Platform Engineer",
        recruiter: "Sam",
        location: "Remote",
        status: "oa",
        priority: "low",
        appliedAt: "2026-03-01",
        nextAction: "",
        nextActionAt: "",
      }),
    );
    await createJobApplication(
      access,
      service,
      requireWrite({
        ...validFields,
        company: "Initech",
        role: "Frontend Engineer",
        recruiter: "Jordan",
        location: "Bengaluru",
        appliedAt: "2026-02-01",
        nextAction: "",
        nextActionAt: "",
      }),
    );

    const searched = await listJobApplications(access, service, {
      search: "jordan",
    });
    expect(searched.ok).toBe(true);
    if (!searched.ok) {
      return;
    }
    expect(searched.value.items.map((item) => item.company).sort()).toEqual([
      "Acme",
      "Initech",
    ]);

    const located = await listJobApplications(access, service, {
      location: "remote",
    });
    expect(
      located.ok && located.value.items.map((item) => item.company),
    ).toEqual(["Globex"]);

    const dated = await listJobApplications(access, service, {
      appliedFrom: "2026-03-01",
      appliedTo: "2026-04-01",
    });
    expect(dated.ok && dated.value.items.map((item) => item.company)).toEqual([
      "Globex",
    ]);

    const sorted = await listJobApplications(access, service, {
      sort: "company",
      dir: "asc",
    });
    expect(sorted.ok && sorted.value.items.map((item) => item.company)).toEqual(
      ["Acme", "Globex", "Initech"],
    );

    const page = await listJobApplications(access, service, {
      sort: "company",
      dir: "asc",
      page: 2,
      pageSize: 2,
    });
    expect(page.ok).toBe(true);
    if (!page.ok) {
      return;
    }
    expect(page.value).toMatchObject({
      total: 3,
      page: 2,
      pageSize: 2,
    });
    expect(page.value.items.map((item) => item.company)).toEqual(["Initech"]);

    const first = sorted.ok ? sorted.value.items[0] : undefined;
    expect(first).toBeDefined();
    if (!first) {
      return;
    }

    const status = await changeJobApplicationStatus(
      access,
      service,
      first.key,
      "oa",
    );
    expect(status).toMatchObject({
      ok: true,
      value: { key: first.key, status: "oa" },
    });
  });
});

describe("job application public boundary", () => {
  it("is not part of the public content source", () => {
    const sourceKeys: Array<keyof PublicContentSource> = [
      "listProjects",
      "listExperience",
      "listSkillCategories",
      "listSkills",
      "listPosts",
      "listResumes",
      "listCertifications",
      "listBadges",
    ];

    expect(sourceKeys.join(" ")).not.toContain("job");
    expect(sourceKeys.join(" ")).not.toContain("application");
  });
});

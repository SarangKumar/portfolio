import { describe, expect, it } from "@jest/globals";
import { createAdminRecord } from "@/admin/directory";
import {
  archiveJobApplication,
  createJobApplication,
  getJobApplication,
  listJobApplications,
  updateJobApplication,
} from "@/career/applications/access";
import { createJobApplicationService } from "@/career/applications/service";
import { jobApplicationStatuses } from "@/career/applications/status";
import type { JobApplicationStore } from "@/career/applications/store";
import type {
  JobApplicationListQuery,
  JobApplicationRecord,
  JobApplicationWriteInput,
} from "@/career/applications/types";
import {
  validateJobApplicationWriteInput,
  type JobApplicationWriteFields,
} from "@/career/applications/validation";
import { ContentNotFoundError } from "@/cms/errors";
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

function memoryStore(seed: JobApplicationRecord[] = []): JobApplicationStore {
  const records = new Map(seed.map((item) => [item.key, { ...item }]));

  function visible(
    ownerIdentityId: string,
    query: JobApplicationListQuery,
  ): JobApplicationRecord[] {
    return [...records.values()].filter((item) => {
      if (item.ownerIdentityId !== ownerIdentityId) {
        return false;
      }

      if (!query.includeArchived && item.archivedAt) {
        return false;
      }

      if (query.status && item.status !== query.status) {
        return false;
      }

      if (query.priority && item.priority !== query.priority) {
        return false;
      }

      return true;
    });
  }

  return {
    async list(ownerIdentityId, query) {
      return visible(ownerIdentityId, query)
        .sort((left, right) => {
          const leftApplied = left.appliedAt ?? "";
          const rightApplied = right.appliedAt ?? "";
          return rightApplied.localeCompare(leftApplied);
        })
        .map((item) => ({
          key: item.key,
          company: item.company,
          role: item.role,
          status: item.status,
          priority: item.priority,
          appliedAt: item.appliedAt,
          nextActionAt: item.nextActionAt,
          archivedAt: item.archivedAt,
          updatedAt: item.updatedAt,
        }));
    },
    async getByKey(ownerIdentityId, key) {
      const record = records.get(key);

      if (!record || record.ownerIdentityId !== ownerIdentityId) {
        return null;
      }

      return {
        ...record,
        interviewRounds: [...record.interviewRounds],
      };
    },
    async create(next) {
      records.set(next.key, {
        ...next,
        interviewRounds: [...next.interviewRounds],
      });
      return {
        ...next,
        interviewRounds: [...next.interviewRounds],
      };
    },
    async update(ownerIdentityId, key, patch) {
      const current = records.get(key);

      if (!current || current.ownerIdentityId !== ownerIdentityId) {
        throw new ContentNotFoundError();
      }

      const next = { ...current, ...patch };
      records.set(key, next);
      return {
        ...next,
        interviewRounds: [...next.interviewRounds],
      };
    },
  };
}

function serviceWith(seed: JobApplicationRecord[] = []) {
  return createJobApplicationService({
    store: memoryStore(seed),
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
    expect(peerList).toEqual({ ok: true, value: [] });

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
    expect(listed.value.map((item) => item.company)).toEqual([
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
    expect(applied.value.map((item) => item.company)).toEqual(["Acme"]);

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
    expect(active.value.map((item) => item.company)).toEqual(["Globex"]);

    const withArchived = await listJobApplications(access, service, {
      includeArchived: true,
      status: "rejected",
    });
    expect(withArchived.ok).toBe(true);
    if (!withArchived.ok) {
      return;
    }
    expect(withArchived.value.map((item) => item.key)).toEqual([
      created.value.key,
    ]);

    const stillReadable = await getJobApplication(
      access,
      service,
      created.value.key,
    );
    expect(stillReadable.ok).toBe(true);
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

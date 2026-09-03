import { describe, expect, it } from "@jest/globals";
import { createAdminRecord } from "@/admin/directory";
import {
  changeJobApplicationStatus,
  createJobApplication,
  getJobApplication,
  listJobApplicationStatusHistory,
  updateJobApplication,
} from "@/career/applications/access";
import { createMemoryJobApplicationStore } from "@/career/applications/memory-store";
import {
  isMongoTransactionUnsupportedError,
  runMongoTransaction,
} from "@/career/applications/mongo-transaction";
import { createJobApplicationService } from "@/career/applications/service";
import type {
  JobApplicationRecord,
  JobApplicationWriteInput,
} from "@/career/applications/types";
import {
  validateJobApplicationStatusChange,
  validateJobApplicationWriteInput,
  type JobApplicationWriteFields,
} from "@/career/applications/validation";

const owner = createAdminRecord("owner@example.com", "active");
const peer = createAdminRecord("peer@example.com", "active");
const access = { status: "allowed" as const, admin: owner };

const validFields: JobApplicationWriteFields = {
  company: "Acme",
  role: "Staff Engineer",
  status: "applied",
  nextAction: "",
  nextActionAt: "",
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

function tickingClock(start = "2026-04-01T00:00:00.000Z") {
  let current = Date.parse(start);

  return () => {
    const date = new Date(current);
    current += 1000;
    return date;
  };
}

function serviceWith() {
  return createJobApplicationService({
    store: createMemoryJobApplicationStore(),
    now: tickingClock(),
  });
}

async function createdApplication() {
  const service = serviceWith();
  const created = await createJobApplication(
    access,
    service,
    requireWrite(validFields),
  );

  if (!created.ok) {
    throw new Error("expected create to succeed");
  }

  return { service, record: created.value };
}

describe("job application status history", () => {
  it("writes an initial history row on create with a null previous status", async () => {
    const { service, record } = await createdApplication();
    const history = await listJobApplicationStatusHistory(
      access,
      service,
      record.key,
    );

    expect(history.ok).toBe(true);
    if (!history.ok) {
      return;
    }
    expect(history.value).toHaveLength(1);
    expect(history.value[0]).toMatchObject({
      applicationKey: record.key,
      ownerIdentityId: owner.id,
      sequence: 1,
      previousStatus: null,
      newStatus: "applied",
      changedByIdentityId: owner.id,
      changedAt: record.createdAt,
      reason: null,
      note: null,
    });
  });

  it("appends a transition with correct previous and new status", async () => {
    const { service, record } = await createdApplication();
    const changed = await changeJobApplicationStatus(
      access,
      service,
      record.key,
      "oa",
    );

    expect(changed).toMatchObject({
      ok: true,
      value: { key: record.key, status: "oa" },
    });

    const history = await listJobApplicationStatusHistory(
      access,
      service,
      record.key,
    );
    expect(history.ok).toBe(true);
    if (!history.ok) {
      return;
    }
    expect(history.value.map((entry) => entry.newStatus)).toEqual([
      "oa",
      "applied",
    ]);
    expect(history.value[0]).toMatchObject({
      previousStatus: "applied",
      newStatus: "oa",
      changedByIdentityId: owner.id,
      sequence: 2,
    });
    expect(history.value[0]?.changedAt).toMatch(
      /^2026-04-01T00:00:0[12]\.000Z$/,
    );
  });

  it("does not duplicate history when the status is unchanged", async () => {
    const { service, record } = await createdApplication();
    const again = await changeJobApplicationStatus(
      access,
      service,
      record.key,
      "applied",
    );

    expect(again).toMatchObject({ ok: true, value: { status: "applied" } });

    const history = await listJobApplicationStatusHistory(
      access,
      service,
      record.key,
    );
    expect(history.ok && history.value).toHaveLength(1);
  });

  it("records multiple transitions newest-first without rewriting earlier rows", async () => {
    const { service, record } = await createdApplication();

    await changeJobApplicationStatus(access, service, record.key, "oa");
    await changeJobApplicationStatus(
      access,
      service,
      record.key,
      "technical_1",
    );

    const history = await listJobApplicationStatusHistory(
      access,
      service,
      record.key,
    );
    expect(history.ok).toBe(true);
    if (!history.ok) {
      return;
    }
    expect(
      history.value.map((entry) => [
        entry.previousStatus,
        entry.newStatus,
        entry.sequence,
      ]),
    ).toEqual([
      ["oa", "technical_1", 3],
      ["applied", "oa", 2],
      [null, "applied", 1],
    ]);
  });

  it("attributes transitions to the acting admin identity", async () => {
    const { service, record } = await createdApplication();
    await changeJobApplicationStatus(access, service, record.key, "oa", {
      note: "Moving to OA",
    });

    const history = await listJobApplicationStatusHistory(
      access,
      service,
      record.key,
    );
    expect(history.ok && history.value[0]).toMatchObject({
      changedByIdentityId: owner.id,
      note: "Moving to OA",
    });
  });

  it("stores an optional rejection reason on the application and history", async () => {
    const { service, record } = await createdApplication();
    const rejected = await changeJobApplicationStatus(
      access,
      service,
      record.key,
      "rejected",
      { rejectionReason: "Leveling mismatch" },
    );

    expect(rejected).toMatchObject({
      ok: true,
      value: { status: "rejected" },
    });

    const current = await getJobApplication(access, service, record.key);
    expect(current).toMatchObject({
      ok: true,
      value: {
        status: "rejected",
        rejectionReason: "Leveling mismatch",
      },
    });

    const history = await listJobApplicationStatusHistory(
      access,
      service,
      record.key,
    );
    expect(history.ok && history.value[0]).toMatchObject({
      previousStatus: "applied",
      newStatus: "rejected",
      reason: "Leveling mismatch",
    });
  });

  it("does not force a rejection reason when moving to rejected", async () => {
    const { service, record } = await createdApplication();
    await changeJobApplicationStatus(access, service, record.key, "rejected");

    const current = await getJobApplication(access, service, record.key);
    expect(current).toMatchObject({
      ok: true,
      value: { status: "rejected", rejectionReason: null },
    });
  });

  it("keeps history intact when editing other fields", async () => {
    const { service, record } = await createdApplication();
    await changeJobApplicationStatus(access, service, record.key, "oa");

    const updated = await updateJobApplication(
      access,
      service,
      record.key,
      requireWrite({
        ...validFields,
        status: "oa",
        notes: "Prep system design.",
      }),
    );

    expect(updated).toMatchObject({
      ok: true,
      value: { notes: "Prep system design.", status: "oa" },
    });

    const history = await listJobApplicationStatusHistory(
      access,
      service,
      record.key,
    );
    expect(history.ok && history.value).toHaveLength(2);
    expect(history.ok && history.value.map((entry) => entry.newStatus)).toEqual(
      ["oa", "applied"],
    );
  });

  it("routes a form status change through the same transition helper", async () => {
    const { service, record } = await createdApplication();
    const updated = await updateJobApplication(
      access,
      service,
      record.key,
      requireWrite({
        ...validFields,
        status: "rejected",
        rejectionReason: "Closed the requisition",
      }),
    );

    expect(updated).toMatchObject({
      ok: true,
      value: {
        status: "rejected",
        rejectionReason: "Closed the requisition",
      },
    });

    const history = await listJobApplicationStatusHistory(
      access,
      service,
      record.key,
    );
    expect(history.ok && history.value[0]).toMatchObject({
      previousStatus: "applied",
      newStatus: "rejected",
      reason: "Closed the requisition",
    });
  });

  it("blocks unauthorized status changes and history reads", async () => {
    const { service, record } = await createdApplication();

    expect(
      await changeJobApplicationStatus(
        { status: "unauthenticated" },
        service,
        record.key,
        "oa",
      ),
    ).toEqual({ ok: false, code: "unauthorized" });
    expect(
      await listJobApplicationStatusHistory(
        { status: "denied" },
        service,
        record.key,
      ),
    ).toEqual({ ok: false, code: "unauthorized" });
    expect(
      await listJobApplicationStatusHistory(
        { status: "allowed", admin: peer },
        service,
        record.key,
      ),
    ).toEqual({ ok: false, code: "notFound" });
    expect(
      await changeJobApplicationStatus(
        { status: "allowed", admin: peer },
        service,
        record.key,
        "oa",
      ),
    ).toEqual({ ok: false, code: "notFound" });
  });

  it("rejects an invalid status before writing history", async () => {
    const { service, record } = await createdApplication();
    const result = await changeJobApplicationStatus(
      access,
      service,
      record.key,
      "phone_screen" as JobApplicationRecord["status"],
    );

    expect(result).toMatchObject({
      ok: false,
      code: "validation",
      fieldErrors: { status: "invalid" },
    });
    const current = await getJobApplication(access, service, record.key);
    expect(current).toMatchObject({ ok: true, value: { status: "applied" } });
  });

  it("does not change current status when history append fails", async () => {
    const createFailed = await createJobApplication(
      access,
      createJobApplicationService({
        store: createMemoryJobApplicationStore([], { failCreateHistory: true }),
        now: tickingClock(),
      }),
      requireWrite(validFields),
    );
    expect(createFailed).toEqual({ ok: false, code: "unavailable" });

    const options = { failHistoryAppend: true };
    const store = createMemoryJobApplicationStore([], options);
    const service = createJobApplicationService({
      store,
      now: tickingClock(),
    });
    const created = await createJobApplication(
      access,
      service,
      requireWrite(validFields),
    );
    expect(created.ok).toBe(true);
    if (!created.ok) {
      return;
    }

    const failed = await changeJobApplicationStatus(
      access,
      service,
      created.value.key,
      "oa",
    );
    expect(failed).toEqual({ ok: false, code: "unavailable" });

    const current = await getJobApplication(access, service, created.value.key);
    expect(current).toMatchObject({
      ok: true,
      value: { status: "applied" },
    });

    const history = await listJobApplicationStatusHistory(
      access,
      service,
      created.value.key,
    );
    expect(history.ok && history.value).toHaveLength(1);
    expect(history.ok && history.value[0]?.newStatus).toBe("applied");
  });

  it("recovers a pending history append without duplicating the transition", async () => {
    const options = { failStatusWriteAfterHistory: true };
    const store = createMemoryJobApplicationStore([], options);
    const service = createJobApplicationService({
      store,
      now: tickingClock(),
    });
    const created = await createJobApplication(
      access,
      service,
      requireWrite(validFields),
    );
    expect(created.ok).toBe(true);
    if (!created.ok) {
      return;
    }

    const failed = await changeJobApplicationStatus(
      access,
      service,
      created.value.key,
      "oa",
    );
    expect(failed).toEqual({ ok: false, code: "unavailable" });

    const current = await getJobApplication(access, service, created.value.key);
    expect(current).toMatchObject({
      ok: true,
      value: { status: "applied" },
    });

    const pending = await listJobApplicationStatusHistory(
      access,
      service,
      created.value.key,
    );
    expect(pending.ok && pending.value[0]).toMatchObject({
      previousStatus: "applied",
      newStatus: "oa",
    });

    options.failStatusWriteAfterHistory = false;
    const retried = await changeJobApplicationStatus(
      access,
      service,
      created.value.key,
      "oa",
    );
    expect(retried).toMatchObject({
      ok: true,
      value: { status: "oa" },
    });

    const history = await listJobApplicationStatusHistory(
      access,
      service,
      created.value.key,
    );
    expect(
      history.ok && history.value.filter((entry) => entry.newStatus === "oa"),
    ).toHaveLength(1);
  });
});

describe("status change validation", () => {
  it("rejects unknown statuses and overlong optional notes", () => {
    expect(
      validateJobApplicationStatusChange({ status: "phone_screen" }),
    ).toMatchObject({
      ok: false,
      fieldErrors: { status: "invalid" },
    });
    expect(
      validateJobApplicationStatusChange({
        status: "oa",
        note: "n".repeat(2001),
      }),
    ).toMatchObject({
      ok: false,
      fieldErrors: { note: "tooLong" },
    });
  });
});

describe("mongo transaction fallback", () => {
  it("detects Prisma replica-set transaction errors", () => {
    expect(
      isMongoTransactionUnsupportedError({
        code: "P2031",
        message: "Transactions are not supported",
      }),
    ).toBe(true);
    expect(
      isMongoTransactionUnsupportedError({
        message:
          "Transaction numbers are only allowed on a replica set member or mongos",
      }),
    ).toBe(true);
    expect(isMongoTransactionUnsupportedError({ code: "P2028" })).toBe(false);
  });

  it("falls back to ordered writes when transactions are unavailable", async () => {
    const calls: string[] = [];
    const client = {
      $transaction: async () => {
        throw { code: "P2031", message: "replica set required" };
      },
    };

    const result = await runMongoTransaction(client, async () => {
      calls.push("run");
      return "ok";
    });

    expect(result).toBe("ok");
    expect(calls).toEqual(["run"]);
  });
});

import { describe, expect, it } from "@jest/globals";
import { toAdminRecord } from "@/db/admin";
import { parseDatabaseUrl, requireDatabaseUrl } from "@/db/config";
import {
  DATABASE_INVALID_MESSAGE,
  DATABASE_MISSING_MESSAGE,
  DATABASE_UNAVAILABLE_MESSAGE,
  DatabaseConfigurationError,
  DatabaseError,
  toDatabaseError,
} from "@/db/errors";
import { executeDatabaseOperation } from "@/db/operation";
import { getOrCreateClient } from "@/db/singleton";

describe("database URL configuration", () => {
  it("accepts a MongoDB URL that includes a database name", () => {
    expect(
      parseDatabaseUrl("mongodb://127.0.0.1:27017/portfolio?replicaSet=rs0"),
    ).toEqual({
      url: "mongodb://127.0.0.1:27017/portfolio?replicaSet=rs0",
    });
    expect(
      parseDatabaseUrl(
        "mongodb+srv://cluster.example.net/portfolio?retryWrites=true",
      ),
    ).toEqual({
      url: "mongodb+srv://cluster.example.net/portfolio?retryWrites=true",
    });
  });

  it("fails clearly when the URL is missing or not MongoDB", () => {
    expect(() => parseDatabaseUrl("")).toThrow(DatabaseConfigurationError);
    expect(() => parseDatabaseUrl("")).toThrow(DATABASE_MISSING_MESSAGE);
    expect(() =>
      parseDatabaseUrl("postgres://localhost:5432/portfolio"),
    ).toThrow(DATABASE_INVALID_MESSAGE);
    expect(() => parseDatabaseUrl("mongodb://127.0.0.1:27017")).toThrow(
      DATABASE_INVALID_MESSAGE,
    );
    expect(() => parseDatabaseUrl("not a url")).toThrow(
      DATABASE_INVALID_MESSAGE,
    );
  });

  it("does not put credentials in configuration error messages", () => {
    expect(() =>
      parseDatabaseUrl("mongodb://owner:super-secret@127.0.0.1:27017"),
    ).toThrow(DATABASE_INVALID_MESSAGE);

    try {
      parseDatabaseUrl("mongodb://owner:super-secret@127.0.0.1:27017");
    } catch (error) {
      expect(error).toBeInstanceOf(DatabaseConfigurationError);
      expect((error as Error).message).not.toContain("super-secret");
    }
  });

  it("requires DATABASE_URL in production before parsing", () => {
    expect(() => requireDatabaseUrl("", "production")).toThrow(
      DATABASE_MISSING_MESSAGE,
    );
    expect(
      requireDatabaseUrl("mongodb://127.0.0.1:27017/portfolio", "production"),
    ).toEqual({ url: "mongodb://127.0.0.1:27017/portfolio" });
  });
});

describe("Prisma client initialization", () => {
  it("reuses one client across hot-reload style lookups", () => {
    const store: { current?: { id: number } } = {};
    let created = 0;

    const first = getOrCreateClient(store, () => {
      created += 1;
      return { id: created };
    });
    const second = getOrCreateClient(store, () => {
      created += 1;
      return { id: created };
    });

    expect(first).toBe(second);
    expect(created).toBe(1);
  });
});

describe("database operation errors", () => {
  it("wraps driver failures without exposing raw details", async () => {
    const wrapped = toDatabaseError(
      new Error("ECONNREFUSED mongodb://owner:super-secret@127.0.0.1:27017"),
    );

    expect(wrapped).toBeInstanceOf(DatabaseError);
    expect(wrapped).not.toBeInstanceOf(DatabaseConfigurationError);
    expect(wrapped.message).toBe(DATABASE_UNAVAILABLE_MESSAGE);
    expect(wrapped.message).not.toContain("super-secret");
    expect(wrapped.cause).toBeInstanceOf(Error);

    await expect(
      executeDatabaseOperation(async () => {
        throw new Error("MongoServerError: not authorized on admin");
      }),
    ).rejects.toMatchObject({
      name: "DatabaseError",
      message: DATABASE_UNAVAILABLE_MESSAGE,
    });
  });

  it("preserves configuration errors instead of masking them", () => {
    const configError = new DatabaseConfigurationError(
      DATABASE_MISSING_MESSAGE,
    );
    expect(toDatabaseError(configError)).toBe(configError);
  });
});

describe("admin persistence mapping", () => {
  it("maps a Prisma admin document onto the existing Admin identity", () => {
    expect(
      toAdminRecord({
        identityId: "abc123abc123abc123abc123",
        email: "owner@example.com",
        status: "active",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-02-01T00:00:00.000Z"),
      }),
    ).toEqual({
      id: "abc123abc123abc123abc123",
      email: "owner@example.com",
      status: "active",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-02-01T00:00:00.000Z",
    });
  });

  it("rejects malformed documents without leaking field values", () => {
    expect(() =>
      toAdminRecord({
        identityId: "",
        email: "owner@example.com",
        status: "compromised",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ).toThrow(DATABASE_UNAVAILABLE_MESSAGE);
  });
});

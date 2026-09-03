import { describe, expect, it } from "@jest/globals";
import { hash } from "bcryptjs";
import {
  AdminAuthorizationError,
  executeAuthorizedAdminOperation,
  isAdmin,
  resolveAdminAccess,
} from "@/admin/authorize";
import { buildAdminDirectory, createAdminRecord } from "@/admin/directory";
import { BOOTSTRAP_ADMIN_TIMESTAMP } from "@/admin/model";
import { stableIdentityId } from "@/auth/identity";
import { verifyAdminCredentials } from "@/auth/credentials";

const directory = buildAdminDirectory({
  bootstrapEmail: "owner@example.com",
  emails: "owner@example.com, staff@example.com",
  inactiveEmails: "retired@example.com, staff@example.com",
});

describe("admin directory", () => {
  it("bootstraps multiple admins from configuration without duplicating identity", () => {
    expect(directory.map((admin) => admin.email)).toEqual([
      "owner@example.com",
      "staff@example.com",
      "retired@example.com",
    ]);
    expect(directory[0]).toMatchObject({
      id: stableIdentityId("owner@example.com"),
      status: "active",
      createdAt: BOOTSTRAP_ADMIN_TIMESTAMP,
      updatedAt: BOOTSTRAP_ADMIN_TIMESTAMP,
    });
    expect(directory[1]?.status).toBe("inactive");
    expect(directory[2]?.status).toBe("inactive");
  });

  it("lets inactive win when an email is listed in both active and inactive sets", () => {
    const admins = buildAdminDirectory({
      bootstrapEmail: "owner@example.com",
      emails: "",
      inactiveEmails: "owner@example.com",
    });

    expect(admins).toEqual([
      createAdminRecord("owner@example.com", "inactive"),
    ]);
  });
});

describe("authorization utilities", () => {
  it("treats a missing session as unauthenticated", () => {
    expect(resolveAdminAccess(null, directory)).toEqual({
      status: "unauthenticated",
    });
    expect(isAdmin(null, directory)).toBe(false);
  });

  it("denies an authenticated identity that is not an administrator", () => {
    const access = resolveAdminAccess(
      {
        id: stableIdentityId("visitor@example.com"),
        email: "visitor@example.com",
      },
      directory,
    );

    expect(access).toEqual({ status: "denied" });
    expect(isAdmin({ id: "x", email: "visitor@example.com" }, directory)).toBe(
      false,
    );
  });

  it("allows an active administrator", () => {
    const user = {
      id: stableIdentityId("owner@example.com"),
      email: "Owner@example.com",
    };

    expect(resolveAdminAccess(user, directory)).toEqual({
      status: "allowed",
      admin: directory[0],
    });
    expect(isAdmin(user, directory)).toBe(true);
  });

  it("denies an inactive administrator without a distinct error", () => {
    const staff = {
      id: stableIdentityId("staff@example.com"),
      email: "staff@example.com",
    };
    const retired = {
      id: stableIdentityId("retired@example.com"),
      email: "retired@example.com",
    };

    expect(resolveAdminAccess(staff, directory)).toEqual({ status: "denied" });
    expect(resolveAdminAccess(retired, directory)).toEqual({
      status: "denied",
    });
    expect(isAdmin(staff, directory)).toBe(false);
  });
});

describe("protected admin operations", () => {
  it("cannot run a protected operation without authorization", () => {
    const unauthenticated = executeAuthorizedAdminOperation(
      { status: "unauthenticated" },
      () => "secret",
    );
    const denied = executeAuthorizedAdminOperation(
      { status: "denied" },
      () => "secret",
    );
    const allowed = executeAuthorizedAdminOperation(
      { status: "allowed", admin: directory[0]! },
      (admin) => admin.id,
    );

    expect(unauthenticated).toEqual({ ok: false });
    expect(denied).toEqual({ ok: false });
    expect(allowed).toEqual({ ok: true, value: directory[0]?.id });
  });

  it("uses a generic authorization error for denied access", () => {
    const error = new AdminAuthorizationError();

    expect(error.message).toBe("Access denied");
    expect(error.name).toBe("AdminAuthorizationError");
  });
});

describe("login identity remains separate from authorization", () => {
  it("issues a stable identity id that matches the admin record", async () => {
    const password = "correct-horse";
    const email = "owner@example.com";
    const user = await verifyAdminCredentials(
      { email, password },
      { email, passwordHash: await hash(password, 4) },
    );

    expect(user).toEqual({
      id: stableIdentityId(email),
      email,
    });
  });
});

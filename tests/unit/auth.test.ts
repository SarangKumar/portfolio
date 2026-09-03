import { describe, expect, it, jest } from "@jest/globals";
import { hash } from "bcryptjs";
import { MemoryRateLimiter } from "@/analytics/rate-limit";
import { attemptLogin } from "@/auth/login";
import {
  isLoginPath,
  isPrivatePath,
  loginRedirectPath,
  shouldRedirectToLogin,
} from "@/auth/paths";
import { postLogoutPath, safeInternalPath } from "@/auth/redirect";
import { toAuthUser } from "@/auth/user";
import { verifyAdminCredentials } from "@/auth/credentials";
import { LOGIN_LIMITS, validateLoginInput } from "@/auth/validation";

function loginFormData(fields: Record<string, string>): FormData {
  const formData = new FormData();

  for (const [name, value] of Object.entries(fields)) {
    formData.set(name, value);
  }

  return formData;
}

describe("private route infrastructure", () => {
  it("treats /admin and nested admin paths as private", () => {
    expect(isPrivatePath("/admin")).toBe(true);
    expect(isPrivatePath("/admin/jobs")).toBe(true);
    expect(isPrivatePath("/en/admin")).toBe(true);
    expect(isPrivatePath("/")).toBe(false);
    expect(isPrivatePath("/about")).toBe(false);
    expect(isPrivatePath("/blog/notes-on-lorem")).toBe(false);
    expect(isPrivatePath("/login")).toBe(false);
    expect(isLoginPath("/login")).toBe(true);
  });

  it("redirects unauthenticated visitors away from protected routes", () => {
    expect(shouldRedirectToLogin("/admin", false)).toBe(true);
    expect(shouldRedirectToLogin("/admin", true)).toBe(false);
    expect(shouldRedirectToLogin("/experience", false)).toBe(false);
    expect(loginRedirectPath("/admin")).toBe("/login?callbackUrl=%2Fadmin");
  });
});

describe("session user mapping", () => {
  it("returns a user only when the session is authenticated", () => {
    expect(toAuthUser(null)).toBeNull();
    expect(
      toAuthUser({
        expires: "2099-01-01T00:00:00.000Z",
        user: { id: "", email: "admin@example.com" },
      }),
    ).toBeNull();
    expect(
      toAuthUser({
        expires: "2099-01-01T00:00:00.000Z",
        user: { id: "admin", email: "admin@example.com" },
      }),
    ).toEqual({ id: "admin", email: "admin@example.com" });
  });
});

describe("validateLoginInput", () => {
  it("rejects empty or invalid credentials", () => {
    expect(
      validateLoginInput({
        email: "",
        password: "",
        callbackUrl: "",
      }),
    ).toEqual({
      ok: false,
      fieldErrors: {
        email: "required",
        password: "required",
      },
    });
    expect(
      validateLoginInput({
        email: "not-an-email",
        password: "secret",
        callbackUrl: "",
      }),
    ).toEqual({
      ok: false,
      fieldErrors: { email: "invalidEmail" },
    });
    expect(
      validateLoginInput({
        email: "admin@example.com",
        password: "x".repeat(LOGIN_LIMITS.password + 1),
        callbackUrl: "",
      }),
    ).toMatchObject({
      ok: false,
      fieldErrors: { password: "tooLong" },
    });
  });

  it("accepts a well-formed email and password", () => {
    expect(
      validateLoginInput({
        email: "admin@example.com",
        password: "secret",
        callbackUrl: "/admin",
      }),
    ).toEqual({
      ok: true,
      value: {
        email: "admin@example.com",
        password: "secret",
      },
    });
  });
});

describe("verifyAdminCredentials", () => {
  const password = "correct-horse";

  it("accepts the configured identifier and password", async () => {
    const passwordHash = await hash(password, 4);
    const config = {
      email: "admin@example.com",
      passwordHash,
    };

    await expect(
      verifyAdminCredentials({ email: "Admin@example.com", password }, config),
    ).resolves.toEqual({ id: "admin", email: "admin@example.com" });
  });

  it("rejects unknown identifiers and wrong passwords without leaking which failed", async () => {
    const passwordHash = await hash(password, 4);
    const config = {
      email: "admin@example.com",
      passwordHash,
    };

    await expect(
      verifyAdminCredentials({ email: "other@localhost", password }, config),
    ).resolves.toBeNull();
    await expect(
      verifyAdminCredentials(
        { email: "admin@example.com", password: "wrong" },
        config,
      ),
    ).resolves.toBeNull();
    await expect(
      verifyAdminCredentials(
        { email: "admin@example.com", password },
        { email: "", passwordHash: "" },
      ),
    ).resolves.toBeNull();
  });
});

describe("attemptLogin", () => {
  it("returns field errors before authentication runs", async () => {
    const authenticate = jest.fn(async () => true);
    const consume = jest.fn(() => ({ allowed: true }));

    await expect(
      attemptLogin(loginFormData({ email: "", password: "" }), {
        consume,
        rateLimitKey: "login:test",
        authenticate,
      }),
    ).resolves.toEqual({
      status: "error",
      fieldErrors: {
        email: "required",
        password: "required",
      },
    });
    expect(authenticate).not.toHaveBeenCalled();
    expect(consume).not.toHaveBeenCalled();
  });

  it("returns a generic error when authentication fails", async () => {
    const limiter = new MemoryRateLimiter(8, 60_000);

    await expect(
      attemptLogin(
        loginFormData({
          email: "admin@example.com",
          password: "wrong",
        }),
        {
          consume: (key) => limiter.consume(key),
          rateLimitKey: "login:fail",
          authenticate: async () => false,
        },
      ),
    ).resolves.toEqual({ status: "error" });
  });

  it("authenticates and sanitizes the callback path", async () => {
    const limiter = new MemoryRateLimiter(8, 60_000);

    await expect(
      attemptLogin(
        loginFormData({
          email: "admin@example.com",
          password: "secret",
          callbackUrl: "https://evil.example/phish",
        }),
        {
          consume: (key) => limiter.consume(key),
          rateLimitKey: "login:ok",
          authenticate: async () => true,
        },
      ),
    ).resolves.toEqual({
      status: "authenticated",
      redirectTo: "/admin",
    });
  });

  it("rate-limits repeated attempts", async () => {
    const limiter = new MemoryRateLimiter(1, 60_000);
    const authenticate = jest.fn(async () => false);
    const deps = {
      consume: (key: string) => limiter.consume(key),
      rateLimitKey: "login:limit",
      authenticate,
    };

    await attemptLogin(
      loginFormData({ email: "admin@example.com", password: "wrong" }),
      deps,
    );
    await expect(
      attemptLogin(
        loginFormData({ email: "admin@example.com", password: "wrong" }),
        deps,
      ),
    ).resolves.toEqual({ status: "rateLimited" });
    expect(authenticate).toHaveBeenCalledTimes(1);
  });
});

describe("logout and callback safety", () => {
  it("invalidates by returning no user and sending visitors home", () => {
    expect(toAuthUser(null)).toBeNull();
    expect(postLogoutPath).toBe("/");
  });

  it("keeps post-login redirects on this origin", () => {
    expect(safeInternalPath("/admin")).toBe("/admin");
    expect(safeInternalPath("//evil.example")).toBe("/admin");
    expect(safeInternalPath("/login")).toBe("/admin");
  });
});

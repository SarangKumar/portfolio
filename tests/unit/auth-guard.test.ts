import { describe, expect, it } from "@jest/globals";
import { requireUserOrRedirect } from "@/auth/guard";

describe("requireUserOrRedirect", () => {
  it("redirects unauthenticated access to the login route", () => {
    expect(() => requireUserOrRedirect(null)).toThrow("NEXT_REDIRECT");
  });

  it("allows authenticated access to continue", () => {
    expect(
      requireUserOrRedirect({ id: "admin", email: "admin@example.com" }),
    ).toEqual({ id: "admin", email: "admin@example.com" });
  });
});

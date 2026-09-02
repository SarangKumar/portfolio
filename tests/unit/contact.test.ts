import { describe, expect, it } from "@jest/globals";
import { CONTACT_LIMITS, validateContactInput } from "@/lib/contact";

describe("validateContactInput", () => {
  it("accepts a trimmed message", () => {
    expect(
      validateContactInput({
        name: "Ada",
        email: "ada@example.com",
        message: "Hello",
        website: "",
      }),
    ).toEqual({
      ok: true,
      ignored: false,
      value: {
        name: "Ada",
        email: "ada@example.com",
        message: "Hello",
      },
    });
  });

  it("returns field codes for empty or invalid input", () => {
    expect(
      validateContactInput({
        name: "",
        email: "not-an-email",
        message: "",
        website: "",
      }),
    ).toEqual({
      ok: false,
      ignored: false,
      fieldErrors: {
        name: "required",
        email: "invalidEmail",
        message: "required",
      },
    });
  });

  it("silently accepts honeypot submissions", () => {
    expect(
      validateContactInput({
        name: "Ada",
        email: "ada@example.com",
        message: "Hello",
        website: "https://spam.example",
      }),
    ).toEqual({ ok: true, ignored: true });
  });

  it("rejects oversized fields", () => {
    expect(
      validateContactInput({
        name: "A".repeat(CONTACT_LIMITS.name + 1),
        email: "ada@example.com",
        message: "Hello",
        website: "",
      }),
    ).toMatchObject({
      ok: false,
      fieldErrors: { name: "tooLong" },
    });
  });
});

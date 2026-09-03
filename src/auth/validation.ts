export const LOGIN_LIMITS = {
  email: 254,
  password: 256,
} as const;

export type LoginField = "email" | "password";

export type LoginFieldErrors = Partial<Record<LoginField, string>>;

export type LoginInput = {
  email: string;
  password: string;
  callbackUrl: string;
};

export type LoginValidation =
  | { ok: true; value: Omit<LoginInput, "callbackUrl"> }
  | { ok: false; fieldErrors: LoginFieldErrors };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}

export function readLoginForm(formData: FormData): LoginInput {
  return {
    email: readString(formData.get("email")).trim(),
    password: readString(formData.get("password")),
    callbackUrl: readString(formData.get("callbackUrl")).trim(),
  };
}

export function validateLoginInput(input: LoginInput): LoginValidation {
  const fieldErrors: LoginFieldErrors = {};

  if (!input.email) {
    fieldErrors.email = "required";
  } else if (
    !EMAIL_PATTERN.test(input.email) ||
    input.email.length > LOGIN_LIMITS.email
  ) {
    fieldErrors.email = "invalidEmail";
  }

  if (!input.password) {
    fieldErrors.password = "required";
  } else if (input.password.length > LOGIN_LIMITS.password) {
    fieldErrors.password = "tooLong";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    value: {
      email: input.email,
      password: input.password,
    },
  };
}

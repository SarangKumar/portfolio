export const CONTACT_LIMITS = {
  name: 80,
  email: 254,
  message: 4000,
} as const;

export type ContactField = "name" | "email" | "message";

export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export type ContactInput = {
  name: string;
  email: string;
  message: string;
  website: string;
};

export type ContactValidation =
  | { ok: true; ignored: false; value: Omit<ContactInput, "website"> }
  | { ok: true; ignored: true }
  | { ok: false; ignored: false; fieldErrors: ContactFieldErrors };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trimField(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export function readContactForm(formData: FormData): ContactInput {
  return {
    name: trimField(formData.get("name")),
    email: trimField(formData.get("email")),
    message: trimField(formData.get("message")),
    website: trimField(formData.get("website")),
  };
}

export function validateContactInput(input: ContactInput): ContactValidation {
  if (input.website.length > 0) {
    return { ok: true, ignored: true };
  }

  const fieldErrors: ContactFieldErrors = {};

  if (!input.name) {
    fieldErrors.name = "required";
  } else if (input.name.length > CONTACT_LIMITS.name) {
    fieldErrors.name = "tooLong";
  }

  if (!input.email) {
    fieldErrors.email = "required";
  } else if (
    !EMAIL_PATTERN.test(input.email) ||
    input.email.length > CONTACT_LIMITS.email
  ) {
    fieldErrors.email = "invalidEmail";
  }

  if (!input.message) {
    fieldErrors.message = "required";
  } else if (input.message.length > CONTACT_LIMITS.message) {
    fieldErrors.message = "tooLong";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, ignored: false, fieldErrors };
  }

  return {
    ok: true,
    ignored: false,
    value: {
      name: input.name,
      email: input.email,
      message: input.message,
    },
  };
}

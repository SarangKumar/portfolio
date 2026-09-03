import { stableIdentityId, normalizeEmail } from "@/auth/identity";
import {
  BOOTSTRAP_ADMIN_TIMESTAMP,
  type Admin,
  type AdminStatus,
} from "@/admin/model";

export type AdminDirectoryInput = {
  bootstrapEmail: string;
  emails: string;
  inactiveEmails: string;
};

export function parseEmailList(value: string): string[] {
  const seen = new Set<string>();
  const emails: string[] = [];

  for (const part of value.split(/[,;]+/)) {
    const email = normalizeEmail(part);

    if (!email || seen.has(email)) {
      continue;
    }

    seen.add(email);
    emails.push(email);
  }

  return emails;
}

export function createAdminRecord(email: string, status: AdminStatus): Admin {
  const normalized = normalizeEmail(email);

  return {
    id: stableIdentityId(normalized),
    email: normalized,
    status,
    createdAt: BOOTSTRAP_ADMIN_TIMESTAMP,
    updatedAt: BOOTSTRAP_ADMIN_TIMESTAMP,
  };
}

export function buildAdminDirectory(input: AdminDirectoryInput): Admin[] {
  const inactive = new Set(parseEmailList(input.inactiveEmails));
  const ordered = parseEmailList(
    [input.bootstrapEmail, input.emails].filter(Boolean).join(","),
  );

  const records = new Map<string, Admin>();

  for (const email of ordered) {
    records.set(
      email,
      createAdminRecord(email, inactive.has(email) ? "inactive" : "active"),
    );
  }

  for (const email of inactive) {
    if (!records.has(email)) {
      records.set(email, createAdminRecord(email, "inactive"));
    }
  }

  return [...records.values()];
}

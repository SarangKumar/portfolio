import type { Admin, AdminStatus } from "@/admin/model";
import { DATABASE_UNAVAILABLE_MESSAGE, DatabaseError } from "@/db/errors";

export type AdminDocument = {
  identityId: string;
  email: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

function isAdminStatus(value: string): value is AdminStatus {
  return value === "active" || value === "inactive";
}

export function toAdminRecord(document: AdminDocument): Admin {
  if (
    !document.identityId ||
    !document.email ||
    !isAdminStatus(document.status)
  ) {
    throw new DatabaseError(DATABASE_UNAVAILABLE_MESSAGE);
  }

  return {
    id: document.identityId,
    email: document.email,
    status: document.status,
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  };
}

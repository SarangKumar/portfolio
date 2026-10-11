import { normalizeEmail, stableIdentityId } from "@/auth/identity";
import {
  BOOTSTRAP_ADMIN_TIMESTAMP,
  type Admin,
  type AdminStatus,
} from "@/admin/model";

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

import "server-only";

export { toAdminRecord, type AdminDocument } from "@/db/admin";
export { getPrismaClient } from "@/db/client";
export {
  parseDatabaseUrl,
  requireDatabaseUrl,
  isDatabaseConfigured,
} from "@/db/config";
export {
  DatabaseConfigurationError,
  DatabaseError,
  DATABASE_INVALID_MESSAGE,
  DATABASE_MISSING_MESSAGE,
  DATABASE_UNAVAILABLE_MESSAGE,
  toDatabaseError,
} from "@/db/errors";
export { executeDatabaseOperation } from "@/db/operation";
export {
  assessDatabaseHealth,
  type DatabaseHealth,
  type DatabaseHealthStatus,
} from "@/db/health";
export { probeDatabaseHealth } from "@/db/probe";

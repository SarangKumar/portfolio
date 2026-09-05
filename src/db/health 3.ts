import "server-only";

import { isDatabaseConfigured } from "@/db/config";

export const databaseHealthStatuses = [
  "healthy",
  "unconfigured",
  "unreachable",
] as const;

export type DatabaseHealthStatus = (typeof databaseHealthStatuses)[number];

export type DatabaseHealth = {
  ok: boolean;
  status: DatabaseHealthStatus;
};

export async function assessDatabaseHealth(
  url: string,
  ping: () => Promise<unknown>,
): Promise<DatabaseHealth> {
  if (!isDatabaseConfigured(url)) {
    return { ok: false, status: "unconfigured" };
  }

  try {
    await ping();
    return { ok: true, status: "healthy" };
  } catch {
    return { ok: false, status: "unreachable" };
  }
}

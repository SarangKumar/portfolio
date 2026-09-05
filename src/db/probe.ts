import "server-only";

import { getPrismaClient } from "@/db/client";
import { assessDatabaseHealth, type DatabaseHealth } from "@/db/health";
import { serverEnv } from "@/lib/env/server";

export async function probeDatabaseHealth(): Promise<DatabaseHealth> {
  return assessDatabaseHealth(serverEnv.databaseUrl, async () => {
    await getPrismaClient().$runCommandRaw({ ping: 1 });
  });
}

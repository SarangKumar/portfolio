import "server-only";

import { PrismaClient } from "@prisma/client";
import { requireDatabaseUrl } from "@/db/config";
import { getOrCreateClient, type ClientStore } from "@/db/singleton";
import { serverEnv } from "@/lib/env/server";

const globalForPrisma = globalThis as typeof globalThis & {
  __portfolioPrisma?: PrismaClient;
};

const prismaStore: ClientStore<PrismaClient> = {
  get current() {
    return globalForPrisma.__portfolioPrisma;
  },
  set current(client) {
    globalForPrisma.__portfolioPrisma = client;
  },
};

function createPrismaClient(): PrismaClient {
  const { url } = requireDatabaseUrl(serverEnv.databaseUrl, serverEnv.nodeEnv);

  return new PrismaClient({
    datasourceUrl: url,
    log: ["error"],
  });
}

export function getPrismaClient(): PrismaClient {
  return getOrCreateClient(prismaStore, createPrismaClient);
}

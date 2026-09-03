import {
  DATABASE_INVALID_MESSAGE,
  DATABASE_MISSING_MESSAGE,
  DatabaseConfigurationError,
} from "@/db/errors";

const MONGODB_PROTOCOLS = ["mongodb:", "mongodb+srv:"] as const;

export type DatabaseUrlConfig = {
  url: string;
};

function isMongoProtocol(protocol: string): boolean {
  return MONGODB_PROTOCOLS.includes(
    protocol as (typeof MONGODB_PROTOCOLS)[number],
  );
}

export function parseDatabaseUrl(value: string): DatabaseUrlConfig {
  const url = value.trim();

  if (!url) {
    throw new DatabaseConfigurationError(DATABASE_MISSING_MESSAGE);
  }

  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch (error) {
    throw new DatabaseConfigurationError(DATABASE_INVALID_MESSAGE, {
      cause: error,
    });
  }

  if (!isMongoProtocol(parsed.protocol)) {
    throw new DatabaseConfigurationError(DATABASE_INVALID_MESSAGE);
  }

  const databaseName = parsed.pathname.replace(/^\/+/, "").split("/")[0] ?? "";

  if (!databaseName) {
    throw new DatabaseConfigurationError(DATABASE_INVALID_MESSAGE);
  }

  return { url };
}

export function requireDatabaseUrl(
  value: string,
  nodeEnv: string,
): DatabaseUrlConfig {
  const url = value.trim();

  if (!url && nodeEnv === "production") {
    throw new DatabaseConfigurationError(DATABASE_MISSING_MESSAGE);
  }

  return parseDatabaseUrl(url);
}

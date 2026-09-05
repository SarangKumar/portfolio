export class DatabaseError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "DatabaseError";
  }
}

export class DatabaseConfigurationError extends DatabaseError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "DatabaseConfigurationError";
  }
}

export const DATABASE_UNAVAILABLE_MESSAGE = "The database is unavailable.";
export const DATABASE_MISSING_MESSAGE = "Database configuration is missing.";
export const DATABASE_INVALID_MESSAGE = "Database configuration is invalid.";

export function toDatabaseError(error: unknown): DatabaseError {
  if (error instanceof DatabaseError) {
    return error;
  }

  return new DatabaseError(DATABASE_UNAVAILABLE_MESSAGE, { cause: error });
}

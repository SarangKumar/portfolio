import { toDatabaseError } from "@/db/errors";

export async function executeDatabaseOperation<T>(
  operation: () => Promise<T>,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    throw toDatabaseError(error);
  }
}

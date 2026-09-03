const MONGO_TRANSACTION_UNSUPPORTED_CODE = "P2031";

export function isMongoTransactionUnsupportedError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  if ("code" in error && error.code === MONGO_TRANSACTION_UNSUPPORTED_CODE) {
    return true;
  }

  const message =
    "message" in error && typeof error.message === "string"
      ? error.message
      : "";

  return /replica set/i.test(message) && /transaction/i.test(message);
}

type TransactionHost<TClient> = {
  $transaction: (fn: (tx: TClient) => Promise<unknown>) => Promise<unknown>;
};

/// Prisma interactive transactions on MongoDB need a replica set (P2031).
/// Atlas provides one. Local single-node must run `mongod --replSet rs0`
/// then `rs.initiate()`. If transactions are unavailable, the callback runs
/// without a transaction; callers must write history before current status.
export async function runMongoTransaction<TClient, T>(
  client: TClient & TransactionHost<TClient>,
  run: (tx: TClient) => Promise<T>,
): Promise<T> {
  try {
    return (await client.$transaction((tx) => run(tx))) as T;
  } catch (error) {
    if (!isMongoTransactionUnsupportedError(error)) {
      throw error;
    }

    return run(client);
  }
}

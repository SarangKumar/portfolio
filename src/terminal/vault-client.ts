export type VaultStatus = {
  configured: boolean;
  unlocked: boolean;
};

export type VaultView = "summary" | "json";

export type VaultClient = {
  status(): Promise<VaultStatus>;
  unlock(
    password: string,
  ): Promise<
    | { ok: true }
    | { ok: false; error: "invalid" | "unconfigured" | "rate_limited" }
  >;
  lock(): Promise<void>;
  read(
    view: VaultView,
  ): Promise<
    | { ok: true; lines: readonly string[] }
    | { ok: false; error: "locked" | "unconfigured" }
  >;
};

export function createHttpVaultClient(
  request: typeof fetch = fetch,
): VaultClient {
  return {
    async status() {
      const response = await request("/api/analytics/vault");
      const body = (await response.json()) as VaultStatus;
      return {
        configured: Boolean(body.configured),
        unlocked: Boolean(body.unlocked),
      };
    },
    async unlock(password: string) {
      const response = await request("/api/analytics/vault", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });

      let body: {
        ok?: boolean;
        error?: "invalid" | "unconfigured" | "rate_limited";
      } = {};

      try {
        body = (await response.json()) as typeof body;
      } catch {
        return { ok: false, error: "invalid" };
      }

      if (response.ok && body.ok) {
        return { ok: true };
      }

      if (body.error === "unconfigured" || body.error === "rate_limited") {
        return { ok: false, error: body.error };
      }

      return { ok: false, error: "invalid" };
    },
    async lock() {
      await request("/api/analytics/vault", { method: "DELETE" });
    },
    async read(view) {
      const response = await request(
        `/api/analytics/vault?view=${encodeURIComponent(view)}`,
      );
      const body = (await response.json()) as {
        ok?: boolean;
        lines?: string[];
        error?: "locked" | "unconfigured";
      };

      if (response.ok && body.ok && Array.isArray(body.lines)) {
        return { ok: true, lines: body.lines };
      }

      if (body.error === "unconfigured") {
        return { ok: false, error: "unconfigured" };
      }

      return { ok: false, error: "locked" };
    },
  };
}

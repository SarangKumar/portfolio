import "server-only";

/**
 * Server-only environment values.
 * Read through `process.env[name]` so Next.js cannot inline an empty
 * string at compile time. Do not import this module from Client Components.
 */
function readEnv(name: string): string {
  return process.env[name] ?? "";
}

export const serverEnv = {
  get nodeEnv() {
    return readEnv("NODE_ENV");
  },
  get contactWebhookUrl() {
    return readEnv("CONTACT_WEBHOOK_URL");
  },
  get analyticsHashSalt() {
    return readEnv("ANALYTICS_HASH_SALT");
  },
  get analyticsVaultPassword() {
    return readEnv("ANALYTICS_VAULT_PASSWORD");
  },
  get authSecret() {
    return readEnv("AUTH_SECRET");
  },
  get adminEmail() {
    return readEnv("ADMIN_EMAIL");
  },
  get adminPasswordHash() {
    return readEnv("ADMIN_PASSWORD_HASH");
  },
  get adminEmails() {
    return readEnv("ADMIN_EMAILS");
  },
  get adminInactiveEmails() {
    return readEnv("ADMIN_INACTIVE_EMAILS");
  },
};

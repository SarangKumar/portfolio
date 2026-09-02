import "server-only";

/**
 * Server-only environment values.
 * Do not import this module from Client Components.
 * Add secrets here as they become required — never expose them via NEXT_PUBLIC_.
 */
export const serverEnv = {
  nodeEnv: process.env.NODE_ENV,
  contactWebhookUrl: process.env.CONTACT_WEBHOOK_URL ?? "",
  analyticsHashSalt: process.env.ANALYTICS_HASH_SALT ?? "",
} as const;

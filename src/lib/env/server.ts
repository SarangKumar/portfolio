import "server-only";

/**
 * Server-only environment values.
 * Do not import this module from Client Components.
 * Add secrets here as they become required — never expose them via NEXT_PUBLIC_.
 */
export const serverEnv = {
  nodeEnv: process.env.NODE_ENV,
} as const;

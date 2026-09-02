import { isPublicSlug } from "@/lib/slug";

export const analyticsEvents = {
  pageView: "page_view",
  projectView: "project_view",
  resumeView: "resume_view",
  resumeDownload: "resume_download",
  resumePreview: "resume_preview",
  blogView: "blog_view",
  githubClick: "github_click",
  linkedinClick: "linkedin_click",
  emailClick: "email_click",
  terminalOpen: "terminal_open",
  terminalCommand: "terminal_command",
  contactSubmit: "contact_submit",
} as const;

export type AnalyticsEventName =
  (typeof analyticsEvents)[keyof typeof analyticsEvents];

export const analyticsEventNames = Object.values(analyticsEvents);

export const contactSubmitResults = [
  "success",
  "error",
  "unavailable",
  "ignored",
] as const;

export type ContactSubmitResult = (typeof contactSubmitResults)[number];

export type AnalyticsMetadata = {
  resumeId?: string;
  result?: ContactSubmitResult;
  command?: string;
  host?: string;
};

export type AnalyticsClientPayload = {
  name: AnalyticsEventName;
  path: string;
  projectSlug?: string;
  blogSlug?: string;
  metadata?: AnalyticsMetadata;
};

export type AnalyticsRecord = AnalyticsClientPayload & {
  timestamp: string;
  sessionId: string;
  visitorId: string;
};

export type AnalyticsValidationResult =
  { ok: true; value: AnalyticsClientPayload } | { ok: false; error: string };

export type AnalyticsRecordValidationResult =
  { ok: true; value: AnalyticsRecord } | { ok: false; error: string };

const EVENT_NAME_SET = new Set<string>(analyticsEventNames);
const RESULT_SET = new Set<string>(contactSubmitResults);
const CLIENT_KEYS = new Set([
  "name",
  "path",
  "projectSlug",
  "blogSlug",
  "metadata",
]);
const RECORD_KEYS = new Set([
  ...CLIENT_KEYS,
  "timestamp",
  "sessionId",
  "visitorId",
]);
const METADATA_KEYS = new Set(["resumeId", "result", "command", "host"]);
const TOKEN_PATTERN = /^[A-Za-z0-9._-]{8,64}$/;
const HOST_PATTERN = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
const RESUME_ID_PATTERN = /^[A-Za-z0-9._-]{1,64}$/;
const PATH_PATTERN = /^\/[A-Za-z0-9\-._/~]*$/;

export const ANALYTICS_MAX_BODY_BYTES = 4096;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(
  value: Record<string, unknown>,
  allowed: Set<string>,
): boolean {
  return Object.keys(value).every((key) => allowed.has(key));
}

export function normalizeAnalyticsPath(path: unknown): string | null {
  if (typeof path !== "string") {
    return null;
  }

  const stripped = path.split("?")[0]?.split("#")[0] ?? "";

  if (!stripped.startsWith("/") || stripped.length > 256) {
    return null;
  }

  if (!PATH_PATTERN.test(stripped)) {
    return null;
  }

  const collapsed = stripped.replace(/\/{2,}/g, "/");
  const withoutTrailing =
    collapsed.length > 1 ? collapsed.replace(/\/$/, "") : collapsed;

  return withoutTrailing || "/";
}

function sanitizeCommand(value: string): string | undefined {
  const compact = value.replace(/\s+/g, " ").trim().slice(0, 80);

  if (!compact || compact.includes("@")) {
    return undefined;
  }

  return compact;
}

function parseMetadata(value: unknown): AnalyticsMetadata | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!isPlainObject(value) || !hasOnlyKeys(value, METADATA_KEYS)) {
    throw new Error("invalid_metadata");
  }

  const metadata: AnalyticsMetadata = {};

  if (value.resumeId !== undefined) {
    if (
      typeof value.resumeId !== "string" ||
      !RESUME_ID_PATTERN.test(value.resumeId)
    ) {
      throw new Error("invalid_resume_id");
    }

    metadata.resumeId = value.resumeId;
  }

  if (value.result !== undefined) {
    if (typeof value.result !== "string" || !RESULT_SET.has(value.result)) {
      throw new Error("invalid_result");
    }

    metadata.result = value.result as ContactSubmitResult;
  }

  if (value.command !== undefined) {
    if (typeof value.command !== "string") {
      throw new Error("invalid_command");
    }

    const command = sanitizeCommand(value.command);

    if (command) {
      metadata.command = command;
    }
  }

  if (value.host !== undefined) {
    if (typeof value.host !== "string" || !HOST_PATTERN.test(value.host)) {
      throw new Error("invalid_host");
    }

    metadata.host = value.host.toLowerCase();
  }

  return Object.keys(metadata).length > 0 ? metadata : undefined;
}

function parseSlug(value: unknown): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string" || !isPublicSlug(value)) {
    throw new Error("invalid_slug");
  }

  return value;
}

function parseEventName(value: unknown): AnalyticsEventName {
  if (typeof value !== "string" || !EVENT_NAME_SET.has(value)) {
    throw new Error("invalid_name");
  }

  return value as AnalyticsEventName;
}

function parseIdentityToken(value: unknown): string {
  if (typeof value !== "string" || !TOKEN_PATTERN.test(value)) {
    throw new Error("invalid_identity");
  }

  return value;
}

function parseTimestamp(value: unknown): string {
  if (typeof value !== "string") {
    throw new Error("invalid_timestamp");
  }

  const parsed = Date.parse(value);

  if (Number.isNaN(parsed)) {
    throw new Error("invalid_timestamp");
  }

  return new Date(parsed).toISOString();
}

function parseClientObject(
  value: Record<string, unknown>,
): AnalyticsClientPayload {
  if (!hasOnlyKeys(value, CLIENT_KEYS)) {
    throw new Error("unexpected_field");
  }

  const name = parseEventName(value.name);
  const path = normalizeAnalyticsPath(value.path);

  if (!path) {
    throw new Error("invalid_path");
  }

  const projectSlug = parseSlug(value.projectSlug);
  const blogSlug = parseSlug(value.blogSlug);
  const metadata = parseMetadata(value.metadata);

  if (name === analyticsEvents.projectView && !projectSlug) {
    throw new Error("missing_project_slug");
  }

  if (name === analyticsEvents.blogView && !blogSlug) {
    throw new Error("missing_blog_slug");
  }

  if (name === analyticsEvents.contactSubmit && !metadata?.result) {
    throw new Error("missing_result");
  }

  return {
    name,
    path,
    ...(projectSlug ? { projectSlug } : {}),
    ...(blogSlug ? { blogSlug } : {}),
    ...(metadata ? { metadata } : {}),
  };
}

export function validateAnalyticsPayload(
  input: unknown,
): AnalyticsValidationResult {
  try {
    if (!isPlainObject(input)) {
      return { ok: false, error: "invalid_payload" };
    }

    return { ok: true, value: parseClientObject(input) };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "invalid_payload",
    };
  }
}

export function validateAnalyticsRecord(
  input: unknown,
): AnalyticsRecordValidationResult {
  try {
    if (!isPlainObject(input) || !hasOnlyKeys(input, RECORD_KEYS)) {
      return { ok: false, error: "invalid_record" };
    }

    const payload = parseClientObject({
      name: input.name,
      path: input.path,
      projectSlug: input.projectSlug,
      blogSlug: input.blogSlug,
      metadata: input.metadata,
    });

    return {
      ok: true,
      value: {
        ...payload,
        timestamp: parseTimestamp(input.timestamp),
        sessionId: parseIdentityToken(input.sessionId),
        visitorId: parseIdentityToken(input.visitorId),
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "invalid_record",
    };
  }
}

export function createAnalyticsRecord(
  payload: AnalyticsClientPayload,
  identity: {
    timestamp: string;
    sessionId: string;
    visitorId: string;
  },
): AnalyticsRecord {
  return {
    ...payload,
    timestamp: identity.timestamp,
    sessionId: identity.sessionId,
    visitorId: identity.visitorId,
  };
}

export function serializeAnalyticsRecord(record: AnalyticsRecord): string {
  return JSON.stringify(record);
}

export function parseAnalyticsRecord(
  serialized: string,
): AnalyticsRecordValidationResult {
  try {
    return validateAnalyticsRecord(JSON.parse(serialized) as unknown);
  } catch {
    return { ok: false, error: "invalid_json" };
  }
}

export function isAnalyticsEventName(
  value: string,
): value is AnalyticsEventName {
  return EVENT_NAME_SET.has(value);
}

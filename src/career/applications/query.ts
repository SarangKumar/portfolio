import {
  isJobApplicationPriority,
  isJobApplicationStatus,
} from "@/career/applications/status";
import type {
  JobApplicationListPage,
  JobApplicationListQuery,
  JobApplicationRecord,
  JobApplicationSortDirection,
  JobApplicationSortField,
  JobApplicationSummary,
} from "@/career/applications/types";

export const DEFAULT_APPLICATION_PAGE_SIZE = 25;
export const MAX_APPLICATION_PAGE_SIZE = 50;
export const MAX_APPLICATION_SEARCH_LENGTH = 80;

export const jobApplicationSortFields = [
  "company",
  "role",
  "status",
  "location",
  "appliedAt",
  "priority",
  "nextActionAt",
] as const satisfies readonly JobApplicationSortField[];

export const APPLICATIONS_PATH = "/admin/applications";
export const MAX_APPLICATIONS_RETURN_PATH_LENGTH = 500;
const APPLICATION_DETAIL_KEY_PATTERN = /^app-[A-Za-z0-9._-]+$/;

export type ApplicationTrackerState = {
  search: string;
  status: JobApplicationListQuery["status"];
  company: string;
  location: string;
  priority: JobApplicationListQuery["priority"];
  appliedFrom: string;
  appliedTo: string;
  includeArchived: boolean;
  sort: JobApplicationSortField;
  dir: JobApplicationSortDirection;
  page: number;
  pageSize: number;
  open: string;
  edit: string;
};

export type ApplicationSearchParams = Record<
  string,
  string | string[] | undefined
>;

function firstValue(
  params: ApplicationSearchParams,
  key: string,
): string | undefined {
  const value = params[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function trimQuery(value: string | undefined, max: number): string {
  return (value ?? "").trim().slice(0, max);
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

function isSortField(value: string): value is JobApplicationSortField {
  return (jobApplicationSortFields as readonly string[]).includes(value);
}

export function defaultApplicationTrackerState(): ApplicationTrackerState {
  return {
    search: "",
    status: undefined,
    company: "",
    location: "",
    priority: undefined,
    appliedFrom: "",
    appliedTo: "",
    includeArchived: false,
    sort: "appliedAt",
    dir: "desc",
    page: 1,
    pageSize: DEFAULT_APPLICATION_PAGE_SIZE,
    open: "",
    edit: "",
  };
}

export function parseApplicationTrackerSearchParams(
  params: ApplicationSearchParams,
): ApplicationTrackerState {
  const defaults = defaultApplicationTrackerState();
  const statusRaw = trimQuery(firstValue(params, "status"), 40);
  const priorityRaw = trimQuery(firstValue(params, "priority"), 20);
  const sortRaw = trimQuery(firstValue(params, "sort"), 40);
  const dirRaw = trimQuery(firstValue(params, "dir"), 8);
  const appliedFrom = trimQuery(firstValue(params, "appliedFrom"), 10);
  const appliedTo = trimQuery(firstValue(params, "appliedTo"), 10);
  const archivedRaw = trimQuery(firstValue(params, "archived"), 8);
  const pageSize = Math.min(
    MAX_APPLICATION_PAGE_SIZE,
    parsePositiveInt(firstValue(params, "pageSize"), defaults.pageSize),
  );

  return {
    search: trimQuery(firstValue(params, "q"), MAX_APPLICATION_SEARCH_LENGTH),
    status: isJobApplicationStatus(statusRaw) ? statusRaw : undefined,
    company: trimQuery(firstValue(params, "company"), 160),
    location: trimQuery(firstValue(params, "location"), 160),
    priority: isJobApplicationPriority(priorityRaw) ? priorityRaw : undefined,
    appliedFrom: isIsoDate(appliedFrom) ? appliedFrom : "",
    appliedTo: isIsoDate(appliedTo) ? appliedTo : "",
    includeArchived: archivedRaw === "1",
    sort: isSortField(sortRaw) ? sortRaw : defaults.sort,
    dir: dirRaw === "asc" || dirRaw === "desc" ? dirRaw : defaults.dir,
    page: parsePositiveInt(firstValue(params, "page"), defaults.page),
    pageSize,
    open: trimQuery(firstValue(params, "open"), 80),
    edit: trimQuery(firstValue(params, "edit"), 80),
  };
}

export function applicationTrackerToListQuery(
  state: ApplicationTrackerState,
): JobApplicationListQuery {
  return {
    search: state.search || undefined,
    status: state.status,
    company: state.company || undefined,
    location: state.location || undefined,
    priority: state.priority,
    appliedFrom: state.appliedFrom || undefined,
    appliedTo: state.appliedTo || undefined,
    includeArchived: state.includeArchived,
    sort: state.sort,
    dir: state.dir,
    page: state.page,
    pageSize: state.pageSize,
  };
}

export function applicationTrackerSearchParams(
  state: ApplicationTrackerState,
  overrides: Partial<ApplicationTrackerState> = {},
): URLSearchParams {
  const next = { ...state, ...overrides };
  const params = new URLSearchParams();

  if (next.search) {
    params.set("q", next.search);
  }

  if (next.status) {
    params.set("status", next.status);
  }

  if (next.company) {
    params.set("company", next.company);
  }

  if (next.location) {
    params.set("location", next.location);
  }

  if (next.priority) {
    params.set("priority", next.priority);
  }

  if (next.appliedFrom) {
    params.set("appliedFrom", next.appliedFrom);
  }

  if (next.appliedTo) {
    params.set("appliedTo", next.appliedTo);
  }

  if (next.includeArchived) {
    params.set("archived", "1");
  }

  if (next.sort !== "appliedAt") {
    params.set("sort", next.sort);
  }

  if (next.dir !== "desc") {
    params.set("dir", next.dir);
  }

  if (next.page > 1) {
    params.set("page", String(next.page));
  }

  if (next.pageSize !== DEFAULT_APPLICATION_PAGE_SIZE) {
    params.set("pageSize", String(next.pageSize));
  }

  if (next.open) {
    params.set("open", next.open);
  }

  if (next.edit) {
    params.set("edit", next.edit);
  }

  return params;
}

export function applicationTrackerHref(
  state: ApplicationTrackerState,
  overrides: Partial<ApplicationTrackerState> = {},
): string {
  const params = applicationTrackerSearchParams(state, overrides);
  const query = params.toString();
  return query ? `${APPLICATIONS_PATH}?${query}` : APPLICATIONS_PATH;
}

export function applicationTrackerHasFilters(
  state: ApplicationTrackerState,
): boolean {
  return Boolean(
    state.search ||
    state.status ||
    state.company ||
    state.location ||
    state.priority ||
    state.appliedFrom ||
    state.appliedTo ||
    state.includeArchived,
  );
}

export const APPLICATION_CREATE_PATH = `${APPLICATIONS_PATH}/new`;

export function applicationDetailPath(key: string): string {
  return `${APPLICATIONS_PATH}/${key}`;
}

export function applicationEditPath(key: string): string {
  return `${applicationDetailPath(key)}/edit`;
}

function applicationPathQuery(
  path: string,
  options: { from?: string; edit?: boolean; saved?: boolean } = {},
): string {
  const params = new URLSearchParams();

  if (options.from) {
    params.set("from", safeApplicationsReturnPath(options.from));
  }

  if (options.edit) {
    params.set("edit", "1");
  }

  if (options.saved) {
    params.set("saved", "1");
  }

  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

export function applicationDetailHref(
  key: string,
  options: { from?: string; edit?: boolean; saved?: boolean } = {},
): string {
  return applicationPathQuery(applicationDetailPath(key), options);
}

export function applicationEditHref(
  key: string,
  options: { from?: string } = {},
): string {
  return applicationPathQuery(applicationEditPath(key), options);
}

export type ApplicationDetailSearchState = {
  from: string;
  edit: boolean;
  saved: boolean;
};

export function parseApplicationDetailSearchParams(
  params: ApplicationSearchParams,
): ApplicationDetailSearchState {
  return {
    from: safeApplicationsReturnPath(
      trimQuery(
        firstValue(params, "from"),
        MAX_APPLICATIONS_RETURN_PATH_LENGTH,
      ),
    ),
    edit: trimQuery(firstValue(params, "edit"), 8) === "1",
    saved: trimQuery(firstValue(params, "saved"), 8) === "1",
  };
}

function isSafeApplicationsKeyPath(path: string): boolean {
  if (path === "new") {
    return true;
  }

  const editSuffix = "/edit";
  const key = path.endsWith(editSuffix)
    ? path.slice(0, -editSuffix.length)
    : path;

  return (
    key.length > 0 &&
    !key.includes("/") &&
    APPLICATION_DETAIL_KEY_PATTERN.test(key)
  );
}

function isSafeApplicationsRest(rest: string): boolean {
  if (!rest) {
    return true;
  }

  if (rest[0] === "?") {
    return true;
  }

  if (rest[0] !== "/") {
    return false;
  }

  const withoutSlash = rest.slice(1);
  const queryIndex = withoutSlash.indexOf("?");
  const path =
    queryIndex === -1 ? withoutSlash : withoutSlash.slice(0, queryIndex);

  return isSafeApplicationsKeyPath(path);
}

export function safeApplicationsReturnPath(value: string): string {
  if (!value || value.length > MAX_APPLICATIONS_RETURN_PATH_LENGTH) {
    return APPLICATIONS_PATH;
  }

  if (
    value.includes("://") ||
    value.includes("\\") ||
    value.includes("\n") ||
    value.includes("\r")
  ) {
    return APPLICATIONS_PATH;
  }

  if (!value.startsWith(APPLICATIONS_PATH)) {
    return APPLICATIONS_PATH;
  }

  const rest = value.slice(APPLICATIONS_PATH.length);

  if (!isSafeApplicationsRest(rest)) {
    return APPLICATIONS_PATH;
  }

  return value;
}

export function formatApplicationSalary(
  amount: number | null,
  currency: string | null,
  empty: string,
): string {
  if (amount === null) {
    return empty;
  }

  const digits = Number.isInteger(amount) ? String(amount) : String(amount);
  return currency ? `${digits} ${currency}` : digits;
}

function includesInsensitive(haystack: string | null, needle: string): boolean {
  if (!needle) {
    return true;
  }

  return (haystack ?? "").toLowerCase().includes(needle.toLowerCase());
}

function instantMs(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function dateStartMs(isoDate: string): number {
  return Date.parse(`${isoDate}T00:00:00.000Z`);
}

function dateEndMs(isoDate: string): number {
  return Date.parse(`${isoDate}T23:59:59.999Z`);
}

export function toJobApplicationSummary(
  record: JobApplicationRecord,
): JobApplicationSummary {
  return {
    key: record.key,
    company: record.company,
    role: record.role,
    status: record.status,
    location: record.location,
    priority: record.priority,
    nextAction: record.nextAction,
    appliedAt: record.appliedAt,
    nextActionAt: record.nextActionAt,
    archivedAt: record.archivedAt,
    updatedAt: record.updatedAt,
  };
}

export function matchesJobApplicationListQuery(
  record: JobApplicationRecord,
  query: JobApplicationListQuery,
): boolean {
  if (!query.includeArchived && record.archivedAt) {
    return false;
  }

  if (query.status && record.status !== query.status) {
    return false;
  }

  if (query.priority && record.priority !== query.priority) {
    return false;
  }

  if (!includesInsensitive(record.company, query.company ?? "")) {
    return false;
  }

  if (!includesInsensitive(record.location, query.location ?? "")) {
    return false;
  }

  const search = query.search ?? "";

  if (
    search &&
    !includesInsensitive(record.company, search) &&
    !includesInsensitive(record.role, search) &&
    !includesInsensitive(record.recruiter, search)
  ) {
    return false;
  }

  const appliedMs = instantMs(record.appliedAt);

  if (query.appliedFrom) {
    if (appliedMs === null || appliedMs < dateStartMs(query.appliedFrom)) {
      return false;
    }
  }

  if (query.appliedTo) {
    if (appliedMs === null || appliedMs > dateEndMs(query.appliedTo)) {
      return false;
    }
  }

  return true;
}

const priorityRank = { low: 0, medium: 1, high: 2 } as const;

function sortValue(
  record: JobApplicationRecord,
  field: JobApplicationSortField,
): string | number {
  switch (field) {
    case "company":
    case "role":
    case "status":
      return record[field].toLowerCase();
    case "location":
      return (record.location ?? "").toLowerCase();
    case "priority":
      return priorityRank[record.priority];
    case "appliedAt":
      return instantMs(record.appliedAt) ?? 0;
    case "nextActionAt":
      return instantMs(record.nextActionAt) ?? 0;
  }
}

export function compareJobApplicationSort(
  left: JobApplicationRecord,
  right: JobApplicationRecord,
  sort: JobApplicationSortField,
  dir: JobApplicationSortDirection,
): number {
  const leftValue = sortValue(left, sort);
  const rightValue = sortValue(right, sort);
  const comparison =
    typeof leftValue === "number" && typeof rightValue === "number"
      ? leftValue - rightValue
      : String(leftValue).localeCompare(String(rightValue));
  const ordered = dir === "asc" ? comparison : -comparison;

  if (ordered !== 0) {
    return ordered;
  }

  return right.updatedAt.localeCompare(left.updatedAt);
}

export function paginateJobApplicationRecords(
  records: readonly JobApplicationRecord[],
  query: JobApplicationListQuery,
): JobApplicationListPage {
  const pageSize = Math.min(
    MAX_APPLICATION_PAGE_SIZE,
    Math.max(1, query.pageSize ?? DEFAULT_APPLICATION_PAGE_SIZE),
  );
  const page = Math.max(1, query.page ?? 1);
  const sort = query.sort ?? "appliedAt";
  const dir = query.dir ?? "desc";
  const matched = records
    .filter((record) => matchesJobApplicationListQuery(record, query))
    .sort((left, right) => compareJobApplicationSort(left, right, sort, dir));
  const start = (page - 1) * pageSize;

  return {
    items: matched.slice(start, start + pageSize).map(toJobApplicationSummary),
    total: matched.length,
    page,
    pageSize,
  };
}

export function formatApplicationDate(value: string | null): string {
  return value ? value.slice(0, 10) : "—";
}

export function formatApplicationTimestamp(value: string): string {
  return value;
}

export function toDateInputValue(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : "";
}

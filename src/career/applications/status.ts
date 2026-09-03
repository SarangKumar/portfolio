export const jobApplicationStatuses = [
  "wishlist",
  "applied",
  "recruiter_contacted",
  "oa",
  "technical_1",
  "technical_2",
  "system_design",
  "managerial",
  "hr",
  "offer",
  "rejected",
  "withdrawn",
  "ghosted",
] as const;

export type JobApplicationStatus = (typeof jobApplicationStatuses)[number];

export const jobApplicationPriorities = ["low", "medium", "high"] as const;

export type JobApplicationPriority = (typeof jobApplicationPriorities)[number];

export const workModes = ["unspecified", "onsite", "remote", "hybrid"] as const;

export type WorkMode = (typeof workModes)[number];

export function isJobApplicationStatus(
  value: string,
): value is JobApplicationStatus {
  return (jobApplicationStatuses as readonly string[]).includes(value);
}

export function isJobApplicationPriority(
  value: string,
): value is JobApplicationPriority {
  return (jobApplicationPriorities as readonly string[]).includes(value);
}

export function isWorkMode(value: string): value is WorkMode {
  return (workModes as readonly string[]).includes(value);
}

export function defaultJobApplicationPriority(): JobApplicationPriority {
  return "medium";
}

export function defaultWorkMode(): WorkMode {
  return "unspecified";
}

export type ContentEntityType =
  | "project"
  | "experience"
  | "skill"
  | "skillCategory"
  | "certification"
  | "badge"
  | "blogPost"
  | "resumeVersion";

export type ContentMutationAction =
  "create" | "update" | "publish" | "unpublish" | "archive";

export type ContentMutationAuditEvent = {
  actorId: string;
  entityType: ContentEntityType;
  entityKey: string;
  action: ContentMutationAction;
  at: string;
};

export type RecordContentMutation = (event: ContentMutationAuditEvent) => void;

export const ignoreContentMutation: RecordContentMutation = () => {
  // Audit persistence is added in the security/audit story.
};

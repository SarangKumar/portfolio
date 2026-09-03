export const messageNamespaces = [
  "navigation",
  "common",
  "home",
  "about",
  "experience",
  "skills",
  "projects",
  "resume",
  "blog",
  "contact",
  "credentials",
  "charts",
  "terminal",
  "accessibility",
  "errors",
  "auth",
  "admin",
] as const;

export type MessageNamespace = (typeof messageNamespaces)[number];

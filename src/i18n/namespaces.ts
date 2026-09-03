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
] as const;

export type MessageNamespace = (typeof messageNamespaces)[number];

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
  "terminal",
  "accessibility",
  "errors",
] as const;

export type MessageNamespace = (typeof messageNamespaces)[number];

import type { PublicationStatus } from "@/content/status";

export type PersistedProjectMedia = {
  src: string;
  alt: string;
  width: number | null;
  height: number | null;
  kind: string | null;
};

export type PersistedProjectSection = {
  key: string;
  title: string;
  body: string;
};

export type PersistedProject = {
  key: string;
  slug: string;
  title: string;
  summary: string;
  description: string | null;
  technologies: readonly string[];
  skillKeys: readonly string[];
  githubUrl: string | null;
  demoUrl: string | null;
  media: readonly PersistedProjectMedia[];
  architecture: string | null;
  problem: string | null;
  solution: string | null;
  challenges: string | null;
  decisions: string | null;
  tradeoffs: string | null;
  testing: string | null;
  performance: string | null;
  futureImprovements: string | null;
  sections: readonly PersistedProjectSection[];
  experienceKeys: readonly string[];
  status: PublicationStatus;
  internalNotes: string | null;
};

export type PersistedExperience = {
  key: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
  technologies: readonly string[];
  skillKeys: readonly string[];
  projectKeys: readonly string[];
  achievements: readonly string[];
  status: PublicationStatus;
  sortOrder: number;
  internalNotes: string | null;
};

export type PersistedSkillCategory = {
  key: string;
  label: string;
  sortOrder: number;
  status: PublicationStatus;
};

export type PersistedSkill = {
  key: string;
  name: string;
  categoryKey: string;
  status: PublicationStatus;
};

export type PersistedBlogCover = {
  src: string;
  alt: string;
};

export type PersistedBlogPost = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  publishedAt: string;
  updatedAt: string | null;
  tags: readonly string[];
  categories: readonly string[];
  coverImage: PersistedBlogCover | null;
  status: PublicationStatus;
  internalNotes: string | null;
};

export type PersistedResume = {
  key: string;
  label: string;
  targetType: string;
  overview: string | null;
  notes: string | null;
  previewSrc: string | null;
  previewKind: string | null;
  fileSrc: string | null;
  fileName: string | null;
  isDefault: boolean;
  status: PublicationStatus;
  createdAt: string;
  updatedAt: string;
  internalNotes: string | null;
};

export type PersistedCertification = {
  key: string;
  name: string;
  issuer: string;
  issuedOn: string | null;
  credentialId: string | null;
  verificationUrl: string | null;
  mediaSrc: string | null;
  skillKeys: readonly string[];
  status: PublicationStatus;
  internalNotes: string | null;
};

export type PersistedBadge = {
  key: string;
  name: string;
  issuer: string;
  issuedOn: string | null;
  verificationUrl: string | null;
  imageSrc: string | null;
  skillKeys: readonly string[];
  status: PublicationStatus;
  internalNotes: string | null;
};

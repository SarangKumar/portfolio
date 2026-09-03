import "server-only";

import { catalogContentSource } from "@/content/catalog";
import { cachePublicContent, publicContentCacheTags } from "@/content/cache";
import { createPublicContentAccess } from "@/content/access";
import { withCatalogFallback } from "@/content/fallback";
import { prismaContentSource } from "@/content/prisma-source";
import { isDatabaseConfigured } from "@/db/config";
import { getPostBySlug } from "@/lib/blog";
import { getProjectBySlug } from "@/lib/projects";
import { serverEnv } from "@/lib/env/server";

function contentAccess() {
  const source = isDatabaseConfigured(serverEnv.databaseUrl)
    ? withCatalogFallback(prismaContentSource, catalogContentSource)
    : catalogContentSource;

  return createPublicContentAccess(source);
}

export async function getPublishedProjects() {
  return cachePublicContent(publicContentCacheTags.projects, () =>
    contentAccess().getPublishedProjects(),
  );
}

export async function getPublishedProjectBySlug(slug: string) {
  return getProjectBySlug(slug, await getPublishedProjects()) ?? null;
}

export async function getPublishedExperience() {
  return cachePublicContent(publicContentCacheTags.experience, () =>
    contentAccess().getPublishedExperience(),
  );
}

export async function getPublishedSkills() {
  return cachePublicContent(publicContentCacheTags.skills, () =>
    contentAccess().getPublishedSkills(),
  );
}

export async function getPublishedBlogPosts() {
  return cachePublicContent(publicContentCacheTags.blog, () =>
    contentAccess().getPublishedBlogPosts(),
  );
}

export async function getPublishedBlogPostBySlug(slug: string) {
  return getPostBySlug(slug, await getPublishedBlogPosts()) ?? null;
}

export async function getPublishedResumeVersions() {
  return cachePublicContent(publicContentCacheTags.resumes, () =>
    contentAccess().getPublishedResumeVersions(),
  );
}

export async function getPublishedCertifications() {
  return cachePublicContent(publicContentCacheTags.credentials, () =>
    contentAccess().getPublishedCertifications(),
  );
}

export async function getPublishedBadges() {
  return cachePublicContent(publicContentCacheTags.credentials, () =>
    contentAccess().getPublishedBadges(),
  );
}

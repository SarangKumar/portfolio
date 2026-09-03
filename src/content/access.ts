import type { BadgeCredential } from "@/data/badges";
import type { BlogPost } from "@/data/blog";
import type { Certification } from "@/data/certifications";
import type { PublicExperience } from "@/data/experience";
import type { ProjectItem } from "@/data/projects";
import type { ResumeVersion } from "@/data/resumes";
import type { Skill, SkillCategory } from "@/data/skills";
import {
  publishedBadges,
  publishedBlogPostBySlug,
  publishedBlogPosts,
  publishedCertifications,
  publishedExperience,
  publishedProjectBySlug,
  publishedProjects,
  publishedResumeVersions,
  publishedSkillCatalog,
} from "@/content/published";
import type { PublicContentSource } from "@/content/source";

export type PublicContentAccess = {
  getPublishedProjects(): Promise<readonly ProjectItem[]>;
  getPublishedProjectBySlug(slug: string): Promise<ProjectItem | null>;
  getPublishedExperience(): Promise<readonly PublicExperience[]>;
  getPublishedSkills(): Promise<{
    categories: readonly SkillCategory[];
    skills: readonly Skill[];
  }>;
  getPublishedBlogPosts(): Promise<readonly BlogPost[]>;
  getPublishedBlogPostBySlug(slug: string): Promise<BlogPost | null>;
  getPublishedResumeVersions(): Promise<readonly ResumeVersion[]>;
  getPublishedCertifications(): Promise<readonly Certification[]>;
  getPublishedBadges(): Promise<readonly BadgeCredential[]>;
};

export function createPublicContentAccess(
  source: PublicContentSource,
): PublicContentAccess {
  return {
    async getPublishedProjects() {
      return publishedProjects(await source.listProjects());
    },
    async getPublishedProjectBySlug(slug) {
      return publishedProjectBySlug(slug, await source.listProjects());
    },
    async getPublishedExperience() {
      return publishedExperience(await source.listExperience());
    },
    async getPublishedSkills() {
      return publishedSkillCatalog(
        await source.listSkillCategories(),
        await source.listSkills(),
      );
    },
    async getPublishedBlogPosts() {
      return publishedBlogPosts(await source.listPosts());
    },
    async getPublishedBlogPostBySlug(slug) {
      return publishedBlogPostBySlug(slug, await source.listPosts());
    },
    async getPublishedResumeVersions() {
      return publishedResumeVersions(await source.listResumes());
    },
    async getPublishedCertifications() {
      return publishedCertifications(await source.listCertifications());
    },
    async getPublishedBadges() {
      return publishedBadges(await source.listBadges());
    },
  };
}

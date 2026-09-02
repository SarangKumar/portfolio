import type { Metadata, MetadataRoute } from "next";
import { navItems } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import type { BlogPost } from "@/data/blog";
import { posts } from "@/data/blog";
import { profile } from "@/data/profile";
import type { ProjectItem } from "@/data/projects";
import { projects } from "@/data/projects";
import { articleHref } from "@/lib/blog";
import { projectHref } from "@/lib/projects";
import { absoluteUrl } from "@/lib/url";

export type ShareImage = {
  url: string;
  alt?: string;
};

export type ShareMetadataInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  images?: readonly ShareImage[];
  publishedTime?: string;
  modifiedTime?: string;
  tags?: readonly string[];
};

export function metadataBaseUrl(): URL {
  return new URL(siteConfig.url);
}

export function pageUrl(path: string): string {
  if (path === "/") {
    return siteConfig.url.replace(/\/$/, "");
  }

  return absoluteUrl(path);
}

export function metadataTitle(metadata: Metadata, fallback: string): string {
  const title = metadata.title;

  if (typeof title === "string") {
    return title;
  }

  if (
    title &&
    typeof title === "object" &&
    "absolute" in title &&
    typeof title.absolute === "string"
  ) {
    return title.absolute;
  }

  return fallback;
}

export function shareMetadata({
  title,
  description,
  path,
  type = "website",
  images,
  publishedTime,
  modifiedTime,
  tags,
}: ShareMetadataInput): Pick<Metadata, "alternates" | "openGraph" | "twitter"> {
  const url = pageUrl(path);
  const ogImages = images?.map((image) => ({
    url: image.url,
    alt: image.alt,
  }));

  return {
    alternates: {
      canonical: url,
      languages: {
        [siteConfig.locale]: url,
        "x-default": url,
      },
    },
    openGraph: {
      type,
      locale: siteConfig.openGraphLocale,
      siteName: siteConfig.name,
      title,
      description,
      url,
      ...(ogImages && ogImages.length > 0 ? { images: ogImages } : {}),
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime,
            tags: tags ? [...tags] : undefined,
          }
        : {}),
    },
    twitter: {
      card: ogImages && ogImages.length > 0 ? "summary_large_image" : "summary",
      title,
      description,
    },
  };
}

export function publicSitemapEntries(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = navItems.map((item) => ({
    url: pageUrl(item.href),
    changeFrequency:
      item.href === "/blog" || item.href === "/projects" ? "weekly" : "monthly",
    priority: item.href === "/" ? 1 : 0.7,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: pageUrl(projectHref(project.slug)),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const articleEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: pageUrl(articleHref(post.slug)),
    lastModified: post.updatedAt ?? post.publishedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...projectEntries, ...articleEntries];
}

export function websiteJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: pageUrl("/"),
    description,
    inLanguage: siteConfig.locale,
  };
}

export function personJsonLd() {
  if (!profile.displayName) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.displayName,
    url: pageUrl("/"),
    ...(profile.headline ? { jobTitle: profile.headline } : {}),
    ...(profile.summary ? { description: profile.summary } : {}),
  };
}

export function articleJsonLd(post: BlogPost, canonicalUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    inLanguage: siteConfig.locale,
    ...(post.tags.length > 0 || post.categories.length > 0
      ? { keywords: [...post.tags, ...post.categories].join(", ") }
      : {}),
    ...(post.coverImage
      ? {
          image: post.coverImage.src.startsWith("http")
            ? post.coverImage.src
            : absoluteUrl(post.coverImage.src),
        }
      : {}),
    ...(profile.displayName
      ? {
          author: {
            "@type": "Person",
            name: profile.displayName,
          },
        }
      : {}),
  };
}

export function creativeWorkJsonLd(project: ProjectItem, canonicalUrl: string) {
  const sameAs = [project.githubUrl, project.demoUrl].filter(
    (value): value is string => Boolean(value),
  );
  const image = project.media.find((item) => item.kind !== "video");

  return {
    "@context": "https://schema.org",
    "@type": project.githubUrl ? "SoftwareSourceCode" : "CreativeWork",
    name: project.title,
    description: project.summary,
    url: canonicalUrl,
    ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(project.technologies.length > 0
      ? { keywords: project.technologies.join(", ") }
      : {}),
    ...(image
      ? {
          image: image.src.startsWith("http")
            ? image.src
            : absoluteUrl(image.src),
        }
      : {}),
  };
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ArticleDetail } from "@/components/content/article-detail";
import { ArticleJsonLd } from "@/components/content/article-json-ld";
import {
  getPublishedBlogPostBySlug,
  getPublishedBlogPosts,
} from "@/content/public";
import { articleCanonicalUrl, articleMetadata } from "@/lib/article-metadata";
import { readingTimeMinutes } from "@/lib/blog";
import { formatIsoDate } from "@/lib/dates";
import { activateLocale } from "@/lib/locale-page";

type ArticlePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  await activateLocale(locale);

  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return articleMetadata(post);
}

export default async function Page({ params }: ArticlePageProps) {
  const { locale, slug } = await params;
  await activateLocale(locale);

  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const t = await getTranslations("blog");
  const dateLocale = await getLocale();

  return (
    <>
      <ArticleJsonLd
        post={post}
        canonicalUrl={articleCanonicalUrl(post.slug)}
      />
      <ArticleDetail
        post={post}
        publishedLabel={t("published", {
          date: formatIsoDate(post.publishedAt, dateLocale),
        })}
        updatedLabel={
          post.updatedAt
            ? t("updated", {
                date: formatIsoDate(post.updatedAt, dateLocale),
              })
            : undefined
        }
        readingLabel={t("readingTime", {
          minutes: readingTimeMinutes(post.content),
        })}
        tagsLabel={t("tags")}
        categoriesLabel={t("categories")}
      />
    </>
  );
}

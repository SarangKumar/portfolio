import { getLocale, getTranslations } from "next-intl/server";
import { ArticleGrid } from "@/components/content/article-grid";
import { ContentPlaceholder } from "@/components/content/content-placeholder";
import { PageHeader } from "@/components/content/page-header";
import { posts } from "@/data/blog";
import { readingTimeMinutes, sortPostsByDate } from "@/lib/blog";
import { formatIsoDate } from "@/lib/dates";

export async function BlogIndexPage() {
  const t = await getTranslations("blog");
  const locale = await getLocale();
  const items = sortPostsByDate(posts);

  return (
    <div className="stack-section">
      <PageHeader title={t("title")} description={t("intro")} />
      <ArticleGrid
        posts={items}
        dateLabel={(post) =>
          t("published", { date: formatIsoDate(post.publishedAt, locale) })
        }
        readingLabel={(post) =>
          t("readingTime", { minutes: readingTimeMinutes(post.content) })
        }
        tagsLabel={t("tags")}
        empty={<ContentPlaceholder>{t("placeholder")}</ContentPlaceholder>}
      />
    </div>
  );
}

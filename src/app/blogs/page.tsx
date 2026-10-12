import { PageIntro } from "@/components/site/section";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/page-meta";
import { Archive } from "./archive";

export const revalidate = 60;
export const generateMetadata = () => pageMetadata("blogs");

export default async function BlogsPage() {
  const { posts, site } = await getContent();
  const page = site.pages.blogs;
  return (
    <>
      <PageIntro index="01" eyebrow={page.eyebrow} title={page.title}>
        {page.intro}
      </PageIntro>
      <Archive posts={posts} />
    </>
  );
}

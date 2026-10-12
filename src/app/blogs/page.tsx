import type { Metadata } from "next";
import { PageIntro } from "@/components/site/section";
import { getContent } from "@/lib/content";
import { Archive } from "./archive";

export const revalidate = 60;
export const metadata: Metadata = { title: "Blogs" };

export default async function BlogsPage() {
  const { posts } = await getContent();
  return (
    <>
      <PageIntro index="01" eyebrow="Writing" title="Blogs & notes">
        Articles, technical notes and half-finished thoughts.
      </PageIntro>
      <Archive posts={posts} />
    </>
  );
}

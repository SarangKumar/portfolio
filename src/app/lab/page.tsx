import Link from "next/link";
import { PageIntro } from "@/components/site/section";
import { getContent, getT } from "@/lib/content";
import { pageMetadata } from "@/lib/page-meta";

export const revalidate = 60;
export const generateMetadata = () => pageMetadata("lab");

export default async function LabPage() {
  const { diagrams, site } = await getContent();
  const t = await getT();
  const page = site.pages.lab;
  return (
    <>
      <PageIntro index="01" eyebrow={page.eyebrow} title={page.title}>
        {page.intro}
      </PageIntro>
      <div className="container-x grid gap-6 md:grid-cols-2">
        {diagrams.map((d, i) => (
          <Link
            key={d.id}
            data-parallax={-0.04 * ((i % 3) + 1)}
            data-parallax-max="24"
            href={`/lab/${d.slug}`}
            className="group border-border lift fade-up rounded-3xl border p-8"
            style={{ ["--delay" as string]: `${i * 80}ms` }}
          >
            <p className="tag">
              {t("lab.stats", {
                nodes: d.nodes.length,
                flows: d.flows.length,
                failures: d.failures.length,
              })}
            </p>
            <h2 className="display group-hover:text-primary-ink mt-6 text-4xl transition-colors">
              {d.title}
            </h2>
            <p className="text-muted-foreground mt-4">{d.summary}</p>
          </Link>
        ))}
      </div>
    </>
  );
}

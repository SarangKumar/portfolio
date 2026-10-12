import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/site/section";
import { getContent, REVALIDATE } from "@/lib/content";

export const revalidate = REVALIDATE;
export const metadata: Metadata = { title: "Architecture Lab" };

export default async function LabPage() {
  const { diagrams } = await getContent();
  return (
    <>
      <PageIntro
        index="01"
        eyebrow="Architecture Lab"
        title="How things are built"
      >
        Interactive system diagrams: play request flows, inspect components, and
        simulate failures. Every diagram is plain configuration, edited from the
        admin panel.
      </PageIntro>
      <div className="container-x grid gap-6 md:grid-cols-2">
        {diagrams.map((d, i) => (
          <Link
            key={d.id}
            href={`/lab/${d.slug}`}
            className="group border-border lift fade-up rounded-3xl border p-8"
            style={{ ["--delay" as string]: `${i * 80}ms` }}
          >
            <p className="tag">
              {d.nodes.length} components · {d.flows.length} flows ·{" "}
              {d.failures.length} failure scenarios
            </p>
            <h2 className="display group-hover:text-primary mt-6 text-4xl transition-colors">
              {d.title}
            </h2>
            <p className="text-muted-foreground mt-4">{d.summary}</p>
          </Link>
        ))}
      </div>
    </>
  );
}

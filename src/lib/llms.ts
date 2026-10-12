import { getContent } from "./content";
import { abs } from "./site-url";

/** llms.txt (https://llmstxt.org) built from published content. */
export async function llmsText(full: boolean) {
  const c = await getContent();
  const s = c.site;
  const out: string[] = [
    `# ${s.name}`,
    "",
    `> ${s.role} in ${s.location}. ${s.tagline.replace(/\.*$/, ".")}`,
    "",
  ];
  if (s.career.available)
    out.push(
      `Status: ${s.career.headline} (${s.career.roles.join(", ")}). Preferred location: ${s.career.locations}. ${s.career.detail}`,
      "",
    );
  out.push(
    `Contact: ${s.email}`,
    ...s.links.map((l) => `- ${l.label}: ${l.href}`),
    "",
  );
  out.push(
    "## Pages",
    ...[
      ...new Map([...s.nav, ...s.footerNav].map((n) => [n.href, n])).values(),
    ].map((n) => `- [${n.label}](${abs(n.href)})`),
    "",
  );
  out.push("## Experience");
  for (const e of c.experience) {
    out.push(
      `- ${e.role}, ${e.company} (${e.start}–${e.end || "present"})${full ? `: ${e.description}` : ""}`,
    );
    if (full) out.push(...e.highlights.map((h) => `  - ${h}`));
  }
  out.push("", "## Projects");
  for (const p of c.projects) {
    out.push(`- [${p.title}](${abs(`/projects/${p.slug}`)}): ${p.summary}`);
    if (full) {
      out.push(
        "",
        `### ${p.title}`,
        "",
        p.description,
        "",
        `Tech: ${p.technologies.join(", ")}`,
      );
      for (const [k, v] of [
        ["Architecture", p.architecture],
        ["Implementation", p.implementation],
        ["Testing", p.testing],
        ["Trade-offs", p.tradeoffs],
      ])
        if (v) out.push("", `#### ${k}`, "", v);
      for (const sec of p.sections)
        out.push("", `#### ${sec.title}`, "", sec.body);
      out.push("");
    }
  }
  out.push("", "## Writing");
  for (const p of c.posts) {
    out.push(
      `- [${p.title}](${abs(`/blogs/${p.slug}`)}) (${p.date}): ${p.excerpt}`,
    );
    if (full) out.push("", `### ${p.title}`, "", p.body, "");
  }
  if (!full)
    out.push("", "## Optional", `- [Full content](${abs("/llms-full.txt")})`);
  return new Response(out.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

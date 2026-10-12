import type { ReactNode } from "react";

/** Tiny markdown subset: ## headings, - lists, ``` code fences, `code`, paragraphs. */
export function Markdown({ source }: { source: string }) {
  const blocks = source
    .split(/\n(?=```)|(?<=```)\n/)
    .flatMap((chunk) =>
      chunk.startsWith("```") ? [chunk] : chunk.split(/\n{2,}/),
    );
  const out: ReactNode[] = [];
  blocks.forEach((b, i) => {
    const block = b.trim();
    if (!block) return;
    if (block.startsWith("```")) {
      out.push(
        <pre key={i}>
          <code>{block.replace(/^```\w*\n?/, "").replace(/```$/, "")}</code>
        </pre>,
      );
    } else if (block.startsWith("## ")) {
      out.push(<h2 key={i}>{block.slice(3)}</h2>);
    } else if (block.split("\n").every((l) => l.startsWith("- "))) {
      out.push(
        <ul key={i}>
          {block.split("\n").map((l, j) => (
            <li key={j}>{inline(l.slice(2))}</li>
          ))}
        </ul>,
      );
    } else {
      out.push(<p key={i}>{inline(block)}</p>);
    }
  });
  return <div className="prose-body">{out}</div>;
}

function inline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/).map((part, i) =>
    part.startsWith("`") ? (
      <code key={i} className="bg-muted rounded px-1">
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  );
}

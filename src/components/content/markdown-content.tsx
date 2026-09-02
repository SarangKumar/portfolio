import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/cn";
import { getExternalAnchorProps, isExternalHref } from "@/lib/href";

const markdownComponents: Components = {
  h1: ({ children }) => <h2 className="type-heading">{children}</h2>,
  h2: ({ children }) => <h2 className="type-heading">{children}</h2>,
  h3: ({ children }) => (
    <h3 className="type-small font-semibold text-foreground">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="type-body text-muted-foreground">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc space-y-1 pl-4 type-body text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal space-y-1 pl-4 type-body text-muted-foreground">
      {children}
    </ol>
  ),
  a: ({ href, children }) => {
    if (!href) {
      return children;
    }

    return (
      <a
        href={href}
        className="text-foreground underline-offset-2 hover:text-primary hover:underline"
        {...(isExternalHref(href) ? getExternalAnchorProps(href) : {})}
      >
        {children}
      </a>
    );
  },
  code: ({ children }) => (
    <code className="rounded-sm bg-muted px-1 font-mono type-small">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-md border border-border bg-muted pad-card font-mono type-small">
      {children}
    </pre>
  ),
};

type MarkdownContentProps = {
  content: string;
  className?: string;
};

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div className={cn("stack-default max-w-prose", className)}>
      <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
    </div>
  );
}

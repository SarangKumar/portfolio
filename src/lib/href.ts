export function isExternalHref(href: unknown): href is string {
  return typeof href === "string" && /^(https?:|mailto:|tel:)/i.test(href);
}

export function getExternalAnchorProps(href: string): {
  target?: "_blank";
  rel?: "noopener noreferrer";
} {
  if (/^https?:/i.test(href)) {
    return { target: "_blank", rel: "noopener noreferrer" };
  }

  return {};
}

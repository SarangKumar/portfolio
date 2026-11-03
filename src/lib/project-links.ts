import type { Link, Project } from "@/content/types";

/**
 * Labels for the stores and registries a project usually also lives on, so an
 * entry can be saved with just a URL and still read well on the site.
 */
const HOSTS: [RegExp, string][] = [
  [/^chromewebstore\.google\.com$|^chrome\.google\.com$/, "Chrome Web Store"],
  [/^microsoftedge\.microsoft\.com$/, "Edge Add-ons"],
  [/^addons\.mozilla\.org$/, "Firefox Add-ons"],
  [/^marketplace\.visualstudio\.com$|^open-vsx\.org$/, "VS Code Marketplace"],
  [/^(www\.)?npmjs\.com$/, "npm"],
  [/^pypi\.org$/, "PyPI"],
  [/^crates\.io$/, "crates.io"],
  [/^apps\.apple\.com$/, "App Store"],
  [/^play\.google\.com$/, "Google Play"],
  [/^(www\.)?producthunt\.com$/, "Product Hunt"],
  [/^(www\.)?figma\.com$/, "Figma"],
  [/^(www\.)?youtube\.com$|^youtu\.be$/, "Demo video"],
  [/^hub\.docker\.com$/, "Docker Hub"],
];

/** Host-derived label for a link saved without one. */
export function labelForUrl(href: string): string {
  try {
    const host = new URL(href).hostname;
    for (const [re, label] of HOSTS) if (re.test(host)) return label;
    return host.replace(/^www\./, "");
  } catch {
    return href;
  }
}

/**
 * A project's extra links (Chrome Web Store, npm, …) beyond live and source:
 * blank rows dropped, missing labels filled in from the host.
 *
 * Deliberately tolerant, because this field is often typed straight into the
 * Firestore console: a bare URL string, a one-link-not-array value, and `url`
 * in place of `href` all read the same as the admin panel's own shape.
 */
export function projectLinks(project: Pick<Project, "links">): Link[] {
  const raw: unknown = project.links;
  const rows = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return rows
    .map((row): Link | null => {
      const r = (typeof row === "string" ? { href: row } : row) as Partial<
        Link & { url: string }
      > | null;
      const href = (r?.href ?? r?.url ?? "").trim();
      if (!href) return null;
      return { href, label: r?.label?.trim() || labelForUrl(href) };
    })
    .filter((l): l is Link => l !== null);
}

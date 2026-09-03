import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const repoRoot = path.join(
  fileURLToPath(new URL(".", import.meta.url)),
  "../..",
);

export const messagesDir = path.join(repoRoot, "messages");
export const compiledDir = path.join(messagesDir, "compiled");

function quotedList(source, exportName) {
  const match = source.match(
    new RegExp(`export const ${exportName} = \\[([\\s\\S]*?)\\] as const`),
  );

  if (!match) {
    throw new Error(`Could not parse ${exportName}`);
  }

  return [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]);
}

export async function readI18nConfig() {
  const [namespacesSource, localesSource] = await Promise.all([
    readFile(path.join(repoRoot, "src/i18n/namespaces.ts"), "utf8"),
    readFile(path.join(repoRoot, "src/i18n/locales.ts"), "utf8"),
  ]);

  return {
    namespaces: quotedList(namespacesSource, "messageNamespaces"),
    locales: quotedList(localesSource, "locales"),
  };
}

export async function mergeLocaleCatalog(locale, namespaces) {
  const catalog = {};

  for (const namespace of namespaces) {
    const filePath = path.join(messagesDir, locale, `${namespace}.json`);
    catalog[namespace] = JSON.parse(await readFile(filePath, "utf8"));
  }

  return catalog;
}

export function serializeCatalog(catalog) {
  return `${JSON.stringify(catalog, null, 2)}\n`;
}

export async function localeDirectories() {
  const entries = await readdir(messagesDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory() && entry.name !== "compiled")
    .map((entry) => entry.name)
    .sort();
}

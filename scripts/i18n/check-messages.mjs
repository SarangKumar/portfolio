import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
  compiledDir,
  localeDirectories,
  mergeLocaleCatalog,
  messagesDir,
  readI18nConfig,
  serializeCatalog,
} from "./lib.mjs";

async function main() {
  const { locales, namespaces } = await readI18nConfig();
  const onDiskLocales = await localeDirectories();
  const expected = [...locales].sort();
  const found = [...onDiskLocales].sort();

  if (JSON.stringify(expected) !== JSON.stringify(found)) {
    throw new Error(
      `Locale folders (${found.join(", ")}) do not match src/i18n/locales.ts (${expected.join(", ")})`,
    );
  }

  for (const locale of locales) {
    const files = (await readdir(path.join(messagesDir, locale)))
      .filter((name) => name.endsWith(".json"))
      .map((name) => name.replace(/\.json$/, ""))
      .sort();

    const missing = namespaces.filter((name) => !files.includes(name));
    const extra = files.filter((name) => !namespaces.includes(name));

    if (missing.length > 0) {
      throw new Error(`${locale}: missing namespaces ${missing.join(", ")}`);
    }

    if (extra.length > 0) {
      throw new Error(`${locale}: unexpected files ${extra.join(", ")}`);
    }

    const catalog = await mergeLocaleCatalog(locale, namespaces);
    const compiledPath = path.join(compiledDir, `${locale}.json`);
    const compiled = await readFile(compiledPath, "utf8");

    if (compiled !== serializeCatalog(catalog)) {
      throw new Error(
        `${path.relative(process.cwd(), compiledPath)} is stale. Run npm run i18n:build.`,
      );
    }
  }

  console.log(
    "Translation catalogs are complete and compiled output is current.",
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  compiledDir,
  mergeLocaleCatalog,
  readI18nConfig,
  serializeCatalog,
} from "./lib.mjs";

async function main() {
  const { locales, namespaces } = await readI18nConfig();
  await mkdir(compiledDir, { recursive: true });

  for (const locale of locales) {
    const catalog = await mergeLocaleCatalog(locale, namespaces);
    const outputPath = path.join(compiledDir, `${locale}.json`);
    await writeFile(outputPath, serializeCatalog(catalog));
    console.log(`Wrote ${path.relative(process.cwd(), outputPath)}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

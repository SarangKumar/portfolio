import Link from "next/link";
import { getT } from "@/lib/content";

export default async function NotFound() {
  const t = await getT();
  return (
    <div className="container-x py-32">
      <p className="eyebrow">{t("notFound.eyebrow")}</p>
      <h1 className="display mt-4 text-6xl">{t("notFound.title")}</h1>
      <Link href="/" className="link-u mt-8 inline-block">
        {t("notFound.link")}
      </Link>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-32">
      <p className="eyebrow">404</p>
      <h1 className="display mt-4 text-6xl">Nothing brewing here.</h1>
      <Link href="/" className="link-u mt-8 inline-block">
        Back home
      </Link>
    </div>
  );
}

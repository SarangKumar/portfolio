import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="app-container flex flex-col items-start gap-6">
      <p className="meta">404</p>
      <h1 className="page-title">This page doesn&apos;t exist.</h1>
      <Link href="/" className={buttonVariants({ variant: "outline" })}>
        Back home
      </Link>
    </div>
  );
}

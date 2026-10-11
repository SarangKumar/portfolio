import Link from "next/link";
import { contactProfile } from "@/data/contact";
import { siteName } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t">
      <div className="app-container flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="meta">
          © {new Date().getFullYear()} {siteName}
        </p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Social">
          {contactProfile.socialLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

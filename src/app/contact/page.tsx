import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { ContactForm } from "@/app/contact/contact-form";
import { PageHeader } from "@/components/site/page-header";
import { contactProfile } from "@/data/contact";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch.",
};

export default function ContactPage() {
  return (
    <div className="app-container grid gap-12 lg:grid-cols-[1fr_1.2fr]">
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Contact"
          description={`Open to ${profile.headline?.replace(/^Software Engineer at /, "roles beyond ") ?? "new roles"}. Send a note and I'll reply by email.`}
        />
        <div
          className="fade-up flex flex-col gap-3 text-sm"
          style={{ "--delay": "180ms" } as React.CSSProperties}
        >
          <a
            href={`mailto:${contactProfile.email}`}
            className="hover:text-primary inline-flex items-center gap-2 transition-colors"
          >
            <Mail className="size-4" /> {contactProfile.email}
          </a>
          {contactProfile.socialLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      {contactProfile.email ? (
        <ContactForm email={contactProfile.email} />
      ) : null}
    </div>
  );
}

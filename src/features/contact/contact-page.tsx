import { getTranslations } from "next-intl/server";
import { TrackedExternalLink } from "@/analytics/tracked-external-link";
import { ContentPlaceholder } from "@/components/content/content-placeholder";
import { PageHeader } from "@/components/content/page-header";
import { PageSection } from "@/components/content/page-section";
import {
  buttonClassName,
  buttonSizes,
  buttonVariants,
} from "@/components/ui/button";
import { contactProfile } from "@/data/contact";
import { ContactForm } from "@/features/contact/contact-form";
import { cn } from "@/lib/cn";
import { isEmptyList } from "@/lib/content";
import { getExternalAnchorProps } from "@/lib/href";

export async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <div className="stack-section">
      <PageHeader title={t("title")} description={t("intro")} />

      <PageSection id="email" title={t("email")}>
        {contactProfile.email ? (
          <TrackedExternalLink
            href={`mailto:${contactProfile.email}`}
            className={cn(
              buttonClassName.base,
              buttonVariants.primary,
              buttonSizes.sm,
              "w-fit",
            )}
            {...getExternalAnchorProps(`mailto:${contactProfile.email}`)}
          >
            {t("emailAction")}
          </TrackedExternalLink>
        ) : (
          <ContentPlaceholder>{t("emailUnavailable")}</ContentPlaceholder>
        )}
      </PageSection>

      <PageSection id="profiles" title={t("social")}>
        {isEmptyList(contactProfile.socialLinks) ? (
          <ContentPlaceholder>{t("socialPlaceholder")}</ContentPlaceholder>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {contactProfile.socialLinks.map((item) => (
              <li key={item.id}>
                <TrackedExternalLink
                  href={item.href}
                  className="type-small text-foreground hover:text-primary"
                  {...getExternalAnchorProps(item.href)}
                >
                  {item.label}
                </TrackedExternalLink>
              </li>
            ))}
          </ul>
        )}
      </PageSection>

      <PageSection id="form" title={t("formTitle")}>
        <ContactForm
          copy={{
            name: t("name"),
            email: t("email"),
            message: t("message"),
            send: t("send"),
            sending: t("sending"),
            success: t("success"),
            error: t("error"),
            unavailable: t("unavailable"),
            required: t("required"),
            invalidEmail: t("invalidEmail"),
            tooLong: t("tooLong"),
            honeypot: t("honeypot"),
          }}
        />
      </PageSection>
    </div>
  );
}

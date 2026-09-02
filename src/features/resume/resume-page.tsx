import { getLocale, getTranslations } from "next-intl/server";
import { ContentPlaceholder } from "@/components/content/content-placeholder";
import { CtaBanner } from "@/components/content/cta-banner";
import {
  BadgeGrid,
  CertificationGrid,
} from "@/components/content/credential-grid";
import { PageHeader } from "@/components/content/page-header";
import { PageSection } from "@/components/content/page-section";
import { ButtonLink } from "@/components/ui/button-link";
import { badges } from "@/data/badges";
import { certifications } from "@/data/certifications";
import { resumes } from "@/data/resumes";
import { skills } from "@/data/skills";
import { ResumePanel } from "@/features/resume/resume-panel";
import { isEmptyList } from "@/lib/content";
import { formatYearMonth } from "@/lib/dates";

export async function ResumePage() {
  const t = await getTranslations("resume");
  const tCredentials = await getTranslations("credentials");
  const locale = await getLocale();

  const credentialCopy = {
    verify: tCredentials("certifications.verify"),
    credentialId: tCredentials("certifications.credentialId"),
    noSkills: tCredentials("certifications.noSkills"),
  };

  return (
    <div className="stack-section">
      <PageHeader title={t("title")} description={t("intro")} />

      {isEmptyList(resumes) ? (
        <ContentPlaceholder>{t("placeholder")}</ContentPlaceholder>
      ) : (
        <ResumePanel
          versions={resumes}
          copy={{
            versions: t("versions"),
            preview: t("preview"),
            previewUnavailable: t("previewUnavailable"),
            download: t("download"),
            downloadUnavailable: t("downloadUnavailable"),
          }}
        />
      )}

      <PageSection
        id="certifications"
        title={tCredentials("certifications.title")}
      >
        {isEmptyList(certifications) ? (
          <ContentPlaceholder>
            {tCredentials("certifications.placeholder")}
          </ContentPlaceholder>
        ) : (
          <CertificationGrid
            items={certifications}
            skills={skills}
            dateLabel={(date) => formatYearMonth(date, locale)}
            copy={credentialCopy}
          />
        )}
      </PageSection>

      <PageSection id="badges" title={tCredentials("badges.title")}>
        {isEmptyList(badges) ? (
          <ContentPlaceholder>
            {tCredentials("badges.placeholder")}
          </ContentPlaceholder>
        ) : (
          <BadgeGrid
            items={badges}
            skills={skills}
            dateLabel={(date) => formatYearMonth(date, locale)}
            copy={{
              verify: tCredentials("badges.verify"),
              credentialId: tCredentials("certifications.credentialId"),
              noSkills: tCredentials("badges.noSkills"),
            }}
          />
        )}
      </PageSection>

      <CtaBanner
        title={t("recruiterTitle")}
        body={t("recruiterBody")}
        action={
          <ButtonLink href="/contact" size="sm">
            {t("recruiterAction")}
          </ButtonLink>
        }
      />
    </div>
  );
}
